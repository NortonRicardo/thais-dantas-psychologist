import { NextRequest, NextResponse } from 'next/server'
import { asc, eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { teamCategories, teamMembers, teamNamePrefixes } from '@/lib/db/schema'
import { normalizeLinkedinUrl } from '@/lib/team-linkedin'
import { teamMemberDisplayName } from '@/lib/team-member-display'

export async function GET() {
  try {
    const rows = await db
      .select({
        id: teamMembers.id,
        categoryId: teamMembers.categoryId,
        categoryTitle: teamCategories.title,
        categoryColor: teamCategories.color,
        namePrefixId: teamMembers.namePrefixId,
        namePrefixLabel: teamNamePrefixes.label,
        name: teamMembers.name,
        qualification: teamMembers.qualification,
        description: teamMembers.description,
        photoMimeType: teamMembers.photoMimeType,
        linkedinUrl: teamMembers.linkedinUrl,
        createdAt: teamMembers.createdAt,
        updatedAt: teamMembers.updatedAt,
      })
      .from(teamMembers)
      .innerJoin(teamCategories, eq(teamMembers.categoryId, teamCategories.id))
      .leftJoin(teamNamePrefixes, eq(teamMembers.namePrefixId, teamNamePrefixes.id))
      .orderBy(asc(teamCategories.title), asc(teamMembers.createdAt))

    return NextResponse.json(
      rows.map(r => ({
        ...r,
        displayName: teamMemberDisplayName(r.name, r.namePrefixLabel),
      }))
    )
  } catch (err) {
    console.error('[GET /api/team]', err)
    return NextResponse.json({ error: 'Erro ao buscar equipe' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const fd = await req.formData()

    const categoryId = (fd.get('categoryId') as string)?.trim()
    const namePrefixIdRaw = (fd.get('namePrefixId') as string)?.trim()
    const namePrefixId =
      namePrefixIdRaw && namePrefixIdRaw !== '__none__' ? namePrefixIdRaw : null
    const name = (fd.get('name') as string)?.trim()
    const qualification = (fd.get('qualification') as string)?.trim()
    const description = (fd.get('description') as string)?.trim() || null
    const linkedinUrl = normalizeLinkedinUrl(fd.get('linkedinUrl') as string | null)

    if (fd.get('linkedinUrl') && String(fd.get('linkedinUrl')).trim() && !linkedinUrl) {
      return NextResponse.json({ error: 'URL do LinkedIn inválida (use linkedin.com/…)' }, { status: 400 })
    }

    if (!categoryId || !name || !qualification) {
      return NextResponse.json({ error: 'Campos obrigatórios faltando' }, { status: 400 })
    }

    const [cat] = await db
      .select({ id: teamCategories.id })
      .from(teamCategories)
      .where(eq(teamCategories.id, categoryId))
      .limit(1)

    if (!cat) {
      return NextResponse.json({ error: 'Categoria inválida' }, { status: 400 })
    }

    if (namePrefixId) {
      const [pfx] = await db
        .select({ id: teamNamePrefixes.id })
        .from(teamNamePrefixes)
        .where(eq(teamNamePrefixes.id, namePrefixId))
        .limit(1)
      if (!pfx) {
        return NextResponse.json({ error: 'Tratamento inválido' }, { status: 400 })
      }
    }

    const photoFile = fd.get('photo') as File | null
    let photo: Buffer | undefined
    let photoMimeType: string | undefined

    if (photoFile && photoFile.size > 0) {
      photo = Buffer.from(await photoFile.arrayBuffer())
      photoMimeType = photoFile.type
    }

    const [created] = await db
      .insert(teamMembers)
      .values({
        categoryId,
        namePrefixId,
        name,
        qualification,
        description,
        linkedinUrl,
        photo,
        photoMimeType,
      })
      .returning({ id: teamMembers.id, name: teamMembers.name })

    return NextResponse.json(created, { status: 201 })
  } catch (err) {
    console.error('[POST /api/team]', err)
    return NextResponse.json({ error: 'Erro ao criar membro' }, { status: 500 })
  }
}
