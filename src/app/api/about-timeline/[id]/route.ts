import { NextRequest, NextResponse } from 'next/server'
import { parseMonthInputToUtcDate } from '@/lib/about-timeline-date'
import { db } from '@/lib/db'
import { aboutTimelineEntries } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

type Ctx = { params: Promise<{ id: string }> }

export async function PUT(req: NextRequest, { params }: Ctx) {
  try {
    const { id } = await params
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
  const { id } = await params
  await db.delete(aboutTimelineEntries).where(eq(aboutTimelineEntries.id, id))
  return new NextResponse(null, { status: 204 })
}
