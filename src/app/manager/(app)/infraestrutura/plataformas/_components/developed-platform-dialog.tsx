'use client'

import { useState } from 'react'
import { Pencil, Plus } from 'lucide-react'
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

export type DevelopedPlatformRow = {
  id: string
  title: string
  description: string
  projectLink: string | null
  platformLink: string | null
  badge: string | null
  iconKey: string
  updatedAt: string
}

const ICON_OPTIONS = [
  { value: 'cloud-sun', label: 'Clima / dados' },
  { value: 'wrench', label: 'Ferramentas (META)' },
  { value: 'globe', label: 'Web / global' },
  { value: 'layout-grid', label: 'Grade / apps' },
  { value: 'layers', label: 'Camadas' },
  { value: 'cpu', label: 'Computação' },
] as const

const INPUT_CLS =
  'bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-0 focus-visible:border-white/30'

type Props = {
  platform?: DevelopedPlatformRow
  onSuccess: () => void
}

export function DevelopedPlatformDialog({ platform, onSuccess }: Props) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [iconKey, setIconKey] = useState(platform?.iconKey ?? 'cloud-sun')

  const isEdit = !!platform

  function handleOpenChange(newOpen: boolean) {
    if (newOpen) {
      setIconKey(platform?.iconKey ?? 'cloud-sun')
    }
    setOpen(newOpen)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const form = e.currentTarget
    const fd = new FormData(form)
    fd.set('iconKey', iconKey)

    const url = isEdit
      ? `/api/developed-platforms/${platform.id}`
      : '/api/developed-platforms'
    const method = isEdit ? 'PUT' : 'POST'

    try {
      const res = await fetch(url, { method, body: fd })
      if (!res.ok) throw new Error(await res.text())
      toast.success(isEdit ? 'Plataforma atualizada!' : 'Plataforma criada!')
      setOpen(false)
      onSuccess()
    } catch (err) {
      console.error(err)
      toast.error('Erro ao salvar plataforma.')
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
            <Plus size={15} /> Nova plataforma
          </Button>
        )}
      </DialogTrigger>

      <DialogContent
        className="max-h-[90vh] max-w-lg overflow-y-auto bg-[#071525] text-white border-white/10 [&_[data-slot='dialog-close']]:bg-transparent [&_[data-slot='dialog-close']]:text-white/40 [&_[data-slot='dialog-close']]:hover:bg-white/10 [&_[data-slot='dialog-close']]:hover:text-white/80 [&_[data-slot='dialog-close']]:rounded"
        onOpenAutoFocus={e => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-white">
            {isEdit ? 'Editar plataforma' : 'Nova plataforma'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-2 grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="title" className="text-white/70">
              Nome da plataforma *
            </Label>
            <Input
              id="title"
              name="title"
              required
              defaultValue={platform?.title}
              className={INPUT_CLS}
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="badge" className="text-white/70">
              Selo / destaque
            </Label>
            <Input
              id="badge"
              name="badge"
              placeholder="Ex.: 2º lugar Seriema 2025"
              defaultValue={platform?.badge ?? ''}
              className={INPUT_CLS}
            />
          </div>

          <div className="grid gap-1.5">
            <Label className="text-white/70">Ícone no card</Label>
            <Select value={iconKey} onValueChange={setIconKey}>
              <SelectTrigger className="w-full bg-white/5 border-white/10 text-white focus:ring-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#071525] border-white/10 text-white">
                {ICON_OPTIONS.map(o => (
                  <SelectItem
                    key={o.value}
                    value={o.value}
                    className="text-white/80 data-[highlighted]:bg-white/10 data-[highlighted]:text-white cursor-pointer"
                  >
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="description" className="text-white/70">
              Descrição *
            </Label>
            <Textarea
              id="description"
              name="description"
              required
              rows={4}
              defaultValue={platform?.description}
              className={`${INPUT_CLS} resize-none`}
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="projectLink" className="text-white/70">
              Link do projeto
            </Label>
            <Input
              id="projectLink"
              name="projectLink"
              type="url"
              placeholder="https://…"
              defaultValue={platform?.projectLink ?? ''}
              className={INPUT_CLS}
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="platformLink" className="text-white/70">
              Link para acessar a plataforma
            </Label>
            <Input
              id="platformLink"
              name="platformLink"
              type="url"
              placeholder="https://…"
              defaultValue={platform?.platformLink ?? ''}
              className={INPUT_CLS}
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
