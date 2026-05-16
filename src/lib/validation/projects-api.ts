import { z } from 'zod'

function fd(form: FormData, key: string): string {
  const v = form.get(key)
  return typeof v === 'string' ? v : ''
}

const optionalUuid = z
  .string()
  .trim()
  .transform((s): string | null => (!s || s === '__none__' ? null : s))
  .pipe(
    z.union([z.null(), z.string().uuid({ error: 'ID de membro inválido.' })])
  )

const optionalUrl = z
  .string()
  .trim()
  .max(2000, 'URL: no máximo 2000 caracteres.')
  .transform(s => s || null)

const optionalTailwind = (maxLen: number, label: string) =>
  z.string().trim().max(maxLen, `${label}: no máximo ${maxLen} caracteres.`)

export const projectFormSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1, 'Slug obrigatório.')
    .max(200, 'Slug: no máximo 200 caracteres.'),
  title: z
    .string()
    .trim()
    .min(1, 'Título obrigatório.')
    .max(300, 'Título: no máximo 300 caracteres.'),
  categoryId: z.string().uuid('Categoria inválida.'),
  themeIds: z
    .array(z.string().uuid('ID de tema inválido.'))
    .min(1, 'Selecione ao menos um tema.'),
  description: z
    .string()
    .trim()
    .min(1, 'Descrição obrigatória.')
    .max(8000, 'Descrição: no máximo 8000 caracteres.'),
  otherMemberIds: z
    .array(z.string().uuid('ID de membro inválido.'))
    .default([]),
  startDate: z
    .string()
    .trim()
    .min(1, 'Data de início obrigatória.')
    .refine(s => !isNaN(Date.parse(s)), 'Data de início inválida.'),
  endDate: z
    .string()
    .trim()
    .transform(s => s || null)
    .pipe(
      z.union([
        z.null(),
        z
          .string()
          .refine(s => !isNaN(Date.parse(s)), 'Data de término inválida.'),
      ])
    ),
  gitUrl: optionalUrl,
  publicationUrl: optionalUrl,
  advisorId: optionalUuid,
  coAdvisorId: optionalUuid,
  researchLeadId: z
    .string()
    .trim()
    .min(1, 'Selecione o responsável pela pesquisa.')
    .uuid({ error: 'Responsável inválido.' }),
})

export type ProjectFormParsed = z.infer<typeof projectFormSchema>

export function parseProjectForm(form: FormData) {
  const themeIds = (form.getAll('themeIds') as string[]).map(t => t.trim()).filter(Boolean)
  const otherMemberIds = (form.getAll('otherMemberIds') as string[]).map(t => t.trim()).filter(Boolean)

  return projectFormSchema.safeParse({
    slug: fd(form, 'slug'),
    title: fd(form, 'title'),
    categoryId: fd(form, 'categoryId'),
    themeIds,
    description: fd(form, 'description'),
    otherMemberIds,
    startDate: fd(form, 'startDate'),
    endDate: fd(form, 'endDate'),
    gitUrl: fd(form, 'gitUrl'),
    publicationUrl: fd(form, 'publicationUrl'),
    advisorId: fd(form, 'advisorId'),
    coAdvisorId: fd(form, 'coAdvisorId'),
    researchLeadId: fd(form, 'researchLeadId'),
  })
}

export const projectCategoryFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Título obrigatório.')
    .max(200, 'Título: no máximo 200 caracteres.'),
  color: z
    .string()
    .trim()
    .min(1, 'Cor obrigatória.')
    .max(240, 'Cor: no máximo 240 caracteres.'),
  chipBg: optionalTailwind(240, 'chipBg'),
  chipBorder: optionalTailwind(240, 'chipBorder'),
  chipText: optionalTailwind(240, 'chipText'),
})

export function parseProjectCategoryForm(form: FormData) {
  return projectCategoryFormSchema.safeParse({
    title: fd(form, 'title'),
    color: fd(form, 'color'),
    chipBg: fd(form, 'chipBg'),
    chipBorder: fd(form, 'chipBorder'),
    chipText: fd(form, 'chipText'),
  })
}

export const projectThemeFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Nome obrigatório.')
    .max(200, 'Nome: no máximo 200 caracteres.'),
  slug: optionalTailwind(200, 'Slug'),
  color: z
    .string()
    .trim()
    .min(1, 'Cor obrigatória.')
    .max(240, 'Cor: no máximo 240 caracteres.'),
  pillColor: optionalTailwind(240, 'pillColor'),
  filterBg: optionalTailwind(240, 'filterBg'),
  filterBorder: optionalTailwind(240, 'filterBorder'),
  filterText: optionalTailwind(240, 'filterText'),
  filterActiveBg: optionalTailwind(240, 'filterActiveBg'),
})

export function parseProjectThemeForm(form: FormData) {
  return projectThemeFormSchema.safeParse({
    name: fd(form, 'name'),
    slug: fd(form, 'slug'),
    color: fd(form, 'color'),
    pillColor: fd(form, 'pillColor'),
    filterBg: fd(form, 'filterBg'),
    filterBorder: fd(form, 'filterBorder'),
    filterText: fd(form, 'filterText'),
    filterActiveBg: fd(form, 'filterActiveBg'),
  })
}
