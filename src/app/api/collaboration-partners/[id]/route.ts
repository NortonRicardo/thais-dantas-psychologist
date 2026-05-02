import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { collaborationPartners } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

type Ctx = { params: Promise<{ id: string }> }

export async function PUT(req: NextRequest, { params }: Ctx) {
  try {
    const { id } = await params
    const fd = await req.formData()

    const name = (fd.get('name') as string)?.trim()
    const description = (fd.get('description') as string)?.trim()

    if (!name || !description) {
      return NextResponse.json(
        { error: 'Campos obrigatórios faltando' },
        { status: 400 }
      )
    }

    const [updated] = await db
      .update(collaborationPartners)
      .set({
        name,
        description,
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
  const { id } = await params
  await db.delete(collaborationPartners).where(eq(collaborationPartners.id, id))
  return new NextResponse(null, { status: 204 })
}
