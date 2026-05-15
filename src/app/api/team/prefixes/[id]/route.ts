import { NextRequest, NextResponse } from 'next/server'
import { eq, sql } from 'drizzle-orm'

import { db } from '@/lib/db'
import { teamMembers, teamNamePrefixes } from '@/lib/db/schema'
import {
  parseTeamPrefixForm,
  uuidParamSafeParse,
  validationErrorResponse,
} from '@/lib/validation/team-api'

type Ctx = { params: Promise<{ id: string }> }

export async function PUT(req: NextRequest, { params }: Ctx) {
  try {
    const { id } = await params
    const idCheck = uuidParamSafeParse(id)
    if (!idCheck.success) {
      return NextResponse.json(
        {
          error: idCheck.error.issues[0]?.message ?? 'Identificador inválido.',
        },
        { status: 400 }
      )
    }

    const fd = await req.formData()
    const parsed = parseTeamPrefixForm(fd)
    if (!parsed.success) return validationErrorResponse(parsed.error)

    const { label } = parsed.data

    const [updated] = await db
      .update(teamNamePrefixes)
      .set({ label, updatedAt: new Date() })
      .where(eq(teamNamePrefixes.id, id))
      .returning({ id: teamNamePrefixes.id, label: teamNamePrefixes.label })

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
        { error: 'Já existe um tratamento com este texto.' },
        { status: 409 }
      )
    }
    console.error('[PUT /api/team/prefixes/:id]', err)
    return NextResponse.json(
      { error: 'Erro ao atualizar tratamento' },
      { status: 500 }
    )
  }
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const { id } = await params
  const idCheck = uuidParamSafeParse(id)
  if (!idCheck.success) {
    return NextResponse.json(
      { error: idCheck.error.issues[0]?.message ?? 'Identificador inválido.' },
      { status: 400 }
    )
  }

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(teamMembers)
    .where(eq(teamMembers.namePrefixId, id))

  if (count > 0) {
    return NextResponse.json(
      {
        error:
          'Não é possível excluir: há membros vinculados a este tratamento. Reatribua os membros antes de excluir.',
      },
      { status: 409 }
    )
  }

  await db.delete(teamNamePrefixes).where(eq(teamNamePrefixes.id, id))
  return new NextResponse(null, { status: 204 })
}
