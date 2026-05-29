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

const INPUT_CLS =
  'bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-0 focus-visible:border-white/30'

const GLASS = {
  background:
    'linear-gradient(135deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02))',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: '1px solid rgba(255,255,255,0.1)',
  boxShadow: '0 8px 32px 0 rgba(0,0,0,0.35)',
} as const

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

function applyPhoneMask(raw: string): string {
  const d = raw.replace(/\D/g, '').slice(0, 11)
  if (d.length <= 2) return d.length ? `(${d}` : ''
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 3)} ${d.slice(3, 7)}-${d.slice(7, 11)}`
}

const PHONE_LABELS = new Set(['Telefone', 'WhatsApp'])

function channelValueIssue(
  label: string,
  iconKey: string,
  value: string
): string | null {
  if (!label) return null
  const trial = contactChannelPostSchema.safeParse({ label, iconKey, value })
  if (trial.success) return null
  const vIssue = trial.error.issues.find(i => i.path[0] === 'value')
  return vIssue?.message ?? null
}

type ContactData = {
  id: string
  mapUrl: string
}

type Channel = {
  id: string
  label: string
  iconKey: string
  value: string
  sortOrder: number
}

function MapCard({
  data,
  onSaved,
}: {
  data: ContactData
  onSaved: (updated: ContactData) => void
}) {
  const [modalOpen, setModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [mapUrlSuffix, setMapUrlSuffix] = useState(() =>
    stripUrlScheme(data.mapUrl)
  )

  function openModal() {
    setMapUrlSuffix(stripUrlScheme(data.mapUrl))
    setModalOpen(true)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    const parsed = contactInfoPutSchema.safeParse({
      mapUrl: toHttpsStored(mapUrlSuffix).trim(),
    })
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
      const updated: ContactData = await res.json()
      onSaved(updated)
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
      <div
        className="group relative flex flex-col items-center gap-3 rounded-xl px-4 py-5 text-center"
        style={GLASS}
      >
        <button
          type="button"
          onClick={openModal}
          className="absolute right-2.5 top-2.5 flex h-6 w-6 items-center justify-center rounded-full text-white/25 opacity-0 transition-all group-hover:opacity-100 hover:bg-white/10 hover:text-white/60"
          title="Editar localização"
        >
          <Pencil size={11} />
        </button>

        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white/60">
          <MapPin size={18} strokeWidth={1.5} />
        </span>

        <div className="space-y-0.5">
          <p className="text-[0.65rem] uppercase tracking-[3px] text-white/35">
            Localização
          </p>
          <p className="max-w-[160px] truncate text-sm text-white/75">
            {data.mapUrl ? (
              data.mapUrl
            ) : (
              <span className="italic text-white/30">Não configurado</span>
            )}
          </p>
        </div>
      </div>

      <Dialog open={modalOpen} onOpenChange={v => !v && setModalOpen(false)}>
        <DialogContent className="border-white/10 bg-[#18181b] text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white/90">
              Localização no mapa
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4 pt-1">
            <div className="grid gap-1.5">
              <Label className="text-sm text-white/70">
                URL do Google Maps (embed)
              </Label>
              <HttpsUrlSuffixField
                id="mapEmbedUrl"
                value={mapUrlSuffix}
                onChange={setMapUrlSuffix}
                placeholder="maps.google.com/maps?...&output=embed"
              />
              <p className="text-xs text-white/30">
                Cole o caminho após https:// ou a URL completa; o valor é salvo
                com https://.
              </p>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-white/50 hover:bg-white/5 hover:text-white"
                onClick={() => setModalOpen(false)}
                disabled={saving}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                size="sm"
                loading={saving}
                loadingLabel="A guardar…"
                className="border-0 bg-orange-800 text-orange-50 hover:bg-orange-700 disabled:opacity-50"
              >
                Salvar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

function ChannelCard({
  channel,
  onDeleted,
}: {
  channel: Channel
  onDeleted: (id: string) => void
}) {
  const [deleting, setDeleting] = useState(false)
  const Icon = ICON_MAP[channel.iconKey] ?? Link

  async function handleDelete() {
    setDeleting(true)
    try {
      const res = await fetch(`/api/contato/channels/${channel.id}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error()
      onDeleted(channel.id)
      toast.success('Canal removido.')
    } catch {
      toast.error('Erro ao remover canal.')
      setDeleting(false)
    }
  }

  return (
    <div
      className="group relative flex flex-col items-center gap-3 rounded-xl px-4 py-5 text-center"
      style={GLASS}
    >
      <button
        type="button"
        onClick={handleDelete}
        disabled={deleting}
        aria-busy={deleting}
        className="absolute right-2.5 top-2.5 flex h-6 w-6 items-center justify-center rounded-full text-white/25 opacity-0 transition-all group-hover:opacity-100 hover:bg-rose-500/15 hover:text-rose-400 disabled:opacity-40"
        title="Remover canal"
      >
        {deleting ? (
          <Loader2
            size={11}
            className="animate-spin text-rose-400/90"
            aria-hidden
          />
        ) : (
          <Trash2 size={11} />
        )}
      </button>

      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white/60">
        <Icon size={18} strokeWidth={1.5} />
      </span>

      <div className="space-y-0.5">
        <p className="text-[0.65rem] uppercase tracking-[3px] text-white/35">
          {channel.label}
        </p>
        <p className="max-w-[160px] break-all text-sm text-white/75">
          {channel.value}
        </p>
      </div>
    </div>
  )
}

function AddChannelModal({
  open,
  onClose,
  onAdded,
}: {
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
    setLabel('')
    setIconKey('mail')
    setValue('')
    setValueError(null)
    onClose()
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    const parsed = contactChannelPostSchema.safeParse({ label, iconKey, value })
    if (!parsed.success) {
      const msg =
        parsed.error.issues.find(i => i.path[0] === 'value')?.message ??
        parsed.error.issues[0]?.message ??
        'Dados inválidos.'
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
        throw new Error(
          typeof body.error === 'string' ? body.error : 'Erro ao criar canal'
        )
      }
      const created: Channel = await res.json()
      onAdded(created)
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
    Telefone: '+55 62 9 0000-0000',
    WhatsApp: '+55 62 9 0000-0000',
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
      <DialogContent className="border-white/10 bg-[#18181b] text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white/90">
            Novo canal de contato
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSave} className="space-y-4 pt-1">
          <div className="grid gap-1.5">
            <Label className="text-sm text-white/70">Tipo</Label>
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
                    {createElement(Icon, {
                      size: 14,
                      className: 'shrink-0 opacity-70',
                    })}
                    {l}
                  </span>
                )
              }}
              renderValue={l => {
                const t = CONTACT_TYPES.find(x => x.label === l)
                const Icon = t ? (ICON_MAP[t.icon] ?? Link) : Link
                return (
                  <span className="flex min-w-0 flex-1 items-center gap-2">
                    {createElement(Icon, {
                      size: 14,
                      className: 'shrink-0 opacity-70',
                    })}
                    <span className="truncate">{l}</span>
                  </span>
                )
              }}
            />
          </div>

          <div className="grid gap-1.5">
            <Label className="text-sm text-white/70">
              Ícone{' '}
              <span className="font-normal text-white/40">
                (definido pelo tipo)
              </span>
            </Label>
            <div
              className={`flex h-10 w-full items-center gap-2.5 rounded-md border px-3 ${INPUT_CLS} pointer-events-none select-none ${
                label ? 'text-white/85' : 'text-white/35'
              }`}
              aria-readonly
            >
              {label ? (
                <>
                  {createElement(ICON_MAP[iconKey] ?? Link, {
                    size: 16,
                    strokeWidth: 1.6,
                    className: 'shrink-0 text-white/70',
                  })}
                  <span className="truncate text-sm">
                    {ICON_OPTIONS.find(o => o.key === iconKey)?.label ?? iconKey}
                  </span>
                </>
              ) : (
                <span className="text-sm text-white/35">
                  Escolha um tipo para ver o ícone correspondente
                </span>
              )}
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label className="text-sm text-white/70">Descrição</Label>
            <Input
              value={value}
              onChange={e => handleValueChange(e.target.value)}
              placeholder={
                label ? (placeholder[label] ?? '') : 'Preencha o tipo primeiro…'
              }
              className={`${INPUT_CLS} h-10 text-sm ${valueError ? 'border-rose-500/60' : ''}`}
            />
            {valueError && (
              <p className="text-xs text-rose-400">{valueError}</p>
            )}
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-white/50 hover:bg-white/5 hover:text-white"
              onClick={handleClose}
              disabled={saving}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              size="sm"
              loading={saving}
              loadingLabel="A adicionar…"
              disabled={!label}
              className="border-0 bg-orange-800 text-orange-50 hover:bg-orange-700 disabled:opacity-50"
            >
              Adicionar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

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
      const info = await infoRes.json()
      const chs = await channelsRes.json()
      setData(info)
      setChannels(Array.isArray(chs) ? chs : [])
    } catch {
      toast.error('Erro ao carregar informações de contato.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return (
    <>
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-white/90">Contato</h1>
        <p className="mt-0.5 text-sm text-white/40">
          Mapa e canais exibidos na página pública.
        </p>
      </div>

      {loading ? (
        <div className="space-y-8">
          <Skeleton className="h-[140px] w-full max-w-md rounded-xl bg-white/10" />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-[140px] rounded-xl bg-white/10" />
            ))}
          </div>
        </div>
      ) : data ? (
        <div className="space-y-10">
          <section aria-labelledby="contato-mapa-heading">
            <h2
              id="contato-mapa-heading"
              className="mb-4 text-sm font-medium uppercase tracking-[2px] text-white/45"
            >
              Mapa
            </h2>
            <div className="max-w-sm">
              <MapCard data={data} onSaved={setData} />
            </div>
          </section>

          <section aria-labelledby="contato-canais-heading">
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2
                id="contato-canais-heading"
                className="text-sm font-medium uppercase tracking-[2px] text-white/45"
              >
                Canais de contato
              </h2>
              <Button
                type="button"
                size="sm"
                className="shrink-0 gap-1.5 border-0 bg-orange-800 text-orange-50 hover:bg-orange-700"
                onClick={() => setModalOpen(true)}
              >
                <Plus size={14} /> Adicionar canal
              </Button>
            </div>
            {channels.length > 0 ? (
              <div className="grid grid-cols-2 items-start gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {channels.map(ch => (
                  <ChannelCard
                    key={ch.id}
                    channel={ch}
                    onDeleted={id =>
                      setChannels(prev => prev.filter(c => c.id !== id))
                    }
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-white/35">
                Nenhum canal cadastrado. Use &quot;Adicionar canal&quot; para
                incluir e-mail, telefone ou redes sociais.
              </p>
            )}
          </section>
        </div>
      ) : null}

      <AddChannelModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdded={ch => setChannels(prev => [...prev, ch])}
      />
    </>
  )
}
