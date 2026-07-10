'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type Category = { id: string; name: string }

export function CategoryDialog({
  open,
  onOpenChange,
  category,
  onSaved,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Omitido = criar categoria nova; presente = editar (renomear). */
  category?: Category
  onSaved: (category: Category) => void
}) {
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)
  const isEdit = !!category

  useEffect(() => {
    if (open) setName(category?.name ?? '')
  }, [open, category])

  async function handleSave() {
    const trimmed = name.trim()
    if (!trimmed) {
      toast.error('Nome obrigatório.')
      return
    }
    setSaving(true)
    try {
      const url = isEdit
        ? `/api/blog/categories/${category.id}`
        : '/api/blog/categories'
      const res = await fetch(url, {
        method: isEdit ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trimmed }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(
          typeof body.error === 'string'
            ? body.error
            : 'Erro ao salvar categoria.'
        )
      }
      const saved: Category = await res.json()
      onSaved(saved)
      toast.success(isEdit ? 'Categoria renomeada!' : 'Categoria criada!')
      onOpenChange(false)
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Erro ao salvar categoria.'
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Renomear categoria' : 'Nova categoria'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'O novo nome será aplicado a todos os artigos que usam essa categoria.'
              : 'Categorias ficam disponíveis para todos os artigos.'}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label htmlFor="category-name">Nome</Label>
          <Input
            id="category-name"
            autoFocus
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleSave()
              }
            }}
            placeholder="Ex.: Ansiedade"
          />
        </div>
        <DialogFooter>
          <Button
            type="button"
            loading={saving}
            loadingLabel="Salvando…"
            onClick={handleSave}
          >
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
