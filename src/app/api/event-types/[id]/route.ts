import { NextRequest, NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { eventTypes } from '@/lib/db/schema'

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    const { name, iconKey, color } = body as { name: string; iconKey: string; color: string }

    if (!name?.trim()) {
      return NextResponse.json({ error: 'Nome é obrigatório' }, { status: 400 })
    }

    const [updated] = await db
      .update(eventTypes)
      .set({
        name: name.trim(),
        iconKey: iconKey?.trim() || 'calendar',
        color: color?.trim() || 'bg-blue-500',
        updatedAt: new Date(),
      })
      .where(eq(eventTypes.id, id))
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
    await db.delete(eventTypes).where(eq(eventTypes.id, id))
    return new NextResponse(null, { status: 204 })
  } catch (err) {
    console.error('[DELETE /api/event-types/:id]', err)
    return NextResponse.json({ error: 'Erro ao remover tipo' }, { status: 500 })
  }
}
