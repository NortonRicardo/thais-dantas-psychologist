import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { contactInfo } from '@/lib/db/schema'
import { contactInfoPutSchema } from '@/lib/validation/contato-api'
import { validationErrorResponse } from '@/lib/validation/api'

const SELECTED_FIELDS = {
  id: contactInfo.id,
  mapUrl: contactInfo.mapUrl,
  createdAt: contactInfo.createdAt,
  updatedAt: contactInfo.updatedAt,
}

export async function getOrCreateContactInfo() {
  const rows = await db.select(SELECTED_FIELDS).from(contactInfo).limit(1)
  if (rows[0]) return rows[0]

  const [created] = await db
    .insert(contactInfo)
    .values({ mapUrl: '' })
    .returning(SELECTED_FIELDS)
  return created
}

export async function GET() {
  try {
    const row = await getOrCreateContactInfo()
    return NextResponse.json(row)
  } catch (err) {
    console.error('[GET /api/contato]', err)
    return NextResponse.json(
      { error: 'Erro ao buscar contato' },
      { status: 500 }
    )
  }
}

export async function PUT(req: NextRequest) {
  try {
    const raw = await req.json()
    const parsed = contactInfoPutSchema.safeParse(raw)
    if (!parsed.success) return validationErrorResponse(parsed.error)

    const { mapUrl } = parsed.data

    const existing = await getOrCreateContactInfo()
    const [updated] = await db
      .update(contactInfo)
      .set({
        mapUrl,
        updatedAt: new Date(),
      })
      .where(eq(contactInfo.id, existing.id))
      .returning(SELECTED_FIELDS)

    revalidateTag('contato', 'max')
    return NextResponse.json(updated)
  } catch (err) {
    console.error('[PUT /api/contato]', err)
    return NextResponse.json(
      { error: 'Erro ao atualizar contato' },
      { status: 500 }
    )
  }
}
