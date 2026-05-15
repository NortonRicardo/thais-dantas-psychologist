'use client'

import { useState } from 'react'
import { Pencil, Plus } from 'lucide-react'
import { toast } from 'sonner'

import { readApiError } from '@/lib/read-api-error'
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

export type EventOrganizationRow = {
  id: string
  name: string
  updatedAt: string
}

const INPUT_CLS =
  'bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-0 focus-visible:border-white/30'

type Props = {
  organization?: EventOrganizationRow
  onSuccess: () => void
}

export function EventOrganizationDialog({ organization, onSuccess }: Props) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const isEdit = !!organization

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const form = e.currentTarget
    const fd = new FormData(form)
    const url = isEdit
      ? `/api/event-organizations/${organization.id}`
      : '/api/event-organizations'
    const method = isEdit ? 'PUT' : 'POST'
    try {
      const res = await fetch(url, { method, body: fd })
      if (!res.ok) throw new Error(await readApiError(res))
      toast.success(isEdit ? 'Organização atualizada!' : 'Organização criada!')
      setOpen(false)
      onSuccess()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao salvar.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
            <Plus size={15} /> Nova organização
          </Button>
        )}
      </DialogTrigger>

      <DialogContent
        className="max-h-[90vh] max-w-lg overflow-y-auto bg-[#071525] text-white border-white/10 [&_[data-slot='dialog-close']]:bg-transparent [&_[data-slot='dialog-close']]:text-white/40 [&_[data-slot='dialog-close']]:hover:bg-white/10 [&_[data-slot='dialog-close']]:hover:text-white/80 [&_[data-slot='dialog-close']]:rounded"
        onOpenAutoFocus={e => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-white">
            {isEdit ? 'Editar organização' : 'Nova organização'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-2 grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="org-name" className="text-white/70">
              Nome *
            </Label>
            <Input
              id="org-name"
              name="name"
              required
              placeholder="Ex.: LEMM · PPGEIIA / PUC Goiás"
              defaultValue={organization?.name}
              className={INPUT_CLS}
            />
            <p className="text-xs text-white/35">
              Esta organização aparece nos cartões públicos do evento. Pode ser
              editada depois sem perder o vínculo com os eventos.
            </p>
          </div>

          <div className="flex justify-end gap-3 border-t border-white/10 pt-4">
            <Button
              type="button"
              variant="ghost"
              className="text-white/50 hover:text-white hover:bg-white/5"
              disabled={loading}
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              loading={loading}
              loadingLabel={isEdit ? 'A guardar…' : 'A criar…'}
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
