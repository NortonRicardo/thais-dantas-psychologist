'use client'

import { useRef, useState } from 'react'
import {
  ChevronDown,
  FileText,
  ImageIcon,
  Pencil,
  Plus,
  Search,
  Trash2,
  Upload,
  X,
} from 'lucide-react'
import { toast } from 'sonner'

import { HttpsUrlSuffixField } from '@/components/https-url-suffix-field'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FilterCombobox } from '@/components/filter-combobox'
import { TeamMemberThumb } from '@/components/team-member-thumb'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Textarea } from '@/components/ui/textarea'
import { extractBgColorKey } from '@/lib/project-taxonomy-styles'
import { readApiError } from '@/lib/read-api-error'
import { stripUrlScheme, toHttpsStored } from '@/lib/url-https'

export type ProjectRow = {
  id: string
  slug: string
  title: string
  category: string
  categoryId: string
  categoryBadgeClass: string
  themes: string[]
  themeIds: string[]
  description: string
  imageMimeType: string | null
  pdfMimeType: string | null
  authors: string[]
  startDate: string
  endDate: string | null
  gitUrl: string | null
  publicationUrl: string | null
  advisorId: string | null
  coAdvisorId: string | null
  researchLeadId: string | null
  advisorName: string | null
  coAdvisorName: string | null
  researchLeadName: string | null
  updatedAt: string
}

type TeamOption = {
  id: string
  name: string
  photoMimeType: string | null
  updatedAt: string
}

type ProjectCategoryOption = { id: string; title: string; color: string }

type ProjectThemeOption = { id: string; name: string; color: string }

function CategoryCombobox({
  value,
  onChange,
  options,
}: {
  value: string
  onChange: (v: string) => void
  options: ProjectCategoryOption[]
}) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const filtered = options.filter(o =>
    o.title.toLowerCase().includes(search.toLowerCase())
  )
  const selected = options.find(o => o.id === value)
  const dotClass = selected ? extractBgColorKey(selected.color) : 'bg-slate-500'

  function select(id: string) {
    onChange(id)
    setOpen(false)
    setSearch('')
  }

  return (
    <Popover
      open={open}
      onOpenChange={o => {
        setOpen(o)
        if (o) setTimeout(() => inputRef.current?.focus(), 0)
      }}
    >
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex w-full items-center justify-between rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none hover:bg-white/[0.08] focus:border-white/20"
        >
          {selected ? (
            <span className="flex items-center gap-2 text-white/90">
              <span className={`h-2 w-2 shrink-0 rounded-full ${dotClass}`} />
              {selected.title}
            </span>
          ) : (
            <span className="text-white/30">Buscar categoria…</span>
          )}
          <ChevronDown size={13} className="shrink-0 text-white/30" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-[--radix-popover-trigger-width] border-white/10 bg-[#071525] p-0 shadow-xl"
      >
        <div className="border-b border-white/10 px-2 py-2">
          <div className="relative">
            <Search
              size={12}
              className="absolute left-2 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none"
            />
            <input
              ref={inputRef}
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Filtrar categorias…"
              className="w-full rounded-md bg-white/5 py-1.5 pl-7 pr-7 text-sm text-white/80 placeholder:text-white/25 outline-none"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>

        <ScrollArea className="h-48 overscroll-contain">
          <div className="p-1">
            {filtered.length === 0 && (
              <p className="py-3 text-center text-xs text-white/30">
                Nenhuma categoria encontrada.
              </p>
            )}
            {filtered.map(o => (
              <button
                key={o.id}
                type="button"
                onClick={() => select(o.id)}
                className={`flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-left text-sm transition-colors ${
                  value === o.id
                    ? 'bg-white/10 text-white/90'
                    : 'text-white/60 hover:bg-white/5 hover:text-white/85'
                }`}
              >
                <span
                  className={`h-2 w-2 shrink-0 rounded-full ${extractBgColorKey(o.color)}`}
                />
                {o.title}
              </button>
            ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}

const INPUT_CLS =
  'bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-0 focus-visible:border-white/30'

type Props = {
  project?: ProjectRow
  onSuccess: () => void
}

export function ProjectDialog({ project, onSuccess }: Props) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [categoryId, setCategoryId] = useState(project?.categoryId ?? '')
  const [themeIds, setThemeIds] = useState<string[]>(project?.themeIds ?? [])
  const [categories, setCategories] = useState<ProjectCategoryOption[]>([])
  const [themeOptions, setThemeOptions] = useState<ProjectThemeOption[]>([])
  const [advisorId, setAdvisorId] = useState(project?.advisorId ?? '')
  const [coAdvisorId, setCoAdvisorId] = useState(project?.coAdvisorId ?? '')
  const [researchLeadId, setResearchLeadId] = useState(
    project?.researchLeadId ?? ''
  )
  const [teamMembers, setTeamMembers] = useState<TeamOption[]>([])

  // Image state
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [removeImage, setRemoveImage] = useState(false)
  const imageRef = useRef<HTMLInputElement>(null)

  // PDF state
  const [pdfFileName, setPdfFileName] = useState<string | null>(null)
  const [removePdf, setRemovePdf] = useState(false)
  const pdfRef = useRef<HTMLInputElement>(null)

  const [gitUrlSuffix, setGitUrlSuffix] = useState(() =>
    stripUrlScheme(project?.gitUrl ?? '')
  )
  const [publicationUrlSuffix, setPublicationUrlSuffix] = useState(() =>
    stripUrlScheme(project?.publicationUrl ?? '')
  )

  const isEdit = !!project

  const existingImageUrl =
    isEdit && project.imageMimeType && !removeImage
      ? `/api/projects/${project.id}/image?t=${new Date(project.updatedAt).getTime()}`
      : null
  const previewSrc = imagePreview ?? existingImageUrl

  const hasExistingPdf = isEdit && !!project.pdfMimeType && !removePdf
  const showPdfPlaceholder = !hasExistingPdf && !pdfFileName

  async function loadTeamMembers() {
    try {
      const res = await fetch('/api/team')
      const data = (await res.json()) as {
        id: string
        name: string
        displayName?: string
        photoMimeType?: string | null
        updatedAt?: string
      }[]
      setTeamMembers(
        data.map(m => ({
          id: m.id,
          name: m.displayName ?? m.name,
          photoMimeType: m.photoMimeType ?? null,
          updatedAt: m.updatedAt ?? '',
        }))
      )
    } catch {
      toast.error('Erro ao carregar membros da equipe.')
    }
  }

  async function loadTaxonomy() {
    try {
      const [catRes, themeRes] = await Promise.all([
        fetch('/api/project-categories'),
        fetch('/api/project-themes'),
      ])
      const catData = (await catRes.json()) as ProjectCategoryOption[]
      const themeData = (await themeRes.json()) as ProjectThemeOption[]
      if (Array.isArray(catData)) setCategories(catData)
      if (Array.isArray(themeData)) setThemeOptions(themeData)
    } catch {
      toast.error('Erro ao carregar categorias e temas.')
    }
  }

  function handleOpenChange(newOpen: boolean) {
    if (newOpen) {
      setCategoryId(project?.categoryId ?? '')
      setThemeIds(project?.themeIds ?? [])
      setAdvisorId(project?.advisorId ?? '')
      setCoAdvisorId(project?.coAdvisorId ?? '')
      setResearchLeadId(project?.researchLeadId ?? '')
      setImagePreview(null)
      setRemoveImage(false)
      setPdfFileName(null)
      setRemovePdf(false)
      setGitUrlSuffix(stripUrlScheme(project?.gitUrl ?? ''))
      setPublicationUrlSuffix(stripUrlScheme(project?.publicationUrl ?? ''))
      void loadTeamMembers()
      void loadTaxonomy()
    }
    setOpen(newOpen)
  }

  function toggleThemeId(id: string) {
    setThemeIds(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    )
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImagePreview(URL.createObjectURL(file))
    setRemoveImage(false)
  }

  function handleRemoveImage() {
    setImagePreview(null)
    setRemoveImage(true)
    if (imageRef.current) imageRef.current.value = ''
  }

  function handlePdfChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setPdfFileName(file.name)
    setRemovePdf(false)
  }

  function handleRemovePdf() {
    setPdfFileName(null)
    setRemovePdf(true)
    if (pdfRef.current) pdfRef.current.value = ''
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!categoryId) {
      toast.error('Selecione uma categoria.')
      return
    }
    if (themeIds.length === 0) {
      toast.error('Selecione ao menos um tema.')
      return
    }
    if (!advisorId) {
      toast.error('Selecione um orientador.')
      return
    }
    setLoading(true)

    const form = e.currentTarget
    const fd = new FormData(form)
    fd.set('categoryId', categoryId)
    themeIds.forEach(tid => fd.append('themeIds', tid))
    fd.set('advisorId', advisorId)
    fd.set('coAdvisorId', coAdvisorId)
    fd.set('researchLeadId', researchLeadId)
    fd.set('gitUrl', toHttpsStored(gitUrlSuffix))
    fd.set('publicationUrl', toHttpsStored(publicationUrlSuffix))
    if (removeImage) fd.set('removeImage', 'true')
    if (removePdf) fd.set('removePdf', 'true')

    const url = isEdit ? `/api/projects/${project.id}` : '/api/projects'
    const method = isEdit ? 'PUT' : 'POST'

    try {
      const res = await fetch(url, { method, body: fd })
      if (!res.ok) {
        toast.error(await readApiError(res))
        return
      }
      toast.success(isEdit ? 'Projeto atualizado!' : 'Projeto criado!')
      setOpen(false)
      onSuccess()
    } catch {
      toast.error('Não foi possível salvar o projeto.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {isEdit ? (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white/40 hover:text-sky-400 hover:bg-sky-400/10"
          >
            <Pencil size={14} />
          </Button>
        ) : (
          <Button className="gap-2 bg-orange-800 text-orange-50 hover:bg-orange-700 border-0">
            <Plus size={15} /> Novo projeto
          </Button>
        )}
      </DialogTrigger>

      <DialogContent
        className="max-h-[90vh] w-full max-w-[calc(100%-2rem)] overflow-y-auto border-white/10 bg-[#071525] text-white sm:max-w-4xl [&_[data-slot='dialog-close']]:bg-transparent [&_[data-slot='dialog-close']]:text-white/40 [&_[data-slot='dialog-close']]:hover:bg-white/10 [&_[data-slot='dialog-close']]:hover:text-white/80 [&_[data-slot='dialog-close']]:rounded"
        onOpenAutoFocus={e => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-white">
            {isEdit ? 'Editar projeto' : 'Novo projeto'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-2 grid gap-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:items-start">
            {/* Capa — esquerda */}
            <div className="flex flex-col gap-3">
              <input
                ref={imageRef}
                name="image"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
              {previewSrc ? (
                <div className="group relative h-28 w-full overflow-hidden rounded-xl border border-white/10 sm:h-32">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewSrc}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/55 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={() => imageRef.current?.click()}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/70 transition hover:bg-white/20 hover:text-white"
                      title="Trocar imagem"
                    >
                      <Upload size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-500/20 text-rose-300 transition hover:bg-rose-500/40 hover:text-rose-200"
                      title="Remover imagem"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => imageRef.current?.click()}
                  className="flex h-28 w-full flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-white/15 bg-white/[0.02] transition hover:border-white/30 hover:bg-white/[0.05] sm:h-32"
                >
                  <ImageIcon size={20} className="text-white/25" />
                  <span className="text-xs text-white/40">
                    Imagem de capa (opcional)
                  </span>
                </button>
              )}
            </div>

            {/* Categoria e slug — direita */}
            <div className="grid min-w-0 gap-4">
              <div className="grid gap-1.5">
                <Label className="text-white/70">Categoria *</Label>
                <CategoryCombobox
                  value={categoryId}
                  onChange={setCategoryId}
                  options={categories}
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="slug" className="text-white/70">
                  Slug *{' '}
                  <span className="text-white/30 font-normal">(URL)</span>
                </Label>
                <Input
                  id="slug"
                  name="slug"
                  required
                  defaultValue={project?.slug}
                  placeholder="weather-brasil"
                  className={INPUT_CLS}
                />
              </div>
            </div>
          </div>

          {/* Título */}
          <div className="grid gap-1.5">
            <Label htmlFor="title" className="text-white/70">
              Título *
            </Label>
            <Input
              id="title"
              name="title"
              required
              defaultValue={project?.title}
              placeholder="Nome do projeto"
              className={INPUT_CLS}
            />
          </div>

          {/* Temas */}
          <div className="grid gap-1.5">
            <Label className="text-white/70">Temas *</Label>
            <div className="flex flex-wrap gap-2">
              {themeOptions.map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => toggleThemeId(t.id)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors border ${
                    themeIds.includes(t.id)
                      ? 'bg-orange-800/50 border-orange-500/50 text-orange-200'
                      : 'bg-white/5 border-white/10 text-white/50 hover:border-white/25 hover:text-white/70'
                  }`}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:items-start">
            {/* Responsável pela pesquisa */}
            <div className="grid min-w-0 gap-1.5">
              <Label className="text-white/70">Responsável pela pesquisa</Label>
              <FilterCombobox
                value={researchLeadId}
                onChange={setResearchLeadId}
                placeholder="Selecionar…"
                clearLabel="Nenhum"
                showClear={!!researchLeadId}
                options={teamMembers.map(m => m.id)}
                labelForValue={id =>
                  teamMembers.find(m => m.id === id)?.name ?? ''
                }
                width="w-full min-w-0"
                renderOption={id => {
                  const m = teamMembers.find(r => r.id === id)
                  const label = m?.name ?? id
                  return (
                    <span className="flex min-w-0 items-center gap-2">
                      <TeamMemberThumb
                        memberId={id}
                        displayName={label}
                        photoMimeType={m?.photoMimeType ?? null}
                        updatedAtIso={m?.updatedAt ?? null}
                        sizePx={22}
                        frameClassName="border-white/10 bg-white/5"
                      />
                      <span className="truncate" title={label}>
                        {label}
                      </span>
                    </span>
                  )
                }}
                renderValue={id => {
                  const m = teamMembers.find(r => r.id === id)
                  const label = m?.name ?? ''
                  return (
                    <span className="flex min-w-0 flex-1 items-center gap-2.5">
                      <TeamMemberThumb
                        memberId={id}
                        displayName={label || id}
                        photoMimeType={m?.photoMimeType ?? null}
                        updatedAtIso={m?.updatedAt ?? null}
                        sizePx={24}
                        frameClassName="border-white/10 bg-white/5"
                      />
                      <span
                        className="block min-w-0 flex-1 truncate"
                        title={label || undefined}
                      >
                        {label}
                      </span>
                    </span>
                  )
                }}
              />
            </div>

            {/* Orientador */}
            <div className="grid min-w-0 gap-1.5">
              <Label className="text-white/70">Orientador(a) *</Label>
              <FilterCombobox
                value={advisorId}
                onChange={setAdvisorId}
                placeholder="Selecionar…"
                clearLabel="Nenhum(a)"
                showClear={!!advisorId}
                options={teamMembers.map(m => m.id)}
                labelForValue={id =>
                  teamMembers.find(m => m.id === id)?.name ?? ''
                }
                width="w-full min-w-0"
                renderOption={id => {
                  const m = teamMembers.find(r => r.id === id)
                  const label = m?.name ?? id
                  return (
                    <span className="flex min-w-0 items-center gap-2">
                      <TeamMemberThumb
                        memberId={id}
                        displayName={label}
                        photoMimeType={m?.photoMimeType ?? null}
                        updatedAtIso={m?.updatedAt ?? null}
                        sizePx={22}
                        frameClassName="border-white/10 bg-white/5"
                      />
                      <span className="truncate" title={label}>
                        {label}
                      </span>
                    </span>
                  )
                }}
                renderValue={id => {
                  const m = teamMembers.find(r => r.id === id)
                  const label = m?.name ?? ''
                  return (
                    <span className="flex min-w-0 flex-1 items-center gap-2.5">
                      <TeamMemberThumb
                        memberId={id}
                        displayName={label || id}
                        photoMimeType={m?.photoMimeType ?? null}
                        updatedAtIso={m?.updatedAt ?? null}
                        sizePx={24}
                        frameClassName="border-white/10 bg-white/5"
                      />
                      <span
                        className="block min-w-0 flex-1 truncate"
                        title={label || undefined}
                      >
                        {label}
                      </span>
                    </span>
                  )
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Data início */}
            <div className="grid gap-1.5">
              <Label htmlFor="startDate" className="text-white/70">
                Data de início *
              </Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                required
                defaultValue={
                  project?.startDate ? project.startDate.slice(0, 10) : ''
                }
                className={INPUT_CLS}
              />
            </div>

            {/* Data conclusão */}
            <div className="grid gap-1.5">
              <Label htmlFor="endDate" className="text-white/70">
                Conclusão{' '}
                <span className="text-white/30 font-normal">(opcional)</span>
              </Label>
              <Input
                id="endDate"
                name="endDate"
                type="date"
                defaultValue={
                  project?.endDate ? project.endDate.slice(0, 10) : ''
                }
                className={INPUT_CLS}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:items-start">
            {/* Coorientador */}
            <div className="grid min-w-0 gap-1.5">
              <Label className="text-white/70">Coorientador(a)</Label>
              <FilterCombobox
                value={coAdvisorId}
                onChange={setCoAdvisorId}
                placeholder="Selecionar…"
                clearLabel="Nenhum(a)"
                showClear={!!coAdvisorId}
                options={teamMembers.map(m => m.id)}
                labelForValue={id =>
                  teamMembers.find(m => m.id === id)?.name ?? ''
                }
                width="w-full min-w-0"
                renderOption={id => {
                  const m = teamMembers.find(r => r.id === id)
                  const label = m?.name ?? id
                  return (
                    <span className="flex min-w-0 items-center gap-2">
                      <TeamMemberThumb
                        memberId={id}
                        displayName={label}
                        photoMimeType={m?.photoMimeType ?? null}
                        updatedAtIso={m?.updatedAt ?? null}
                        sizePx={22}
                        frameClassName="border-white/10 bg-white/5"
                      />
                      <span className="truncate" title={label}>
                        {label}
                      </span>
                    </span>
                  )
                }}
                renderValue={id => {
                  const m = teamMembers.find(r => r.id === id)
                  const label = m?.name ?? ''
                  return (
                    <span className="flex min-w-0 flex-1 items-center gap-2.5">
                      <TeamMemberThumb
                        memberId={id}
                        displayName={label || id}
                        photoMimeType={m?.photoMimeType ?? null}
                        updatedAtIso={m?.updatedAt ?? null}
                        sizePx={24}
                        frameClassName="border-white/10 bg-white/5"
                      />
                      <span
                        className="block min-w-0 flex-1 truncate"
                        title={label || undefined}
                      >
                        {label}
                      </span>
                    </span>
                  )
                }}
              />
            </div>

            {/* Outros */}
            <div className="grid min-w-0 gap-1.5">
              <Label htmlFor="authors" className="text-white/70">
                Outros{' '}
                <span className="text-white/30 font-normal">
                  (nomes separados por vírgula)
                </span>
              </Label>
              <Input
                id="authors"
                name="authors"
                defaultValue={project?.authors.join(', ')}
                placeholder="Discente PPGEIIA, Nome Sobrenome"
                className={INPUT_CLS}
              />
            </div>
          </div>

          {/* Descrição */}
          <div className="grid gap-1.5">
            <Label htmlFor="description" className="text-white/70">
              Descrição *
            </Label>
            <Textarea
              id="description"
              name="description"
              required
              rows={4}
              defaultValue={project?.description}
              placeholder="Descreva o projeto…"
              className={`${INPUT_CLS} resize-none`}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:items-start">
            {/* PDF — esquerda */}
            <div className="flex flex-col gap-3">
              <Label className="text-white/70">PDF do projeto</Label>
              <input
                ref={pdfRef}
                name="pdf"
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={handlePdfChange}
              />
              {showPdfPlaceholder ? (
                <button
                  type="button"
                  onClick={() => pdfRef.current?.click()}
                  className="flex h-28 w-full flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-white/15 bg-white/[0.02] text-sm text-white/40 transition hover:border-white/30 hover:bg-white/[0.05] hover:text-white/60 sm:h-32"
                >
                  <FileText size={20} className="shrink-0 text-white/25" />
                  <span>Selecionar PDF</span>
                </button>
              ) : (
                <div className="flex h-28 w-full items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 sm:h-32">
                  <FileText size={18} className="shrink-0 text-orange-300/70" />
                  <span className="min-w-0 flex-1 truncate text-sm text-white/70">
                    {pdfFileName ?? (hasExistingPdf ? 'PDF carregado' : '')}
                  </span>
                  <div className="flex shrink-0 items-center gap-1">
                    {hasExistingPdf && (
                      <a
                        href={`/api/projects/${project!.id}/pdf`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-7 w-7 items-center justify-center rounded-md text-white/40 transition hover:bg-white/10 hover:text-white/70"
                        title="Ver PDF"
                        onClick={e => e.stopPropagation()}
                      >
                        <FileText size={13} />
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() => pdfRef.current?.click()}
                      className="flex h-7 w-7 items-center justify-center rounded-md text-white/40 transition hover:bg-white/10 hover:text-white/70"
                      title="Trocar PDF"
                    >
                      <Upload size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={handleRemovePdf}
                      className="flex h-7 w-7 items-center justify-center rounded-md text-rose-400/60 transition hover:bg-rose-500/10 hover:text-rose-300"
                      title="Remover PDF"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Git + publicação — direita */}
            <div className="grid min-w-0 gap-4">
              <div className="grid gap-1.5">
                <Label htmlFor="gitUrl" className="text-white/70">
                  Git URL
                </Label>
                <HttpsUrlSuffixField
                  id="gitUrl"
                  value={gitUrlSuffix}
                  onChange={setGitUrlSuffix}
                  placeholder="github.com/org/repo"
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="publicationUrl" className="text-white/70">
                  URL de publicação
                </Label>
                <HttpsUrlSuffixField
                  id="publicationUrl"
                  value={publicationUrlSuffix}
                  onChange={setPublicationUrlSuffix}
                  placeholder="doi.org/…"
                />
              </div>
              <p className="text-[0.65rem] text-white/35">
                Digite só o domínio e o caminho; o endereço é salvo com
                https://.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-white/10 pt-4">
            <Button
              type="button"
              variant="ghost"
              className="text-white/50 hover:text-white hover:bg-white/5"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              loading={loading}
              loadingLabel="Salvando…"
              className="border-0 bg-orange-800 text-orange-50 hover:bg-orange-700 disabled:opacity-50"
            >
              {isEdit ? 'Salvar alterações' : 'Criar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
