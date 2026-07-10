'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Pencil, Plus, Search, Trash2, X } from 'lucide-react'
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
import { FilterCombobox } from '@/components/filter-combobox'
import { Input } from '@/components/ui/input'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Skeleton } from '@/components/ui/skeleton'

const GLASS = {
  background:
    'linear-gradient(135deg, rgba(255,255,255,0.10), rgba(255,255,255,0.04))',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: '1px solid rgba(255,255,255,0.13)',
} satisfies React.CSSProperties

const PER_PAGE = 6

type Article = {
  id: string
  title: string
  categories: { id: string; name: string }[]
  published: boolean
}

function ArticleRow({
  article,
  onDeleted,
}: {
  article: Article
  onDeleted: (id: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    setDeleting(true)
    try {
      const res = await fetch(`/api/blog/${article.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      onDeleted(article.id)
      toast.success('Artigo excluído.')
    } catch {
      toast.error('Erro ao excluir artigo.')
      setDeleting(false)
    }
  }

  return (
    <tr className="group transition-colors hover:bg-white/[0.04]">
      <td className="px-6 py-4">
        <span className="line-clamp-1 text-white/85 group-hover:text-white">
          {article.title}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex flex-wrap gap-1.5">
          {article.categories.map(c => (
            <span
              key={c.id}
              className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs text-white/55"
            >
              {c.name}
            </span>
          ))}
        </div>
      </td>
      <td className="px-6 py-4">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs ${
            article.published
              ? 'bg-emerald-500/10 text-emerald-400/80'
              : 'bg-white/5 text-white/40'
          }`}
        >
          {article.published ? 'Publicado' : 'Rascunho'}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center justify-end gap-1">
          <Link
            href={`/manager/blog/${article.id}`}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white/35 transition-colors hover:bg-white/10 hover:text-white/80"
            aria-label="Editar"
          >
            <Pencil size={14} />
          </Link>
          <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-white/35 transition-colors hover:bg-red-500/15 hover:text-red-400"
                aria-label="Deletar"
              >
                <Trash2 size={14} />
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Excluir artigo?</AlertDialogTitle>
                <AlertDialogDescription>
                  &ldquo;{article.title}&rdquo; será removido permanentemente.
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
        </div>
      </td>
    </tr>
  )
}

export default function BlogManagerPage() {
  const [loading, setLoading] = useState(true)
  const [articles, setArticles] = useState<Article[]>([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [page, setPage] = useState(1)

  useEffect(() => {
    fetch('/api/blog')
      .then(res => res.json())
      .then((items: Article[]) =>
        setArticles(Array.isArray(items) ? items : [])
      )
      .catch(() => toast.error('Erro ao carregar artigos.'))
      .finally(() => setLoading(false))
  }, [])

  const categories = useMemo(
    () =>
      [...new Set(articles.flatMap(a => a.categories.map(c => c.name)))].sort(
        (a, b) => a.localeCompare(b, 'pt')
      ),
    [articles]
  )

  const filtered = useMemo(() => {
    return articles.filter(a => {
      const matchSearch = a.title.toLowerCase().includes(search.toLowerCase())
      const matchCat =
        !category || a.categories.some(c => c.name === category)
      return matchSearch && matchCat
    })
  }, [articles, search, category])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const currentPage = Math.min(page, totalPages)
  const paginated = filtered.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE
  )

  function goToPage(p: number) {
    setPage(p)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function clearFilters() {
    setSearch('')
    setCategory('')
    setPage(1)
  }

  function handleDeleted(id: string) {
    setArticles(prev => prev.filter(a => a.id !== id))
  }

  const hasFilters = search || category

  return (
    <div className="px-6 pb-12 sm:px-10">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Cabeçalho */}
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="font-[family-name:var(--font-cormorant)] text-3xl font-semibold text-white sm:text-4xl">
              Blog
            </h1>
            <p className="mt-1 text-sm text-white/50">
              {filtered.length} {filtered.length === 1 ? 'artigo' : 'artigos'}
              {hasFilters ? ' encontrados' : ' publicados'}
            </p>
          </div>
          <Button
            asChild
            variant="create"
            size="sm"
            className="shrink-0 gap-1.5"
          >
            <Link href="/manager/blog/new">
              <Plus size={13} /> Novo artigo
            </Link>
          </Button>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap items-center justify-start gap-3">
          {/* Busca */}
          <div className="relative min-w-0 flex-1 sm:max-w-xs">
            <Search
              size={13}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
            />
            <Input
              value={search}
              onChange={e => {
                setSearch(e.target.value)
                setPage(1)
              }}
              placeholder="Buscar artigo…"
              className="border-white/10 !bg-white/5 pl-8 text-white/85 placeholder:text-white/25 focus-visible:border-white/25 focus-visible:ring-0"
            />
          </div>

          {/* Categoria */}
          <FilterCombobox
            value={category}
            onChange={v => {
              setCategory(v)
              setPage(1)
            }}
            placeholder="Categoria"
            clearLabel="Limpar categoria"
            options={categories}
            width="w-48"
          />

          {/* Limpar */}
          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="flex items-center gap-1.5 rounded-md px-3 py-2 text-xs text-white/40 transition-colors hover:text-white/70"
            >
              <X size={11} /> Limpar
            </button>
          )}
        </div>

        {/* Tabela */}
        {loading ? (
          <div className="grid gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-16 rounded-xl bg-white/10" />
            ))}
          </div>
        ) : (
          <div style={GLASS} className="overflow-hidden rounded-2xl">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-white/40">
                    Título
                  </th>
                  <th className="w-48 px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-white/40">
                    Categoria
                  </th>
                  <th className="w-32 px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-white/40">
                    Status
                  </th>
                  <th className="w-24 px-6 py-4 text-right text-xs font-medium uppercase tracking-wider text-white/40">
                    Opções
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {paginated.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-12 text-center text-sm text-white/30"
                    >
                      Nenhum artigo encontrado.
                    </td>
                  </tr>
                ) : (
                  paginated.map(article => (
                    <ArticleRow
                      key={article.id}
                      article={article}
                      onDeleted={handleDeleted}
                    />
                  ))
                )}
              </tbody>
            </table>

            {/* Paginação */}
            {totalPages > 1 && (
              <div className="border-t border-white/[0.08] px-6 py-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={e => {
                          e.preventDefault()
                          if (currentPage > 1) goToPage(currentPage - 1)
                        }}
                        aria-disabled={currentPage === 1}
                        className={`text-white/60 hover:bg-white/10 hover:text-white ${currentPage === 1 ? 'pointer-events-none opacity-30' : ''}`}
                      />
                    </PaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      p => (
                        <PaginationItem key={p}>
                          <PaginationLink
                            href="#"
                            isActive={p === currentPage}
                            onClick={e => {
                              e.preventDefault()
                              goToPage(p)
                            }}
                            className={
                              p === currentPage
                                ? 'border-white/20 bg-white/15 text-white hover:bg-white/20'
                                : 'border-transparent text-white/50 hover:bg-white/10 hover:text-white'
                            }
                          >
                            {p}
                          </PaginationLink>
                        </PaginationItem>
                      )
                    )}
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={e => {
                          e.preventDefault()
                          if (currentPage < totalPages)
                            goToPage(currentPage + 1)
                        }}
                        aria-disabled={currentPage === totalPages}
                        className={`text-white/60 hover:bg-white/10 hover:text-white ${currentPage === totalPages ? 'pointer-events-none opacity-30' : ''}`}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
