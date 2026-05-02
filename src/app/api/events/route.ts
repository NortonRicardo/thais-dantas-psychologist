import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { events } from '@/lib/db/schema'
import { desc } from 'drizzle-orm'

export async function GET() {
  try {
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
        featured: events.featured,
        imageMimeType: events.imageMimeType,
        createdAt: events.createdAt,
        updatedAt: events.updatedAt,
      })
      .from(events)
      .orderBy(desc(events.date))

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
        title,
        description,
        date: new Date(dateRaw),
        type,
        speaker,
        organizer,
        link,
        meetLink,
        featured,
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
