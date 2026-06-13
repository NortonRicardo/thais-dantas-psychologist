'use client'

import { createElement, useCallback, useEffect, useState } from 'react'
import {
  Facebook,
  Github,
  Globe,
  Instagram,
  Link,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  Pencil,
  Phone,
  Plus,
  Send,
  Trash2,
  Twitter,
  Youtube,
  Loader2,
  Map,
  type LucideIcon,
} from 'lucide-react'
import { toast } from 'sonner'

import { FilterCombobox } from '@/components/filter-combobox'
import { HttpsUrlSuffixField } from '@/components/https-url-suffix-field'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { stripUrlScheme, toHttpsStored } from '@/lib/url-https'
import {
  CONTACT_TYPES_UI,
  contactChannelPostSchema,
  contactInfoPutSchema,
} from '@/lib/validation/contato-api'

/* ─── Estilos compartilhados ─────────────────────────────────────────────── */
const INPUT_CLS =
  'bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-0 focus-visible:border-white/30 shadow-[0_2px_6px_rgba(0,0,0,0.25)]'

const GLASS = {
  background:
    'linear-gradient(135deg, rgba(255,255,255,0.10), rgba(255,255,255,0.04))',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: '1px solid rgba(255,255,255,0.13)',
} as const

/* #F4F0EA (bege público) com L≈22% — marrom-bege escuro, visivelmente quente */
const DIALOG_STYLE = {
  background: '#3d3028',
} as const

const BTN_PRIMARY = 'bg-white text-[#3A4424] hover:bg-white/90 shadow-[0_2px_8px_rgba(0,0,0,0.35)]'
const BTN_CANCEL  = 'border border-white/20 text-white/55 hover:bg-white/6 hover:border-white/35 hover:text-white/80 shadow-[0_2px_6px_rgba(0,0,0,0.2)]'

/* ─── Ícones ─────────────────────────────────────────────────────────────── */
const ICON_MAP: Record<string, LucideIcon> = {
  mail: Mail,
  phone: Phone,
  'message-circle': MessageCircle,
  linkedin: Linkedin,
  instagram: Instagram,
  github: Github,
  youtube: Youtube,
  twitter: Twitter,
  facebook: Facebook,
  globe: Globe,
  'map-pin': MapPin,
  send: Send,
  link: Link,
}

const CONTACT_TYPES = CONTACT_TYPES_UI

const ICON_OPTIONS = [
  { key: 'mail', label: 'E-mail' },
  { key: 'phone', label: 'Telefone' },
  { key: 'message-circle', label: 'Mensagem / WhatsApp' },
  { key: 'linkedin', label: 'LinkedIn' },
  { key: 'instagram', label: 'Instagram' },
  { key: 'github', label: 'GitHub' },
  { key: 'youtube', label: 'YouTube' },
  { key: 'twitter', label: 'Twitter / X' },
  { key: 'facebook', label: 'Facebook' },
  { key: 'globe', label: 'Site / Web' },
  { key: 'map-pin', label: 'Localização' },
  { key: 'send', label: 'Telegram' },
  { key: 'link', label: 'Link genérico' },
]

/* ─── Helpers ────────────────────────────────────────────────────────────── */
function applyPhoneMask(raw: string): string {
  const d = raw.replace(/\D/g, '').slice(0, 11)
  if (d.length <= 2) return d.length ? `(${d}` : ''
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 3)} ${d.slice(3, 7)}-${d.slice(7, 11)}`
}

const PHONE_LABELS = new Set(['Telefone', 'WhatsApp'])

function channelValueIssue(label: string, iconKey: string, value: string): string | null {
  if (!label) return null
  const trial = contactChannelPostSchema.safeParse({ label, iconKey, value })
  if (trial.success) return null
  return trial.error.issues.find(i => i.path[0] === 'value')?.message ?? null
}

/* ─── Types ──────────────────────────────────────────────────────────────── */
type ContactData = { id: string; mapUrl: string }
type Channel = { id: string; label: string; iconKey: string; value: string; sortOrder: number }

/* ─── MapSection ─────────────────────────────────────────────────────────── */
function MapSection({ data, onSaved }: { data: ContactData; onSaved: (u: ContactData) => void }) {
  const [modalOpen, setModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [mapUrlSuffix, setMapUrlSuffix] = useState(() => stripUrlScheme(data.mapUrl))

  function openModal() {
    setMapUrlSuffix(stripUrlScheme(data.mapUrl))
    setModalOpen(true)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    const parsed = contactInfoPutSchema.safeParse({ mapUrl: toHttpsStored(mapUrlSuffix).trim() })
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? 'Dados inválidos.')
      return
    }
    setSaving(true)
    try {
      const res = await fetch('/api/contato', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      })
      if (!res.ok) throw new Error()
      onSaved(await res.json())
      setModalOpen(false)
      toast.success('Localização atualizada!')
    } catch {
      toast.error('Erro ao salvar.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      {data.mapUrl ? (
        /* Preview do mapa */
        <div className="group overflow-hidden rounded-2xl" style={GLASS}>
          <div className="relative h-[260px]">
            <iframe
              src={data.mapUrl}
              title="Localização no mapa"
              className="h-full w-full border-0"
              allowFullScreen
              loading="lazy"
            />
            <button
              type="button"
              onClick={openModal}
              className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1.5 text-[11px] font-medium text-white/80 opacity-0 backdrop-blur-sm transition-all group-hover:opacity-100 hover:bg-black/70 hover:text-white"
            >
              <Pencil size={10} /> Editar
            </button>
          </div>
          <div className="flex items-center gap-3 px-4 py-3 border-t border-white/10">
            <MapPin size={13} className="shrink-0 text-white/40" strokeWidth={1.5} />
            <p className="flex-1 truncate text-xs text-white/50">{data.mapUrl}</p>
          </div>
        </div>
      ) : (
        /* Estado vazio */
        <button
          type="button"
          onClick={openModal}
          className="flex w-full flex-col items-center justify-center gap-3 rounded-2xl py-12 text-center transition-colors hover:bg-white/5"
          style={GLASS}
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
            <Map size={20} className="text-white/50" strokeWidth={1.5} />
          </span>
          <div>
            <p className="text-sm font-medium text-white/70">Configurar mapa</p>
            <p className="mt-0.5 text-xs text-white/35">Clique para adicionar a URL do Google Maps</p>
          </div>
        </button>
      )}

      <Dialog open={modalOpen} onOpenChange={v => !v && setModalOpen(false)}>
        <DialogContent
          className="border-[#F4F0EA]/12 text-white sm:max-w-md"
          style={DIALOG_STYLE}
          onOpenAutoFocus={e => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle className="text-white/90">Localização no mapa</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4 pt-1">
            <div className="grid gap-1.5">
              <Label className="text-sm text-white/70">URL do Google Maps (embed)</Label>
              <HttpsUrlSuffixField
                id="mapEmbedUrl"
                value={mapUrlSuffix}
                onChange={setMapUrlSuffix}
                placeholder="maps.google.com/maps?...&output=embed"
              />
              <p className="text-xs text-white/30">
                Cole o caminho após https:// ou a URL completa.
              </p>
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="ghost" size="sm"
                className={BTN_CANCEL}
                onClick={() => setModalOpen(false)} disabled={saving}>
                Cancelar
              </Button>
              <Button type="submit" size="sm" loading={saving} loadingLabel="Salvando…"
                className={`border-0 ${BTN_PRIMARY}`}>
                Salvar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

/* ─── ChannelCard ────────────────────────────────────────────────────────── */
function ChannelCard({ channel, onDeleted }: { channel: Channel; onDeleted: (id: string) => void }) {
  const [deleting, setDeleting] = useState(false)
  const Icon = ICON_MAP[channel.iconKey] ?? Link

  async function handleDelete() {
    setDeleting(true)
    try {
      const res = await fetch(`/api/contato/channels/${channel.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      onDeleted(channel.id)
      toast.success('Canal removido.')
    } catch {
      toast.error('Erro ao remover canal.')
      setDeleting(false)
    }
  }

  return (
    <div className="group relative flex items-center gap-4 rounded-xl px-4 py-4 transition-colors" style={GLASS}>
      {/* Ícone */}
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-white/60">
        <Icon size={16} strokeWidth={1.5} />
      </span>

      {/* Texto */}
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/35">{channel.label}</p>
        <p className="mt-0.5 truncate text-sm text-white/80">{channel.value}</p>
      </div>

      {/* Deletar */}
      <button
        type="button"
        onClick={handleDelete}
        disabled={deleting}
        className="shrink-0 flex h-7 w-7 items-center justify-center rounded-full text-white/20 opacity-0 transition-all group-hover:opacity-100 hover:bg-rose-500/15 hover:text-rose-400 disabled:opacity-40"
        title="Remover"
      >
        {deleting
          ? <Loader2 size={13} className="animate-spin text-rose-400/90" />
          : <Trash2 size={13} />}
      </button>
    </div>
  )
}

/* ─── AddChannelModal ────────────────────────────────────────────────────── */
function AddChannelModal({ open, onClose, onAdded }: {
  open: boolean
  onClose: () => void
  onAdded: (channel: Channel) => void
}) {
  const [saving, setSaving] = useState(false)
  const [label, setLabel] = useState('')
  const [iconKey, setIconKey] = useState('mail')
  const [value, setValue] = useState('')
  const [valueError, setValueError] = useState<string | null>(null)

  function handleTypeChange(type: string) {
    const found = CONTACT_TYPES.find(t => t.label === type)
    setLabel(type)
    if (found) setIconKey(found.icon)
    setValueError(null)
  }

  function handleValueChange(v: string) {
    const masked = PHONE_LABELS.has(label) ? applyPhoneMask(v) : v
    setValue(masked)
    if (valueError) setValueError(channelValueIssue(label, iconKey, masked))
  }

  function handleClose() {
    setLabel(''); setIconKey('mail'); setValue(''); setValueError(null)
    onClose()
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    const parsed = contactChannelPostSchema.safeParse({ label, iconKey, value })
    if (!parsed.success) {
      const msg = parsed.error.issues.find(i => i.path[0] === 'value')?.message
        ?? parsed.error.issues[0]?.message ?? 'Dados inválidos.'
      setValueError(msg)
      return
    }
    setSaving(true)
    try {
      const res = await fetch('/api/contato/channels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(typeof body.error === 'string' ? body.error : 'Erro ao criar canal')
      }
      onAdded(await res.json())
      handleClose()
      toast.success('Canal adicionado!')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao criar canal.')
    } finally {
      setSaving(false)
    }
  }

  const placeholder: Record<string, string> = {
    'E-mail': 'contato@thaisdantas.com.br',
    Telefone: '(62) 9 0000-0000',
    WhatsApp: '(62) 9 0000-0000',
    LinkedIn: 'https://linkedin.com/in/thaisdantas',
    Instagram: 'https://instagram.com/thaisdantas',
    GitHub: 'https://github.com/thaisdantas',
    YouTube: 'https://youtube.com/@thaisdantas',
    'Twitter / X': 'https://x.com/thaisdantas',
    Facebook: 'https://facebook.com/thaisdantas',
    Site: 'https://thaisdantas.com.br',
    Telegram: 'https://t.me/thaisdantas',
    Localização: 'Endereço ou referência',
    Outro: 'Descrição livre',
  }

  return (
    <Dialog open={open} onOpenChange={v => !v && handleClose()}>
      <DialogContent
        className="border-[#F4F0EA]/12 text-white sm:max-w-md"
        style={DIALOG_STYLE}
        onOpenAutoFocus={e => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-white/90">Novo canal de contato</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSave} className="space-y-4 pt-1">
          <div className="grid gap-1.5">
            <Label className="text-sm text-white/70">Tipo</Label>
            <div className="shadow-[0_2px_6px_rgba(0,0,0,0.25)]">
            <FilterCombobox
              value={label}
              onChange={handleTypeChange}
              placeholder="Selecione o tipo…"
              clearLabel="Limpar"
              showClear={false}
              options={CONTACT_TYPES.map(t => t.label)}
              labelForValue={l => l}
              width="w-full min-w-0"
              renderOption={l => {
                const t = CONTACT_TYPES.find(x => x.label === l)
                const Icon = t ? (ICON_MAP[t.icon] ?? Link) : Link
                return (
                  <span className="flex items-center gap-2">
                    {createElement(Icon, { size: 14, className: 'shrink-0 opacity-70' })}
                    {l}
                  </span>
                )
              }}
              renderValue={l => {
                const t = CONTACT_TYPES.find(x => x.label === l)
                const Icon = t ? (ICON_MAP[t.icon] ?? Link) : Link
                return (
                  <span className="flex min-w-0 flex-1 items-center gap-2">
                    {createElement(Icon, { size: 14, className: 'shrink-0 opacity-70' })}
                    <span className="truncate">{l}</span>
                  </span>
                )
              }}
            />
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label className="text-sm text-white/70">
              Ícone <span className="font-normal text-white/40">(definido pelo tipo)</span>
            </Label>
            <div
              className={`flex h-10 w-full items-center gap-2.5 rounded-md border px-3 ${INPUT_CLS} pointer-events-none select-none ${label ? 'text-white/85' : 'text-white/35'} shadow-[0_2px_6px_rgba(0,0,0,0.25)]`}
              aria-readonly
            >
              {label ? (
                <>
                  {createElement(ICON_MAP[iconKey] ?? Link, { size: 16, strokeWidth: 1.6, className: 'shrink-0 text-white/70' })}
                  <span className="truncate text-sm">
                    {ICON_OPTIONS.find(o => o.key === iconKey)?.label ?? iconKey}
                  </span>
                </>
              ) : (
                <span className="text-sm text-white/35">Escolha um tipo para ver o ícone</span>
              )}
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label className="text-sm text-white/70">Descrição</Label>
            <Input
              value={value}
              onChange={e => handleValueChange(e.target.value)}
              placeholder={label ? (placeholder[label] ?? '') : 'Preencha o tipo primeiro…'}
              className={`${INPUT_CLS} h-10 text-sm ${valueError ? 'border-rose-500/60' : ''}`}
            />
            {valueError && <p className="text-xs text-rose-400">{valueError}</p>}
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="ghost" size="sm"
              className={BTN_CANCEL}
              onClick={handleClose} disabled={saving}>
              Cancelar
            </Button>
            <Button type="submit" size="sm" loading={saving} loadingLabel="Adicionando…"
              disabled={!label} className={`border-0 ${BTN_PRIMARY}`}>
              Adicionar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

/* ─── ContatoWorkspace ───────────────────────────────────────────────────── */
export function ContatoWorkspace() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<ContactData | null>(null)
  const [channels, setChannels] = useState<Channel[]>([])
  const [modalOpen, setModalOpen] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [infoRes, channelsRes] = await Promise.all([
        fetch('/api/contato'),
        fetch('/api/contato/channels'),
      ])
      setData(await infoRes.json())
      const chs = await channelsRes.json()
      setChannels(Array.isArray(chs) ? chs : [])
    } catch {
      toast.error('Erro ao carregar informações de contato.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  return (
    <div className="mx-auto max-w-7xl px-6 pb-16 sm:px-10">

      {/* Cabeçalho */}
      <div className="mb-10 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white/90">Contato</h1>
          <p className="mt-0.5 text-sm text-white/40">Mapa e canais exibidos na página pública.</p>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-8 lg:grid-cols-[1fr_2fr]">
          <div>
            <Skeleton className="mb-3 h-3 w-12 rounded bg-white/10" />
            <Skeleton className="h-[300px] rounded-2xl bg-white/10" />
          </div>
          <div>
            <div className="mb-3 flex items-center justify-between">
              <Skeleton className="h-3 w-24 rounded bg-white/10" />
              <Skeleton className="h-8 w-28 rounded-full bg-white/10" />
            </div>
            <div className="grid gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-16 rounded-xl bg-white/10" />
              ))}
            </div>
          </div>
        </div>
      ) : data ? (
        <div className="grid gap-10 lg:grid-cols-[1fr_2fr]">

          {/* Coluna esquerda — Mapa */}
          <section aria-labelledby="section-mapa">
            <h2 id="section-mapa" className="mb-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/35">
              Localização
            </h2>
            <MapSection data={data} onSaved={setData} />
          </section>

          {/* Coluna direita — Canais */}
          <section aria-labelledby="section-canais">
            <div className="mb-3 flex items-center justify-between gap-4">
              <h2 id="section-canais" className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/35">
                Canais de contato
              </h2>
              <Button
                type="button"
                size="sm"
                className={`shrink-0 gap-1.5 border-0 ${BTN_PRIMARY}`}
                onClick={() => setModalOpen(true)}
              >
                <Plus size={13} /> Adicionar
              </Button>
            </div>

            {channels.length > 0 ? (
              <div className="grid gap-3">
                {channels.map(ch => (
                  <ChannelCard
                    key={ch.id}
                    channel={ch}
                    onDeleted={id => setChannels(prev => prev.filter(c => c.id !== id))}
                  />
                ))}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="flex w-full flex-col items-center justify-center gap-3 rounded-2xl py-12 text-center transition-colors hover:bg-white/5"
                style={GLASS}
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                  <Plus size={16} className="text-white/40" />
                </span>
                <div>
                  <p className="text-sm font-medium text-white/60">Nenhum canal cadastrado</p>
                  <p className="mt-0.5 text-xs text-white/30">Clique para adicionar e-mail, telefone ou redes sociais</p>
                </div>
              </button>
            )}
          </section>

        </div>
      ) : null}

      <AddChannelModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdded={ch => setChannels(prev => [...prev, ch])}
      />
    </div>
  )
}
