import { NextRequest, NextResponse } from 'next/server'
import { asc } from 'drizzle-orm'
import { db } from '@/lib/db'
import { collaborationPartners } from '@/lib/db/schema'
import { parseCollaborationPartnerForm } from '@/lib/validation/infraestrutura-api'
import { validationErrorResponse } from '@/lib/validation/team-api'

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
    const parsed = parseCollaborationPartnerForm(fd)
    if (!parsed.success) return validationErrorResponse(parsed.error)
    const d = parsed.data

    const [created] = await db
      .insert(collaborationPartners)
      .values({
        name: d.name,
        description: d.description,
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
