import { NextRequest, NextResponse } from 'next/server'
import { eq, sql } from 'drizzle-orm'

import { db } from '@/lib/db'
import { projectCategories, projects } from '@/lib/db/schema'
import { defaultCategoryChipsFromManagerColor } from '@/lib/project-taxonomy-styles'

type Ctx = { params: Promise<{ id: string }> }

export async function PUT(req: NextRequest, { params }: Ctx) {
  try {
    const { id } = await params
    const fd = await req.formData()
    const title = (fd.get('title') as string)?.trim()
    const color = (fd.get('color') as string)?.trim()
    const chipBg = (fd.get('chipBg') as string)?.trim()
    const chipBorder = (fd.get('chipBorder') as string)?.trim()
    const chipText = (fd.get('chipText') as string)?.trim()

    if (!title || !color) {
      return NextResponse.json(
        { error: 'Campos obrigatórios faltando' },
        { status: 400 }
      )
    }

    const defaults = defaultCategoryChipsFromManagerColor(color)

    const [updated] = await db
      .update(projectCategories)
      .set({
        title,
        color,
        chipBg: chipBg || defaults.chipBg,
        chipBorder: chipBorder || defaults.chipBorder,
        chipText: chipText || defaults.chipText,
        updatedAt: new Date(),
      })
      .where(eq(projectCategories.id, id))
      .returning({
        id: projectCategories.id,
        title: projectCategories.title,
      })

    if (!updated)
      return NextResponse.json({ error: 'Não encontrado' }, { status: 404 })
    return NextResponse.json(updated)
  } catch (err) {
    console.error('[PUT /api/project-categories/:id]', err)
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
    .from(projects)
    .where(eq(projects.categoryId, id))

  if (count > 0) {
    return NextResponse.json(
      {
        error:
          'Existem projetos nesta categoria. Reatribua-os antes de excluir.',
      },
      { status: 409 }
    )
  }

  await db.delete(projectCategories).where(eq(projectCategories.id, id))
  return new NextResponse(null, { status: 204 })
}
