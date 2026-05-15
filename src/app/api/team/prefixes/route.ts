import { NextRequest, NextResponse } from 'next/server'
import { asc } from 'drizzle-orm'

import { db } from '@/lib/db'
import { teamNamePrefixes } from '@/lib/db/schema'
import {
  parseTeamPrefixForm,
  validationErrorResponse,
} from '@/lib/validation/team-api'

export async function GET() {
  try {
    const rows = await db
      .select({
        id: teamNamePrefixes.id,
        label: teamNamePrefixes.label,
        createdAt: teamNamePrefixes.createdAt,
        updatedAt: teamNamePrefixes.updatedAt,
      })
      .from(teamNamePrefixes)
      .orderBy(asc(teamNamePrefixes.label))

    return NextResponse.json(rows)
  } catch (err) {
    console.error('[GET /api/team/prefixes]', err)
    return NextResponse.json(
      { error: 'Erro ao buscar tratamentos' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const fd = await req.formData()
    const parsed = parseTeamPrefixForm(fd)
    if (!parsed.success) return validationErrorResponse(parsed.error)

    const { label } = parsed.data

    const [created] = await db
      .insert(teamNamePrefixes)
      .values({ label })
      .returning({ id: teamNamePrefixes.id, label: teamNamePrefixes.label })

    return NextResponse.json(created, { status: 201 })
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
    console.error('[POST /api/team/prefixes]', err)
    return NextResponse.json(
      { error: 'Erro ao criar tratamento' },
      { status: 500 }
    )
  }
}
