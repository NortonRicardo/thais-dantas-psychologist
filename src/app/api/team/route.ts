import { NextRequest, NextResponse } from 'next/server'
import { asc } from 'drizzle-orm'
import { db } from '@/lib/db'
import { teamMembers } from '@/lib/db/schema'

export async function GET() {
  try {
    const rows = await db
      .select({
        id: teamMembers.id,
        category: teamMembers.category,
        name: teamMembers.name,
        qualification: teamMembers.qualification,
        description: teamMembers.description,
        photoMimeType: teamMembers.photoMimeType,
        sortOrder: teamMembers.sortOrder,
        createdAt: teamMembers.createdAt,
        updatedAt: teamMembers.updatedAt,
      })
      .from(teamMembers)
      .orderBy(asc(teamMembers.sortOrder), asc(teamMembers.createdAt))

    return NextResponse.json(rows)
  } catch (err) {
    console.error('[GET /api/team]', err)
    return NextResponse.json({ error: 'Erro ao buscar equipe' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const fd = await req.formData()

    const category = (fd.get('category') as string)?.trim()
    const name = (fd.get('name') as string)?.trim()
    const qualification = (fd.get('qualification') as string)?.trim()
    const description = (fd.get('description') as string)?.trim() || null
    const sortOrder = parseInt(fd.get('sortOrder') as string) || 0

    if (!category || !name || !qualification) {
      return NextResponse.json({ error: 'Campos obrigatórios faltando' }, { status: 400 })
    }

    const photoFile = fd.get('photo') as File | null
    let photo: Buffer | undefined
    let photoMimeType: string | undefined

    if (photoFile && photoFile.size > 0) {
      photo = Buffer.from(await photoFile.arrayBuffer())
      photoMimeType = photoFile.type
    }

    const [created] = await db
      .insert(teamMembers)
      .values({ category, name, qualification, description, photo, photoMimeType, sortOrder })
      .returning({ id: teamMembers.id, name: teamMembers.name })

    return NextResponse.json(created, { status: 201 })
  } catch (err) {
    console.error('[POST /api/team]', err)
    return NextResponse.json({ error: 'Erro ao criar membro' }, { status: 500 })
  }
}
