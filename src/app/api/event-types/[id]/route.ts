import { NextRequest, NextResponse } from 'next/server'
import { eq, sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import { events, eventTypes } from '@/lib/db/schema'
import { eventTypeUpsertSchema } from '@/lib/validation/events-api'
import {
  validationErrorResponse,
  uuidParamSafeParse,
} from '@/lib/validation/team-api'

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const idParsed = uuidParamSafeParse(id)
    if (!idParsed.success) return validationErrorResponse(idParsed.error)

    const raw = await req.json()
    const parsed = eventTypeUpsertSchema.safeParse(raw)
    if (!parsed.success) return validationErrorResponse(parsed.error)

    const { name, iconKey, color } = parsed.data

    const eventTypeId = idParsed.data

    const [updated] = await db
      .update(eventTypes)
      .set({
        name,
        iconKey,
        color,
        updatedAt: new Date(),
      })
      .where(eq(eventTypes.id, eventTypeId))
      .returning()

    if (!updated) {
      return NextResponse.json({ error: 'Tipo não encontrado' }, { status: 404 })
    }

    return NextResponse.json(updated)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : ''
    if (msg.includes('unique') || msg.includes('duplicate')) {
      return NextResponse.json({ error: 'Já existe um tipo com este nome' }, { status: 409 })
    }
    console.error('[PUT /api/event-types/:id]', err)
    return NextResponse.json({ error: 'Erro ao atualizar tipo' }, { status: 500 })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const idParsed = uuidParamSafeParse(id)
    if (!idParsed.success) return validationErrorResponse(idParsed.error)

    const eventTypeId = idParsed.data

    const [row] = await db
      .select({ id: eventTypes.id, name: eventTypes.name })
      .from(eventTypes)
      .where(eq(eventTypes.id, eventTypeId))
      .limit(1)

    if (!row) {
      return NextResponse.json({ error: 'Tipo não encontrado' }, { status: 404 })
    }

    const [{ c }] = await db
      .select({ c: sql<number>`count(*)::int` })
      .from(events)
      .where(eq(events.type, row.name))

    if (Number(c) > 0) {
      return NextResponse.json(
        {
          error:
            'Não é possível excluir: existem eventos cadastrados com este tipo. Edite ou remova esses eventos antes.',
        },
        { status: 409 }
      )
    }

    await db.delete(eventTypes).where(eq(eventTypes.id, eventTypeId))
    return new NextResponse(null, { status: 204 })
  } catch (err) {
    console.error('[DELETE /api/event-types/:id]', err)
    return NextResponse.json({ error: 'Erro ao remover tipo' }, { status: 500 })
  }
}
