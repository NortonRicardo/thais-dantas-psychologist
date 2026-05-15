'use client'

import { createElement, useCallback, useEffect, useState } from 'react'
import * as Lucide from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { LucideIconPicker } from '@/app/manager/(app)/hardware/_components/lucide-icon-picker'
import { ColorSelector } from '@/components/color-selector'
import { COLOR_OPTIONS } from '@/components/constants/colors'

type EventTypeRow = {
  id: string
  name: string
  iconKey: string
  color: string
  createdAt: string
  updatedAt: string
}

const LUCIDE_NAMES = new Set(
  Object.keys(Lucide).filter(k => /^[A-Z]/.test(k) && !k.endsWith('Icon'))
)

function resolveIcon(name: string): LucideIcon {
  const C = (Lucide as Record<string, unknown>)[name]
  if (typeof C === 'function') return C as LucideIcon
  return Lucide.Calendar as LucideIcon
}

function IconPreview({ iconKey, color }: { iconKey: string; color: string }) {
  const Icon = LUCIDE_NAMES.has(iconKey) ? resolveIcon(iconKey) : Lucide.Calendar
  return (
    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${color}`}>
      {createElement(Icon, { size: 15, strokeWidth: 1.8, className: 'text-white' })}
    </span>
  )
}

type FormState = { name: string; iconKey: string; color: string }

function EventTypeDialog({
  open,
  onOpenChange,
  initial,
  onSuccess,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  initial?: EventTypeRow
  onSuccess: () => void
}) {
  const [form, setForm] = useState<FormState>({
    name: initial?.name ?? '',
    iconKey: initial?.iconKey ?? 'Calendar',
    color: initial?.color ?? COLOR_OPTIONS[0].key,
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (open) {
      setForm({
        name: initial?.name ?? '',
        iconKey: initial?.iconKey ?? 'Calendar',
        color: initial?.color ?? COLOR_OPTIONS[0].key,
      })
    }
  }, [open, initial])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) { toast.error('Nome é obrigatório'); return }
    setSaving(true)
    try {
      const url = initial ? `/api/event-types/${initial.id}` : '/api/event-types'
      const method = initial ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const data = await res.json()
        toast.error(data.error ?? 'Erro ao salvar')
        return
      }
      toast.success(initial ? 'Tipo atualizado.' : 'Tipo criado.')
      onSuccess()
      onOpenChange(false)
    } catch {
      toast.error('Erro ao salvar tipo.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="bg-[#071525] border-white/10 text-white sm:max-w-md"
        onOpenAutoFocus={e => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>{initial ? 'Editar tipo' : 'Novo tipo de evento'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 pt-1">
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-white/60">Nome</label>
            <input
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="Ex: Workshop"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/90 placeholder:text-white/25 outline-none focus:border-white/20"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-white/60">Ícone</label>
            <LucideIconPicker
              value={form.iconKey}
              onChange={v => setForm(f => ({ ...f, iconKey: v }))}
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-white/60">Cor</label>
            <ColorSelector
              value={form.color}
              onChange={v => setForm(f => ({ ...f, color: v }))}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              className="text-white/50 hover:text-white/80"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="bg-orange-700 hover:bg-orange-600 text-white"
            >
              {saving ? 'Salvando…' : initial ? 'Salvar' : 'Criar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function EventTypesTable() {
  const [rows, setRows] = useState<EventTypeRow[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<EventTypeRow | undefined>()

  const fetchTypes = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/event-types')
      const data = await res.json()
      setRows(Array.isArray(data) ? data : [])
    } catch {
      toast.error('Erro ao carregar tipos.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchTypes() }, [fetchTypes])

  async function handleDelete(id: string) {
    try {
      await fetch(`/api/event-types/${id}`, { method: 'DELETE' })
      toast.success('Tipo removido.')
      fetchTypes()
    } catch {
      toast.error('Erro ao remover tipo.')
    }
  }

  function openCreate() {
    setEditing(undefined)
    setDialogOpen(true)
  }

  function openEdit(row: EventTypeRow) {
    setEditing(row)
    setDialogOpen(true)
  }

  return (
    <div className="space-y-4">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white/90">Tipo de Evento</h1>
          <p className="mt-0.5 text-sm text-white/40">
            Gerencie as categorias de eventos com ícone e cor.
          </p>
        </div>
        <Button
          onClick={openCreate}
          className="bg-orange-700 hover:bg-orange-600 text-white gap-1.5"
        >
          <Plus size={15} />
          Novo tipo
        </Button>
      </div>

      <div
        className="w-full overflow-x-auto rounded-xl"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02))',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 8px 32px 0 rgba(0,0,0,0.35)',
        }}
      >
        <Table className="min-w-[500px] [table-layout:fixed]">
          <TableHeader>
            <TableRow
              className="border-white/[0.07] hover:bg-transparent"
              style={{ background: 'rgba(255,255,255,0.04)' }}
            >
              <TableHead className="text-white/40 text-xs uppercase tracking-widest font-semibold w-[48%]">
                Nome
              </TableHead>
              <TableHead className="text-white/40 text-xs uppercase tracking-widest font-semibold w-[20%]">
                Ícone
              </TableHead>
              <TableHead className="text-white/40 text-xs uppercase tracking-widest font-semibold w-[20%]">
                Cor
              </TableHead>
              <TableHead className="text-white/40 text-xs uppercase tracking-widest font-semibold w-[12%] text-right">
                Ações
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading &&
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i} className="border-white/[0.07]">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full bg-white/10" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}

            {!loading && rows.length === 0 && (
              <TableRow className="border-white/[0.07] hover:bg-transparent">
                <TableCell colSpan={4} className="py-12 text-center text-sm text-white/30">
                  Nenhum tipo cadastrado ainda.
                </TableCell>
              </TableRow>
            )}

            {!loading && rows.map(row => (
              <TableRow
                key={row.id}
                className="border-white/[0.07] transition-colors hover:bg-white/[0.04]"
              >
                <TableCell className="font-medium text-white/90">
                  <div className="flex items-center gap-3">
                    <IconPreview iconKey={row.iconKey} color={row.color} />
                    <span>{row.name}</span>
                  </div>
                </TableCell>

                <TableCell className="text-sm text-white/55">
                  {row.iconKey || '—'}
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className={`h-4 w-4 rounded-full ${row.color}`} />
                    <span className="text-xs text-white/40">{row.color.replace('bg-', '')}</span>
                  </div>
                </TableCell>

                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-white/50 hover:text-white hover:bg-white/10"
                      onClick={() => openEdit(row)}
                    >
                      <Pencil size={14} />
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-white/50 hover:text-rose-400 hover:bg-rose-400/10"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-[#071525] border-white/10 text-white">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remover tipo?</AlertDialogTitle>
                          <AlertDialogDescription className="text-white/50">
                            &ldquo;{row.name}&rdquo; será removido permanentemente.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white">
                            Cancelar
                          </AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-rose-500/15 text-rose-300 border border-rose-500/30 hover:bg-rose-500/25"
                            onClick={() => handleDelete(row.id)}
                          >
                            Remover
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <EventTypeDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initial={editing}
        onSuccess={fetchTypes}
      />
    </div>
  )
}
