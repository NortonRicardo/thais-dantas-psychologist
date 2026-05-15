import { z } from 'zod'

/** Payload JSON POST/PUT `/api/hardware` */
export const hardwareModulePayloadSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Título do módulo é obrigatório.')
    .max(400, 'Título do módulo: no máximo 400 caracteres.'),
  iconKey: z
    .string()
    .trim()
    .max(160, 'Chave do ícone: no máximo 160 caracteres.'),
  description: z
    .string()
    .trim()
    .min(1, 'Descrição do módulo é obrigatória.')
    .max(8000, 'Descrição do módulo: no máximo 8000 caracteres.'),
})

export const hardwareUpsertBodySchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Título do equipamento é obrigatório.')
    .max(400, 'Título do equipamento: no máximo 400 caracteres.'),
  modules: z
    .array(hardwareModulePayloadSchema)
    .max(48, 'No máximo 48 módulos neste equipamento.'),
})

export type HardwareUpsertBody = z.infer<typeof hardwareUpsertBodySchema>

function formString(fd: FormData, key: string): string {
  const v = fd.get(key)
  return typeof v === 'string' ? v : ''
}

/** Campos opcionais vindos do FormData — vazio → null na base. */
const optionalLink = z
  .string()
  .trim()
  .max(2000, 'Link: no máximo 2000 caracteres.')
  .transform(s => (s.length === 0 ? null : s))

export const developedPlatformFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Nome da plataforma é obrigatório.')
    .max(300, 'Nome: no máximo 300 caracteres.'),
  description: z
    .string()
    .trim()
    .min(1, 'Descrição é obrigatória.')
    .max(8000, 'Descrição: no máximo 8000 caracteres.'),
  badge: z
    .string()
    .trim()
    .max(240, 'Selo: no máximo 240 caracteres.')
    .transform(s => (s === '' ? null : s)),
  iconKey: z
    .string()
    .trim()
    .min(1, 'Ícone é obrigatório.')
    .max(120, 'Ícone: no máximo 120 caracteres.')
    .transform(s => s || 'cloud-sun'),
  projectLink: optionalLink,
  platformLink: optionalLink,
})

export type DevelopedPlatformFormParsed = z.infer<
  typeof developedPlatformFormSchema
>

export function parseDevelopedPlatformForm(fd: FormData) {
  return developedPlatformFormSchema.safeParse({
    title: formString(fd, 'title'),
    description: formString(fd, 'description'),
    badge: formString(fd, 'badge'),
    iconKey: formString(fd, 'iconKey'),
    projectLink: formString(fd, 'projectLink'),
    platformLink: formString(fd, 'platformLink'),
  })
}

export const collaborationPartnerFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Nome é obrigatório.')
    .max(300, 'Nome: no máximo 300 caracteres.'),
  description: z
    .string()
    .trim()
    .min(1, 'Descrição é obrigatória.')
    .max(8000, 'Descrição: no máximo 8000 caracteres.'),
})

export type CollaborationPartnerFormParsed = z.infer<
  typeof collaborationPartnerFormSchema
>

export function parseCollaborationPartnerForm(fd: FormData) {
  return collaborationPartnerFormSchema.safeParse({
    name: formString(fd, 'name'),
    description: formString(fd, 'description'),
  })
}
