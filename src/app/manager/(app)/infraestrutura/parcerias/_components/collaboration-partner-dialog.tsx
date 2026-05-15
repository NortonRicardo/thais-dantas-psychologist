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
import { Textarea } from '@/components/ui/textarea'
import { readApiError } from '@/lib/read-api-error'

export type CollaborationPartnerRow = {
  id: string
  name: string
  description: string
  updatedAt: string
}

const INPUT_CLS =
  'bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-0 focus-visible:border-white/30'

type Props = {
  partner?: CollaborationPartnerRow
  onSuccess: () => void
}

export function CollaborationPartnerDialog({ partner, onSuccess }: Props) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const isEdit = !!partner

  function handleOpenChange(newOpen: boolean) {
    setOpen(newOpen)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const form = e.currentTarget
    const fd = new FormData(form)

    const url = isEdit
      ? `/api/collaboration-partners/${partner.id}`
      : '/api/collaboration-partners'
    const method = isEdit ? 'PUT' : 'POST'

    try {
      const res = await fetch(url, { method, body: fd })
      if (!res.ok) throw new Error(await readApiError(res))
      toast.success(isEdit ? 'Parceiro atualizado!' : 'Parceiro criado!')
      setOpen(false)
      onSuccess()
    } catch (err) {
      console.error(err)
      toast.error(
        err instanceof Error ? err.message : 'Erro ao salvar parceiro.'
      )
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
            <Plus size={15} /> Novo parceiro
          </Button>
        )}
      </DialogTrigger>

      <DialogContent
        className="max-h-[90vh] w-full max-w-[calc(100%-2rem)] overflow-y-auto bg-[#071525] text-white border-white/10 sm:max-w-xl [&_[data-slot='dialog-close']]:bg-transparent [&_[data-slot='dialog-close']]:text-white/40 [&_[data-slot='dialog-close']]:hover:bg-white/10 [&_[data-slot='dialog-close']]:hover:text-white/80 [&_[data-slot='dialog-close']]:rounded"
        onOpenAutoFocus={e => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-white">
            {isEdit ? 'Editar parceiro' : 'Novo parceiro'}
          </DialogTitle>
        </DialogHeader>

        <form
          key={`${open}-${partner?.id ?? 'new'}`}
          onSubmit={handleSubmit}
          className="mt-2 grid gap-4"
        >
          <div className="grid gap-1.5">
            <Label htmlFor="name" className="text-white/70">
              Nome *
            </Label>
            <Input
              id="name"
              name="name"
              required
              placeholder="Instituição ou projeto"
              defaultValue={partner?.name}
              className={INPUT_CLS}
            />
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
              placeholder="Linha de colaboração ou áreas de atuação"
              defaultValue={partner?.description}
              className={`${INPUT_CLS} resize-none`}
            />
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
