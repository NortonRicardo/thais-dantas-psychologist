import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { developedPlatforms } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

type Ctx = { params: Promise<{ id: string }> }

function optLink(v: unknown): string | null {
  const t = typeof v === 'string' ? v.trim() : ''
  return t.length > 0 ? t : null
}

export async function PUT(req: NextRequest, { params }: Ctx) {
  try {
    const { id } = await params
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

    const [updated] = await db
      .update(developedPlatforms)
      .set({
        title,
        description,
        projectLink: optLink(fd.get('projectLink')),
        platformLink: optLink(fd.get('platformLink')),
        badge: badgeRaw ? badgeRaw : null,
        iconKey: iconKey || 'cloud-sun',
        updatedAt: new Date(),
      })
      .where(eq(developedPlatforms.id, id))
      .returning({
        id: developedPlatforms.id,
        title: developedPlatforms.title,
      })

    if (!updated)
      return NextResponse.json({ error: 'Não encontrado' }, { status: 404 })
    return NextResponse.json(updated)
  } catch (err) {
    console.error('[PUT /api/developed-platforms/:id]', err)
    return NextResponse.json(
      { error: 'Erro ao atualizar plataforma' },
      { status: 500 }
    )
  }
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const { id } = await params
  await db.delete(developedPlatforms).where(eq(developedPlatforms.id, id))
  return new NextResponse(null, { status: 204 })
}
