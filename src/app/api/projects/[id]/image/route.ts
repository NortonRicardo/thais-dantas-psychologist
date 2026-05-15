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
    .select({ image: projects.image, imageMimeType: projects.imageMimeType })
    .from(projects)
    .where(eq(projects.id, id))

  if (!row?.image || !row.imageMimeType) {
    return NextResponse.json(
      { error: 'Imagem não encontrada.' },
      { status: 404 }
    )
  }

  return new NextResponse(row.image as BodyInit, {
    headers: {
      'Content-Type': row.imageMimeType,
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}
