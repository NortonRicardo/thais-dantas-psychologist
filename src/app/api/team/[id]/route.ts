import { NextRequest, NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { teamMembers } from '@/lib/db/schema'

type Ctx = { params: Promise<{ id: string }> }

export async function PUT(req: NextRequest, { params }: Ctx) {
  try {
    const { id } = await params
    const fd = await req.formData()

    const category = (fd.get('category') as string)?.trim()
    const name = (fd.get('name') as string)?.trim()
    const qualification = (fd.get('qualification') as string)?.trim()
    const description = (fd.get('description') as string)?.trim() || null
    const sortOrder = parseInt(fd.get('sortOrder') as string) || 0

    if (!category || !name || !qualification) {
      return NextResponse.json({ error: 'Campos obrigatórios faltando' }, { status: 400 })
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const patch: Record<string, any> = {
      category, name, qualification, description, sortOrder, updatedAt: new Date(),
    }

    if (fd.get('removePhoto') === 'true') {
      patch.photo = null
      patch.photoMimeType = null
    }

    const photoFile = fd.get('photo') as File | null
    if (photoFile && photoFile.size > 0) {
      patch.photo = Buffer.from(await photoFile.arrayBuffer())
      patch.photoMimeType = photoFile.type
    }

    const [updated] = await db
      .update(teamMembers)
      .set(patch)
      .where(eq(teamMembers.id, id))
      .returning({ id: teamMembers.id, name: teamMembers.name })

    if (!updated) return NextResponse.json({ error: 'Não encontrado' }, { status: 404 })
    return NextResponse.json(updated)
  } catch (err) {
    console.error('[PUT /api/team/:id]', err)
    return NextResponse.json({ error: 'Erro ao atualizar membro' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const { id } = await params
  await db.delete(teamMembers).where(eq(teamMembers.id, id))
  return new NextResponse(null, { status: 204 })
}
