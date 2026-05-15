import { z } from 'zod'

import { parseMonthInputToUtcDate } from '@/lib/about-timeline-date'

function formString(fd: FormData, key: string): string {
  const v = fd.get(key)
  return typeof v === 'string' ? v : ''
}

export const aboutTimelineFormSchema = z
  .object({
    date: z.string().trim().min(1, 'Indique o mês e o ano.'),
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
  })
  .superRefine((data, ctx) => {
    if (!parseMonthInputToUtcDate(data.date)) {
      ctx.addIssue({
        code: 'custom',
        path: ['date'],
        message: 'Data inválida: use mês e ano válidos (YYYY-MM).',
      })
    }
  })

export function parseAboutTimelineForm(fd: FormData) {
  return aboutTimelineFormSchema.safeParse({
    date: formString(fd, 'date'),
    title: formString(fd, 'title'),
    description: formString(fd, 'description'),
  })
}
