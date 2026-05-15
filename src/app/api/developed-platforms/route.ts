import { NextRequest, NextResponse } from 'next/server'
import { asc } from 'drizzle-orm'
import { db } from '@/lib/db'
import { developedPlatforms } from '@/lib/db/schema'
import { parseDevelopedPlatformForm } from '@/lib/validation/infraestrutura-api'
import { validationErrorResponse } from '@/lib/validation/team-api'

export async function GET() {
  try {
    const rows = await db
      .select({
        id: developedPlatforms.id,
        title: developedPlatforms.title,
        description: developedPlatforms.description,
        projectLink: developedPlatforms.projectLink,
        platformLink: developedPlatforms.platformLink,
        badge: developedPlatforms.badge,
        iconKey: developedPlatforms.iconKey,
        createdAt: developedPlatforms.createdAt,
        updatedAt: developedPlatforms.updatedAt,
      })
      .from(developedPlatforms)
      .orderBy(asc(developedPlatforms.createdAt), asc(developedPlatforms.title))

    return NextResponse.json(rows)
  } catch (err) {
    console.error('[GET /api/developed-platforms]', err)
    return NextResponse.json(
      { error: 'Erro ao buscar plataformas' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const fd = await req.formData()
    const parsed = parseDevelopedPlatformForm(fd)
    if (!parsed.success) return validationErrorResponse(parsed.error)
    const d = parsed.data

    const [created] = await db
      .insert(developedPlatforms)
      .values({
        title: d.title,
        description: d.description,
        projectLink: d.projectLink,
        platformLink: d.platformLink,
        badge: d.badge,
        iconKey: d.iconKey,
      })
      .returning({
        id: developedPlatforms.id,
        title: developedPlatforms.title,
      })

    return NextResponse.json(created, { status: 201 })
  } catch (err) {
    console.error('[POST /api/developed-platforms]', err)
    return NextResponse.json(
      { error: 'Erro ao criar plataforma' },
      { status: 500 }
    )
  }
}
