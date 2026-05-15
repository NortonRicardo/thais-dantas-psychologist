import { NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { projects } from '@/lib/db/schema'
import {
  uuidParamSafeParse,
  validationErrorResponse,
} from '@/lib/validation/team-api'

type Ctx = { params: Promise<{ id: string }> }

export async function GET(_: Request, { params }: Ctx) {
  const { id } = await params
  const idParsed = uuidParamSafeParse(id)
  if (!idParsed.success) return validationErrorResponse(idParsed.error)

  const [row] = await db
    .select({ pdf: projects.pdf, pdfMimeType: projects.pdfMimeType })
    .from(projects)
    .where(eq(projects.id, id))

  if (!row?.pdf || !row.pdfMimeType) {
    return NextResponse.json({ error: 'PDF não encontrado.' }, { status: 404 })
  }

  return new NextResponse(row.pdf as BodyInit, {
    headers: {
      'Content-Type': row.pdfMimeType,
      'Content-Disposition': 'inline',
      'Cache-Control': 'no-cache',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}
