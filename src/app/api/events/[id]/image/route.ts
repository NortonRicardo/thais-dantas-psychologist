import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { events } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [row] = await db
    .select({ image: events.image, imageMimeType: events.imageMimeType })
    .from(events)
    .where(eq(events.id, id))

  if (!row?.image) return new NextResponse(null, { status: 404 })

  return new NextResponse(row.image as unknown as BodyInit, {
    headers: {
      'Content-Type': row.imageMimeType ?? 'image/jpeg',
      'Cache-Control': 'no-cache',
    },
  })
}
