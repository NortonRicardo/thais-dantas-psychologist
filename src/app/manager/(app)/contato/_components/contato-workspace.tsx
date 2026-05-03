'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ImageIcon, Pencil, Trash2, Upload, X } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'

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

type ContactData = {
  id: string
  directorName: string
  directorRole: string
  email: string
  phone: string
  linkedin: string
  hasPhoto: boolean
}

// ─── Director panel ───────────────────────────────────────────────────────────

function DirectorPanel({
  data,
  ts,
  onSaved,
}: {
  data: ContactData
  ts: number
  onSaved: (updated: ContactData, newTs: number) => void
}) {
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [name, setName] = useState(data.directorName)
  const [role, setRole] = useState(data.directorRole)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [removePhoto, setRemovePhoto] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  function openEdit() {
    setName(data.directorName)
    setRole(data.directorRole)
    setPhotoFile(null)
    setPhotoPreview(null)
    setRemovePhoto(false)
    setEditing(true)
  }

  function cancelEdit() {
    setEditing(false)
  }

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setPhotoFile(file)
    setRemovePhoto(false)
    setPhotoPreview(URL.createObjectURL(file))
  }

  function handleRemovePhoto() {
    setPhotoFile(null)
    setPhotoPreview(null)
    setRemovePhoto(true)
    if (fileRef.current) fileRef.current.value = ''
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const fd = new FormData()
      fd.append('directorName', name.trim())
      fd.append('directorRole', role.trim())
      fd.append('email', data.email)
      fd.append('phone', data.phone)
      fd.append('linkedin', data.linkedin)
      if (removePhoto) fd.append('removePhoto', 'true')
      if (photoFile) fd.append('photo', photoFile)

      const res = await fetch('/api/contato', { method: 'PUT', body: fd })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(typeof err.error === 'string' ? err.error : 'Erro ao salvar')
      }
      const updated: ContactData = await res.json()
      onSaved(updated, Date.now())
      setEditing(false)
      toast.success('Diretor atualizado!')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao salvar.')
    } finally {
      setSaving(false)
    }
  }

  const photoSrc =
    photoPreview ??
    (data.hasPhoto && !removePhoto ? `/api/contato/photo?t=${ts}` : null)

  const initials = (data.directorName || 'D')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join('')

  return (
    <div className="rounded-xl p-6" style={GLASS}>
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-[0.12em] text-white/40">
          Diretor
        </p>
        {!editing && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 gap-1.5 text-white/50 hover:bg-white/10 hover:text-white"
            onClick={openEdit}
          >
            <Pencil size={13} /> Editar
          </Button>
        )}
      </div>

      {editing ? (
        <form onSubmit={handleSave} className="space-y-5">
          {/* Foto */}
          <div className="flex flex-col items-center">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
            />
            {photoSrc ? (
              <div className="group relative h-36 w-36 overflow-hidden rounded-full border border-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photoSrc} alt="Foto" className="h-full w-full object-cover" />
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
                    onClick={handleRemovePhoto}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-500/20 text-rose-300 transition hover:bg-rose-500/40"
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
                className="flex h-36 w-36 flex-col items-center justify-center gap-2 rounded-full border border-dashed border-white/15 bg-white/[0.02] transition hover:border-white/30 hover:bg-white/[0.05]"
              >
                <ImageIcon size={20} className="text-white/25" />
                <span className="text-xs text-white/40">Enviar foto</span>
              </button>
            )}
          </div>

          {/* Nome */}
          <div className="grid gap-1.5">
            <Label htmlFor="d-name" className="text-white/70 text-sm">Nome</Label>
            <Input
              id="d-name"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Prof. Dr. Nome Sobrenome"
              className={`${INPUT_CLS} h-10 text-sm`}
            />
          </div>

          {/* Cargo */}
          <div className="grid gap-1.5">
            <Label htmlFor="d-role" className="text-white/70 text-sm">Cargo / Título</Label>
            <Input
              id="d-role"
              value={role}
              onChange={e => setRole(e.target.value)}
              placeholder="Diretor"
              className={`${INPUT_CLS} h-10 text-sm`}
            />
          </div>

          <div className="flex justify-end gap-2 border-t border-white/10 pt-4">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-white/50 hover:text-white hover:bg-white/5"
              onClick={cancelEdit}
              disabled={saving}
            >
              <X size={14} className="mr-1" /> Cancelar
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={saving}
              className="bg-orange-800 text-orange-50 hover:bg-orange-700 border-0 disabled:opacity-50"
            >
              {saving ? 'Salvando…' : 'Salvar'}
            </Button>
          </div>
        </form>
      ) : (
        /* Visualização */
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-white/15 bg-white/10 text-2xl font-bold text-white/50">
            {photoSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photoSrc} alt={data.directorName} className="h-full w-full object-cover" />
            ) : (
              initials
            )}
          </div>
          <div>
            <p className="text-base font-semibold text-white/90">
              {data.directorName || <span className="text-white/30 italic">Não informado</span>}
            </p>
            <p className="mt-0.5 text-sm text-white/45">
              {data.directorRole || <span className="italic">—</span>}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Contacts panel ───────────────────────────────────────────────────────────

function ContactsPanel({
  data,
  onSaved,
}: {
  data: ContactData
  onSaved: (updated: ContactData) => void
}) {
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [email, setEmail] = useState(data.email)
  const [phone, setPhone] = useState(data.phone)
  const [linkedin, setLinkedin] = useState(data.linkedin)

  function openEdit() {
    setEmail(data.email)
    setPhone(data.phone)
    setLinkedin(data.linkedin)
    setEditing(true)
  }

  function cancelEdit() {
    setEditing(false)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const fd = new FormData()
      fd.append('directorName', data.directorName)
      fd.append('directorRole', data.directorRole)
      fd.append('email', email.trim())
      fd.append('phone', phone.trim())
      fd.append('linkedin', linkedin.trim())

      const res = await fetch('/api/contato', { method: 'PUT', body: fd })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(typeof err.error === 'string' ? err.error : 'Erro ao salvar')
      }
      const updated: ContactData = await res.json()
      onSaved(updated)
      setEditing(false)
      toast.success('Contatos atualizados!')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao salvar.')
    } finally {
      setSaving(false)
    }
  }

  const rows = [
    { label: 'E-mail', value: data.email },
    { label: 'Telefone', value: data.phone },
    { label: 'LinkedIn', value: data.linkedin },
  ]

  return (
    <div className="rounded-xl p-6" style={GLASS}>
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-[0.12em] text-white/40">
          Canais de Contato
        </p>
        {!editing && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 gap-1.5 text-white/50 hover:bg-white/10 hover:text-white"
            onClick={openEdit}
          >
            <Pencil size={13} /> Editar
          </Button>
        )}
      </div>

      {editing ? (
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid gap-1.5">
            <Label htmlFor="c-email" className="text-white/70 text-sm">E-mail</Label>
            <Input
              id="c-email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="lemm@pucgoias.edu.br"
              className={`${INPUT_CLS} h-10 text-sm`}
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="c-phone" className="text-white/70 text-sm">Telefone</Label>
            <Input
              id="c-phone"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="+55 (62) 3946-1000"
              className={`${INPUT_CLS} h-10 text-sm`}
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="c-linkedin" className="text-white/70 text-sm">LinkedIn (URL)</Label>
            <Input
              id="c-linkedin"
              value={linkedin}
              onChange={e => setLinkedin(e.target.value)}
              placeholder="https://linkedin.com/company/lemm"
              className={`${INPUT_CLS} h-10 text-sm`}
            />
          </div>

          <div className="flex justify-end gap-2 border-t border-white/10 pt-4">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-white/50 hover:text-white hover:bg-white/5"
              onClick={cancelEdit}
              disabled={saving}
            >
              <X size={14} className="mr-1" /> Cancelar
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={saving}
              className="bg-orange-800 text-orange-50 hover:bg-orange-700 border-0 disabled:opacity-50"
            >
              {saving ? 'Salvando…' : 'Salvar'}
            </Button>
          </div>
        </form>
      ) : (
        /* Visualização */
        <div className="space-y-4">
          {rows.map(({ label, value }) => (
            <div key={label} className="space-y-0.5">
              <p className="text-[0.65rem] uppercase tracking-[0.12em] text-white/35">
                {label}
              </p>
              <p className="text-sm text-white/80 break-all">
                {value || <span className="italic text-white/25">Não informado</span>}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export function ContatoWorkspace() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<ContactData | null>(null)
  const [ts, setTs] = useState(() => Date.now())

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/contato')
      const json = await res.json()
      setData(json)
      if (json.hasPhoto) setTs(Date.now())
    } catch {
      toast.error('Erro ao carregar informações de contato.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  if (loading) {
    return (
      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-64 rounded-xl bg-white/10" />
        <Skeleton className="h-64 rounded-xl bg-white/10" />
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <DirectorPanel
        data={data}
        ts={ts}
        onSaved={(updated, newTs) => {
          setData(updated)
          setTs(newTs)
        }}
      />
      <ContactsPanel
        data={data}
        onSaved={updated => setData(updated)}
      />
    </div>
  )
}
