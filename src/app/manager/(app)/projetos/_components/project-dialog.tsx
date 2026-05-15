'use client'

import { useRef, useState } from 'react'
import { FileText, ImageIcon, Pencil, Plus, Trash2, Upload } from 'lucide-react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { stripUrlScheme, toHttpsStored } from '@/lib/url-https'

export type ProjectRow = {
  id: string
  slug: string
  title: string
  category: string
  themes: string[]
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

type TeamOption = { id: string; name: string; category: string }

const CATEGORIES = [
  'TCC',
  'Iniciação Científica',
  'Mestrado',
  'Plataforma',
  'Pesquisa',
]

const THEMES = [
  'Clima',
  'Matemática',
  'Otimização e Metaheurísticas',
  'Agro & Sustentabilidade',
]

const INPUT_CLS =
  'bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-0 focus-visible:border-white/30'

type Props = {
  project?: ProjectRow
  onSuccess: () => void
}

export function ProjectDialog({ project, onSuccess }: Props) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [category, setCategory] = useState(project?.category ?? '')
  const [themes, setThemes] = useState<string[]>(project?.themes ?? [])
  const [advisorId, setAdvisorId] = useState(project?.advisorId ?? '__none__')
  const [coAdvisorId, setCoAdvisorId] = useState(project?.coAdvisorId ?? '__none__')
  const [researchLeadId, setResearchLeadId] = useState(project?.researchLeadId ?? '__none__')
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
      const data: TeamOption[] = await res.json()
      setTeamMembers(data)
    } catch {
      toast.error('Erro ao carregar membros da equipe.')
    }
  }

  function handleOpenChange(newOpen: boolean) {
    if (newOpen) {
      setCategory(project?.category ?? '')
      setThemes(project?.themes ?? [])
      setAdvisorId(project?.advisorId ?? '__none__')
      setCoAdvisorId(project?.coAdvisorId ?? '__none__')
      setResearchLeadId(project?.researchLeadId ?? '__none__')
      setImagePreview(null)
      setRemoveImage(false)
      setPdfFileName(null)
      setRemovePdf(false)
      setGitUrlSuffix(stripUrlScheme(project?.gitUrl ?? ''))
      setPublicationUrlSuffix(stripUrlScheme(project?.publicationUrl ?? ''))
      loadTeamMembers()
    }
    setOpen(newOpen)
  }

  function toggleTheme(theme: string) {
    setThemes(prev =>
      prev.includes(theme) ? prev.filter(t => t !== theme) : [...prev, theme]
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
    if (!category) {
      toast.error('Selecione uma categoria.')
      return
    }
    if (themes.length === 0) {
      toast.error('Selecione ao menos um tema.')
      return
    }
    setLoading(true)

    const form = e.currentTarget
    const fd = new FormData(form)
    fd.delete('themes')
    themes.forEach(t => fd.append('themes', t))
    fd.set('category', category)
    fd.set('advisorId', advisorId === '__none__' ? '' : advisorId)
    fd.set('coAdvisorId', coAdvisorId === '__none__' ? '' : coAdvisorId)
    fd.set('researchLeadId', researchLeadId === '__none__' ? '' : researchLeadId)
    fd.set('gitUrl', toHttpsStored(gitUrlSuffix))
    fd.set('publicationUrl', toHttpsStored(publicationUrlSuffix))
    if (removeImage) fd.set('removeImage', 'true')
    if (removePdf) fd.set('removePdf', 'true')

    const url = isEdit ? `/api/projects/${project.id}` : '/api/projects'
    const method = isEdit ? 'PUT' : 'POST'

    try {
      const res = await fetch(url, { method, body: fd })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(typeof err.error === 'string' ? err.error : 'Erro ao salvar')
      }
      toast.success(isEdit ? 'Projeto atualizado!' : 'Projeto criado!')
      setOpen(false)
      onSuccess()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao salvar.')
    } finally {
      setLoading(false)
    }
  }

  const membersWithNone: TeamOption[] = [
    { id: '__none__', name: '— Nenhum —', category: '' },
    ...teamMembers,
  ]

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
        className="max-h-[90vh] max-w-2xl overflow-y-auto bg-[#071525] text-white border-white/10 [&_[data-slot='dialog-close']]:bg-transparent [&_[data-slot='dialog-close']]:text-white/40 [&_[data-slot='dialog-close']]:hover:bg-white/10 [&_[data-slot='dialog-close']]:hover:text-white/80 [&_[data-slot='dialog-close']]:rounded"
        onOpenAutoFocus={e => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-white">
            {isEdit ? 'Editar projeto' : 'Novo projeto'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-2 grid gap-4">
          {/* Imagem de capa */}
          <div className="flex flex-col items-center gap-3">
            <input
              ref={imageRef}
              name="image"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
            {previewSrc ? (
              <div className="group relative h-32 w-full overflow-hidden rounded-xl border border-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={previewSrc} alt="Preview" className="h-full w-full object-cover" />
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
                className="flex h-24 w-full flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-white/15 bg-white/[0.02] transition hover:border-white/30 hover:bg-white/[0.05]"
              >
                <ImageIcon size={20} className="text-white/25" />
                <span className="text-xs text-white/40">Imagem de capa (opcional)</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Slug */}
            <div className="grid gap-1.5">
              <Label htmlFor="slug" className="text-white/70">
                Slug * <span className="text-white/30 font-normal">(URL)</span>
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

            {/* Categoria */}
            <div className="grid gap-1.5">
              <Label className="text-white/70">Categoria *</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-full bg-white/5 border-white/10 text-white focus:ring-0">
                  <SelectValue placeholder="Selecionar…" />
                </SelectTrigger>
                <SelectContent className="bg-[#071525] border-white/10 text-white">
                  {CATEGORIES.map(c => (
                    <SelectItem
                      key={c}
                      value={c}
                      className="text-white/80 data-[highlighted]:bg-white/10 data-[highlighted]:text-white cursor-pointer"
                    >
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Título */}
          <div className="grid gap-1.5">
            <Label htmlFor="title" className="text-white/70">Título *</Label>
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
              {THEMES.map(theme => (
                <button
                  key={theme}
                  type="button"
                  onClick={() => toggleTheme(theme)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors border ${
                    themes.includes(theme)
                      ? 'bg-orange-800/50 border-orange-500/50 text-orange-200'
                      : 'bg-white/5 border-white/10 text-white/50 hover:border-white/25 hover:text-white/70'
                  }`}
                >
                  {theme}
                </button>
              ))}
            </div>
          </div>

          {/* Descrição */}
          <div className="grid gap-1.5">
            <Label htmlFor="description" className="text-white/70">Descrição *</Label>
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

          <div className="grid grid-cols-2 gap-4">
            {/* Data início */}
            <div className="grid gap-1.5">
              <Label htmlFor="startDate" className="text-white/70">Data de início *</Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                required
                defaultValue={project?.startDate ? project.startDate.slice(0, 10) : ''}
                className={INPUT_CLS}
              />
            </div>

            {/* Data conclusão */}
            <div className="grid gap-1.5">
              <Label htmlFor="endDate" className="text-white/70">
                Conclusão <span className="text-white/30 font-normal">(opcional)</span>
              </Label>
              <Input
                id="endDate"
                name="endDate"
                type="date"
                defaultValue={project?.endDate ? project.endDate.slice(0, 10) : ''}
                className={INPUT_CLS}
              />
            </div>
          </div>

          {/* Orientador */}
          <div className="grid gap-1.5">
            <Label className="text-white/70">Orientador(a)</Label>
            <Select value={advisorId} onValueChange={setAdvisorId}>
              <SelectTrigger className="w-full bg-white/5 border-white/10 text-white focus:ring-0">
                <SelectValue placeholder="Selecionar…" />
              </SelectTrigger>
              <SelectContent className="bg-[#071525] border-white/10 text-white">
                {membersWithNone.map(m => (
                  <SelectItem
                    key={m.id}
                    value={m.id}
                    className="text-white/80 data-[highlighted]:bg-white/10 data-[highlighted]:text-white cursor-pointer"
                  >
                    {m.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Coorientador */}
          <div className="grid gap-1.5">
            <Label className="text-white/70">Coorientador(a)</Label>
            <Select value={coAdvisorId} onValueChange={setCoAdvisorId}>
              <SelectTrigger className="w-full bg-white/5 border-white/10 text-white focus:ring-0">
                <SelectValue placeholder="Selecionar…" />
              </SelectTrigger>
              <SelectContent className="bg-[#071525] border-white/10 text-white">
                {membersWithNone.map(m => (
                  <SelectItem
                    key={m.id}
                    value={m.id}
                    className="text-white/80 data-[highlighted]:bg-white/10 data-[highlighted]:text-white cursor-pointer"
                  >
                    {m.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Responsável pela pesquisa */}
          <div className="grid gap-1.5">
            <Label className="text-white/70">Responsável pela pesquisa</Label>
            <Select value={researchLeadId} onValueChange={setResearchLeadId}>
              <SelectTrigger className="w-full bg-white/5 border-white/10 text-white focus:ring-0">
                <SelectValue placeholder="Selecionar…" />
              </SelectTrigger>
              <SelectContent className="bg-[#071525] border-white/10 text-white">
                {membersWithNone.map(m => (
                  <SelectItem
                    key={m.id}
                    value={m.id}
                    className="text-white/80 data-[highlighted]:bg-white/10 data-[highlighted]:text-white cursor-pointer"
                  >
                    {m.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Outros */}
          <div className="grid gap-1.5">
            <Label htmlFor="authors" className="text-white/70">
              Outros <span className="text-white/30 font-normal">(nomes separados por vírgula)</span>
            </Label>
            <Input
              id="authors"
              name="authors"
              defaultValue={project?.authors.join(', ')}
              placeholder="Discente PPGEIIA, Nome Sobrenome"
              className={INPUT_CLS}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Git URL */}
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

            {/* Publicação */}
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
          </div>
          <p className="text-[0.65rem] text-white/35 -mt-2">
            Digite só o domínio e o caminho; o endereço é salvo com https://.
          </p>

          {/* PDF upload */}
          <div className="grid gap-1.5">
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
                className="flex h-14 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 bg-white/[0.02] text-sm text-white/40 transition hover:border-white/30 hover:bg-white/[0.05] hover:text-white/60"
              >
                <FileText size={16} className="shrink-0" />
                Selecionar PDF
              </button>
            ) : (
              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                <FileText size={18} className="shrink-0 text-orange-300/70" />
                <span className="flex-1 truncate text-sm text-white/70">
                  {pdfFileName ?? (hasExistingPdf ? 'PDF carregado' : '')}
                </span>
                <div className="flex items-center gap-1">
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
              disabled={loading}
              className="bg-orange-800 text-orange-50 hover:bg-orange-700 border-0 disabled:opacity-50"
            >
              {loading ? 'Salvando…' : isEdit ? 'Salvar alterações' : 'Criar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
