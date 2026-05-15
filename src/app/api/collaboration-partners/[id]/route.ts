import { NextRequest, NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { collaborationPartners } from '@/lib/db/schema'
import { parseCollaborationPartnerForm } from '@/lib/validation/infraestrutura-api'
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
    const parsed = parseCollaborationPartnerForm(fd)
    if (!parsed.success) return validationErrorResponse(parsed.error)
    const d = parsed.data

    const [updated] = await db
      .update(collaborationPartners)
      .set({
        name: d.name,
        description: d.description,
        updatedAt: new Date(),
      })
      .where(eq(collaborationPartners.id, id))
      .returning({
        id: collaborationPartners.id,
        name: collaborationPartners.name,
      })

    if (!updated)
      return NextResponse.json({ error: 'Não encontrado' }, { status: 404 })
    return NextResponse.json(updated)
  } catch (err) {
    console.error('[PUT /api/collaboration-partners/:id]', err)
    return NextResponse.json(
      { error: 'Erro ao atualizar parceiro' },
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
      .delete(collaborationPartners)
      .where(eq(collaborationPartners.id, id))
      .returning({ id: collaborationPartners.id })

    if (deleted.length === 0) {
      return NextResponse.json({ error: 'Não encontrado' }, { status: 404 })
    }

    return new NextResponse(null, { status: 204 })
  } catch (err) {
    console.error('[DELETE /api/collaboration-partners/:id]', err)
    return NextResponse.json(
      { error: 'Erro ao remover parceiro' },
      { status: 500 }
    )
  }
}
