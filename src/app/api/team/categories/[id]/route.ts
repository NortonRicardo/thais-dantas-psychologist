import { NextRequest, NextResponse } from 'next/server'
import { eq, sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import { teamCategories, teamMembers } from '@/lib/db/schema'

type Ctx = { params: Promise<{ id: string }> }

export async function PUT(req: NextRequest, { params }: Ctx) {
  try {
    const { id } = await params
    const fd = await req.formData()
    const title = (fd.get('title') as string)?.trim()
    const color = (fd.get('color') as string)?.trim()

    if (!title || !color) {
      return NextResponse.json(
        { error: 'Campos obrigatórios faltando' },
        { status: 400 }
      )
    }

    const [updated] = await db
      .update(teamCategories)
      .set({
        title,
        color,
        updatedAt: new Date(),
      })
      .where(eq(teamCategories.id, id))
      .returning({
        id: teamCategories.id,
        title: teamCategories.title,
      })

    if (!updated)
      return NextResponse.json({ error: 'Não encontrado' }, { status: 404 })
    return NextResponse.json(updated)
  } catch (err) {
    console.error('[PUT /api/team/categories/:id]', err)
    return NextResponse.json(
      { error: 'Erro ao atualizar categoria' },
      { status: 500 }
    )
  }
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const { id } = await params

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(teamMembers)
    .where(eq(teamMembers.categoryId, id))

  if (count > 0) {
    return NextResponse.json(
      { error: 'Existem membros nesta categoria. Reatribua-os antes de excluir.' },
      { status: 409 }
    )
  }

  await db.delete(teamCategories).where(eq(teamCategories.id, id))
  return new NextResponse(null, { status: 204 })
}
