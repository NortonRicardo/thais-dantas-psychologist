import { NextRequest, NextResponse } from 'next/server'
import { eq, sql } from 'drizzle-orm'

import { db } from '@/lib/db'
import { projectProjectThemes, projectThemes } from '@/lib/db/schema'
import {
  defaultThemeStylesFromManagerColor,
  slugifyThemeSlug,
} from '@/lib/project-taxonomy-styles'
import { parseProjectThemeForm } from '@/lib/validation/projects-api'
import {
  uuidParamSafeParse,
  validationErrorResponse,
} from '@/lib/validation/team-api'

type Ctx = { params: Promise<{ id: string }> }

export async function PUT(req: NextRequest, { params }: Ctx) {
  try {
    const { id } = await params
    const idParsed = uuidParamSafeParse(id)
    if (!idParsed.success) return validationErrorResponse(idParsed.error)

    const fd = await req.formData()
    const parsed = parseProjectThemeForm(fd)
    if (!parsed.success) return validationErrorResponse(parsed.error)

    const p = parsed.data
    const slug = p.slug || slugifyThemeSlug(p.name)
    const d = defaultThemeStylesFromManagerColor(p.color)

    let finalColor = p.color
    if (p.color.startsWith('bg-') && !p.color.includes('text-')) {
      const m = /^bg-([a-z]+)-(\d+)$/.exec(p.color)
      if (m) {
        finalColor = `bg-${m[1]}-${m[2]}/15 text-${m[1]}-300 border-${m[1]}-500/30`
      }
    }

    const [updated] = await db
      .update(projectThemes)
      .set({
        name: p.name,
        slug,
        color: finalColor,
        pillColor: p.pillColor || d.pillColor,
        filterBg: p.filterBg || d.filterBg,
        filterBorder: p.filterBorder || d.filterBorder,
        filterText: p.filterText || d.filterText,
        filterActiveBg: p.filterActiveBg || d.filterActiveBg,
        updatedAt: new Date(),
      })
      .where(eq(projectThemes.id, id))
      .returning({
        id: projectThemes.id,
        name: projectThemes.name,
      })

    if (!updated)
      return NextResponse.json(
        { error: 'Tema não encontrado.' },
        { status: 404 }
      )
    return NextResponse.json(updated)
  } catch (err) {
    console.error('[PUT /api/project-themes/:id]', err)
    const duplicate = err instanceof Error && /unique/i.test(err.message)
    return NextResponse.json(
      {
        error: duplicate
          ? 'Nome ou slug já existe.'
          : 'Erro ao atualizar tema.',
      },
      { status: duplicate ? 409 : 500 }
    )
  }
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  try {
    const { id } = await params
    const idParsed = uuidParamSafeParse(id)
    if (!idParsed.success) return validationErrorResponse(idParsed.error)

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

    const deleted = await db
      .delete(projectThemes)
      .where(eq(projectThemes.id, id))
      .returning({ id: projectThemes.id })

    if (deleted.length === 0) {
      return NextResponse.json(
        { error: 'Tema não encontrado.' },
        { status: 404 }
      )
    }

    return new NextResponse(null, { status: 204 })
  } catch (err) {
    console.error('[DELETE /api/project-themes/:id]', err)
    return NextResponse.json(
      { error: 'Erro ao excluir tema.' },
      { status: 500 }
    )
  }
}
