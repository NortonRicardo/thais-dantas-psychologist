import { NextRequest, NextResponse } from 'next/server'
import { desc, eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import {
  eventOrganizations,
  events,
  teamMembers,
  teamNamePrefixes,
} from '@/lib/db/schema'
import { eventSpeakerDisplayName } from '@/lib/events-speaker-display'
import { parseEventForm } from '@/lib/validation/events-api'
import { validationErrorResponse } from '@/lib/validation/team-api'

export async function GET() {
  try {
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
        organizationId: events.organizationId,
        organizer: eventOrganizations.name,
        link: events.link,
        meetLink: events.meetLink,
        recordingLink: events.recordingLink,
        featured: events.featured,
        imageMimeType: events.imageMimeType,
        createdAt: events.createdAt,
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

    const rows = raw.map(r => {
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
      }
    })

    return NextResponse.json(rows)
  } catch (err) {
    console.error('[GET /api/events]', err)
    return NextResponse.json(
      { error: 'Erro ao buscar eventos' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const fd = await req.formData()
    const parsed = parseEventForm(fd)
    if (!parsed.success) return validationErrorResponse(parsed.error)

    const d = parsed.data
    const date = new Date(d.dateRaw)

    const imageFile = fd.get('image') as File | null
    let image: Buffer | undefined
    let imageMimeType: string | undefined

    if (imageFile && imageFile.size > 0) {
      image = Buffer.from(await imageFile.arrayBuffer())
      imageMimeType = imageFile.type
    }

    const [created] = await db
      .insert(events)
      .values({
        title: d.title,
        description: d.description,
        date,
        type: d.type,
        speakerMemberId: d.speakerMemberId,
        organizationId: d.organizationId,
        link: d.link,
        meetLink: d.meetLink,
        recordingLink: d.recordingLink,
        featured: d.featured,
        image,
        imageMimeType,
      })
      .returning({ id: events.id, title: events.title, date: events.date })

    return NextResponse.json(created, { status: 201 })
  } catch (err) {
    console.error('[POST /api/events]', err)
    return NextResponse.json({ error: 'Erro ao criar evento' }, { status: 500 })
  }
}
