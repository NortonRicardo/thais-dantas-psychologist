import { NextRequest, NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { parseMonthInputToUtcDate } from '@/lib/about-timeline-date'
import { db } from '@/lib/db'
import { aboutTimelineEntries } from '@/lib/db/schema'
import { parseAboutTimelineForm } from '@/lib/validation/about-timeline-api'
import {
  validationErrorResponse,
  uuidParamSafeParse,
} from '@/lib/validation/team-api'

type Ctx = { params: Promise<{ id: string }> }

export async function PUT(req: NextRequest, { params }: Ctx) {
  try {
    const { id } = await params
    const idParsed = uuidParamSafeParse(id)
    if (!idParsed.success) return validationErrorResponse(idParsed.error)

    const fd = await req.formData()
    const parsed = parseAboutTimelineForm(fd)
    if (!parsed.success) return validationErrorResponse(parsed.error)

    const date = parseMonthInputToUtcDate(parsed.data.date)!
    const { title, description } = parsed.data

    const [updated] = await db
      .update(aboutTimelineEntries)
      .set({
        date,
        title,
        description,
        updatedAt: new Date(),
      })
      .where(eq(aboutTimelineEntries.id, id))
      .returning({
        id: aboutTimelineEntries.id,
        title: aboutTimelineEntries.title,
        date: aboutTimelineEntries.date,
      })

    if (!updated)
      return NextResponse.json({ error: 'Não encontrado' }, { status: 404 })
    return NextResponse.json(updated)
  } catch (err) {
    console.error('[PUT /api/about-timeline/:id]', err)
    return NextResponse.json(
      { error: 'Erro ao atualizar marco' },
      { status: 500 }
    )
  }
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  try {
    const { id } = await params
    const idParsed = uuidParamSafeParse(id)
    if (!idParsed.success) return validationErrorResponse(idParsed.error)

    const deleted = await db
      .delete(aboutTimelineEntries)
      .where(eq(aboutTimelineEntries.id, id))
      .returning({ id: aboutTimelineEntries.id })

    if (deleted.length === 0) {
      return NextResponse.json({ error: 'Não encontrado' }, { status: 404 })
    }

    return new NextResponse(null, { status: 204 })
  } catch (err) {
    console.error('[DELETE /api/about-timeline/:id]', err)
    return NextResponse.json(
      { error: 'Erro ao remover marco' },
      { status: 500 }
    )
  }
}
