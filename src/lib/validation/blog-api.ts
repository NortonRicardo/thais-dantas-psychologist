import { z } from 'zod'

const SLUG_REGEX = /^[a-z0-9]+(-[a-z0-9]+)*$/

export const blogPostWriteSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Título obrigatório.')
    .max(200, 'Título: no máximo 200 caracteres.'),
  subtitle: z
    .string()
    .trim()
    .max(300, 'Subtítulo: no máximo 300 caracteres.')
    .optional()
    .transform(v => (v ? v : undefined)),
  category: z
    .string()
    .trim()
    .min(1, 'Categoria obrigatória.')
    .max(80, 'Categoria: no máximo 80 caracteres.'),
  slug: z
    .string()
    .trim()
    .max(200, 'Slug: no máximo 200 caracteres.')
    .regex(
      SLUG_REGEX,
      'Slug inválido — use apenas letras minúsculas, números e hífens.'
    )
    .optional()
    .transform(v => (v ? v : undefined)),
  coverImageUrl: z
    .string()
    .trim()
    .max(2000, 'URL da capa: no máximo 2000 caracteres.')
    .optional()
    .nullable()
    .transform(v => (v ? v : null)),
  bodyHtml: z.string().min(1, 'Conteúdo obrigatório.'),
  published: z.boolean(),
})

export type BlogPostWriteBody = z.infer<typeof blogPostWriteSchema>

export const blogListQuerySchema = z.object({
  search: z
    .string()
    .trim()
    .optional()
    .transform(v => (v ? v : undefined)),
  category: z
    .string()
    .trim()
    .optional()
    .transform(v => (v ? v : undefined)),
  sort: z
    .enum(['recent', 'oldest', 'most_read', 'az', 'za'])
    .optional()
    .default('recent'),
  page: z.coerce.number().int().min(1).optional().default(1),
  perPage: z.coerce.number().int().min(1).max(50).optional().default(6),
})

export type BlogListQuery = z.infer<typeof blogListQuerySchema>
