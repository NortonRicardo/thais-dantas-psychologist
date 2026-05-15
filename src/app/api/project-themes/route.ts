import { NextRequest, NextResponse } from 'next/server'
import { asc } from 'drizzle-orm'

import { db } from '@/lib/db'
import { projectThemes } from '@/lib/db/schema'
import {
  defaultThemeStylesFromManagerColor,
  slugifyThemeSlug,
} from '@/lib/project-taxonomy-styles'
import { parseProjectThemeForm } from '@/lib/validation/projects-api'
import { validationErrorResponse } from '@/lib/validation/team-api'

export async function GET() {
  try {
    const rows = await db
      .select({
        id: projectThemes.id,
        name: projectThemes.name,
        slug: projectThemes.slug,
        color: projectThemes.color,
        pillColor: projectThemes.pillColor,
        filterBg: projectThemes.filterBg,
        filterBorder: projectThemes.filterBorder,
        filterText: projectThemes.filterText,
        filterActiveBg: projectThemes.filterActiveBg,
        createdAt: projectThemes.createdAt,
        updatedAt: projectThemes.updatedAt,
      })
      .from(projectThemes)
      .orderBy(asc(projectThemes.name), asc(projectThemes.createdAt))

    return NextResponse.json(
      rows.map(r => ({
        ...r,
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString(),
      }))
    )
  } catch (err) {
    console.error('[GET /api/project-themes]', err)
    return NextResponse.json({ error: 'Erro ao buscar temas' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
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

    const [created] = await db
      .insert(projectThemes)
      .values({
        name: p.name,
        slug,
        color: finalColor,
        pillColor: p.pillColor || d.pillColor,
        filterBg: p.filterBg || d.filterBg,
        filterBorder: p.filterBorder || d.filterBorder,
        filterText: p.filterText || d.filterText,
        filterActiveBg: p.filterActiveBg || d.filterActiveBg,
      })
      .returning({
        id: projectThemes.id,
        name: projectThemes.name,
      })

    return NextResponse.json(created, { status: 201 })
  } catch (err) {
    console.error('[POST /api/project-themes]', err)
    const duplicate = err instanceof Error && /unique/i.test(err.message)
    return NextResponse.json(
      {
        error: duplicate ? 'Nome ou slug já existe.' : 'Erro ao criar tema.',
      },
      { status: duplicate ? 409 : 500 }
    )
  }
}
