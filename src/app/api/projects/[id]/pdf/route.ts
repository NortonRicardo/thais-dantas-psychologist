import { NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { projects } from '@/lib/db/schema'

type Ctx = { params: Promise<{ id: string }> }

export async function GET(_: Request, { params }: Ctx) {
  const { id } = await params
  const [row] = await db
    .select({ pdf: projects.pdf, pdfMimeType: projects.pdfMimeType })
    .from(projects)
    .where(eq(projects.id, id))

  if (!row?.pdf || !row.pdfMimeType) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return new NextResponse(row.pdf as BodyInit, {
    headers: {
      'Content-Type': row.pdfMimeType,
      'Content-Disposition': 'inline',
      'Cache-Control': 'no-cache',
    },
  })
}
