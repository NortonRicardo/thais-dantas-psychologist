import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { developedPlatforms } from '@/lib/db/schema'
import { asc } from 'drizzle-orm'

function optLink(v: unknown): string | null {
  const t = typeof v === 'string' ? v.trim() : ''
  return t.length > 0 ? t : null
}

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

    const title = (fd.get('title') as string)?.trim()
    const description = (fd.get('description') as string)?.trim()
    const iconKey = ((fd.get('iconKey') as string) || 'cloud-sun').trim()
    const badgeRaw = (fd.get('badge') as string)?.trim()

    if (!title || !description) {
      return NextResponse.json(
        { error: 'Campos obrigatórios faltando' },
        { status: 400 }
      )
    }

    const [created] = await db
      .insert(developedPlatforms)
      .values({
        title,
        description,
        projectLink: optLink(fd.get('projectLink')),
        platformLink: optLink(fd.get('platformLink')),
        badge: badgeRaw ? badgeRaw : null,
        iconKey: iconKey || 'cloud-sun',
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
