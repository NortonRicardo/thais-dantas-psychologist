import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { events } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

type Ctx = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Ctx) {
  const { id } = await params
  const [row] = await db
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
      featured: events.featured,
      imageMimeType: events.imageMimeType,
      createdAt: events.createdAt,
      updatedAt: events.updatedAt,
    })
    .from(events)
    .where(eq(events.id, id))

  if (!row)
    return NextResponse.json({ error: 'Não encontrado' }, { status: 404 })
  return NextResponse.json({ ...row, hasImage: !!row.imageMimeType })
}

export async function PUT(req: NextRequest, { params }: Ctx) {
  try {
    const { id } = await params
    const fd = await req.formData()

    const title = (fd.get('title') as string)?.trim()
    const description = (fd.get('description') as string)?.trim()
    const dateRaw = fd.get('date') as string
    const type = (fd.get('type') as string)?.trim()

    if (!title || !description || !dateRaw || !type) {
      return NextResponse.json(
        { error: 'Campos obrigatórios faltando' },
        { status: 400 }
      )
    }

    const speaker = (fd.get('speaker') as string) || null
    const organizer = (fd.get('organizer') as string) || null
    const link = (fd.get('link') as string) || null
    const meetLink = (fd.get('meetLink') as string) || null
    const featured = fd.get('featured') === 'true'

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const patch: Record<string, any> = {
      title,
      description,
      date: new Date(dateRaw),
      type,
      speaker,
      organizer,
      link,
      meetLink,
      featured,
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
      .where(eq(events.id, id))
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
  const { id } = await params
  await db.delete(events).where(eq(events.id, id))
  return new NextResponse(null, { status: 204 })
}
