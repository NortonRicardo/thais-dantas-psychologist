import { z } from 'zod'

export const blogCategoryWriteSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Nome obrigatório.')
    .max(80, 'Nome: no máximo 80 caracteres.'),
})

export type BlogCategoryWriteBody = z.infer<typeof blogCategoryWriteSchema>
