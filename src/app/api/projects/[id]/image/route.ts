import { NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { projects } from '@/lib/db/schema'

type Ctx = { params: Promise<{ id: string }> }

export async function GET(_: Request, { params }: Ctx) {
  const { id } = await params
  const [row] = await db
    .select({ image: projects.image, imageMimeType: projects.imageMimeType })
    .from(projects)
    .where(eq(projects.id, id))

  if (!row?.image || !row.imageMimeType) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return new NextResponse(row.image as BodyInit, {
    headers: {
      'Content-Type': row.imageMimeType,
      'Cache-Control': 'no-cache',
    },
  })
}
