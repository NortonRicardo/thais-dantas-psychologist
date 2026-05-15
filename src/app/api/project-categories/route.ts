import { NextRequest, NextResponse } from 'next/server'
import { asc } from 'drizzle-orm'

import { db } from '@/lib/db'
import { projectCategories } from '@/lib/db/schema'
import { defaultCategoryChipsFromManagerColor } from '@/lib/project-taxonomy-styles'
import { parseProjectCategoryForm } from '@/lib/validation/projects-api'
import { validationErrorResponse } from '@/lib/validation/team-api'

export async function GET() {
  try {
    const rows = await db
      .select({
        id: projectCategories.id,
        title: projectCategories.title,
        color: projectCategories.color,
        chipBg: projectCategories.chipBg,
        chipBorder: projectCategories.chipBorder,
        chipText: projectCategories.chipText,
        createdAt: projectCategories.createdAt,
        updatedAt: projectCategories.updatedAt,
      })
      .from(projectCategories)
      .orderBy(asc(projectCategories.title), asc(projectCategories.createdAt))

    return NextResponse.json(
      rows.map(r => ({
        ...r,
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString(),
      }))
    )
  } catch (err) {
    console.error('[GET /api/project-categories]', err)
    return NextResponse.json(
      { error: 'Erro ao buscar categorias' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const fd = await req.formData()
    const parsed = parseProjectCategoryForm(fd)
    if (!parsed.success) return validationErrorResponse(parsed.error)

    const { title, color, chipBg, chipBorder, chipText } = parsed.data
    const defaults = defaultCategoryChipsFromManagerColor(color)

    const [created] = await db
      .insert(projectCategories)
      .values({
        title,
        color,
        chipBg: chipBg || defaults.chipBg,
        chipBorder: chipBorder || defaults.chipBorder,
        chipText: chipText || defaults.chipText,
      })
      .returning({
        id: projectCategories.id,
        title: projectCategories.title,
      })

    return NextResponse.json(created, { status: 201 })
  } catch (err) {
    console.error('[POST /api/project-categories]', err)
    return NextResponse.json(
      { error: 'Erro ao criar categoria' },
      { status: 500 }
    )
  }
}
