import {
  ArrowRight,
  Facebook,
  Github,
  Globe,
  Instagram,
  Link,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  Twitter,
  Youtube,
  type LucideIcon,
} from 'lucide-react'
import { unstable_cache } from 'next/cache'
import { asc, eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { contactChannels, contactInfo } from '@/lib/db/schema'

import { MapIframe } from './map-iframe'

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

function getHref(label: string, value: string): string {
  const l = label.toLowerCase()
  if (l === 'e-mail') return `mailto:${value}`
  if (l === 'telefone') return `tel:${value.replace(/\D/g, '')}`
  if (l === 'whatsapp') return `https://wa.me/${value.replace(/\D/g, '')}`
  return value.startsWith('http') ? value : `https://${value}`
}

const getData = unstable_cache(
  async () => {
    const infoRows = await db
      .select({
        id: contactInfo.id,
        mapUrl: contactInfo.mapUrl,
      })
      .from(contactInfo)
      .limit(1)

    const info = infoRows[0] ?? null

    const channels = info
      ? await db
          .select()
          .from(contactChannels)
          .where(eq(contactChannels.contactInfoId, info.id))
          .orderBy(
            asc(contactChannels.sortOrder),
            asc(contactChannels.createdAt)
          )
      : []

    return { info, channels }
  },
  ['contato-data'],
  { tags: ['contato'] }
)

export async function ContatoSection() {
  const { info, channels } = await getData()

  const mapUrl = info?.mapUrl?.trim() || null

  return (
    <>
      {/* ── HEADER ROW ── mesma estrutura do Blog & Reflexões ─────────── */}
      <div className="flex items-center justify-between border-b border-white/15 pb-5 pt-14">
        <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/50">
          Contato
        </span>
        <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-white/35">
          Online &amp; Presencial
        </span>
      </div>

      {/* ── HEADING ─────────────────────────────────────────────────────── */}
      <div className="py-12">
        <h1 className="font-[family-name:var(--font-cormorant)] text-[clamp(3.2rem,7vw,6.5rem)] font-light leading-[1.02] text-white">
          Fale<br />
          <em className="italic text-white/45">comigo.</em>
        </h1>
        <p className="mt-6 max-w-md text-[13px] leading-relaxed text-white/50">
          Escolha o canal de sua preferência para agendar uma consulta ou tirar dúvidas — responderei em breve.
        </p>
      </div>

      {/* ── GRID ─── mesma estrutura dos artigos do blog ────────────────── */}
      <div className="mt-auto grid flex-1 grid-cols-1 gap-px border-t border-white/15 sm:grid-cols-[2fr_1fr]">

        {/* Channels */}
        <div className="flex flex-col py-8 sm:pr-10">
          {channels.length === 0 ? (
            <p className="text-[13px] text-white/35">Nenhum canal cadastrado ainda.</p>
          ) : (
            <ul className="list-none p-0">
              {channels.map(ch => {
                const Icon = ICON_MAP[ch.iconKey] ?? Link
                const href = getHref(ch.label, ch.value)
                return (
                  <li key={ch.id} className="border-b border-white/10 last:border-b-0">
                    <a
                      href={href}
                      target={href.startsWith('http') ? '_blank' : undefined}
                      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="group flex items-center gap-4 py-5 transition-opacity hover:opacity-60"
                    >
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-white/20 text-white/60">
                        <Icon size={13} strokeWidth={1.5} />
                      </span>
                      <span className="w-20 shrink-0 text-[9px] font-semibold uppercase tracking-[0.28em] text-white/35">
                        {ch.label}
                      </span>
                      <div className="h-px flex-1 bg-white/10" />
                      <span className="text-[13px] text-white/75">{ch.value}</span>
                      <ArrowRight
                        className="size-3 shrink-0 text-white/25 transition-transform group-hover:translate-x-0.5"
                        strokeWidth={1.5}
                      />
                    </a>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {/* Location */}
        <div className="flex flex-col gap-6 py-8 sm:border-l sm:border-white/15 sm:px-8">
          <div>
            <span className="text-[9px] font-semibold uppercase tracking-[0.3em] text-white/35">
              Localização
            </span>
            <p className="mt-4 font-[family-name:var(--font-cormorant)] text-xl font-light leading-snug text-white">
              PUC Goiás
            </p>
            <p className="mt-2 text-[12px] leading-relaxed text-white/45">
              Av. Universitária, 1440<br />
              Setor Universitário<br />
              Goiânia – GO
            </p>
          </div>

          <div className="overflow-hidden rounded-sm opacity-80">
            <MapIframe
              src={
                mapUrl ??
                'https://maps.google.com/maps?q=-16.6784792,-49.2453736&z=17&output=embed'
              }
              className="h-44"
            />
          </div>

          <div className="mt-auto flex items-center gap-3 border-t border-white/10 pt-5">
            <MapPin className="size-3 text-white/25" strokeWidth={1.5} />
            <span className="text-[10px] text-white/35">Atendimento presencial e online</span>
          </div>
        </div>
      </div>
    </>
  )
}
