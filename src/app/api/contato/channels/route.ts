import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { asc, eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { contactChannels } from '@/lib/db/schema'
import { contactChannelPostSchema } from '@/lib/validation/contato-api'
import { validationErrorResponse } from '@/lib/validation/team-api'
import { getOrCreateContactInfo } from '../route'

export async function GET() {
  try {
    const info = await getOrCreateContactInfo()
    const channels = await db
      .select()
      .from(contactChannels)
      .where(eq(contactChannels.contactInfoId, info.id))
      .orderBy(asc(contactChannels.sortOrder), asc(contactChannels.createdAt))
    return NextResponse.json(channels)
  } catch (err) {
    console.error('[GET /api/contato/channels]', err)
    return NextResponse.json(
      { error: 'Erro ao buscar canais' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const raw = await req.json()
    const parsed = contactChannelPostSchema.safeParse(raw)
    if (!parsed.success) return validationErrorResponse(parsed.error)

    const { label, iconKey, value } = parsed.data

    const info = await getOrCreateContactInfo()

    const existing = await db
      .select({ sortOrder: contactChannels.sortOrder })
      .from(contactChannels)
      .where(eq(contactChannels.contactInfoId, info.id))
      .orderBy(asc(contactChannels.sortOrder))

    const nextOrder =
      existing.length > 0 ? Math.max(...existing.map(r => r.sortOrder)) + 1 : 0

    const [created] = await db
      .insert(contactChannels)
      .values({
        contactInfoId: info.id,
        label,
        iconKey,
        value,
        sortOrder: nextOrder,
      })
      .returning()

    revalidateTag('contato', 'max')
    return NextResponse.json(created, { status: 201 })
  } catch (err) {
    console.error('[POST /api/contato/channels]', err)
    return NextResponse.json({ error: 'Erro ao criar canal' }, { status: 500 })
  }
}
