import { NextRequest, NextResponse } from 'next/server'
import { asc } from 'drizzle-orm'

import { db } from '@/lib/db'
import { projectThemes } from '@/lib/db/schema'
import {
  defaultThemeStylesFromManagerColor,
  slugifyThemeSlug,
} from '@/lib/project-taxonomy-styles'

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

    const [created] = await db
      .insert(projectThemes)
      .values({
        name,
        slug,
        color: finalColor,
        pillColor,
        filterBg,
        filterBorder,
        filterText,
        filterActiveBg,
      })
      .returning({
        id: projectThemes.id,
        name: projectThemes.name,
      })

    return NextResponse.json(created, { status: 201 })
  } catch (err) {
    console.error('[POST /api/project-themes]', err)
    const msg =
      err instanceof Error && /unique/i.test(err.message)
        ? 'Nome ou slug já existe.'
        : 'Erro ao criar tema'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
