import { NextRequest, NextResponse } from 'next/server'
import { asc, eq } from 'drizzle-orm'

import { db } from '@/lib/db'
import {
  teamCategories,
  teamDegreeLevels,
  teamMembers,
  teamNamePrefixes,
} from '@/lib/db/schema'
import { parseTeamMemberForm } from '@/lib/validation/team-api'
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
        degreeLevelId: teamMembers.degreeLevelId,
        degreeLevelLabel: teamDegreeLevels.label,
        formationInstitution: teamMembers.formationInstitution,
        name: teamMembers.name,
        qualification: teamMembers.qualification,
        description: teamMembers.description,
        photoMimeType: teamMembers.photoMimeType,
        linkedinUrl: teamMembers.linkedinUrl,
        lattesUrl: teamMembers.lattesUrl,
        active: teamMembers.active,
        createdAt: teamMembers.createdAt,
        updatedAt: teamMembers.updatedAt,
      })
      .from(teamMembers)
      .innerJoin(teamCategories, eq(teamMembers.categoryId, teamCategories.id))
      .leftJoin(
        teamNamePrefixes,
        eq(teamMembers.namePrefixId, teamNamePrefixes.id)
      )
      .leftJoin(
        teamDegreeLevels,
        eq(teamMembers.degreeLevelId, teamDegreeLevels.id)
      )
      .orderBy(asc(teamCategories.title), asc(teamMembers.name))

    return NextResponse.json(
      rows.map(r => ({
        ...r,
        displayName: teamMemberDisplayName(r.name, r.namePrefixLabel),
      }))
    )
  } catch (err) {
    console.error('[GET /api/team]', err)
    return NextResponse.json(
      { error: 'Erro ao buscar equipe' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const fd = await req.formData()
    const validated = parseTeamMemberForm(fd)
    if (!validated.ok) return validated.response

    const {
      categoryId,
      namePrefixId,
      degreeLevelId,
      formationInstitution,
      name,
      qualification,
      description,
      linkedinUrl,
      lattesUrl,
    } = validated.data

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
        return NextResponse.json(
          { error: 'Tratamento inválido' },
          { status: 400 }
        )
      }
    }

    if (degreeLevelId) {
      const [deg] = await db
        .select({ id: teamDegreeLevels.id })
        .from(teamDegreeLevels)
        .where(eq(teamDegreeLevels.id, degreeLevelId))
        .limit(1)
      if (!deg) {
        return NextResponse.json(
          { error: 'Grau acadêmico inválido' },
          { status: 400 }
        )
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
        degreeLevelId,
        formationInstitution,
        name,
        qualification,
        description,
        linkedinUrl,
        lattesUrl,
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
