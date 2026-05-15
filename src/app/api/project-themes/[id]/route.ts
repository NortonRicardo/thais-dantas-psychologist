import { NextRequest, NextResponse } from 'next/server'
import { eq, sql } from 'drizzle-orm'

import { db } from '@/lib/db'
import { projectProjectThemes, projectThemes } from '@/lib/db/schema'
import {
  defaultThemeStylesFromManagerColor,
  slugifyThemeSlug,
} from '@/lib/project-taxonomy-styles'

type Ctx = { params: Promise<{ id: string }> }

export async function PUT(req: NextRequest, { params }: Ctx) {
  try {
    const { id } = await params
    const fd = await req.formData()
    const name = (fd.get('name') as string)?.trim()
    let slug = (fd.get('slug') as string)?.trim()
    const color = (fd.get('color') as string)?.trim()

    if (!name || !color) {
      return NextResponse.json(
        { error: 'Campos obrigatórios faltando' },
        { status: 400 }
      )
    }

    if (!slug) slug = slugifyThemeSlug(name)

    const d = defaultThemeStylesFromManagerColor(color)

    const pillColor = (fd.get('pillColor') as string)?.trim() || d.pillColor
    const filterBg = (fd.get('filterBg') as string)?.trim() || d.filterBg
    const filterBorder =
      (fd.get('filterBorder') as string)?.trim() || d.filterBorder
    const filterText = (fd.get('filterText') as string)?.trim() || d.filterText
    const filterActiveBg =
      (fd.get('filterActiveBg') as string)?.trim() || d.filterActiveBg

    let finalColor = color
    if (color.startsWith('bg-') && !color.includes('text-')) {
      const m = /^bg-([a-z]+)-(\d+)$/.exec(color)
      if (m) {
        const fam = m[1]
        const shade = m[2]
        finalColor = `bg-${fam}-${shade}/15 text-${fam}-300 border-${fam}-500/30`
      }
    }

    const [updated] = await db
      .update(projectThemes)
      .set({
        name,
        slug,
        color: finalColor,
        pillColor,
        filterBg,
        filterBorder,
        filterText,
        filterActiveBg,
        updatedAt: new Date(),
      })
      .where(eq(projectThemes.id, id))
      .returning({
        id: projectThemes.id,
        name: projectThemes.name,
      })

    if (!updated)
      return NextResponse.json({ error: 'Não encontrado' }, { status: 404 })
    return NextResponse.json(updated)
  } catch (err) {
    console.error('[PUT /api/project-themes/:id]', err)
    return NextResponse.json(
      { error: 'Erro ao atualizar tema' },
      { status: 500 }
    )
  }
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const { id } = await params

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(projectProjectThemes)
    .where(eq(projectProjectThemes.themeId, id))

  if (count > 0) {
    return NextResponse.json(
      {
        error:
          'Existem projetos usando este tema. Remova-o dos projetos antes de excluir.',
      },
      { status: 409 }
    )
  }

  await db.delete(projectThemes).where(eq(projectThemes.id, id))
  return new NextResponse(null, { status: 204 })
}
