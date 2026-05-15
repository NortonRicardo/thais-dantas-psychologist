'use client'

import { useEffect, useRef, useState } from 'react'
import { ImageIcon, Pencil, Plus, Trash2, Upload } from 'lucide-react'
import { toast } from 'sonner'

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
import { HttpsUrlSuffixField } from '@/components/https-url-suffix-field'
import { stripUrlScheme, toHttpsStored } from '@/lib/url-https'

export type TeamMemberRow = {
  id: string
  categoryId: string
  categoryTitle: string
  categoryColor: string
  namePrefixId: string | null
  namePrefixLabel: string | null
  degreeLevelId: string | null
  degreeLevelLabel: string | null
  formationInstitution: string | null
  name: string
  displayName: string
  qualification: string
  description: string | null
  photoMimeType: string | null
  linkedinUrl: string | null
  lattesUrl: string | null
  active: boolean
  updatedAt: string
}

type CategoryOption = { id: string; title: string; color: string }
type PrefixOption = { id: string; label: string }
type DegreeLevelOption = { id: string; label: string }

const INPUT_CLS =
  'bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-0 focus-visible:border-white/30'

type Props = {
  member?: TeamMemberRow
  onSuccess: () => void
}

export function TeamDialog({ member, onSuccess }: Props) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<CategoryOption[]>([])
  const [prefixes, setPrefixes] = useState<PrefixOption[]>([])
  const [degreeLevels, setDegreeLevels] = useState<DegreeLevelOption[]>([])
  const [memberActive, setMemberActive] = useState(member?.active ?? true)
  const [categoryId, setCategoryId] = useState(member?.categoryId ?? '')
  const [namePrefixId, setNamePrefixId] = useState(
    () => member?.namePrefixId ?? '__none__'
  )
  const [degreeLevelId, setDegreeLevelId] = useState(
    () => member?.degreeLevelId ?? '__none__'
  )
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [removeImage, setRemoveImage] = useState(false)
  const [linkedinSuffix, setLinkedinSuffix] = useState(() =>
    stripUrlScheme(member?.linkedinUrl ?? '')
  )
  const [lattesSuffix, setLattesSuffix] = useState(() =>
    stripUrlScheme(member?.lattesUrl ?? '')
  )
  const fileRef = useRef<HTMLInputElement>(null)

  const isEdit = !!member

  const existingImageUrl =
    isEdit && member.photoMimeType && !removeImage
      ? `/api/team/${member.id}/photo?t=${new Date(member.updatedAt).getTime()}`
      : null
  const previewSrc = imagePreview ?? existingImageUrl

  useEffect(() => {
    if (!open) return
    let cancelled = false
    ;(async () => {
      try {
        const [catRes, pfxRes, degRes] = await Promise.all([
          fetch('/api/team/categories'),
          fetch('/api/team/prefixes'),
          fetch('/api/team/degree-levels'),
        ])
        if (!catRes.ok || !pfxRes.ok || !degRes.ok) throw new Error('fetch')
        const data: CategoryOption[] = await catRes.json()
        const pfxData: PrefixOption[] = await pfxRes.json()
        const degData: DegreeLevelOption[] = await degRes.json()
        if (cancelled) return
        setCategories(data)
        setPrefixes(pfxData)
        setDegreeLevels(degData)
        setCategoryId(prev => {
          if (member?.categoryId) return member.categoryId
          if (prev && data.some(c => c.id === prev)) return prev
          return data[0]?.id ?? ''
        })
        setNamePrefixId(prev => {
          if (
            member?.namePrefixId &&
            pfxData.some(p => p.id === member.namePrefixId)
          ) {
            return member.namePrefixId
          }
          if (prev !== '__none__' && pfxData.some(p => p.id === prev))
            return prev
          return '__none__'
        })
        setDegreeLevelId(prev => {
          if (
            member?.degreeLevelId &&
            degData.some(d => d.id === member.degreeLevelId)
          ) {
            return member.degreeLevelId
          }
          if (prev !== '__none__' && degData.some(d => d.id === prev))
            return prev
          return '__none__'
        })
      } catch {
        if (!cancelled) toast.error('Erro ao carregar opções.')
      }
    })()
    return () => {
      cancelled = true
    }
  }, [open, member])

  function handleOpenChange(newOpen: boolean) {
    if (newOpen) {
      setCategoryId(member?.categoryId ?? '')
      setNamePrefixId(member?.namePrefixId ?? '__none__')
      setDegreeLevelId(member?.degreeLevelId ?? '__none__')
      setLinkedinSuffix(stripUrlScheme(member?.linkedinUrl ?? ''))
      setLattesSuffix(stripUrlScheme(member?.lattesUrl ?? ''))
      setImagePreview(null)
      setRemoveImage(false)
      setMemberActive(member?.active ?? true)
    }
    setOpen(newOpen)
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImagePreview(URL.createObjectURL(file))
    setRemoveImage(false)
  }

  function handleRemoveImage() {
    setImagePreview(null)
    setRemoveImage(true)
    if (fileRef.current) fileRef.current.value = ''
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!categoryId) {
      toast.error('Selecione uma categoria.')
      return
    }
    setLoading(true)

    const form = e.currentTarget
    const fd = new FormData(form)
    fd.set('categoryId', categoryId)
    fd.set('namePrefixId', namePrefixId === '__none__' ? '' : namePrefixId)
    fd.set('degreeLevelId', degreeLevelId === '__none__' ? '' : degreeLevelId)
    fd.set('linkedinUrl', toHttpsStored(linkedinSuffix))
    fd.set('lattesUrl', toHttpsStored(lattesSuffix))
    if (removeImage) fd.set('removePhoto', 'true')
    if (isEdit) fd.set('active', memberActive ? 'true' : 'false')

    const url = isEdit ? `/api/team/${member.id}` : '/api/team'
    const method = isEdit ? 'PUT' : 'POST'

    try {
      const res = await fetch(url, { method, body: fd })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(
          typeof err.error === 'string' ? err.error : 'Erro ao salvar'
        )
      }
      toast.success(isEdit ? 'Membro atualizado!' : 'Membro criado!')
      setOpen(false)
      onSuccess()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao salvar.')
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
            <Plus size={15} /> Novo membro
          </Button>
        )}
      </DialogTrigger>

      <DialogContent
        className="max-h-[90vh] w-full max-w-[calc(100%-2rem)] overflow-y-auto bg-[#071525] text-white border-white/10 sm:max-w-3xl [&_[data-slot='dialog-close']]:bg-transparent [&_[data-slot='dialog-close']]:text-white/40 [&_[data-slot='dialog-close']]:hover:bg-white/10 [&_[data-slot='dialog-close']]:hover:text-white/80 [&_[data-slot='dialog-close']]:rounded"
        onOpenAutoFocus={e => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-white">
            {isEdit ? 'Editar membro' : 'Novo membro'}
          </DialogTitle>
        </DialogHeader>

        <form
          key={member?.id ?? 'new'}
          onSubmit={handleSubmit}
          className="mt-2 grid gap-4"
        >
          {/* Foto — primeiro campo, centralizado, redondo */}
          <div className="flex flex-col items-center gap-3">
            <input
              ref={fileRef}
              name="photo"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            {previewSrc ? (
              <div className="group relative h-28 w-28 overflow-hidden rounded-full border border-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewSrc}
                  alt="Preview"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/55 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/70 transition hover:bg-white/20 hover:text-white"
                    title="Trocar foto"
                  >
                    <Upload size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-500/20 text-rose-300 transition hover:bg-rose-500/40 hover:text-rose-200"
                    title="Remover foto"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex h-28 w-28 flex-col items-center justify-center gap-1.5 rounded-full border border-dashed border-white/15 bg-white/[0.02] transition hover:border-white/30 hover:bg-white/[0.05]"
              >
                <ImageIcon size={20} className="text-white/25" />
                <span className="text-xs text-white/40">Foto</span>
              </button>
            )}
          </div>

          {/* Categoria + situação (lado a lado no topo em edição) */}
          <div
            className={`grid gap-4 ${isEdit ? 'sm:grid-cols-2' : 'grid-cols-1'}`}
          >
            <div className="grid min-w-0 gap-1.5">
              <Label className="text-white/70">Categoria *</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger className="w-full bg-white/5 border-white/10 text-white focus:ring-0">
                  <SelectValue
                    placeholder={
                      !categories.length ? 'Carregando…' : 'Selecionar…'
                    }
                  />
                </SelectTrigger>
                <SelectContent className="bg-[#071525] border-white/10 text-white">
                  {categories.map(c => (
                    <SelectItem
                      key={c.id}
                      value={c.id}
                      className="text-white/80 data-[highlighted]:bg-white/10 data-[highlighted]:text-white cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <span
                          className={`h-2.5 w-2.5 shrink-0 rounded-full ${c.color}`}
                        />
                        {c.title}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {isEdit ? (
              <div className="grid min-w-0 gap-1.5">
                <Label className="text-white/70">
                  Situação na página Equipe
                </Label>
                <Select
                  value={memberActive ? 'active' : 'inactive'}
                  onValueChange={v => setMemberActive(v === 'active')}
                >
                  <SelectTrigger className="w-full bg-white/5 border-white/10 text-white focus:ring-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#071525] border-white/10 text-white">
                    <SelectItem
                      value="active"
                      className="text-white/80 data-[highlighted]:bg-white/10 data-[highlighted]:text-white cursor-pointer"
                    >
                      Ativo — aparece na equipe pública
                    </SelectItem>
                    <SelectItem
                      value="inactive"
                      className="text-white/80 data-[highlighted]:bg-white/10 data-[highlighted]:text-white cursor-pointer"
                    >
                      Inativo — oculto da equipe pública (vínculos em projetos
                      são mantidos)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ) : null}
          </div>

          {/* Tratamento + grau acadêmico */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid min-w-0 gap-1.5">
              <Label className="text-white/70">Tratamento</Label>
              <Select value={namePrefixId} onValueChange={setNamePrefixId}>
                <SelectTrigger className="w-full bg-white/5 border-white/10 text-white focus:ring-0">
                  <SelectValue
                    placeholder={!prefixes.length ? 'Carregando…' : 'Nenhum'}
                  />
                </SelectTrigger>
                <SelectContent className="bg-[#071525] border-white/10 text-white">
                  <SelectItem
                    value="__none__"
                    className="text-white/80 data-[highlighted]:bg-white/10 data-[highlighted]:text-white cursor-pointer"
                  >
                    — Nenhum —
                  </SelectItem>
                  {prefixes.map(p => (
                    <SelectItem
                      key={p.id}
                      value={p.id}
                      className="text-white/80 data-[highlighted]:bg-white/10 data-[highlighted]:text-white cursor-pointer"
                    >
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid min-w-0 gap-1.5">
              <Label className="text-white/70">Grau acadêmico</Label>
              <Select value={degreeLevelId} onValueChange={setDegreeLevelId}>
                <SelectTrigger className="w-full bg-white/5 border-white/10 text-white focus:ring-0">
                  <SelectValue
                    placeholder={
                      !degreeLevels.length ? 'Carregando…' : 'Nenhum'
                    }
                  />
                </SelectTrigger>
                <SelectContent className="bg-[#071525] border-white/10 text-white">
                  <SelectItem
                    value="__none__"
                    className="text-white/80 data-[highlighted]:bg-white/10 data-[highlighted]:text-white cursor-pointer"
                  >
                    — Nenhum —
                  </SelectItem>
                  {degreeLevels.map(d => (
                    <SelectItem
                      key={d.id}
                      value={d.id}
                      className="text-white/80 data-[highlighted]:bg-white/10 data-[highlighted]:text-white cursor-pointer"
                    >
                      {d.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Nome */}
          <div className="grid gap-1.5">
            <Label htmlFor="name" className="text-white/70">
              Nome *
            </Label>
            <Input
              id="name"
              name="name"
              required
              defaultValue={member?.name}
              placeholder="Nome completo (sem Dr., Prof., …)"
              className={INPUT_CLS}
            />
          </div>

          {/* LinkedIn */}
          <div className="grid gap-1.5">
            <Label htmlFor="linkedinSuffix" className="text-white/70">
              LinkedIn{' '}
              <span className="text-white/35 font-normal">(opcional)</span>
            </Label>
            <HttpsUrlSuffixField
              id="linkedinSuffix"
              value={linkedinSuffix}
              onChange={setLinkedinSuffix}
              placeholder="www.linkedin.com/in/seu-perfil"
            />
            <p className="text-[0.65rem] text-white/35">
              Digite só o domínio e o caminho após{' '}
              <span className="text-white/50">https://</span>; o endereço é
              salvo com https://.
            </p>
          </div>

          {/* Currículo Lattes (CNPq) */}
          <div className="grid gap-1.5">
            <Label htmlFor="lattesSuffix" className="text-white/70">
              Currículo Lattes{' '}
              <span className="text-white/35 font-normal">(opcional)</span>
            </Label>
            <HttpsUrlSuffixField
              id="lattesSuffix"
              value={lattesSuffix}
              onChange={setLattesSuffix}
              placeholder="lattes.cnpq.br/0000000000000000"
            />
            <p className="text-[0.65rem] text-white/35">
              Aceita <span className="text-white/50">lattes.cnpq.br/…</span> ou
              links do{' '}
              <span className="text-white/50">buscatextual.cnpq.br</span>{' '}
              (visualização do CV). O endereço é salvo com https://.
            </p>
          </div>

          {/* Instituição de formação */}
          <div className="grid gap-1.5">
            <Label htmlFor="formationInstitution" className="text-white/70">
              Instituição de formação{' '}
              <span className="text-white/35 font-normal">(opcional)</span>
            </Label>
            <Input
              id="formationInstitution"
              name="formationInstitution"
              defaultValue={member?.formationInstitution ?? ''}
              placeholder="Ex.: PUC Goiás, INPE…"
              className={INPUT_CLS}
            />
          </div>

          {/* qualification = área / linha de atuação (grau vem do select) */}
          <div className="grid gap-1.5">
            <Label htmlFor="qualification" className="text-white/70">
              Área / atuação *
            </Label>
            <Input
              id="qualification"
              name="qualification"
              required
              defaultValue={member?.qualification}
              placeholder="Ex.: Ciência da Computação, IA e clima…"
              className={INPUT_CLS}
            />
            <p className="text-[0.65rem] text-white/35">
              Use o grau acadêmico acima para Mestrado/Doutorado etc.; aqui
              descreva a área, o cargo ou a linha de pesquisa que aparece junto
              do nome no site.
            </p>
          </div>

          {/* Descrição */}
          <div className="grid gap-1.5">
            <Label htmlFor="description" className="text-white/70">
              Descrição
            </Label>
            <Textarea
              id="description"
              name="description"
              rows={3}
              defaultValue={member?.description ?? ''}
              placeholder="Áreas de atuação, projetos…"
              className={`${INPUT_CLS} resize-none`}
            />
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
