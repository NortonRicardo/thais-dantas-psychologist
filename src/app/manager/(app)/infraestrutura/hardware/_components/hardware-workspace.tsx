'use client'

import { createElement, useCallback, useEffect, useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
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
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'

import { LucideIconPicker } from './lucide-icon-picker'
import { getLucideIcon } from '@/lib/lucide-resolve'

const INPUT_CLS =
  'bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-0 focus-visible:border-white/30'

const FIELD_LABEL_CLS =
  'text-xs font-medium uppercase tracking-[0.12em] text-white/55'

type ModuleDraft = {
  key: string
  title: string
  iconKey: string
  description: string
}

type ModuleErrors = Record<string, { title?: string; description?: string }>

type HardwareDraft = {
  key: string
  title: string
  modules: ModuleDraft[]
}

function newModule(): ModuleDraft {
  return {
    key: crypto.randomUUID(),
    title: '',
    iconKey: '',
    description: '',
  }
}

function emptyHardwareDraft(): HardwareDraft {
  return {
    key: crypto.randomUUID(),
    title: '',
    modules: [],
  }
}

function moduleDescriptionPreview(description: string): string {
  const t = description.trim()
  if (!t) return 'Sem descrição'
  const first = t.split(/\r?\n/)[0]?.trim() ?? t
  return first.length > 120 ? `${first.slice(0, 117)}…` : first
}

function HardwareSummaryCard({
  hardware,
  onEdit,
  onDelete,
}: {
  hardware: HardwareDraft
  onEdit: () => void
  onDelete: () => void
}) {
  const title = hardware.title.trim() || 'Sem título'

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
      <div className="flex items-start justify-between gap-2 border-b border-white/[0.06] pb-3">
        <h3 className="min-w-0 flex-1 text-sm font-semibold leading-snug text-white/90">
          {title}
        </h3>
        <div className="flex shrink-0 items-center gap-0.5">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white/45 hover:bg-white/10 hover:text-sky-400"
            title="Editar"
            onClick={onEdit}
          >
            <Pencil size={15} />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white/45 hover:bg-rose-500/10 hover:text-rose-400"
                title="Remover equipamento"
              >
                <Trash2 size={15} />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="border-white/10 bg-[#071525] text-white">
              <AlertDialogHeader>
                <AlertDialogTitle>Remover equipamento?</AlertDialogTitle>
                <AlertDialogDescription className="text-white/50">
                  &ldquo;{title}&rdquo; e todos os seus módulos serão removidos
                  permanentemente.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-white/5 text-white/70 border-white/10 hover:bg-white/10">
                  Cancelar
                </AlertDialogCancel>
                <AlertDialogAction
                  className="bg-rose-500/15 text-rose-300 border border-rose-500/30 hover:bg-rose-500/25"
                  onClick={onDelete}
                >
                  Remover
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      {hardware.modules.length === 0 ? (
        <p className="mt-3 text-[0.75rem] text-white/35">Nenhum módulo</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {hardware.modules.map(m => (
            <li
              key={m.key}
              className="flex gap-2.5 text-[0.8rem] leading-snug text-white/60"
            >
              {m.iconKey.trim() ? (
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white/[0.08] text-white/85">
                  {createElement(getLucideIcon(m.iconKey), {
                    size: 14,
                    strokeWidth: 1.5,
                  })}
                </span>
              ) : null}
              <span className="flex min-w-0 flex-col gap-2">
                <span className="block font-medium text-white/80">
                  {m.title.trim() || 'Sem título'}
                </span>
                <span className="block text-white/45">
                  {moduleDescriptionPreview(m.description)}
                </span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function HardwareWorkspace() {
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create')
  const [editingServerId, setEditingServerId] = useState<string | null>(null)
  const [draft, setDraft] = useState<HardwareDraft>(() => emptyHardwareDraft())

  const [hardwareItems, setHardwareItems] = useState<HardwareDraft[]>([])
  const [moduleErrors, setModuleErrors] = useState<ModuleErrors>({})

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/hardware')
      const data = await res.json()
      const rows = Array.isArray(data.items) ? data.items : []
      setHardwareItems(
        rows.map(
          (row: {
            id: string
            title: string
            modules: Array<{
              id: string
              title: string
              iconKey: string
              description: string
            }>
          }) => ({
            key: row.id,
            title: row.title ?? '',
            modules: (row.modules ?? []).map(m => ({
              key: m.id,
              title: m.title ?? '',
              iconKey: m.iconKey ?? '',
              description: m.description ?? '',
            })),
          })
        )
      )
    } catch {
      toast.error('Erro ao carregar hardware.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  function openCreate() {
    setDialogMode('create')
    setEditingServerId(null)
    setDraft(emptyHardwareDraft())
    setDialogOpen(true)
  }

  function openEdit(hw: HardwareDraft) {
    setDialogMode('edit')
    setEditingServerId(hw.key)
    setDraft({
      key: hw.key,
      title: hw.title,
      modules: hw.modules.map(m => ({ ...m })),
    })
    setDialogOpen(true)
  }

  function handleDialogOpen(open: boolean) {
    setDialogOpen(open)
    if (!open) {
      setDraft(emptyHardwareDraft())
      setEditingServerId(null)
      setModuleErrors({})
    }
  }

  function addModuleToDraft() {
    setDraft(prev => ({
      ...prev,
      modules: [...prev.modules, newModule()],
    }))
  }

  function removeModuleFromDraft(modKey: string) {
    setDraft(prev => ({
      ...prev,
      modules: prev.modules.filter(m => m.key !== modKey),
    }))
    setModuleErrors(prev => {
      const next = { ...prev }
      delete next[modKey]
      return next
    })
  }

  function updateDraftTitle(title: string) {
    setDraft(prev => ({ ...prev, title }))
  }

  function updateDraftModule(modKey: string, patch: Partial<ModuleDraft>) {
    setDraft(prev => ({
      ...prev,
      modules: prev.modules.map(m =>
        m.key === modKey ? { ...m, ...patch } : m
      ),
    }))
    setModuleErrors(prev => {
      const errs = prev[modKey]
      if (!errs) return prev
      const next = { ...errs }
      if ('title' in patch && patch.title?.trim()) delete next.title
      if ('description' in patch && patch.description?.trim()) delete next.description
      const cleaned = { ...prev, [modKey]: next }
      if (!next.title && !next.description) delete cleaned[modKey]
      return cleaned
    })
  }

  async function handleSubmitModal(e: React.FormEvent) {
    e.preventDefault()

    const errors: ModuleErrors = {}
    for (const m of draft.modules) {
      const err: { title?: string; description?: string } = {}
      if (!m.title.trim()) err.title = 'Obrigatório'
      if (!m.description.trim()) err.description = 'Obrigatório'
      if (err.title || err.description) errors[m.key] = err
    }
    if (Object.keys(errors).length > 0) {
      setModuleErrors(errors)
      return
    }

    setSaving(true)
    try {
      const payload = {
        title: draft.title.trim(),
        modules: draft.modules.map(m => ({
          title: m.title.trim(),
          iconKey: m.iconKey.trim(),
          description: m.description.trim(),
        })),
      }

      if (dialogMode === 'create') {
        const res = await fetch('/api/hardware', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (!res.ok) {
          const err = await res.json().catch(() => ({}))
          throw new Error(
            typeof err.error === 'string' ? err.error : await res.text()
          )
        }
        toast.success('Equipamento criado!')
      } else if (editingServerId) {
        const res = await fetch(`/api/hardware/${editingServerId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (!res.ok) {
          const err = await res.json().catch(() => ({}))
          throw new Error(
            typeof err.error === 'string' ? err.error : await res.text()
          )
        }
        toast.success('Equipamento atualizado!')
      }

      setDialogOpen(false)
      await load()
    } catch (err) {
      console.error(err)
      toast.error(
        err instanceof Error ? err.message : 'Erro ao salvar equipamento.'
      )
    } finally {
      setSaving(false)
    }
  }

  async function handleDeleteHardware(id: string) {
    try {
      const res = await fetch(`/api/hardware/${id}`, { method: 'DELETE' })
      if (!res.ok && res.status !== 204) {
        const err = await res.json().catch(() => ({}))
        throw new Error(
          typeof err.error === 'string' ? err.error : 'Erro ao remover'
        )
      }
      toast.success('Equipamento removido.')
      await load()
    } catch (err) {
      console.error(err)
      toast.error(
        err instanceof Error ? err.message : 'Erro ao remover equipamento.'
      )
    }
  }

  return (
    <>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-xl font-semibold text-white/90">Hardware</h1>
        <Button
          type="button"
          className="gap-1.5 border-0 bg-orange-800 text-orange-50 hover:bg-orange-700"
          onClick={openCreate}
        >
          <Plus size={16} strokeWidth={2} /> Adicionar equipamento
        </Button>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-xl bg-white/10" />
          ))}
        </div>
      ) : hardwareItems.length === 0 ? (
        <p className="rounded-lg border border-dashed border-white/12 px-4 py-12 text-center text-sm text-white/35">
          Nenhum equipamento cadastrado.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {hardwareItems.map(hw => (
            <HardwareSummaryCard
              key={hw.key}
              hardware={hw}
              onEdit={() => openEdit(hw)}
              onDelete={() => void handleDeleteHardware(hw.key)}
            />
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={handleDialogOpen}>
        <DialogContent
          className="max-h-[92vh] w-full max-w-[min(96vw,56rem)] gap-0 overflow-y-auto border-white/10 bg-[#071525] p-0 text-white sm:max-w-4xl lg:max-w-5xl [&_[data-slot='dialog-close']]:text-white/40 [&_[data-slot='dialog-close']]:hover:bg-white/10 [&_[data-slot='dialog-close']]:hover:text-white/85"
          onOpenAutoFocus={e => e.preventDefault()}
        >
          <div className="border-b border-white/10 px-6 pb-4 pt-5">
            <DialogHeader className="text-left">
              <DialogTitle className="text-base text-white">
                {dialogMode === 'create'
                  ? 'Novo equipamento'
                  : 'Editar equipamento'}
              </DialogTitle>
            </DialogHeader>
          </div>

          <form onSubmit={handleSubmitModal} className="px-6 pb-6 pt-4">
            <div className="space-y-1.5">
              <Label htmlFor="modal-hw-title" className={FIELD_LABEL_CLS}>
                Equipamento — título *
              </Label>
              <Input
                id="modal-hw-title"
                value={draft.title}
                onChange={e => updateDraftTitle(e.target.value)}
                required
                placeholder="Ex.: Estação HPC principal"
                className={`${INPUT_CLS} h-10 text-sm`}
              />
            </div>

            <div className="mt-5 flex items-center justify-between gap-2 border-t border-white/10 pt-5">
              <span className="text-xs font-medium uppercase tracking-[0.12em] text-white/50">
                Módulos deste equipamento
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 gap-1 border-white/18 bg-white/[0.06] px-2.5 text-[0.7rem] text-white/85 hover:bg-white/10"
                onClick={addModuleToDraft}
              >
                <Plus size={13} /> Módulo
              </Button>
            </div>

            {draft.modules.length === 0 ? (
              <p className="mt-3 text-[0.75rem] text-white/30">
                Adicione módulos com &quot;+ Módulo&quot; (título e descrição).
              </p>
            ) : (
              <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2">
                {draft.modules.map((m, mi) => (
                  <div
                    key={m.key}
                    className={cn(
                      'rounded-lg border bg-black/30 p-3',
                      moduleErrors[m.key]
                        ? 'border-rose-500/60'
                        : 'border-white/[0.1]'
                    )}
                  >
                    <div className="mb-1.5 flex items-center justify-between gap-2">
                      <span className="text-[0.6rem] tabular-nums text-white/35">
                        #{mi + 1}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-rose-400/85 hover:bg-rose-500/10 hover:text-rose-300"
                        title="Remover módulo"
                        onClick={() => removeModuleFromDraft(m.key)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                    <div className="flex flex-col gap-3">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-2">
                        <div className="min-w-0 flex-1 space-y-1.5">
                          <Label
                            htmlFor={`modal-t-${m.key}`}
                            className={FIELD_LABEL_CLS}
                          >
                            Título *
                          </Label>
                          <Input
                            id={`modal-t-${m.key}`}
                            value={m.title}
                            onChange={e =>
                              updateDraftModule(m.key, {
                                title: e.target.value,
                              })
                            }
                            placeholder="AMD Ryzen Threadripper PRO 5965WX"
                            className={cn(
                              `${INPUT_CLS} h-10 text-sm`,
                              moduleErrors[m.key]?.title &&
                                'border-rose-500/70 focus-visible:border-rose-500/70'
                            )}
                          />
                          {moduleErrors[m.key]?.title && (
                            <p className="text-[0.7rem] text-rose-400">
                              {moduleErrors[m.key].title}
                            </p>
                          )}
                        </div>
                        <div className="shrink-0 space-y-1.5">
                          <Label className={FIELD_LABEL_CLS}>Ícone</Label>
                          <LucideIconPicker
                            compact
                            value={m.iconKey}
                            onChange={iconKey =>
                              updateDraftModule(m.key, { iconKey })
                            }
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label
                          htmlFor={`modal-d-${m.key}`}
                          className={FIELD_LABEL_CLS}
                        >
                          Descrição *
                        </Label>
                        <Textarea
                          id={`modal-d-${m.key}`}
                          value={m.description}
                          onChange={e =>
                            updateDraftModule(m.key, {
                              description: e.target.value,
                            })
                          }
                          rows={3}
                          placeholder="Processador de alto desempenho para workloads paralelos de modelagem e HPC."
                          className={cn(
                            `${INPUT_CLS} min-h-[4.5rem] resize-none text-sm leading-relaxed`,
                            moduleErrors[m.key]?.description &&
                              'border-rose-500/70 focus-visible:border-rose-500/70'
                          )}
                        />
                        {moduleErrors[m.key]?.description && (
                          <p className="text-[0.7rem] text-rose-400">
                            {moduleErrors[m.key].description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 flex flex-wrap justify-end gap-2 border-t border-white/10 pt-5">
              <Button
                type="button"
                variant="ghost"
                className="text-white/50 hover:bg-white/5 hover:text-white"
                onClick={() => setDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="bg-orange-800 text-orange-50 hover:bg-orange-700 border-0 disabled:opacity-50"
              >
                {saving
                  ? 'Salvando…'
                  : dialogMode === 'create'
                    ? 'Criar'
                    : 'Salvar'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
