import { NextRequest, NextResponse } from 'next/server'
import { eq, sql } from 'drizzle-orm'

import { db } from '@/lib/db'
import { events, eventOrganizations } from '@/lib/db/schema'
import { parseEventOrganizationForm } from '@/lib/validation/events-api'
import {
  uuidParamSafeParse,
  validationErrorResponse,
} from '@/lib/validation/team-api'

type Ctx = { params: Promise<{ id: string }> }

export async function PUT(req: NextRequest, { params }: Ctx) {
  try {
    const { id } = await params
    const idParsed = uuidParamSafeParse(id)
    if (!idParsed.success) return validationErrorResponse(idParsed.error)

    const orgId = idParsed.data

    const fd = await req.formData()
    const parsed = parseEventOrganizationForm(fd)
    if (!parsed.success) return validationErrorResponse(parsed.error)

    const { name } = parsed.data

    const [updated] = await db
      .update(eventOrganizations)
      .set({ name, updatedAt: new Date() })
      .where(eq(eventOrganizations.id, orgId))
      .returning({
        id: eventOrganizations.id,
        name: eventOrganizations.name,
      })

    if (!updated)
      return NextResponse.json({ error: 'Não encontrado' }, { status: 404 })
    return NextResponse.json(updated)
  } catch (err: unknown) {
    const code =
      err && typeof err === 'object' && 'code' in err
        ? (err as { code: string }).code
        : ''
    if (code === '23505') {
      return NextResponse.json(
        { error: 'Já existe uma organização com este nome.' },
        { status: 409 }
      )
    }
    console.error('[PUT /api/event-organizations/:id]', err)
    return NextResponse.json(
      { error: 'Erro ao atualizar organização' },
      { status: 500 }
    )
  }
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  try {
    const { id } = await params
    const idParsed = uuidParamSafeParse(id)
    if (!idParsed.success) return validationErrorResponse(idParsed.error)

    const orgId = idParsed.data

    const [row] = await db
      .select({ id: eventOrganizations.id })
      .from(eventOrganizations)
      .where(eq(eventOrganizations.id, orgId))
      .limit(1)

    if (!row) {
      return NextResponse.json({ error: 'Não encontrado' }, { status: 404 })
    }

    const [{ c }] = await db
      .select({ c: sql<number>`count(*)::int` })
      .from(events)
      .where(eq(events.organizationId, orgId))

    if (Number(c) > 0) {
      return NextResponse.json(
        {
          error:
            'Não é possível excluir: há eventos vinculados a esta organização. Altere ou remova esses eventos antes.',
        },
        { status: 409 }
      )
    }

    await db.delete(eventOrganizations).where(eq(eventOrganizations.id, orgId))
    return new NextResponse(null, { status: 204 })
  } catch (err) {
    console.error('[DELETE /api/event-organizations/:id]', err)
    return NextResponse.json(
      { error: 'Erro ao remover organização' },
      { status: 500 }
    )
  }
}
