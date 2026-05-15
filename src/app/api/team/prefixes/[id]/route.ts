import { NextRequest, NextResponse } from 'next/server'
import { eq, sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import { teamMembers, teamNamePrefixes } from '@/lib/db/schema'

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
      .update(teamNamePrefixes)
      .set({ label, updatedAt: new Date() })
      .where(eq(teamNamePrefixes.id, id))
      .returning({ id: teamNamePrefixes.id, label: teamNamePrefixes.label })

    if (!updated) return NextResponse.json({ error: 'Não encontrado' }, { status: 404 })
    return NextResponse.json(updated)
  } catch (err: unknown) {
    const code = err && typeof err === 'object' && 'code' in err ? (err as { code: string }).code : ''
    if (code === '23505') {
      return NextResponse.json({ error: 'Já existe um tratamento com este texto.' }, { status: 409 })
    }
    console.error('[PUT /api/team/prefixes/:id]', err)
    return NextResponse.json({ error: 'Erro ao atualizar tratamento' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const { id } = await params

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(teamMembers)
    .where(eq(teamMembers.namePrefixId, id))

  if (count > 0) {
    return NextResponse.json(
      { error: 'Existem membros usando este tratamento. Reatribua ou remova antes de excluir.' },
      { status: 409 }
    )
  }

  await db.delete(teamNamePrefixes).where(eq(teamNamePrefixes.id, id))
  return new NextResponse(null, { status: 204 })
}
