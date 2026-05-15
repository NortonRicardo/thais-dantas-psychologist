import { NextRequest, NextResponse } from 'next/server'
import { asc } from 'drizzle-orm'
import { db } from '@/lib/db'
import { teamCategories } from '@/lib/db/schema'

export async function GET() {
  try {
    const rows = await db
      .select({
        id: teamCategories.id,
        title: teamCategories.title,
        color: teamCategories.color,
        createdAt: teamCategories.createdAt,
        updatedAt: teamCategories.updatedAt,
      })
      .from(teamCategories)
      .orderBy(asc(teamCategories.title), asc(teamCategories.createdAt))

    return NextResponse.json(rows)
  } catch (err) {
    console.error('[GET /api/team/categories]', err)
    return NextResponse.json(
      { error: 'Erro ao buscar categorias' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const fd = await req.formData()
    const title = (fd.get('title') as string)?.trim()
    const color = (fd.get('color') as string)?.trim()

    if (!title || !color) {
      return NextResponse.json(
        { error: 'Campos obrigatórios faltando' },
        { status: 400 }
      )
    }

    const [created] = await db
      .insert(teamCategories)
      .values({ title, color })
      .returning({
        id: teamCategories.id,
        title: teamCategories.title,
      })

    return NextResponse.json(created, { status: 201 })
  } catch (err) {
    console.error('[POST /api/team/categories]', err)
    return NextResponse.json(
      { error: 'Erro ao criar categoria' },
      { status: 500 }
    )
  }
}
