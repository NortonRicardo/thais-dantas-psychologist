import { NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'

import { db } from '@/lib/db'
import { fetchProjectHydratedById } from '@/lib/db/project-queries'
import { syncProjectThemes } from '@/lib/db/sync-project-themes'
import { projectCategoryManagerBadgeClasses } from '@/lib/project-category-badge'
import { projects } from '@/lib/db/schema'

type Ctx = { params: Promise<{ id: string }> }

function serializeManagerProject(
  h: NonNullable<Awaited<ReturnType<typeof fetchProjectHydratedById>>>
) {
  return {
    id: h.id,
    slug: h.slug,
    title: h.title,
    category: h.categoryTitle,
    categoryId: h.categoryId,
    categoryBadgeClass: projectCategoryManagerBadgeClasses(h.categoryColor),
    themes: h.themes,
    themeIds: h.themeIds,
    description: h.description,
    imageMimeType: h.imageMimeType,
    pdfMimeType: h.pdfMimeType,
    authors: h.authors,
    startDate: h.startDate,
    endDate: h.endDate,
    gitUrl: h.gitUrl,
    publicationUrl: h.publicationUrl,
    advisorId: h.advisorId,
    coAdvisorId: h.coAdvisorId,
    researchLeadId: h.researchLeadId,
    advisorName: h.advisorName,
    coAdvisorName: h.coAdvisorName,
    researchLeadName: h.researchLeadName,
    updatedAt: h.updatedAt,
  }
}

export async function GET(_: Request, { params }: Ctx) {
  const { id } = await params
  const row = await fetchProjectHydratedById(id)
  if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(serializeManagerProject(row))
}

export async function PUT(req: Request, { params }: Ctx) {
  const { id } = await params
  const fd = await req.formData()

  const slug = (fd.get('slug') as string | null)?.trim()
  const title = (fd.get('title') as string | null)?.trim()
  const categoryId = (fd.get('categoryId') as string | null)?.trim()
  const themeIds = (fd.getAll('themeIds') as string[])
    .map(t => t.trim())
    .filter(Boolean)
  const description = (fd.get('description') as string | null)?.trim()
  const outrosRaw = (fd.get('authors') as string | null) ?? ''
  const startDateStr = (fd.get('startDate') as string | null)?.trim()
  const endDateStr = (fd.get('endDate') as string | null)?.trim()
  const gitUrl = (fd.get('gitUrl') as string | null)?.trim() || null
  const publicationUrl =
    (fd.get('publicationUrl') as string | null)?.trim() || null
  const advisorId = (fd.get('advisorId') as string | null)?.trim() || null
  const coAdvisorId = (fd.get('coAdvisorId') as string | null)?.trim() || null
  const researchLeadId =
    (fd.get('researchLeadId') as string | null)?.trim() || null
  const imageFile = fd.get('image') as File | null
  const removeImage = fd.get('removeImage') === 'true'
  const pdfFile = fd.get('pdf') as File | null
  const removePdf = fd.get('removePdf') === 'true'

  if (!slug || !title || !categoryId || !description || !startDateStr) {
    return NextResponse.json(
      { error: 'Campos obrigatórios faltando.' },
      { status: 400 }
    )
  }

  if (themeIds.length === 0) {
    return NextResponse.json(
      { error: 'Selecione ao menos um tema.' },
      { status: 400 }
    )
  }

  const authors = outrosRaw
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)

  const update: Record<string, unknown> = {
    slug,
    title,
    categoryId,
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
  await syncProjectThemes(id, themeIds)
  return NextResponse.json({ ok: true })
}

export async function DELETE(_: Request, { params }: Ctx) {
  const { id } = await params
  await db.delete(projects).where(eq(projects.id, id))
  return NextResponse.json({ ok: true })
}
