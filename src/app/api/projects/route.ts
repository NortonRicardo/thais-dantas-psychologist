import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { projects } from '@/lib/db/schema'
import { fetchTeamMembersDisplayMap } from '@/lib/db/team-member-display-map'

export async function GET() {
  const rows = await db
    .select({
      id: projects.id,
      slug: projects.slug,
      title: projects.title,
      category: projects.category,
      themes: projects.themes,
      description: projects.description,
      imageMimeType: projects.imageMimeType,
      pdfMimeType: projects.pdfMimeType,
      authors: projects.authors,
      startDate: projects.startDate,
      endDate: projects.endDate,
      gitUrl: projects.gitUrl,
      publicationUrl: projects.publicationUrl,
      advisorId: projects.advisorId,
      coAdvisorId: projects.coAdvisorId,
      researchLeadId: projects.researchLeadId,
      updatedAt: projects.updatedAt,
    })
    .from(projects)
    .orderBy(projects.startDate)

  const memberMap = await fetchTeamMembersDisplayMap()

  const result = rows.map(r => ({
    ...r,
    startDate: r.startDate.toISOString(),
    endDate: r.endDate ? r.endDate.toISOString() : null,
    updatedAt: r.updatedAt.toISOString(),
    advisorName: r.advisorId ? (memberMap[r.advisorId] ?? null) : null,
    coAdvisorName: r.coAdvisorId ? (memberMap[r.coAdvisorId] ?? null) : null,
    researchLeadName: r.researchLeadId ? (memberMap[r.researchLeadId] ?? null) : null,
  }))

  return NextResponse.json(result)
}

export async function POST(req: Request) {
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
  const pdfFile = fd.get('pdf') as File | null

  if (!slug || !title || !category || !description || !startDateStr) {
    return NextResponse.json({ error: 'Campos obrigatórios faltando.' }, { status: 400 })
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
      category,
      themes: themesRaw,
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

  return NextResponse.json(row, { status: 201 })
}
