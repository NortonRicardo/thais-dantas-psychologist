import { NextRequest, NextResponse } from 'next/server'
import { asc } from 'drizzle-orm'
import { db } from '@/lib/db'
import { eventTypes } from '@/lib/db/schema'

export async function GET() {
  try {
    const rows = await db
      .select()
      .from(eventTypes)
      .orderBy(asc(eventTypes.name))
    return NextResponse.json(rows)
  } catch (err) {
    console.error('[GET /api/event-types]', err)
    return NextResponse.json({ error: 'Erro ao buscar tipos' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, iconKey, color } = body as { name: string; iconKey: string; color: string }

    if (!name?.trim()) {
      return NextResponse.json({ error: 'Nome é obrigatório' }, { status: 400 })
    }

    const [created] = await db
      .insert(eventTypes)
      .values({
        name: name.trim(),
        iconKey: iconKey?.trim() || 'calendar',
        color: color?.trim() || 'bg-blue-500',
      })
      .returning()

    return NextResponse.json(created, { status: 201 })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : ''
    if (msg.includes('unique') || msg.includes('duplicate')) {
      return NextResponse.json({ error: 'Já existe um tipo com este nome' }, { status: 409 })
    }
    console.error('[POST /api/event-types]', err)
    return NextResponse.json({ error: 'Erro ao criar tipo' }, { status: 500 })
  }
}
