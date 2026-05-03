'use client'

import { useRef, useState } from 'react'
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

export type TeamMemberRow = {
  id: string
  category: string
  name: string
  qualification: string
  description: string | null
  photoMimeType: string | null
  sortOrder: number
  updatedAt: string
}

const CATEGORIES = [
  { value: 'professores', label: 'Professores' },
  { value: 'colaboradores', label: 'Colaboradores' },
  { value: 'convidados', label: 'Convidados' },
]

const INPUT_CLS =
  'bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-0 focus-visible:border-white/30'

type Props = {
  member?: TeamMemberRow
  onSuccess: () => void
}

export function TeamDialog({ member, onSuccess }: Props) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [category, setCategory] = useState(member?.category ?? '')
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [removeImage, setRemoveImage] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const isEdit = !!member

  const existingImageUrl =
    isEdit && member.photoMimeType && !removeImage
      ? `/api/team/${member.id}/photo?t=${new Date(member.updatedAt).getTime()}`
      : null
  const previewSrc = imagePreview ?? existingImageUrl

  function handleOpenChange(newOpen: boolean) {
    if (newOpen) {
      setCategory(member?.category ?? '')
      setImagePreview(null)
      setRemoveImage(false)
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
    if (!category) {
      toast.error('Selecione uma categoria.')
      return
    }
    setLoading(true)

    const form = e.currentTarget
    const fd = new FormData(form)
    fd.set('category', category)
    if (removeImage) fd.set('removePhoto', 'true')

    const url = isEdit ? `/api/team/${member.id}` : '/api/team'
    const method = isEdit ? 'PUT' : 'POST'

    try {
      const res = await fetch(url, { method, body: fd })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(typeof err.error === 'string' ? err.error : 'Erro ao salvar')
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
        className="max-h-[90vh] max-w-lg overflow-y-auto bg-[#071525] text-white border-white/10 [&_[data-slot='dialog-close']]:bg-transparent [&_[data-slot='dialog-close']]:text-white/40 [&_[data-slot='dialog-close']]:hover:bg-white/10 [&_[data-slot='dialog-close']]:hover:text-white/80 [&_[data-slot='dialog-close']]:rounded"
        onOpenAutoFocus={e => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-white">
            {isEdit ? 'Editar membro' : 'Novo membro'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-2 grid gap-4">
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
                <img src={previewSrc} alt="Preview" className="h-full w-full object-cover" />
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
                    key={c.value}
                    value={c.value}
                    className="text-white/80 data-[highlighted]:bg-white/10 data-[highlighted]:text-white cursor-pointer"
                  >
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Nome */}
          <div className="grid gap-1.5">
            <Label htmlFor="name" className="text-white/70">Nome *</Label>
            <Input
              id="name"
              name="name"
              required
              defaultValue={member?.name}
              placeholder="Prof. Dr. Nome Sobrenome"
              className={INPUT_CLS}
            />
          </div>

          {/* Qualificação */}
          <div className="grid gap-1.5">
            <Label htmlFor="qualification" className="text-white/70">Qualificação *</Label>
            <Input
              id="qualification"
              name="qualification"
              required
              defaultValue={member?.qualification}
              placeholder="Doutor em Ciência da Computação"
              className={INPUT_CLS}
            />
          </div>

          {/* Descrição */}
          <div className="grid gap-1.5">
            <Label htmlFor="description" className="text-white/70">Descrição</Label>
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
