import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { collaborationPartners } from '@/lib/db/schema'
import { asc } from 'drizzle-orm'

export async function GET() {
  try {
    const rows = await db
      .select({
        id: collaborationPartners.id,
        name: collaborationPartners.name,
        description: collaborationPartners.description,
        createdAt: collaborationPartners.createdAt,
        updatedAt: collaborationPartners.updatedAt,
      })
      .from(collaborationPartners)
      .orderBy(
        asc(collaborationPartners.createdAt),
        asc(collaborationPartners.name)
      )

    return NextResponse.json(rows)
  } catch (err) {
    console.error('[GET /api/collaboration-partners]', err)
    return NextResponse.json(
      { error: 'Erro ao buscar parceiros' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const fd = await req.formData()

    const name = (fd.get('name') as string)?.trim()
    const description = (fd.get('description') as string)?.trim()

    if (!name || !description) {
      return NextResponse.json(
        { error: 'Campos obrigatórios faltando' },
        { status: 400 }
      )
    }

    const [created] = await db
      .insert(collaborationPartners)
      .values({
        name,
        description,
      })
      .returning({
        id: collaborationPartners.id,
        name: collaborationPartners.name,
      })

    return NextResponse.json(created, { status: 201 })
  } catch (err) {
    console.error('[POST /api/collaboration-partners]', err)
    return NextResponse.json(
      { error: 'Erro ao criar parceiro' },
      { status: 500 }
    )
  }
}
