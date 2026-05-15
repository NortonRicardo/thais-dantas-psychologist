import { z } from 'zod'

/** Tipos de canal suportados (rótulo → chave de ícone a enviar na API). */
export const CONTACT_LABEL_TO_ICON = {
  'E-mail': 'mail',
  Telefone: 'phone',
  WhatsApp: 'message-circle',
  LinkedIn: 'linkedin',
  Instagram: 'instagram',
  GitHub: 'github',
  YouTube: 'youtube',
  'Twitter / X': 'twitter',
  Facebook: 'facebook',
  Site: 'globe',
  Localização: 'map-pin',
  Telegram: 'send',
  Outro: 'link',
} as const

export type ContactChannelLabel = keyof typeof CONTACT_LABEL_TO_ICON

/** Ordem dos tipos nos seletores (UI e validação). */
export const CONTACT_CHANNEL_LABEL_ORDER = [
  'E-mail',
  'Telefone',
  'WhatsApp',
  'LinkedIn',
  'Instagram',
  'GitHub',
  'YouTube',
  'Twitter / X',
  'Facebook',
  'Site',
  'Localização',
  'Telegram',
  'Outro',
] as const satisfies readonly ContactChannelLabel[]

export const contactChannelLabels = CONTACT_CHANNEL_LABEL_ORDER

export const CONTACT_TYPES_UI = CONTACT_CHANNEL_LABEL_ORDER.map(label => ({
  label,
  icon: CONTACT_LABEL_TO_ICON[label],
}))

const URL_LABELS = new Set<string>([
  'LinkedIn',
  'Instagram',
  'GitHub',
  'YouTube',
  'Twitter / X',
  'Facebook',
  'Site',
  'Telegram',
])

function refineChannelValue(
  label: ContactChannelLabel,
  value: string,
  ctx: z.RefinementCtx
) {
  const v = value.trim()
  if (!v) {
    ctx.addIssue({
      code: 'custom',
      path: ['value'],
      message: 'Campo obrigatório.',
    })
    return
  }

  if (label === 'E-mail') {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
      ctx.addIssue({
        code: 'custom',
        path: ['value'],
        message: 'Informe um e-mail válido.',
      })
    }
    return
  }

  if (label === 'Telefone' || label === 'WhatsApp') {
    if (v.replace(/\D/g, '').length < 8) {
      ctx.addIssue({
        code: 'custom',
        path: ['value'],
        message: 'Informe um número válido (ex: (62) 9 0000-0000).',
      })
    }
    return
  }

  if (URL_LABELS.has(label)) {
    if (!/^https?:\/\/.+/.test(v)) {
      ctx.addIssue({
        code: 'custom',
        path: ['value'],
        message: 'Informe uma URL válida (ex: https://…).',
      })
    }
  }
}

export const contactChannelPostSchema = z
  .object({
    label: z.enum(contactChannelLabels, {
      error: 'Tipo de canal inválido.',
    }),
    iconKey: z.string().trim().min(1, 'Ícone obrigatório.'),
    value: z
      .string()
      .max(2000, 'Descrição: no máximo 2000 caracteres.')
      .transform(s => s.trim()),
  })
  .superRefine((data, ctx) => {
    const expected = CONTACT_LABEL_TO_ICON[data.label]
    if (data.iconKey !== expected) {
      ctx.addIssue({
        code: 'custom',
        path: ['iconKey'],
        message: 'Ícone inconsistente com o tipo selecionado.',
      })
    }
    refineChannelValue(data.label, data.value, ctx)
  })

export type ContactChannelPostBody = z.infer<typeof contactChannelPostSchema>

export const contactInfoPutSchema = z.object({
  directorTeamMemberId: z.union([
    z.null(),
    z.string().uuid({ error: 'Identificador do membro inválido.' }),
  ]),
  mapUrl: z
    .string()
    .max(4000, 'URL do mapa: no máximo 4000 caracteres.')
    .transform(s => s.trim()),
})

export type ContactInfoPutBody = z.infer<typeof contactInfoPutSchema>
