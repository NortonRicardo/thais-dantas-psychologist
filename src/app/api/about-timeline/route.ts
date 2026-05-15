import { NextRequest, NextResponse } from 'next/server'
import { asc } from 'drizzle-orm'
import { parseMonthInputToUtcDate } from '@/lib/about-timeline-date'
import { db } from '@/lib/db'
import { aboutTimelineEntries } from '@/lib/db/schema'
import { parseAboutTimelineForm } from '@/lib/validation/about-timeline-api'
import { validationErrorResponse } from '@/lib/validation/team-api'

export async function GET() {
  try {
    const rows = await db
      .select({
        id: aboutTimelineEntries.id,
        date: aboutTimelineEntries.date,
        title: aboutTimelineEntries.title,
        description: aboutTimelineEntries.description,
        createdAt: aboutTimelineEntries.createdAt,
        updatedAt: aboutTimelineEntries.updatedAt,
      })
      .from(aboutTimelineEntries)
      .orderBy(asc(aboutTimelineEntries.date))

    return NextResponse.json(rows)
  } catch (err) {
    console.error('[GET /api/about-timeline]', err)
    return NextResponse.json(
      { error: 'Erro ao buscar linha do tempo' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const fd = await req.formData()
    const parsed = parseAboutTimelineForm(fd)
    if (!parsed.success) return validationErrorResponse(parsed.error)

    const date = parseMonthInputToUtcDate(parsed.data.date)!
    const { title, description } = parsed.data

    const [created] = await db
      .insert(aboutTimelineEntries)
      .values({
        date,
        title,
        description,
      })
      .returning({
        id: aboutTimelineEntries.id,
        title: aboutTimelineEntries.title,
        date: aboutTimelineEntries.date,
      })

    return NextResponse.json(created, { status: 201 })
  } catch (err) {
    console.error('[POST /api/about-timeline]', err)
    return NextResponse.json({ error: 'Erro ao criar marco' }, { status: 500 })
  }
}
