import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { contactInfo } from '@/lib/db/schema'

export async function GET() {
  const rows = await db
    .select({ photo: contactInfo.directorPhoto, mime: contactInfo.directorPhotoMimeType })
    .from(contactInfo)
    .limit(1)

  const row = rows[0]
  if (!row?.photo) return new NextResponse(null, { status: 404 })

  return new NextResponse(row.photo as unknown as BodyInit, {
    headers: {
      'Content-Type': row.mime ?? 'image/jpeg',
      'Cache-Control': 'no-cache',
    },
  })
}
