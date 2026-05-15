import { NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { projects } from '@/lib/db/schema'
import { fetchTeamMembersDisplayMap } from '@/lib/db/team-member-display-map'

type Ctx = { params: Promise<{ id: string }> }

export async function GET(_: Request, { params }: Ctx) {
  const { id } = await params
  const [row] = await db.select().from(projects).where(eq(projects.id, id))
  if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const memberMap = await fetchTeamMembersDisplayMap()

  return NextResponse.json({
    ...row,
    image: undefined,
    pdf: undefined,
    startDate: row.startDate.toISOString(),
    endDate: row.endDate ? row.endDate.toISOString() : null,
    updatedAt: row.updatedAt.toISOString(),
    advisorName: row.advisorId ? (memberMap[row.advisorId] ?? null) : null,
    coAdvisorName: row.coAdvisorId ? (memberMap[row.coAdvisorId] ?? null) : null,
    researchLeadName: row.researchLeadId ? (memberMap[row.researchLeadId] ?? null) : null,
  })
}

export async function PUT(req: Request, { params }: Ctx) {
  const { id } = await params
  const fd = await req.formData()

  const slug = (fd.get('slug') as string | null)?.trim()
  const title = (fd.get('title') as string | null)?.trim()
  const category = (fd.get('category') as string | null)?.trim()
  const themesRaw = fd.getAll('themes') as string[]
  const description = (fd.get('description') as string | null)?.trim()
  const outrosRaw = (fd.get('authors') as string | null) ?? ''
  const startDateStr = (fd.get('startDate') as string | null)?.trim()
  const endDateStr = (fd.get('endDate') as string | null)?.trim()
  const gitUrl = (fd.get('gitUrl') as string | null)?.trim() || null
  const publicationUrl = (fd.get('publicationUrl') as string | null)?.trim() || null
  const advisorId = (fd.get('advisorId') as string | null)?.trim() || null
  const coAdvisorId = (fd.get('coAdvisorId') as string | null)?.trim() || null
  const researchLeadId = (fd.get('researchLeadId') as string | null)?.trim() || null
  const imageFile = fd.get('image') as File | null
  const removeImage = fd.get('removeImage') === 'true'
  const pdfFile = fd.get('pdf') as File | null
  const removePdf = fd.get('removePdf') === 'true'

  if (!slug || !title || !category || !description || !startDateStr) {
    return NextResponse.json({ error: 'Campos obrigatórios faltando.' }, { status: 400 })
  }

  const authors = outrosRaw
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)

  const update: Record<string, unknown> = {
    slug,
    title,
    category,
    themes: themesRaw,
    description,
    authors,
    startDate: new Date(startDateStr),
    endDate: endDateStr ? new Date(endDateStr) : null,
    gitUrl,
    publicationUrl,
    advisorId,
    coAdvisorId,
    researchLeadId,
    updatedAt: new Date(),
  }

  if (removeImage) {
    update.image = null
    update.imageMimeType = null
  } else if (imageFile && imageFile.size > 0) {
    update.image = Buffer.from(await imageFile.arrayBuffer())
    update.imageMimeType = imageFile.type
  }

  if (removePdf) {
    update.pdf = null
    update.pdfMimeType = null
  } else if (pdfFile && pdfFile.size > 0) {
    update.pdf = Buffer.from(await pdfFile.arrayBuffer())
    update.pdfMimeType = pdfFile.type
  }

  await db.update(projects).set(update).where(eq(projects.id, id))
  return NextResponse.json({ ok: true })
}

export async function DELETE(_: Request, { params }: Ctx) {
  const { id } = await params
  await db.delete(projects).where(eq(projects.id, id))
  return NextResponse.json({ ok: true })
}
