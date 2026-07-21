import { NextRequest, NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { blogImages } from '@/lib/db/schema'

const FILENAME_PATTERN =
  /^([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\.webp$/

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params
  const match = FILENAME_PATTERN.exec(filename)
  if (!match) {
    return NextResponse.json({ error: 'Não encontrado.' }, { status: 404 })
  }

  const [image] = await db
    .select({ data: blogImages.data, contentType: blogImages.contentType })
    .from(blogImages)
    .where(eq(blogImages.id, match[1]))
    .limit(1)

  if (!image) {
    return NextResponse.json({ error: 'Não encontrado.' }, { status: 404 })
  }

  return new NextResponse(new Uint8Array(image.data), {
    headers: {
      'Content-Type': image.contentType,
      'Cache-Control': 'public, max-age=31536000, immutable',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}
