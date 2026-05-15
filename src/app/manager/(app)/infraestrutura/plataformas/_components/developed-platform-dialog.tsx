'use client'

import { createElement, useMemo, useState } from 'react'
import { Layers, Pencil, Plus } from 'lucide-react'
import { toast } from 'sonner'

import { DEVELOPED_PLATFORM_ICON_OPTIONS } from '@/lib/developed-platform-icon-options'
import { getLucideIconNamed } from '@/lib/lucide-resolve'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from '@/components/ui/input-group'
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

const INPUT_CLS =
  'bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-0 focus-visible:border-white/30'

/** Remove esquema e barras iniciais para exibir só o host/caminho no campo com máscara https:// */
function stripUrlScheme(url: string): string {
  return url
    .trim()
    .replace(/^https?:\/\//i, '')
    .replace(/^\/+/, '')
}

/** Monta URL absoluta com https (valor enviado à API). */
function projectLinkToStored(suffix: string): string {
  const t = stripUrlScheme(suffix)
  if (!t) return ''
  return `https://${t}`
}

type Props = {
  platform?: DevelopedPlatformRow
  onSuccess: () => void
}

export function DevelopedPlatformDialog({ platform, onSuccess }: Props) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [iconKey, setIconKey] = useState(platform?.iconKey ?? 'cloud-sun')
  const [projectLinkSuffix, setProjectLinkSuffix] = useState(() =>
    stripUrlScheme(platform?.projectLink ?? '')
  )

  const isEdit = !!platform

  const iconSelectOptions = useMemo(() => {
    const known = new Set<string>(
      DEVELOPED_PLATFORM_ICON_OPTIONS.map(o => o.value)
    )
    const raw = platform?.iconKey?.trim()
    if (raw && !known.has(raw)) {
      return [
        { value: raw, label: `Ícone salvo (${raw})` },
        ...DEVELOPED_PLATFORM_ICON_OPTIONS,
      ]
    }
    return [...DEVELOPED_PLATFORM_ICON_OPTIONS]
  }, [platform?.iconKey])

  function handleOpenChange(newOpen: boolean) {
    if (newOpen) {
      setIconKey(platform?.iconKey ?? 'cloud-sun')
      setProjectLinkSuffix(stripUrlScheme(platform?.projectLink ?? ''))
    }
    setOpen(newOpen)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const form = e.currentTarget
    const fd = new FormData(form)
    fd.set('iconKey', iconKey)
    fd.set('projectLink', projectLinkToStored(projectLinkSuffix))

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
              <SelectTrigger className="h-auto min-h-10 w-full gap-2 bg-white/5 border-white/10 py-2 text-white focus:ring-0 [&_[data-slot=select-value]]:flex [&_[data-slot=select-value]]:items-center [&_[data-slot=select-value]]:gap-2">
                <SelectValue placeholder="Escolha um ícone" />
              </SelectTrigger>
              <SelectContent
                position="popper"
                sideOffset={6}
                className="max-h-72 w-[var(--radix-select-trigger-width)] bg-[#071525] border-white/10 text-white"
              >
                {iconSelectOptions.map(o => {
                  const Icon = getLucideIconNamed(o.value, Layers)
                  return (
                    <SelectItem
                      key={o.value}
                      value={o.value}
                      className="cursor-pointer py-2 text-white/85 data-[highlighted]:bg-white/10 data-[highlighted]:text-white data-[state=checked]:bg-white/15"
                    >
                      <span className="flex items-center gap-2.5">
                        {createElement(Icon, {
                          size: 16,
                          strokeWidth: 1.6,
                          className: 'shrink-0 text-white/80',
                        })}
                        <span>{o.label}</span>
                      </span>
                    </SelectItem>
                  )
                })}
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
            <InputGroup className="h-auto min-h-10 border-white/10 bg-white/5 shadow-none has-[[data-slot=input-group-control]:focus-visible]:border-white/30 has-[[data-slot=input-group-control]:focus-visible]:ring-0">
              <InputGroupAddon
                align="inline-start"
                className="shrink-0 border-r border-white/10 py-2 pl-3 pr-2 text-white/45"
              >
                <InputGroupText className="text-white/50">
                  {'https://'}
                </InputGroupText>
              </InputGroupAddon>
              <InputGroupInput
                id="projectLink"
                value={projectLinkSuffix}
                onChange={e =>
                  setProjectLinkSuffix(stripUrlScheme(e.target.value))
                }
                placeholder="exemplo.org/seu-projeto"
                inputMode="url"
                autoComplete="url"
                className="min-h-10 py-2 text-white placeholder:text-white/30"
              />
            </InputGroup>
            <p className="text-[0.65rem] text-white/35">
              Digite só o domínio e o caminho; o endereço é salvo com https://.
            </p>
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
