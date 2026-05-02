import { NextRequest, NextResponse } from 'next/server'
import { parseMonthInputToUtcDate } from '@/lib/about-timeline-date'
import { db } from '@/lib/db'
import { aboutTimelineEntries } from '@/lib/db/schema'
import { asc } from 'drizzle-orm'

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

    const monthRaw = (fd.get('date') as string)?.trim()
    const title = (fd.get('title') as string)?.trim()
    const description = (fd.get('description') as string)?.trim()

    const date = parseMonthInputToUtcDate(monthRaw ?? '')
    if (!date || !title || !description) {
      return NextResponse.json(
        {
          error: 'Campos obrigatórios faltando ou data inválida (use mês/ano).',
        },
        { status: 400 }
      )
    }

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
