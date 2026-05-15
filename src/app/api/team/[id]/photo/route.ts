import { NextRequest, NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'

import { db } from '@/lib/db'
import { teamMembers } from '@/lib/db/schema'
import { uuidParamSafeParse } from '@/lib/validation/team-api'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const idCheck = uuidParamSafeParse(id)
  if (!idCheck.success) {
    return NextResponse.json(
      { error: idCheck.error.issues[0]?.message ?? 'Identificador inválido.' },
      { status: 400 }
    )
  }

  const [row] = await db
    .select({
      photo: teamMembers.photo,
      photoMimeType: teamMembers.photoMimeType,
    })
    .from(teamMembers)
    .where(eq(teamMembers.id, id))

  if (!row?.photo) return new NextResponse(null, { status: 404 })

  return new NextResponse(row.photo as unknown as BodyInit, {
    headers: {
      'Content-Type': row.photoMimeType ?? 'image/jpeg',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  })
}
