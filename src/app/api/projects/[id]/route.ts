import { NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'

import { db } from '@/lib/db'
import { fetchProjectHydratedById } from '@/lib/db/project-queries'
import { syncProjectThemes } from '@/lib/db/sync-project-themes'
import { projectCategoryManagerBadgeClasses } from '@/lib/project-category-badge'
import { projects } from '@/lib/db/schema'
import { parseProjectForm } from '@/lib/validation/projects-api'
import {
  uuidParamSafeParse,
  validationErrorResponse,
} from '@/lib/validation/team-api'
import {
  validateImageUpload,
  validatePdfUpload,
  uploadErrorResponse,
} from '@/lib/upload-validation'

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
  const idParsed = uuidParamSafeParse(id)
  if (!idParsed.success) return validationErrorResponse(idParsed.error)

  const row = await fetchProjectHydratedById(id)
  if (!row)
    return NextResponse.json(
      { error: 'Projeto não encontrado.' },
      { status: 404 }
    )
  return NextResponse.json(serializeManagerProject(row))
}

export async function PUT(req: Request, { params }: Ctx) {
  const { id } = await params
  const idParsed = uuidParamSafeParse(id)
  if (!idParsed.success) return validationErrorResponse(idParsed.error)

  const fd = await req.formData()

  const parsed = parseProjectForm(fd)
  if (!parsed.success) return validationErrorResponse(parsed.error)

  const d = parsed.data
  const imageFile = fd.get('image') as File | null
  const removeImage = fd.get('removeImage') === 'true'
  const pdfFile = fd.get('pdf') as File | null
  const removePdf = fd.get('removePdf') === 'true'

  const update: Record<string, unknown> = {
    slug: d.slug,
    title: d.title,
    categoryId: d.categoryId,
    description: d.description,
    authors: d.authors,
    startDate: new Date(d.startDate),
    endDate: d.endDate ? new Date(d.endDate) : null,
    gitUrl: d.gitUrl,
    publicationUrl: d.publicationUrl,
    advisorId: d.advisorId,
    coAdvisorId: d.coAdvisorId,
    researchLeadId: d.researchLeadId,
    updatedAt: new Date(),
  }

  if (removeImage) {
    update.image = null
    update.imageMimeType = null
  } else if (imageFile && imageFile.size > 0) {
    const buf = new Uint8Array(await imageFile.arrayBuffer())
    const err = validateImageUpload(imageFile, buf)
    if (err) return uploadErrorResponse(err)
    update.image = Buffer.from(buf)
    update.imageMimeType = imageFile.type
  }

  if (removePdf) {
    update.pdf = null
    update.pdfMimeType = null
  } else if (pdfFile && pdfFile.size > 0) {
    const buf = new Uint8Array(await pdfFile.arrayBuffer())
    const err = validatePdfUpload(pdfFile, buf)
    if (err) return uploadErrorResponse(err)
    update.pdf = Buffer.from(buf)
    update.pdfMimeType = pdfFile.type
  }

  const updated = await db
    .update(projects)
    .set(update)
    .where(eq(projects.id, id))
    .returning({ id: projects.id })

  if (updated.length === 0) {
    return NextResponse.json(
      { error: 'Projeto não encontrado.' },
      { status: 404 }
    )
  }

  await syncProjectThemes(id, d.themeIds)
  return NextResponse.json({ ok: true })
}

export async function DELETE(_: Request, { params }: Ctx) {
  const { id } = await params
  const idParsed = uuidParamSafeParse(id)
  if (!idParsed.success) return validationErrorResponse(idParsed.error)

  const deleted = await db
    .delete(projects)
    .where(eq(projects.id, id))
    .returning({ id: projects.id })

  if (deleted.length === 0) {
    return NextResponse.json(
      { error: 'Projeto não encontrado.' },
      { status: 404 }
    )
  }

  return NextResponse.json({ ok: true })
}
