import { NextResponse } from 'next/server'
import { z } from 'zod'

import { normalizeLinkedinUrl } from '@/lib/team-linkedin'
import { normalizeLattesUrl } from '@/lib/team-lattes'

export function teamFormString(fd: FormData, key: string): string {
  const v = fd.get(key)
  return typeof v === 'string' ? v : ''
}

/** ID de rota (membro, categoria, etc.) — UUID */
export const teamUuidParamSchema = z.string().uuid({
  error: 'Identificador inválido.',
})

const optionalFkUuid = z
  .string()
  .transform((s): string | null => {
    const t = s.trim()
    if (!t || t === '__none__') return null
    return t
  })
  .pipe(
    z.union([
      z.null(),
      z.string().uuid({
        error: 'Tratamento, grau ou categoria referenciados são inválidos.',
      }),
    ])
  )

const teamMemberFieldsSchema = z
  .object({
    categoryId: z.uuid({ error: 'Categoria obrigatória ou inválida.' }),
    namePrefixId: optionalFkUuid,
    degreeLevelId: optionalFkUuid,
    formationInstitution: z
      .string()
      .trim()
      .max(280, 'Instituição de formação: no máximo 280 caracteres.')
      .transform(s => (s === '' ? null : s)),
    name: z
      .string()
      .trim()
      .min(1, 'Nome é obrigatório.')
      .max(200, 'Nome: no máximo 200 caracteres.'),
    qualification: z
      .string()
      .trim()
      .min(1, 'Área / atuação é obrigatória.')
      .max(500, 'Área / atuação: no máximo 500 caracteres.'),
    description: z
      .string()
      .trim()
      .max(8000, 'Descrição: no máximo 8000 caracteres.')
      .transform(s => (s === '' ? null : s)),
    linkedinUrl: z.string().trim(),
    lattesUrl: z.string().trim(),
    removePhoto: z.boolean().optional().default(false),
    active: z.enum(['true', 'false']).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.linkedinUrl && !normalizeLinkedinUrl(data.linkedinUrl)) {
      ctx.addIssue({
        code: 'custom',
        path: ['linkedinUrl'],
        message: 'URL do LinkedIn inválida (use linkedin.com/…).',
      })
    }
    if (data.lattesUrl && !normalizeLattesUrl(data.lattesUrl)) {
      ctx.addIssue({
        code: 'custom',
        path: ['lattesUrl'],
        message:
          'URL do Lattes inválida (use lattes.cnpq.br ou buscatextual.cnpq.br/…).',
      })
    }
  })

export type TeamMemberFormParsed = Omit<
  z.infer<typeof teamMemberFieldsSchema>,
  'linkedinUrl' | 'lattesUrl' | 'active'
> & {
  linkedinUrl: string | null
  lattesUrl: string | null
  active?: 'true' | 'false'
}

export function extractTeamMemberForm(fd: FormData) {
  return {
    categoryId: teamFormString(fd, 'categoryId').trim(),
    namePrefixId: teamFormString(fd, 'namePrefixId'),
    degreeLevelId: teamFormString(fd, 'degreeLevelId'),
    formationInstitution: teamFormString(fd, 'formationInstitution').trim(),
    name: teamFormString(fd, 'name').trim(),
    qualification: teamFormString(fd, 'qualification').trim(),
    description: teamFormString(fd, 'description').trim(),
    linkedinUrl: teamFormString(fd, 'linkedinUrl').trim(),
    lattesUrl: teamFormString(fd, 'lattesUrl').trim(),
    removePhoto: teamFormString(fd, 'removePhoto') === 'true',
    active: fd.has('active') ? teamFormString(fd, 'active').trim() : undefined,
  }
}

export function parseTeamMemberForm(fd: FormData):
  | {
      ok: true
      data: TeamMemberFormParsed
    }
  | { ok: false; response: NextResponse } {
  const raw = extractTeamMemberForm(fd)
  const parsed = teamMemberFieldsSchema.safeParse(raw)
  if (!parsed.success)
    return { ok: false, response: validationErrorResponse(parsed.error) }
  const d = parsed.data
  const linkedinUrl = normalizeLinkedinUrl(d.linkedinUrl) ?? null
  const lattesUrl = normalizeLattesUrl(d.lattesUrl) ?? null
  return {
    ok: true,
    data: {
      categoryId: d.categoryId,
      namePrefixId: d.namePrefixId,
      degreeLevelId: d.degreeLevelId,
      formationInstitution: d.formationInstitution,
      name: d.name,
      qualification: d.qualification,
      description: d.description,
      linkedinUrl,
      lattesUrl,
      removePhoto: d.removePhoto,
      active: d.active,
    },
  }
}

/** Categorias da equipe (título + classe Tailwind) */
export const teamCategoryFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Título obrigatório.')
    .max(120, 'Título: no máximo 120 caracteres.'),
  color: z
    .string()
    .trim()
    .min(1, 'Cor/classe é obrigatória.')
    .max(160, 'Cor/classe: no máximo 160 caracteres.'),
})

export function parseTeamCategoryForm(fd: FormData) {
  return teamCategoryFormSchema.safeParse({
    title: teamFormString(fd, 'title').trim(),
    color: teamFormString(fd, 'color').trim(),
  })
}

/** Tratamento (prefixo de nome) */
export const teamPrefixFormSchema = z.object({
  label: z
    .string()
    .trim()
    .min(1, 'Rótulo obrigatório.')
    .max(120, 'Rótulo: no máximo 120 caracteres.'),
})

export function parseTeamPrefixForm(fd: FormData) {
  return teamPrefixFormSchema.safeParse({
    label: teamFormString(fd, 'label').trim(),
  })
}

/** Grau acadêmico */
export const teamDegreeLevelFormSchema = teamPrefixFormSchema

export function parseTeamDegreeLevelForm(fd: FormData) {
  return parseTeamPrefixForm(fd)
}

export function validationErrorResponse(error: z.ZodError) {
  return NextResponse.json(
    { error: error.issues[0]?.message ?? 'Dados inválidos.' },
    { status: 400 }
  )
}

export function uuidParamSafeParse(id: string) {
  return teamUuidParamSchema.safeParse(id)
}
