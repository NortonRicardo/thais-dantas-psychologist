import { NextRequest, NextResponse } from 'next/server'
import { eq, sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import { teamDegreeLevels, teamMembers } from '@/lib/db/schema'

type Ctx = { params: Promise<{ id: string }> }

export async function PUT(req: NextRequest, { params }: Ctx) {
  try {
    const { id } = await params
    const fd = await req.formData()
    const label = (fd.get('label') as string)?.trim()
    if (!label) {
      return NextResponse.json({ error: 'Rótulo obrigatório' }, { status: 400 })
    }

    const [updated] = await db
      .update(teamDegreeLevels)
      .set({ label, updatedAt: new Date() })
      .where(eq(teamDegreeLevels.id, id))
      .returning({ id: teamDegreeLevels.id, label: teamDegreeLevels.label })

    if (!updated) return NextResponse.json({ error: 'Não encontrado' }, { status: 404 })
    return NextResponse.json(updated)
  } catch (err: unknown) {
    const code = err && typeof err === 'object' && 'code' in err ? (err as { code: string }).code : ''
    if (code === '23505') {
      return NextResponse.json({ error: 'Já existe um grau com este texto.' }, { status: 409 })
    }
    console.error('[PUT /api/team/degree-levels/:id]', err)
    return NextResponse.json({ error: 'Erro ao atualizar grau' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const { id } = await params

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(teamMembers)
    .where(eq(teamMembers.degreeLevelId, id))

  if (count > 0) {
    return NextResponse.json(
      { error: 'Existem membros usando este grau. Reatribua ou remova antes de excluir.' },
      { status: 409 }
    )
  }

  await db.delete(teamDegreeLevels).where(eq(teamDegreeLevels.id, id))
  return new NextResponse(null, { status: 204 })
}
