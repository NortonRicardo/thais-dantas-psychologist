'use client'

import { useState } from 'react'
import { Pencil, Plus } from 'lucide-react'
import { toast } from 'sonner'

import { ColorSelector } from '@/components/color-selector'
import { COLOR_OPTIONS } from '@/components/constants/colors'
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
  extractBgColorKey,
  slugifyThemeSlug,
} from '@/lib/project-taxonomy-styles'
import { readApiError } from '@/lib/read-api-error'

export type ProjectThemeRow = {
  id: string
  name: string
  slug: string
  color: string
  updatedAt: string
}

const INPUT_CLS =
  'bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-0 focus-visible:border-white/30'

type Props = {
  theme?: ProjectThemeRow
  onSuccess: () => void
}

export function ProjectThemeDialog({ theme, onSuccess }: Props) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [color, setColor] = useState(() =>
    extractBgColorKey(theme?.color ?? COLOR_OPTIONS[0].key)
  )
  const [slug, setSlug] = useState(theme?.slug ?? '')

  const isEdit = !!theme

  function handleOpenChange(newOpen: boolean) {
    if (newOpen) {
      setColor(extractBgColorKey(theme?.color ?? COLOR_OPTIONS[0].key))
      setSlug(theme?.slug ?? '')
    }
    setOpen(newOpen)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const form = e.currentTarget
    const fd = new FormData(form)
    const name = (fd.get('name') as string)?.trim()
    fd.set('color', color)
    fd.set('slug', (slug.trim() || slugifyThemeSlug(name ?? '')).trim())

    const url = isEdit
      ? `/api/project-themes/${theme.id}`
      : '/api/project-themes'
    const method = isEdit ? 'PUT' : 'POST'

    try {
      const res = await fetch(url, { method, body: fd })
      if (!res.ok) {
        toast.error(await readApiError(res))
        return
      }
      toast.success(isEdit ? 'Tema atualizado!' : 'Tema criado!')
      setOpen(false)
      onSuccess()
    } catch {
      toast.error('Não foi possível salvar o tema.')
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
            <Plus size={15} /> Novo tema
          </Button>
        )}
      </DialogTrigger>

      <DialogContent
        className="max-h-[90vh] max-w-lg overflow-y-auto bg-[#071525] text-white border-white/10 [&_[data-slot='dialog-close']]:bg-transparent [&_[data-slot='dialog-close']]:text-white/40 [&_[data-slot='dialog-close']]:hover:bg-white/10 [&_[data-slot='dialog-close']]:hover:text-white/80 [&_[data-slot='dialog-close']]:rounded"
        onOpenAutoFocus={e => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-white">
            {isEdit ? 'Editar tema' : 'Novo tema'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-2 grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="name" className="text-white/70">
              Nome *
            </Label>
            <Input
              id="name"
              name="name"
              required
              placeholder="Clima"
              defaultValue={theme?.name}
              className={INPUT_CLS}
              onBlur={e => {
                if (!isEdit && !slug.trim())
                  setSlug(slugifyThemeSlug(e.target.value))
              }}
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="slug" className="text-white/70">
              Slug{' '}
              <span className="text-white/30 font-normal">(URL ?tema=)</span>
            </Label>
            <Input
              id="slug"
              name="slug"
              value={slug}
              onChange={e => setSlug(e.target.value)}
              placeholder="clima"
              className={INPUT_CLS}
            />
          </div>

          <div className="grid gap-1.5">
            <Label className="text-white/70">Cor *</Label>
            <ColorSelector value={color} onChange={setColor} />
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
