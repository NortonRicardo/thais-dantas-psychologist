import 'server-only'
import { asc } from 'drizzle-orm'
import { db } from '@/lib/db'
import { aboutTimelineEntries } from '@/lib/db/schema'

export type PublicTimelineEntry = {
  id: string
  date: string
  title: string
  description: string
  updatedAt: string
}

export async function getPublicAboutTimeline(): Promise<PublicTimelineEntry[]> {
  const rows = await db
    .select({
      id: aboutTimelineEntries.id,
      date: aboutTimelineEntries.date,
      title: aboutTimelineEntries.title,
      description: aboutTimelineEntries.description,
      updatedAt: aboutTimelineEntries.updatedAt,
    })
    .from(aboutTimelineEntries)
    .orderBy(asc(aboutTimelineEntries.date))

  return rows.map(r => ({
    ...r,
    date: r.date.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  }))
}
