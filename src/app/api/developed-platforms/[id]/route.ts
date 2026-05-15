import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { developedPlatforms } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { parseDevelopedPlatformForm } from '@/lib/validation/infraestrutura-api'
import {
  validationErrorResponse,
  uuidParamSafeParse,
} from '@/lib/validation/team-api'

type Ctx = { params: Promise<{ id: string }> }

export async function PUT(req: NextRequest, { params }: Ctx) {
  try {
    const { id } = await params
    const idParsed = uuidParamSafeParse(id)
    if (!idParsed.success) return validationErrorResponse(idParsed.error)

    const fd = await req.formData()
    const parsed = parseDevelopedPlatformForm(fd)
    if (!parsed.success) return validationErrorResponse(parsed.error)
    const d = parsed.data

    const [updated] = await db
      .update(developedPlatforms)
      .set({
        title: d.title,
        description: d.description,
        projectLink: d.projectLink,
        platformLink: d.platformLink,
        badge: d.badge,
        iconKey: d.iconKey,
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
  try {
    const { id } = await params
    const idParsed = uuidParamSafeParse(id)
    if (!idParsed.success) return validationErrorResponse(idParsed.error)

    const deleted = await db
      .delete(developedPlatforms)
      .where(eq(developedPlatforms.id, id))
      .returning({ id: developedPlatforms.id })

    if (deleted.length === 0) {
      return NextResponse.json({ error: 'Não encontrado' }, { status: 404 })
    }

    return new NextResponse(null, { status: 204 })
  } catch (err) {
    console.error('[DELETE /api/developed-platforms/:id]', err)
    return NextResponse.json(
      { error: 'Erro ao remover plataforma' },
      { status: 500 }
    )
  }
}
