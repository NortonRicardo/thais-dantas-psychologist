import { z } from 'zod'

function formString(fd: FormData, key: string): string {
  const v = fd.get(key)
  return typeof v === 'string' ? v : ''
}

function nullableTrimmed(maxLen: number, label: string) {
  return z
    .string()
    .trim()
    .max(maxLen, `${label}: no máximo ${maxLen} caracteres.`)
    .transform(val => (val === '' ? null : val))
}

/** POST/PUT `/api/events` — FormData */
export const eventFormSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, 'Título é obrigatório.')
      .max(300, 'Título: no máximo 300 caracteres.'),
    description: z
      .string()
      .trim()
      .min(1, 'Descrição é obrigatória.')
      .max(8000, 'Descrição: no máximo 8000 caracteres.'),
    dateRaw: z.string().trim().min(1, 'Data e hora são obrigatórias.'),
    type: z
      .string()
      .trim()
      .min(1, 'Tipo é obrigatório.')
      .max(120, 'Tipo: no máximo 120 caracteres.'),
    speakerMemberId: z
      .string()
      .trim()
      .min(1, 'Palestrante é obrigatório.')
      .uuid('Palestrante inválido.'),
    organizationId: z
      .string()
      .trim()
      .superRefine((val, ctx) => {
        if (val === '') return
        const r = z.string().uuid().safeParse(val)
        if (!r.success) {
          ctx.addIssue({
            code: 'custom',
            message: 'Organização inválida.',
          })
        }
      })
      .transform(val => (val === '' ? null : val)),
    link: nullableTrimmed(2000, 'Link'),
    meetLink: nullableTrimmed(2000, 'Link da sala'),
    recordingLink: nullableTrimmed(2000, 'Gravação'),
    featured: z.boolean(),
  })
  .superRefine((data, ctx) => {
    const t = Date.parse(data.dateRaw)
    if (Number.isNaN(t)) {
      ctx.addIssue({
        code: 'custom',
        path: ['date'],
        message: 'Data ou hora inválida.',
      })
    }
  })

export type EventFormParsed = z.infer<typeof eventFormSchema>

export function parseEventForm(fd: FormData) {
  return eventFormSchema.safeParse({
    title: formString(fd, 'title'),
    description: formString(fd, 'description'),
    dateRaw: formString(fd, 'date'),
    type: formString(fd, 'type'),
    speakerMemberId: formString(fd, 'speakerMemberId'),
    organizationId: formString(fd, 'organizationId'),
    link: formString(fd, 'link'),
    meetLink: formString(fd, 'meetLink'),
    recordingLink: formString(fd, 'recordingLink'),
    featured: fd.get('featured') === 'true',
  })
}

/** POST `/api/event-types` — PUT `/api/event-types/[id]` — JSON */
export const eventTypeUpsertSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Nome é obrigatório.')
    .max(120, 'Nome: no máximo 120 caracteres.'),
  iconKey: z
    .string()
    .trim()
    .max(120, 'Ícone: no máximo 120 caracteres.')
    .transform(s => (s === '' ? 'Calendar' : s)),
  color: z
    .string()
    .trim()
    .max(160, 'Cor/classe: no máximo 160 caracteres.')
    .transform(s => (s === '' ? 'bg-blue-500' : s)),
})

/** POST `/api/event-organizations` — PUT `/api/event-organizations/[id]` — FormData */
export function parseEventOrganizationForm(fd: FormData) {
  return z
    .object({
      name: z
        .string()
        .trim()
        .min(1, 'Nome é obrigatório.')
        .max(200, 'Nome: no máximo 200 caracteres.'),
    })
    .safeParse({ name: formString(fd, 'name') })
}
