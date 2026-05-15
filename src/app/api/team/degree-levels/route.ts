import { NextRequest, NextResponse } from 'next/server'
import { asc } from 'drizzle-orm'
import { db } from '@/lib/db'
import { teamDegreeLevels } from '@/lib/db/schema'

export async function GET() {
  try {
    const rows = await db
      .select({
        id: teamDegreeLevels.id,
        label: teamDegreeLevels.label,
        createdAt: teamDegreeLevels.createdAt,
        updatedAt: teamDegreeLevels.updatedAt,
      })
      .from(teamDegreeLevels)
      .orderBy(asc(teamDegreeLevels.label))

    return NextResponse.json(rows)
  } catch (err) {
    console.error('[GET /api/team/degree-levels]', err)
    return NextResponse.json({ error: 'Erro ao buscar graus' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const fd = await req.formData()
    const label = (fd.get('label') as string)?.trim()
    if (!label) {
      return NextResponse.json({ error: 'Rótulo obrigatório' }, { status: 400 })
    }

    const [created] = await db
      .insert(teamDegreeLevels)
      .values({ label })
      .returning({ id: teamDegreeLevels.id, label: teamDegreeLevels.label })

    return NextResponse.json(created, { status: 201 })
  } catch (err: unknown) {
    const code = err && typeof err === 'object' && 'code' in err ? (err as { code: string }).code : ''
    if (code === '23505') {
      return NextResponse.json({ error: 'Já existe um grau com este texto.' }, { status: 409 })
    }
    console.error('[POST /api/team/degree-levels]', err)
    return NextResponse.json({ error: 'Erro ao criar grau' }, { status: 500 })
  }
}
