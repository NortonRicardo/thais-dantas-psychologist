'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import NextImage from 'next/image'
import { ArrowLeft, ImagePlus, Loader2, Pencil, Trash2, X } from 'lucide-react'
import { toast } from 'sonner'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import { blogPostWriteSchema } from '@/lib/validation/blog-api'
import { CategoryDialog } from './category-dialog'
import { CategoryMultiSelect } from './category-multi-select'
import { RichTextEditor } from './rich-text-editor'

type Category = { id: string; name: string }

const GLASS = {
  background:
    'linear-gradient(135deg, rgba(255,255,255,0.10), rgba(255,255,255,0.04))',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: '1px solid rgba(255,255,255,0.13)',
} as const

type BlogPostRecord = {
  id: string
  title: string
  subtitle: string | null
  categories: Category[]
  slug: string
  coverImageUrl: string | null
  bodyHtml: string
  published: boolean
  createdAt: string
  updatedAt: string
}

async function uploadImage(file: File): Promise<{ url: string } | null> {
  const formData = new FormData()
  formData.append('file', file)
  try {
    const res = await fetch('/api/blog/upload', {
      method: 'POST',
      body: formData,
    })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(
        typeof body.error === 'string' ? body.error : 'Erro ao enviar imagem.'
      )
    }
    return await res.json()
  } catch (err) {
    toast.error(err instanceof Error ? err.message : 'Erro ao enviar imagem.')
    return null
  }
}

/* ─── CoverImageField ────────────────────────────────────────────────────── */
function CoverImageField({
  value,
  onChange,
}: {
  value: string
  onChange: (url: string) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  async function handleFile(file: File) {
    setUploading(true)
    const result = await uploadImage(file)
    setUploading(false)
    if (result) onChange(result.url)
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => {
          const file = e.target.files?.[0]
          e.target.value = ''
          if (file) handleFile(file)
        }}
      />
      {value ? (
        <div
          className="group relative h-40 w-full overflow-hidden rounded-xl"
          style={GLASS}
        >
          <NextImage
            src={value}
            alt="Capa do artigo"
            fill
            sizes="320px"
            className="object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-[11px] font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/25"
            >
              {uploading ? (
                <Loader2 size={11} className="animate-spin" />
              ) : (
                <Pencil size={11} />
              )}{' '}
              Substituir
            </button>
            <button
              type="button"
              onClick={() => onChange('')}
              className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-[11px] font-medium text-white backdrop-blur-sm transition-colors hover:bg-red-500/40"
            >
              <X size={11} /> Remover
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 py-10 text-center transition-colors hover:bg-white/5"
        >
          {uploading ? (
            <Loader2 size={18} className="animate-spin text-white/50" />
          ) : (
            <ImagePlus size={18} className="text-white/40" strokeWidth={1.5} />
          )}
          <span className="text-xs text-white/40">
            {uploading ? 'Enviando…' : 'Clique para adicionar uma capa'}
          </span>
        </button>
      )}
    </div>
  )
}

/* ─── ArticleEditor ──────────────────────────────────────────────────────── */
export function ArticleEditor({
  mode,
  articleId,
}: {
  mode: 'create' | 'edit'
  articleId?: string
}) {
  const router = useRouter()
  const titleRef = useRef<HTMLTextAreaElement>(null)

  const [loading, setLoading] = useState(mode === 'edit')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<
    Category | undefined
  >(undefined)

  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [categoryIds, setCategoryIds] = useState<string[]>([])
  const [coverImageUrl, setCoverImageUrl] = useState('')
  const [bodyHtml, setBodyHtml] = useState('')
  const [published, setPublished] = useState(false)
  const [meta, setMeta] = useState<{
    createdAt: string
    updatedAt: string
  } | null>(null)

  function loadCategories() {
    fetch('/api/blog/categories')
      .then(res => res.json())
      .then((items: Category[]) => {
        if (Array.isArray(items)) setCategories(items)
      })
      .catch(() => {})
  }

  useEffect(loadCategories, [])

  function handleCategorySaved(saved: Category) {
    const isNew = !editingCategory
    setCategories(prev => {
      const next = isNew
        ? [...prev, saved]
        : prev.map(c => (c.id === saved.id ? saved : c))
      return next.sort((a, b) => a.name.localeCompare(b.name, 'pt'))
    })
    if (isNew) setCategoryIds(prev => [...prev, saved.id])
  }

  useEffect(() => {
    if (mode !== 'edit' || !articleId) return
    setLoading(true)
    fetch(`/api/blog/${articleId}`)
      .then(res => {
        if (!res.ok) throw new Error()
        return res.json() as Promise<BlogPostRecord>
      })
      .then(post => {
        setTitle(post.title)
        setSubtitle(post.subtitle ?? '')
        setCategoryIds(post.categories.map(c => c.id))
        setCoverImageUrl(post.coverImageUrl ?? '')
        setBodyHtml(post.bodyHtml)
        setPublished(post.published)
        setMeta({ createdAt: post.createdAt, updatedAt: post.updatedAt })
      })
      .catch(() => toast.error('Erro ao carregar artigo.'))
      .finally(() => setLoading(false))
  }, [mode, articleId])

  useEffect(() => {
    const el = titleRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }, [title, loading])

  async function handleSave() {
    const payload = {
      title,
      subtitle: subtitle || undefined,
      categoryIds,
      coverImageUrl: coverImageUrl || null,
      bodyHtml,
      published,
    }
    const parsed = blogPostWriteSchema.safeParse(payload)
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? 'Dados inválidos.')
      return
    }

    setSaving(true)
    try {
      const url = mode === 'create' ? '/api/blog' : `/api/blog/${articleId}`
      const method = mode === 'create' ? 'POST' : 'PUT'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(
          typeof body.error === 'string' ? body.error : 'Erro ao salvar artigo.'
        )
      }
      const saved: BlogPostRecord = await res.json()
      toast.success(mode === 'create' ? 'Artigo criado!' : 'Artigo salvo!')
      if (mode === 'create') {
        router.replace(`/manager/blog/${saved.id}`)
      } else {
        setMeta({ createdAt: saved.createdAt, updatedAt: saved.updatedAt })
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao salvar artigo.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!articleId) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/blog/${articleId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast.success('Artigo excluído.')
      router.push('/manager/blog')
    } catch {
      toast.error('Erro ao excluir artigo.')
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-6 pb-16 sm:px-10">
        <Skeleton className="mb-8 h-5 w-24 rounded bg-white/10" />
        <div className="grid items-start gap-8 lg:grid-cols-[1fr_280px]">
          <Skeleton className="h-[70vh] rounded-2xl bg-white/10" />
          <div className="grid content-start gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-2xl bg-white/10" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-6 pb-16 sm:px-10">
      {/* Barra superior */}
      <div className="mb-8 flex items-center justify-between gap-4">
        <Link
          href="/manager/blog"
          className="flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white/80"
        >
          <ArrowLeft size={15} /> Blog
        </Link>
        <div className="flex items-center gap-2">
          {mode === 'edit' && (
            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
              <AlertDialogTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="gap-1.5 text-red-400/70 hover:bg-red-500/10 hover:text-red-400"
                >
                  <Trash2 size={13} /> Excluir
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Excluir artigo?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação não pode ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={deleting}>
                    Cancelar
                  </AlertDialogCancel>
                  <AlertDialogAction
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={deleting}
                  >
                    {deleting ? 'Excluindo…' : 'Excluir'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          <Button
            type="button"
            size="sm"
            loading={saving}
            loadingLabel="Salvando…"
            onClick={handleSave}
            className="gap-1.5 border-0 bg-white text-[#3A4424] hover:bg-white/90"
          >
            Salvar
          </Button>
        </div>
      </div>

      <div className="grid items-start gap-8 lg:grid-cols-[1fr_280px]">
        {/* Documento */}
        <div className="overflow-hidden rounded-2xl" style={GLASS}>
          <div className="space-y-3 px-6 pt-6">
            <textarea
              ref={titleRef}
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Título do artigo"
              rows={1}
              className="w-full resize-none overflow-hidden bg-transparent font-[family-name:var(--font-cormorant)] text-3xl font-light text-white placeholder:text-white/25 focus:outline-none"
            />
            <input
              value={subtitle}
              onChange={e => setSubtitle(e.target.value)}
              placeholder="Subtítulo (opcional)"
              className="w-full bg-transparent pb-3 text-sm text-white/50 placeholder:text-white/25 focus:outline-none"
            />
          </div>
          <RichTextEditor content={bodyHtml} onChange={setBodyHtml} />
        </div>

        {/* Sidebar */}
        <div className="grid gap-4">
          {/* Publicação */}
          <div className="rounded-2xl p-5" style={GLASS}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white/80">
                  {published ? 'Publicado' : 'Rascunho'}
                </p>
                <p className="mt-0.5 text-xs text-white/35">
                  {published
                    ? 'Visível no site público'
                    : 'Não aparece no blog público'}
                </p>
              </div>
              <Switch checked={published} onCheckedChange={setPublished} />
            </div>
            {meta && (
              <div className="mt-4 space-y-1 border-t border-white/10 pt-3 text-[11px] text-white/30">
                <p>
                  Criado em{' '}
                  {new Date(meta.createdAt).toLocaleDateString('pt-BR')}
                </p>
                <p>
                  Atualizado em{' '}
                  {new Date(meta.updatedAt).toLocaleDateString('pt-BR')}
                </p>
              </div>
            )}
          </div>

          {/* Capa */}
          <div className="rounded-2xl p-5" style={GLASS}>
            <Label className="mb-3 block text-[10px] font-semibold uppercase tracking-[0.2em] text-white/35">
              Imagem de capa
            </Label>
            <CoverImageField
              value={coverImageUrl}
              onChange={setCoverImageUrl}
            />
          </div>

          {/* Categoria */}
          <div className="rounded-2xl p-5" style={GLASS}>
            <Label className="mb-3 block text-[10px] font-semibold uppercase tracking-[0.2em] text-white/35">
              Categorias
            </Label>
            <CategoryMultiSelect
              categories={categories}
              selectedIds={categoryIds}
              onChange={setCategoryIds}
              onRequestCreate={() => {
                setEditingCategory(undefined)
                setCategoryDialogOpen(true)
              }}
              onRequestEdit={c => {
                setEditingCategory(c)
                setCategoryDialogOpen(true)
              }}
            />
          </div>
        </div>
      </div>

      <CategoryDialog
        open={categoryDialogOpen}
        onOpenChange={setCategoryDialogOpen}
        category={editingCategory}
        onSaved={handleCategorySaved}
      />
    </div>
  )
}
