import 'server-only'
import { asc, desc, eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import {
  eventOrganizations,
  eventTypes,
  events,
  teamMembers,
  teamNamePrefixes,
} from '@/lib/db/schema'
import { eventSpeakerDisplayName } from '@/lib/events-speaker-display'

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
  speakerMemberId: string | null
  speakerPhotoMimeType: string | null
  /** Para cache-bust da foto `/api/team/:id/photo` */
  speakerMemberUpdatedAt: string | null
  /** Nome da organização (via FK) */
  organizer: string | null
  link: string | null
  meetLink: string | null
  recordingLink: string | null
  featured: boolean
  imageMimeType: string | null
  updatedAt: string
}

export async function getPublicEvents(): Promise<PublicEventData[]> {
  const raw = await db
    .select({
      id: events.id,
      title: events.title,
      description: events.description,
      date: events.date,
      type: events.type,
      speakerMemberId: events.speakerMemberId,
      speakerMemberName: teamMembers.name,
      speakerPrefixLabel: teamNamePrefixes.label,
      speakerPhotoMimeType: teamMembers.photoMimeType,
      speakerMemberUpdatedAt: teamMembers.updatedAt,
      organizer: eventOrganizations.name,
      link: events.link,
      meetLink: events.meetLink,
      recordingLink: events.recordingLink,
      featured: events.featured,
      imageMimeType: events.imageMimeType,
      updatedAt: events.updatedAt,
    })
    .from(events)
    .leftJoin(
      eventOrganizations,
      eq(events.organizationId, eventOrganizations.id)
    )
    .leftJoin(teamMembers, eq(events.speakerMemberId, teamMembers.id))
    .leftJoin(
      teamNamePrefixes,
      eq(teamMembers.namePrefixId, teamNamePrefixes.id)
    )
    .orderBy(desc(events.date), desc(events.createdAt))

  return raw.map(r => {
    const {
      speakerMemberName,
      speakerPrefixLabel,
      speakerMemberId,
      speakerPhotoMimeType,
      speakerMemberUpdatedAt,
      ...rest
    } = r
    return {
      ...rest,
      speakerMemberId,
      speakerPhotoMimeType,
      speakerMemberUpdatedAt: speakerMemberUpdatedAt
        ? speakerMemberUpdatedAt.toISOString()
        : null,
      speaker: eventSpeakerDisplayName({
        speakerMemberName,
        speakerPrefixLabel,
      }),
      date: r.date.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    }
  })
}
