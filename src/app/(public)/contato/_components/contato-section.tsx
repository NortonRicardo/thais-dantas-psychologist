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
  if (l === 'telefone' || l === 'whatsapp') return `tel:${value.replace(/\D/g, '')}`
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
          .orderBy(asc(contactChannels.sortOrder), asc(contactChannels.createdAt))
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
    <div className="mt-10 flex flex-col gap-10">
      <section aria-label="Localização">
        <div className="overflow-hidden rounded-lg border border-neutral-200">
          <MapIframe
            src={
              mapUrl ??
              'https://maps.google.com/maps?q=-16.6784792,-49.2453736&z=17&output=embed'
            }
          />
        </div>
      </section>

      {channels.length > 0 && (
        <section aria-label="Canais de contato">
          <ul className="grid list-none gap-4 p-0 sm:grid-cols-2">
            {channels.map(ch => {
              const Icon = ICON_MAP[ch.iconKey] ?? Link
              const href = getHref(ch.label, ch.value)
              return (
                <li key={ch.id}>
                  <a
                    href={href}
                    target={href.startsWith('http') ? '_blank' : undefined}
                    rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="flex h-full flex-col gap-3 rounded-lg border border-neutral-200 p-5 transition-colors hover:border-neutral-300 hover:bg-neutral-50"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 text-neutral-700">
                      <Icon size={18} strokeWidth={1.5} />
                    </span>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                        {ch.label}
                      </p>
                      <p className="mt-1 break-all text-sm text-neutral-900">
                        {ch.value}
                      </p>
                    </div>
                  </a>
                </li>
              )
            })}
          </ul>
        </section>
      )}
    </div>
  )
}
