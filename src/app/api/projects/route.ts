import { NextResponse } from 'next/server'

import { fetchProjectsHydrated } from '@/lib/db/project-queries'
import { syncProjectThemes } from '@/lib/db/sync-project-themes'
import { projectCategoryManagerBadgeClasses } from '@/lib/project-category-badge'
import { db } from '@/lib/db'
import { projects } from '@/lib/db/schema'

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
  const pdfFile = fd.get('pdf') as File | null

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

  let image: Buffer | undefined
  let imageMimeType: string | undefined
  if (imageFile && imageFile.size > 0) {
    image = Buffer.from(await imageFile.arrayBuffer())
    imageMimeType = imageFile.type
  }

  let pdf: Buffer | undefined
  let pdfMimeType: string | undefined
  if (pdfFile && pdfFile.size > 0) {
    pdf = Buffer.from(await pdfFile.arrayBuffer())
    pdfMimeType = pdfFile.type
  }

  const [row] = await db
    .insert(projects)
    .values({
      slug,
      title,
      categoryId,
      description,
      image,
      imageMimeType: imageMimeType ?? null,
      pdf,
      pdfMimeType: pdfMimeType ?? null,
      authors,
      startDate: new Date(startDateStr),
      endDate: endDateStr ? new Date(endDateStr) : null,
      gitUrl,
      publicationUrl,
      advisorId,
      coAdvisorId,
      researchLeadId,
    })
    .returning({ id: projects.id })

  if (!row) {
    return NextResponse.json(
      { error: 'Erro ao criar projeto.' },
      { status: 500 }
    )
  }

  await syncProjectThemes(row.id, themeIds)

  return NextResponse.json(row, { status: 201 })
}
