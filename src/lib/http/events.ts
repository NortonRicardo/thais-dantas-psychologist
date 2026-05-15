import 'server-only'
import { asc, desc } from 'drizzle-orm'
import { db } from '@/lib/db'
import { eventTypes, events } from '@/lib/db/schema'

export type PublicEventTypeData = {
  name: string
  color: string
}

export async function getPublicEventTypes(): Promise<PublicEventTypeData[]> {
  const rows = await db
    .select({ name: eventTypes.name, color: eventTypes.color })
    .from(eventTypes)
    .orderBy(asc(eventTypes.name))
  return rows
}

export type PublicEventData = {
  id: string
  title: string
  description: string
  date: string
  type: string
  speaker: string | null
  organizer: string | null
  link: string | null
  meetLink: string | null
  recordingLink: string | null
  featured: boolean
  imageMimeType: string | null
  updatedAt: string
}

export async function getPublicEvents(): Promise<PublicEventData[]> {
  const rows = await db
    .select({
      id: events.id,
      title: events.title,
      description: events.description,
      date: events.date,
      type: events.type,
      speaker: events.speaker,
      organizer: events.organizer,
      link: events.link,
      meetLink: events.meetLink,
      recordingLink: events.recordingLink,
      featured: events.featured,
      imageMimeType: events.imageMimeType,
      updatedAt: events.updatedAt,
    })
    .from(events)
    .orderBy(desc(events.date))

  return rows.map(r => ({
    ...r,
    date: r.date.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  }))
}
