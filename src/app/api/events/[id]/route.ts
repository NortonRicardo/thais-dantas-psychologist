import { NextRequest, NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import {
  eventOrganizations,
  events,
  teamMembers,
  teamNamePrefixes,
} from '@/lib/db/schema'
import { eventSpeakerDisplayName } from '@/lib/events-speaker-display'
import { parseEventForm } from '@/lib/validation/events-api'
import {
  uuidParamSafeParse,
  validationErrorResponse,
} from '@/lib/validation/team-api'

type Ctx = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Ctx) {
  const { id } = await params
  const idParsed = uuidParamSafeParse(id)
  if (!idParsed.success) return validationErrorResponse(idParsed.error)

  const eventId = idParsed.data
  const [raw] = await db
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
    .where(eq(events.id, eventId))

  if (!raw)
    return NextResponse.json({ error: 'Não encontrado' }, { status: 404 })

  const {
    speakerMemberName,
    speakerPrefixLabel,
    speakerMemberId,
    speakerPhotoMimeType,
    speakerMemberUpdatedAt,
    ...rest
  } = raw

  const row = {
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

  return NextResponse.json({ ...row, hasImage: !!row.imageMimeType })
}

export async function PUT(req: NextRequest, { params }: Ctx) {
  try {
    const { id } = await params
    const idParsed = uuidParamSafeParse(id)
    if (!idParsed.success) return validationErrorResponse(idParsed.error)

    const fd = await req.formData()
    const parsed = parseEventForm(fd)
    if (!parsed.success) return validationErrorResponse(parsed.error)

    const d = parsed.data

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const patch: Record<string, any> = {
      title: d.title,
      description: d.description,
      date: new Date(d.dateRaw),
      type: d.type,
      speakerMemberId: d.speakerMemberId,
      organizationId: d.organizationId,
      link: d.link,
      meetLink: d.meetLink,
      recordingLink: d.recordingLink,
      featured: d.featured,
      updatedAt: new Date(),
    }

    if (fd.get('removeImage') === 'true') {
      patch.image = null
      patch.imageMimeType = null
    }

    const imageFile = fd.get('image') as File | null
    if (imageFile && imageFile.size > 0) {
      patch.image = Buffer.from(await imageFile.arrayBuffer())
      patch.imageMimeType = imageFile.type
    }

    const [updated] = await db
      .update(events)
      .set(patch)
      .where(eq(events.id, idParsed.data))
      .returning({ id: events.id, title: events.title, date: events.date })

    if (!updated)
      return NextResponse.json({ error: 'Não encontrado' }, { status: 404 })
    return NextResponse.json(updated)
  } catch (err) {
    console.error('[PUT /api/events/:id]', err)
    return NextResponse.json(
      { error: 'Erro ao atualizar evento' },
      { status: 500 }
    )
  }
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  try {
    const { id } = await params
    const idParsed = uuidParamSafeParse(id)
    if (!idParsed.success) return validationErrorResponse(idParsed.error)

    const [deleted] = await db
      .delete(events)
      .where(eq(events.id, idParsed.data))
      .returning({ id: events.id })

    if (!deleted) {
      return NextResponse.json({ error: 'Não encontrado' }, { status: 404 })
    }

    return new NextResponse(null, { status: 204 })
  } catch (err) {
    console.error('[DELETE /api/events/:id]', err)
    return NextResponse.json(
      { error: 'Erro ao remover evento' },
      { status: 500 }
    )
  }
}
