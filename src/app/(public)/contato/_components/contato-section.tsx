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
  Phone,
  Send,
  Twitter,
  Youtube,
  type LucideIcon,
} from 'lucide-react'
import { MapIframe } from './map-iframe'
import { unstable_cache } from 'next/cache'
import { asc, eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { contactChannels, contactInfo, teamMembers, teamNamePrefixes } from '@/lib/db/schema'
import { teamMemberDisplayName } from '@/lib/team-member-display'

const glassStyle = {
  background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0))',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  borderRadius: '20px',
  border: '1px solid rgba(255,255,255,0.18)',
  boxShadow: '0 8px 32px 0 rgba(0,0,0,0.37)',
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

function getHref(label: string, value: string): string {
  const l = label.toLowerCase()
  if (l === 'e-mail') return `mailto:${value}`
  if (l === 'telefone' || l === 'whatsapp') return `tel:${value.replace(/\D/g, '')}`
  return value.startsWith('http') ? value : `https://${value}`
}

const getData = unstable_cache(
  async () => {
  const infoRows = await db
    .select({
      id: contactInfo.id,
      directorTeamMemberId: contactInfo.directorTeamMemberId,
      mapUrl: contactInfo.mapUrl,
    })
    .from(contactInfo)
    .limit(1)

  const info = infoRows[0] ?? null

  const [channels, director] = await Promise.all([
    info
      ? db
          .select()
          .from(contactChannels)
          .where(eq(contactChannels.contactInfoId, info.id))
          .orderBy(asc(contactChannels.sortOrder), asc(contactChannels.createdAt))
      : Promise.resolve([]),

    info?.directorTeamMemberId
      ? db
          .select({
            name: teamMembers.name,
            namePrefixLabel: teamNamePrefixes.label,
            photo: teamMembers.photo,
            photoMimeType: teamMembers.photoMimeType,
          })
          .from(teamMembers)
          .leftJoin(teamNamePrefixes, eq(teamMembers.namePrefixId, teamNamePrefixes.id))
          .where(eq(teamMembers.id, info.directorTeamMemberId))
          .limit(1)
          .then(rows => rows[0] ?? null)
      : Promise.resolve(null),
  ])

  return { info, channels, director }
  },
  ['contato-data'],
  { tags: ['contato'] }
)

export async function ContatoSection() {
  const { info, channels, director } = await getData()

  const mapUrl = info?.mapUrl?.trim() || null
  const showDirector = !!director

  let photoSrc: string | null = null
  if (director?.photo && director.photoMimeType) {
    const b64 = Buffer.from(director.photo as unknown as ArrayBuffer).toString('base64')
    photoSrc = `data:${director.photoMimeType};base64,${b64}`
  }

  const directorDisplay =
    director != null
      ? teamMemberDisplayName(director.name, director.namePrefixLabel)
      : null

  const initials = directorDisplay
    ? directorDisplay.split(' ').filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join('')
    : null

  const totalCards = (showDirector ? 1 : 0) + channels.length
  const gridCols =
    totalCards <= 1 ? '' :
    totalCards === 2 ? 'sm:grid-cols-2' :
    totalCards === 3 ? 'sm:grid-cols-2 lg:grid-cols-3' :
    'sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4'

  return (
    <div className="mt-6 flex w-full flex-col items-center">
      {/* Mapa */}
      <div className="w-full overflow-hidden rounded-xl border border-white/10">
        <MapIframe
          src={mapUrl ?? 'https://maps.google.com/maps?q=-16.6784792,-49.2453736&z=17&output=embed'}
        />
      </div>

      {totalCards > 0 && (
        <div className={`mt-4 grid w-full max-w-5xl grid-cols-1 gap-4 ${gridCols}`}>
          {showDirector && (
            <div className="flex flex-col items-center gap-3 px-4 py-7 text-center" style={glassStyle}>
              <span className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-white/15 bg-white/10 text-xl font-bold text-white/60">
                {photoSrc ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={photoSrc} alt={directorDisplay ?? ''} className="h-full w-full object-cover" />
                ) : (
                  initials ?? '?'
                )}
              </span>
              <span className="text-[0.65rem] uppercase tracking-[3px] text-white/40">Diretor</span>
              <span className="text-sm font-medium leading-snug text-white/80">{directorDisplay}</span>
            </div>
          )}

          {channels.map(ch => {
            const Icon = ICON_MAP[ch.iconKey] ?? Link
            const href = getHref(ch.label, ch.value)
            return (
              <a
                key={ch.id}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="group flex flex-col items-center gap-3 px-4 py-7 text-center transition-colors"
                style={glassStyle}
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors group-hover:bg-white/15">
                  <Icon size={20} strokeWidth={1.5} />
                </span>
                <span className="text-[0.65rem] uppercase tracking-[3px] text-white/40">{ch.label}</span>
                <span className="break-all text-sm leading-snug text-white/70 transition-colors group-hover:text-white/90">
                  {ch.value}
                </span>
              </a>
            )
          })}
        </div>
      )}
    </div>
  )
}
