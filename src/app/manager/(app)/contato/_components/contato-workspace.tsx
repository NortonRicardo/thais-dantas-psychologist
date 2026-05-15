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
  X,
  Youtube,
  type LucideIcon,
} from 'lucide-react'
import { toast } from 'sonner'

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { stripUrlScheme, toHttpsStored } from '@/lib/url-https'

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

const CONTACT_TYPES = [
  { label: 'E-mail', icon: 'mail' },
  { label: 'Telefone', icon: 'phone' },
  { label: 'WhatsApp', icon: 'message-circle' },
  { label: 'LinkedIn', icon: 'linkedin' },
  { label: 'Instagram', icon: 'instagram' },
  { label: 'GitHub', icon: 'github' },
  { label: 'YouTube', icon: 'youtube' },
  { label: 'Twitter / X', icon: 'twitter' },
  { label: 'Facebook', icon: 'facebook' },
  { label: 'Site', icon: 'globe' },
  { label: 'Localização', icon: 'map-pin' },
  { label: 'Telegram', icon: 'send' },
  { label: 'Outro', icon: 'link' },
]

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

const URL_LABELS = new Set([
  'LinkedIn',
  'Instagram',
  'GitHub',
  'YouTube',
  'Twitter / X',
  'Facebook',
  'Site',
  'Telegram',
])

function validateValue(label: string, value: string): string | null {
  const v = value.trim()
  if (!v) return 'Campo obrigatório.'

  if (label === 'E-mail') {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
      ? null
      : 'Informe um e-mail válido.'
  }
  if (label === 'Telefone' || label === 'WhatsApp') {
    return v.replace(/\D/g, '').length >= 8
      ? null
      : 'Informe um número válido (ex: (62) 9 0000-0000).'
  }
  if (URL_LABELS.has(label)) {
    return /^https?:\/\/.+/.test(v)
      ? null
      : 'Informe uma URL válida (ex: https://...).'
  }
  return null
}

type ContactData = {
  id: string
  directorTeamMemberId: string | null
  mapUrl: string
}

type TeamMember = {
  id: string
  name: string
  photoMimeType: string | null
  /** false = oculto na equipe pública; ainda pode ser diretor em contatos. */
  active: boolean
}

type Channel = {
  id: string
  label: string
  iconKey: string
  value: string
  sortOrder: number
}

// ─── Team member searchable dropdown ─────────────────────────────────────────

function TeamMemberSearch({
  value,
  onChange,
  teamMembers,
}: {
  value: string
  onChange: (id: string) => void
  teamMembers: TeamMember[]
}) {
  const selected = teamMembers.find(m => m.id === value)
  const [query, setQuery] = useState(selected?.name ?? '')
  const [open, setOpen] = useState(false)

  const filtered = query.trim()
    ? teamMembers.filter(m =>
        m.name.toLowerCase().includes(query.toLowerCase())
      )
    : teamMembers

  function select(m: TeamMember) {
    onChange(m.id)
    setQuery(m.name)
    setOpen(false)
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value)
    setOpen(true)
    if (!e.target.value) onChange('')
  }

  return (
    <div className="relative">
      <Input
        value={query}
        onChange={handleChange}
        onClick={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder="Buscar membro…"
        className={`${INPUT_CLS} h-10 text-sm`}
        autoComplete="off"
      />
      {open && (
        <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-md border border-white/10 bg-[#27272a] shadow-lg">
          <ul
            className="max-h-52 overflow-y-auto p-1"
            onWheel={e => e.stopPropagation()}
          >
            {filtered.length > 0 ? (
              filtered.map(m => (
                <li
                  key={m.id}
                  onMouseDown={() => select(m)}
                  className={`cursor-pointer rounded-sm px-2.5 py-1.5 text-sm transition-colors ${
                    m.id === value
                      ? 'bg-white/15 text-white'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {m.name}
                </li>
              ))
            ) : (
              <li className="px-2.5 py-2 text-sm text-white/35">
                Nenhum membro encontrado.
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  )
}

// ─── Director card ────────────────────────────────────────────────────────────

function DirectorCard({
  data,
  teamMembers,
  membersForPicker,
  onSaved,
}: {
  data: ContactData
  teamMembers: TeamMember[]
  /** Opções da busca (ex.: apenas ativos + diretor atual se inativo). */
  membersForPicker: TeamMember[]
  onSaved: (updated: ContactData) => void
}) {
  const [modalOpen, setModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [selectedId, setSelectedId] = useState<string>(
    data.directorTeamMemberId ?? ''
  )

  function openModal() {
    setSelectedId(data.directorTeamMemberId ?? '')
    setModalOpen(true)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/contato', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          directorTeamMemberId: selectedId || null,
          mapUrl: data.mapUrl,
        }),
      })
      if (!res.ok) throw new Error()
      const updated: ContactData = await res.json()
      onSaved(updated)
      setModalOpen(false)
      toast.success('Diretor atualizado!')
    } catch {
      toast.error('Erro ao salvar.')
    } finally {
      setSaving(false)
    }
  }

  const director = teamMembers.find(m => m.id === data.directorTeamMemberId)
  const photoSrc = director?.photoMimeType
    ? `/api/team/${director.id}/photo`
    : null

  const initials = director
    ? director.name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map(w => w[0].toUpperCase())
        .join('')
    : 'D'

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
          title="Alterar diretor"
        >
          <Pencil size={11} />
        </button>

        <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-white/15 bg-white/10 text-sm font-bold text-white/50">
          {photoSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photoSrc}
              alt={director?.name}
              className="h-full w-full object-cover"
            />
          ) : (
            initials
          )}
        </span>

        <div className="space-y-0.5">
          <p className="text-[0.65rem] uppercase tracking-[3px] text-white/35">
            Diretor
          </p>
          <p className="text-sm font-medium text-white/80">
            {director?.name ?? (
              <span className="italic text-white/30">Não selecionado</span>
            )}
          </p>
        </div>
      </div>

      <Dialog open={modalOpen} onOpenChange={v => !v && setModalOpen(false)}>
        <DialogContent
          className="border-white/10 bg-[#18181b] text-white sm:max-w-sm"
          onOpenAutoFocus={e => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle className="text-white/90">
              Selecionar diretor
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4 pt-1">
            <div className="grid gap-1.5">
              <Label className="text-sm text-white/70">Membro da equipe</Label>
              <TeamMemberSearch
                value={selectedId}
                onChange={setSelectedId}
                teamMembers={membersForPicker}
              />
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
                <X size={13} className="mr-1" /> Cancelar
              </Button>
              <Button
                type="submit"
                size="sm"
                loading={saving}
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

// ─── Map card (fixed) ─────────────────────────────────────────────────────────

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
    setSaving(true)
    try {
      const res = await fetch('/api/contato', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          directorTeamMemberId: data.directorTeamMemberId,
          mapUrl: toHttpsStored(mapUrlSuffix).trim(),
        }),
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

// ─── Channel card ─────────────────────────────────────────────────────────────

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
        className="absolute right-2.5 top-2.5 flex h-6 w-6 items-center justify-center rounded-full text-white/25 opacity-0 transition-all group-hover:opacity-100 hover:bg-rose-500/15 hover:text-rose-400 disabled:opacity-40"
        title="Remover canal"
      >
        <Trash2 size={11} />
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

// ─── Add channel modal ────────────────────────────────────────────────────────

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
    if (valueError) setValueError(validateValue(label, masked))
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
    const err = validateValue(label, value)
    if (err) {
      setValueError(err)
      return
    }
    setSaving(true)
    try {
      const res = await fetch('/api/contato/channels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ label, iconKey, value: value.trim() }),
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
    'E-mail': 'lemm@pucgoias.edu.br',
    Telefone: '+55 62 3946-1000',
    WhatsApp: '+55 62 9 0000-0000',
    LinkedIn: 'https://linkedin.com/company/lemm',
    Instagram: 'https://instagram.com/lemm',
    GitHub: 'https://github.com/lemm',
    YouTube: 'https://youtube.com/@lemm',
    'Twitter / X': 'https://x.com/lemm',
    Facebook: 'https://facebook.com/lemm',
    Site: 'https://lemm.pucgoias.edu.br',
    Telegram: 'https://t.me/lemm',
    Localização: 'Área III — PUC Goiás, Goiânia, GO',
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
            <Select value={label} onValueChange={handleTypeChange}>
              <SelectTrigger className={`${INPUT_CLS} h-10 w-full`}>
                <SelectValue placeholder="Selecione o tipo…" />
              </SelectTrigger>
              <SelectContent className="border-white/10 bg-[#27272a] text-white">
                {CONTACT_TYPES.map(t => {
                  const Icon = ICON_MAP[t.icon] ?? Link
                  return (
                    <SelectItem
                      key={t.label}
                      value={t.label}
                      className="focus:bg-white/10 focus:text-white"
                    >
                      <Icon
                        size={14}
                        className="mr-1.5 inline-block opacity-70"
                      />
                      {t.label}
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
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
                    {ICON_OPTIONS.find(o => o.key === iconKey)?.label ??
                      iconKey}
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

// ─── Root ─────────────────────────────────────────────────────────────────────

export function ContatoWorkspace() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<ContactData | null>(null)
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [channels, setChannels] = useState<Channel[]>([])
  const [modalOpen, setModalOpen] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [infoRes, channelsRes, teamRes] = await Promise.all([
        fetch('/api/contato'),
        fetch('/api/contato/channels'),
        fetch('/api/team'),
      ])
      const info = await infoRes.json()
      const chs = await channelsRes.json()
      const team = await teamRes.json()
      setData(info)
      setChannels(Array.isArray(chs) ? chs : [])
      setTeamMembers(
        Array.isArray(team)
          ? team.map(
              (m: {
                id: string
                name: string
                displayName?: string
                photoMimeType: string | null
                active?: boolean
              }) => ({
                id: m.id,
                name: m.displayName ?? m.name,
                photoMimeType: m.photoMimeType,
                active: m.active !== false,
              })
            )
          : []
      )
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
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white/90">Contato</h1>
          <p className="mt-0.5 text-sm text-white/40">
            Informações do diretor e canais públicos de contato.
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          className="shrink-0 gap-1.5 border-0 bg-orange-800 text-orange-50 hover:bg-orange-700"
          onClick={() => setModalOpen(true)}
          disabled={loading}
        >
          <Plus size={14} /> Contato
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[140px] rounded-xl bg-white/10" />
          ))}
        </div>
      ) : data ? (
        <div className="grid grid-cols-2 items-start gap-4 sm:grid-cols-3 lg:grid-cols-4">
          <DirectorCard
            data={data}
            teamMembers={teamMembers}
            membersForPicker={teamMembers.filter(
              m =>
                m.active ||
                (data.directorTeamMemberId != null &&
                  m.id === data.directorTeamMemberId)
            )}
            onSaved={setData}
          />
          <MapCard data={data} onSaved={setData} />
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
      ) : null}

      <AddChannelModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdded={ch => setChannels(prev => [...prev, ch])}
      />
    </>
  )
}
