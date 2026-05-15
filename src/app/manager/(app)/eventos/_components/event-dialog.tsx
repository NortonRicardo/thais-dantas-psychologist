'use client'

import { useEffect, useRef, useState } from 'react'
import { ChevronDown, ImageIcon, Pencil, Plus, Search, Trash2, Upload, X } from 'lucide-react'
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { stripUrlScheme, toHttpsStored } from '@/lib/url-https'

export type EventRow = {
  id: string
  title: string
  description: string
  date: string
  type: string
  speaker: string | null
  organizer: string | null
  link: string | null
  meetLink: string | null
  recordingLink: string | null
  featured: boolean
  imageMimeType: string | null
  updatedAt: string
}

type EventTypeOption = { id: string; name: string; color: string }

function TypeCombobox({
  value,
  onChange,
  options,
}: {
  value: string
  onChange: (v: string) => void
  options: EventTypeOption[]
}) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const filtered = options.filter(o =>
    o.name.toLowerCase().includes(search.toLowerCase())
  )
  const selected = options.find(o => o.name === value)

  function select(name: string) {
    onChange(name)
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
              <span className={`h-2 w-2 shrink-0 rounded-full ${selected.color}`} />
              {selected.name}
            </span>
          ) : (
            <span className="text-white/30">Selecionar…</span>
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
            <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
            <input
              ref={inputRef}
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar tipo…"
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

        <div className="max-h-48 overflow-y-auto overscroll-contain p-1">
          {filtered.length === 0 && (
            <p className="py-2 text-center text-xs text-white/25">Nenhum resultado</p>
          )}
          {filtered.map(opt => (
            <button
              key={opt.id}
              type="button"
              onClick={() => select(opt.name)}
              className={`flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-left text-sm transition-colors ${
                value === opt.name
                  ? 'bg-white/10 text-white/90'
                  : 'text-white/60 hover:bg-white/5 hover:text-white/80'
              }`}
            >
              <span className={`h-2 w-2 shrink-0 rounded-full ${opt.color}`} />
              {opt.name}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

const INPUT_CLS =
  'bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-0 focus-visible:border-white/30'

function toDatetimeLocal(iso: string) {
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

type Props = {
  event?: EventRow
  onSuccess: () => void
}

export function EventDialog({ event, onSuccess }: Props) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [featured, setFeatured] = useState(event?.featured ?? false)
  const [type, setType] = useState(event?.type ?? '')
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [removeImage, setRemoveImage] = useState(false)
  const [eventTypeOptions, setEventTypeOptions] = useState<EventTypeOption[]>([])
  const fileRef = useRef<HTMLInputElement>(null)

  const [linkSuffix, setLinkSuffix] = useState(() =>
    stripUrlScheme(event?.link ?? '')
  )
  const [meetLinkSuffix, setMeetLinkSuffix] = useState(() =>
    stripUrlScheme(event?.meetLink ?? '')
  )
  const [recordingLinkSuffix, setRecordingLinkSuffix] = useState(() =>
    stripUrlScheme(event?.recordingLink ?? '')
  )

  const isEdit = !!event

  useEffect(() => {
    fetch('/api/event-types')
      .then(r => r.json())
      .then(d => setEventTypeOptions(Array.isArray(d) ? d : []))
      .catch(() => {})
  }, [])

  const existingImageUrl =
    isEdit && event.imageMimeType && !removeImage
      ? `/api/events/${event.id}/image?t=${new Date(event.updatedAt).getTime()}`
      : null
  const previewSrc = imagePreview ?? existingImageUrl

  function handleOpenChange(newOpen: boolean) {
    if (newOpen) {
      setFeatured(event?.featured ?? false)
      setType(event?.type ?? '')
      setImagePreview(null)
      setRemoveImage(false)
      setLinkSuffix(stripUrlScheme(event?.link ?? ''))
      setMeetLinkSuffix(stripUrlScheme(event?.meetLink ?? ''))
      setRecordingLinkSuffix(stripUrlScheme(event?.recordingLink ?? ''))
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
    setLoading(true)

    const form = e.currentTarget
    const fd = new FormData(form)
    fd.set('featured', String(featured))
    fd.set('type', type)
    fd.set('link', toHttpsStored(linkSuffix))
    fd.set('meetLink', toHttpsStored(meetLinkSuffix))
    fd.set('recordingLink', toHttpsStored(recordingLinkSuffix))
    if (removeImage) fd.set('removeImage', 'true')

    const url = isEdit ? `/api/events/${event.id}` : '/api/events'
    const method = isEdit ? 'PUT' : 'POST'

    try {
      const res = await fetch(url, { method, body: fd })
      if (!res.ok) throw new Error(await res.text())
      toast.success(isEdit ? 'Evento atualizado!' : 'Evento criado!')
      setOpen(false)
      onSuccess()
    } catch (err) {
      console.error(err)
      toast.error('Erro ao salvar evento.')
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
            <Plus size={15} /> Novo Evento
          </Button>
        )}
      </DialogTrigger>

      <DialogContent
        className="max-h-[90vh] w-full sm:max-w-2xl overflow-y-auto bg-[#071525] text-white border-white/10 [&_[data-slot='dialog-close']]:bg-transparent [&_[data-slot='dialog-close']]:text-white/40 [&_[data-slot='dialog-close']]:hover:bg-white/10 [&_[data-slot='dialog-close']]:hover:text-white/80 [&_[data-slot='dialog-close']]:rounded"
        onOpenAutoFocus={e => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-white">
            {isEdit ? 'Editar Evento' : 'Novo Evento'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-2 grid gap-4">
          {/* Title */}
          <div className="grid gap-1.5">
            <Label htmlFor="title" className="text-white/70">
              Título *
            </Label>
            <Input
              id="title"
              name="title"
              required
              defaultValue={event?.title}
              className={INPUT_CLS}
            />
          </div>

          {/* Description */}
          <div className="grid gap-1.5">
            <Label htmlFor="description" className="text-white/70">
              Descrição *
            </Label>
            <Textarea
              id="description"
              name="description"
              required
              rows={3}
              defaultValue={event?.description}
              className={`${INPUT_CLS} resize-none`}
            />
          </div>

          {/* Date + Type */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="date" className="text-white/70">
                Data e hora *
              </Label>
              <Input
                id="date"
                name="date"
                type="datetime-local"
                required
                defaultValue={event?.date ? toDatetimeLocal(event.date) : ''}
                className={`${INPUT_CLS} [color-scheme:dark]`}
              />
            </div>
            <div className="grid gap-1.5">
              <Label className="text-white/70">Tipo *</Label>
              <TypeCombobox
                value={type}
                onChange={setType}
                options={eventTypeOptions}
              />
            </div>
          </div>

          {/* Speaker + Organizer */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="speaker" className="text-white/70">
                Palestrante
              </Label>
              <Input
                id="speaker"
                name="speaker"
                defaultValue={event?.speaker ?? ''}
                className={INPUT_CLS}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="organizer" className="text-white/70">
                Organização
              </Label>
              <Input
                id="organizer"
                name="organizer"
                defaultValue={event?.organizer ?? ''}
                className={INPUT_CLS}
              />
            </div>
          </div>

          {/* Link + MeetLink */}
          <div className="space-y-1">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-1.5">
                <Label htmlFor="link" className="text-white/70">
                  Link (saiba mais)
                </Label>
                <HttpsUrlSuffixField
                  id="link"
                  value={linkSuffix}
                  onChange={setLinkSuffix}
                  placeholder="exemplo.org/evento"
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="meetLink" className="text-white/70">
                  Link da sala
                </Label>
                <HttpsUrlSuffixField
                  id="meetLink"
                  value={meetLinkSuffix}
                  onChange={setMeetLinkSuffix}
                  placeholder="meet.google.com/…"
                />
              </div>
            </div>
            <p className="text-[0.65rem] text-white/35">
              Digite só o domínio e o caminho; o endereço é salvo com https://.
            </p>
          </div>

          {/* Recording link */}
          <div className="grid gap-1.5">
            <Label htmlFor="recordingLink" className="text-white/70">
              Gravação da aula
            </Label>
            <HttpsUrlSuffixField
              id="recordingLink"
              value={recordingLinkSuffix}
              onChange={setRecordingLinkSuffix}
              placeholder="drive.google.com/file/…"
            />
            <p className="text-[0.65rem] text-white/35">
              Digite só o domínio e o caminho; o endereço é salvo com https://.
            </p>
          </div>

          {/* Image */}
          <div className="grid gap-1.5">
            <Label className="text-white/70">Imagem</Label>

            <input
              ref={fileRef}
              id="image"
              name="image"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            {previewSrc ? (
              <div className="group relative h-44 w-full overflow-hidden rounded-lg border border-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewSrc}
                  alt="Preview"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/70 transition hover:bg-white/20 hover:text-white"
                    title="Trocar imagem"
                  >
                    <Upload size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-500/20 text-rose-300 transition hover:bg-rose-500/40 hover:text-rose-200"
                    title="Remover imagem"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex h-32 w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-white/15 bg-white/[0.02] transition hover:border-white/30 hover:bg-white/[0.05]"
              >
                <ImageIcon size={22} className="text-white/25" />
                <span className="text-sm text-white/40">
                  Clique para selecionar
                </span>
                <span className="text-xs text-white/20">PNG · JPG · WEBP</span>
              </button>
            )}
          </div>

          {/* Featured */}
          <div className="flex items-center gap-3">
            <Switch
              id="featured"
              checked={featured}
              onCheckedChange={setFeatured}
              className="data-[state=unchecked]:bg-white/15 data-[state=unchecked]:border-white/20 data-[state=checked]:bg-orange-800 data-[state=checked]:border-orange-800"
            />
            <Label htmlFor="featured" className="cursor-pointer text-white/70">
              Destaque
            </Label>
          </div>

          {/* Actions */}
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
              disabled={loading || !type}
              className="bg-orange-800 text-orange-50 hover:bg-orange-700 border-0 disabled:opacity-50"
            >
              {loading
                ? 'Salvando…'
                : isEdit
                  ? 'Salvar alterações'
                  : 'Criar evento'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
