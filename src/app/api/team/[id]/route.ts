import { NextRequest, NextResponse } from 'next/server'
import { count, eq, or } from 'drizzle-orm'

import { db } from '@/lib/db'
import {
  projects,
  teamCategories,
  teamDegreeLevels,
  teamMembers,
  teamNamePrefixes,
} from '@/lib/db/schema'
import {
  parseTeamMemberForm,
  uuidParamSafeParse,
} from '@/lib/validation/team-api'

type Ctx = { params: Promise<{ id: string }> }

export async function PUT(req: NextRequest, { params }: Ctx) {
  try {
    const { id } = await params
    const idCheck = uuidParamSafeParse(id)
    if (!idCheck.success) {
      return NextResponse.json(
        {
          error: idCheck.error.issues[0]?.message ?? 'Identificador inválido.',
        },
        { status: 400 }
      )
    }

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
      removePhoto,
      active,
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const patch: Record<string, any> = {
      categoryId,
      namePrefixId,
      degreeLevelId,
      formationInstitution,
      name,
      qualification,
      description,
      linkedinUrl,
      lattesUrl,
      updatedAt: new Date(),
    }

    if (removePhoto) {
      patch.photo = null
      patch.photoMimeType = null
    }

    const photoFile = fd.get('photo') as File | null
    if (photoFile && photoFile.size > 0) {
      patch.photo = Buffer.from(await photoFile.arrayBuffer())
      patch.photoMimeType = photoFile.type
    }

    if (active !== undefined) {
      patch.active = active === 'true'
    }

    const [updated] = await db
      .update(teamMembers)
      .set(patch)
      .where(eq(teamMembers.id, id))
      .returning({ id: teamMembers.id, name: teamMembers.name })

    if (!updated)
      return NextResponse.json({ error: 'Não encontrado' }, { status: 404 })
    return NextResponse.json(updated)
  } catch (err) {
    console.error('[PUT /api/team/:id]', err)
    return NextResponse.json(
      { error: 'Erro ao atualizar membro' },
      { status: 500 }
    )
  }
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  try {
    const { id } = await params
    const idCheck = uuidParamSafeParse(id)
    if (!idCheck.success) {
      return NextResponse.json(
        {
          error: idCheck.error.issues[0]?.message ?? 'Identificador inválido.',
        },
        { status: 400 }
      )
    }

    const [linkRow] = await db
      .select({ c: count() })
      .from(projects)
      .where(
        or(
          eq(projects.advisorId, id),
          eq(projects.coAdvisorId, id),
          eq(projects.researchLeadId, id)
        )
      )

    const linkedCount = Number(linkRow?.c ?? 0)
    if (linkedCount > 0) {
      return NextResponse.json(
        {
          error:
            'Este membro está vinculado a um ou mais projetos (orientador, coorientador ou liderança). Inative-o em “Editar membro” para ocultá-lo da equipe pública sem perder os vínculos.',
        },
        { status: 409 }
      )
    }

    const [deleted] = await db
      .delete(teamMembers)
      .where(eq(teamMembers.id, id))
      .returning({ id: teamMembers.id })

    if (!deleted) {
      return NextResponse.json({ error: 'Não encontrado' }, { status: 404 })
    }

    return new NextResponse(null, { status: 204 })
  } catch (err) {
    console.error('[DELETE /api/team/:id]', err)
    return NextResponse.json(
      { error: 'Erro ao remover membro' },
      { status: 500 }
    )
  }
}
