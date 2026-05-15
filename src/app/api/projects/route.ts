import { NextResponse } from 'next/server'

import { fetchProjectsHydrated } from '@/lib/db/project-queries'
import { syncProjectThemes } from '@/lib/db/sync-project-themes'
import { projectCategoryManagerBadgeClasses } from '@/lib/project-category-badge'
import { db } from '@/lib/db'
import { projects } from '@/lib/db/schema'
import { parseProjectForm } from '@/lib/validation/projects-api'
import { validationErrorResponse } from '@/lib/validation/team-api'
import {
  validateImageUpload,
  validatePdfUpload,
  uploadErrorResponse,
} from '@/lib/upload-validation'

function serializeManagerProject(
  h: Awaited<ReturnType<typeof fetchProjectsHydrated>>[number]
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

export async function GET() {
  const rows = await fetchProjectsHydrated()
  return NextResponse.json(rows.map(serializeManagerProject))
}

export async function POST(req: Request) {
  const fd = await req.formData()

  const parsed = parseProjectForm(fd)
  if (!parsed.success) return validationErrorResponse(parsed.error)

  const d = parsed.data
  const imageFile = fd.get('image') as File | null
  const pdfFile = fd.get('pdf') as File | null

  let image: Buffer | undefined
  let imageMimeType: string | undefined
  if (imageFile && imageFile.size > 0) {
    const buf = new Uint8Array(await imageFile.arrayBuffer())
    const err = validateImageUpload(imageFile, buf)
    if (err) return uploadErrorResponse(err)
    image = Buffer.from(buf)
    imageMimeType = imageFile.type
  }

  let pdf: Buffer | undefined
  let pdfMimeType: string | undefined
  if (pdfFile && pdfFile.size > 0) {
    const buf = new Uint8Array(await pdfFile.arrayBuffer())
    const err = validatePdfUpload(pdfFile, buf)
    if (err) return uploadErrorResponse(err)
    pdf = Buffer.from(buf)
    pdfMimeType = pdfFile.type
  }

  const [row] = await db
    .insert(projects)
    .values({
      slug: d.slug,
      title: d.title,
      categoryId: d.categoryId,
      description: d.description,
      image,
      imageMimeType: imageMimeType ?? null,
      pdf,
      pdfMimeType: pdfMimeType ?? null,
      authors: d.authors,
      startDate: new Date(d.startDate),
      endDate: d.endDate ? new Date(d.endDate) : null,
      gitUrl: d.gitUrl,
      publicationUrl: d.publicationUrl,
      advisorId: d.advisorId,
      coAdvisorId: d.coAdvisorId,
      researchLeadId: d.researchLeadId,
    })
    .returning({ id: projects.id })

  if (!row) {
    return NextResponse.json(
      { error: 'Erro ao criar projeto.' },
      { status: 500 }
    )
  }

  await syncProjectThemes(row.id, d.themeIds)

  return NextResponse.json(row, { status: 201 })
}
