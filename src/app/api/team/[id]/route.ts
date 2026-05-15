import { NextRequest, NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { teamCategories, teamMembers, teamNamePrefixes } from '@/lib/db/schema'
import { normalizeLinkedinUrl } from '@/lib/team-linkedin'

type Ctx = { params: Promise<{ id: string }> }

export async function PUT(req: NextRequest, { params }: Ctx) {
  try {
    const { id } = await params
    const fd = await req.formData()

    const categoryId = (fd.get('categoryId') as string)?.trim()
    const namePrefixIdRaw = (fd.get('namePrefixId') as string)?.trim()
    const namePrefixId =
      namePrefixIdRaw && namePrefixIdRaw !== '__none__' ? namePrefixIdRaw : null
    const name = (fd.get('name') as string)?.trim()
    const qualification = (fd.get('qualification') as string)?.trim()
    const description = (fd.get('description') as string)?.trim() || null
    const linkedinUrl = normalizeLinkedinUrl(fd.get('linkedinUrl') as string | null)

    if (fd.get('linkedinUrl') && String(fd.get('linkedinUrl')).trim() && !linkedinUrl) {
      return NextResponse.json({ error: 'URL do LinkedIn inválida (use linkedin.com/…)' }, { status: 400 })
    }

    if (!categoryId || !name || !qualification) {
      return NextResponse.json({ error: 'Campos obrigatórios faltando' }, { status: 400 })
    }

    const [cat] = await db
      .select({ id: teamCategories.id })
      .from(teamCategories)
      .where(eq(teamCategories.id, categoryId))
      .limit(1)

    if (!cat) {
      return NextResponse.json({ error: 'Categoria inválida' }, { status: 400 })
    }

    if (namePrefixId) {
      const [pfx] = await db
        .select({ id: teamNamePrefixes.id })
        .from(teamNamePrefixes)
        .where(eq(teamNamePrefixes.id, namePrefixId))
        .limit(1)
      if (!pfx) {
        return NextResponse.json({ error: 'Tratamento inválido' }, { status: 400 })
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const patch: Record<string, any> = {
      categoryId,
      namePrefixId,
      name,
      qualification,
      description,
      linkedinUrl,
      updatedAt: new Date(),
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
