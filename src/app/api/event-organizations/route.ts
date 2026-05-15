import { NextRequest, NextResponse } from 'next/server'
import { asc } from 'drizzle-orm'

import { db } from '@/lib/db'
import { eventOrganizations } from '@/lib/db/schema'
import { parseEventOrganizationForm } from '@/lib/validation/events-api'
import { validationErrorResponse } from '@/lib/validation/team-api'

export async function GET() {
  try {
    const rows = await db
      .select({
        id: eventOrganizations.id,
        name: eventOrganizations.name,
        createdAt: eventOrganizations.createdAt,
        updatedAt: eventOrganizations.updatedAt,
      })
      .from(eventOrganizations)
      .orderBy(asc(eventOrganizations.name))

    return NextResponse.json(rows)
  } catch (err) {
    console.error('[GET /api/event-organizations]', err)
    return NextResponse.json(
      { error: 'Erro ao buscar organizações' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const fd = await req.formData()
    const parsed = parseEventOrganizationForm(fd)
    if (!parsed.success) return validationErrorResponse(parsed.error)

    const { name } = parsed.data

    const [created] = await db
      .insert(eventOrganizations)
      .values({ name })
      .returning({
        id: eventOrganizations.id,
        name: eventOrganizations.name,
      })

    return NextResponse.json(created, { status: 201 })
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
    console.error('[POST /api/event-organizations]', err)
    return NextResponse.json(
      { error: 'Erro ao criar organização' },
      { status: 500 }
    )
  }
}
