'use client'

import { useRef, useState } from 'react'
import { Pencil, Plus } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'

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
  featured: boolean
  imageMimeType: string | null
}

const EVENT_TYPES = [
  'Conferência', 'Workshop', 'Seminário', 'Desafio',
  'Minicurso', 'Defesa', 'Palestra', 'Mesa-Redonda', 'Encontro',
]

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
  const [open, setOpen]       = useState(false)
  const [loading, setLoading] = useState(false)
  const [featured, setFeatured] = useState(event?.featured ?? false)
  const [type, setType]       = useState(event?.type ?? '')
  const fileRef               = useRef<HTMLInputElement>(null)

  const isEdit = !!event

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const form = e.currentTarget
    const fd   = new FormData(form)
    fd.set('featured', String(featured))
    fd.set('type', type)

    const url    = isEdit ? `/api/events/${event.id}` : '/api/events'
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isEdit ? (
          <Button variant="ghost" size="icon" className="h-8 w-8 text-white/40 hover:text-sky-400 hover:bg-sky-400/10">
            <Pencil size={14} />
          </Button>
        ) : (
          <Button className="gap-2 bg-orange-800 text-orange-50 hover:bg-orange-700 border-0">
            <Plus size={15} /> Novo Evento
          </Button>
        )}
      </DialogTrigger>

      <DialogContent
        className="max-h-[90vh] max-w-2xl overflow-y-auto bg-[#071525] text-white border-white/10 [&_[data-slot='dialog-close']]:bg-transparent [&_[data-slot='dialog-close']]:text-white/40 [&_[data-slot='dialog-close']]:hover:bg-white/10 [&_[data-slot='dialog-close']]:hover:text-white/80 [&_[data-slot='dialog-close']]:rounded"
        onOpenAutoFocus={e => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-white">{isEdit ? 'Editar Evento' : 'Novo Evento'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-2 grid gap-4">
          {/* Title */}
          <div className="grid gap-1.5">
            <Label htmlFor="title" className="text-white/70">Título *</Label>
            <Input
              id="title" name="title" required
              defaultValue={event?.title}
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-0 focus-visible:border-white/30"
            />
          </div>

          {/* Description */}
          <div className="grid gap-1.5">
            <Label htmlFor="description" className="text-white/70">Descrição *</Label>
            <Textarea
              id="description" name="description" required rows={3}
              defaultValue={event?.description}
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-0 focus-visible:border-white/30 resize-none"
            />
          </div>

          {/* Date + Type */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="date" className="text-white/70">Data e hora *</Label>
              <Input
                id="date" name="date" type="datetime-local" required
                defaultValue={event?.date ? toDatetimeLocal(event.date) : ''}
                className="bg-white/5 border-white/10 text-white focus-visible:ring-0 focus-visible:border-white/30 [color-scheme:dark]"
              />
            </div>
            <div className="grid gap-1.5">
              <Label className="text-white/70">Tipo *</Label>
              <Select value={type} onValueChange={setType} required>
                <SelectTrigger className="w-full bg-white/5 border-white/10 text-white focus:ring-[#00d4ff]/40">
                  <SelectValue placeholder="Selecionar…" />
                </SelectTrigger>
                <SelectContent className="bg-[#071525] border-white/10 text-white">
                  {EVENT_TYPES.map(t => (
                    <SelectItem key={t} value={t} className="text-white/80 data-[highlighted]:bg-white/10 data-[highlighted]:text-white cursor-pointer">{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Speaker + Organizer */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="speaker" className="text-white/70">Palestrante</Label>
              <Input
                id="speaker" name="speaker"
                defaultValue={event?.speaker ?? ''}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-0 focus-visible:border-white/30"
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="organizer" className="text-white/70">Organização</Label>
              <Input
                id="organizer" name="organizer"
                defaultValue={event?.organizer ?? ''}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-0 focus-visible:border-white/30"
              />
            </div>
          </div>

          {/* Link + MeetLink */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="link" className="text-white/70">Link (saiba mais)</Label>
              <Input
                id="link" name="link" type="url" placeholder="https://…"
                defaultValue={event?.link ?? ''}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-0 focus-visible:border-white/30"
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="meetLink" className="text-white/70">Link da sala (Meet / Teams)</Label>
              <Input
                id="meetLink" name="meetLink" type="url" placeholder="https://…"
                defaultValue={event?.meetLink ?? ''}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-0 focus-visible:border-white/30"
              />
            </div>
          </div>

          {/* Image */}
          <div className="grid gap-1.5">
            <Label htmlFor="image" className="text-white/70">
              Imagem {event?.imageMimeType && <span className="text-[#00d4ff]">(atual: {event.imageMimeType})</span>}
            </Label>
            <Input
              ref={fileRef}
              id="image" name="image" type="file" accept="image/*"
              className="bg-white/5 border-white/10 text-white/70 file:text-white/60 file:bg-white/5 file:border-0 file:rounded file:px-2 file:py-1 file:text-xs focus-visible:ring-0 focus-visible:border-white/30"
            />
          </div>

          {/* Featured */}
          <div className="flex items-center gap-3">
            <Switch
              id="featured"
              checked={featured}
              onCheckedChange={setFeatured}
              className="data-[state=unchecked]:bg-white/15 data-[state=unchecked]:border-white/20 data-[state=checked]:bg-orange-800 data-[state=checked]:border-orange-800"
            />
            <Label htmlFor="featured" className="cursor-pointer text-white/70">Destaque</Label>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 border-t border-white/10 pt-4">
            <Button
              type="button" variant="ghost"
              className="text-white/50 hover:text-white hover:bg-white/5"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit" disabled={loading || !type}
              className="bg-orange-800 text-orange-50 hover:bg-orange-700 border-0 disabled:opacity-50"
            >
              {loading ? 'Salvando…' : isEdit ? 'Salvar alterações' : 'Criar evento'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
