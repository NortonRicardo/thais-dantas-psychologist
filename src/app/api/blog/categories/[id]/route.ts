import { NextRequest, NextResponse } from 'next/server'
import {
  getCategoryById,
  isCategoryNameTaken,
  renameCategory,
} from '@/lib/db/blog-category-queries'
import { blogCategoryWriteSchema } from '@/lib/validation/blog-category-api'
import {
  uuidParamSafeParse,
  validationErrorResponse,
} from '@/lib/validation/api'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const idParsed = uuidParamSafeParse(id)
    if (!idParsed.success) return validationErrorResponse(idParsed.error)

    const raw = await req.json()
    const parsed = blogCategoryWriteSchema.safeParse(raw)
    if (!parsed.success) return validationErrorResponse(parsed.error)

    const existing = await getCategoryById(id)
    if (!existing) {
      return NextResponse.json(
        { error: 'Categoria não encontrada' },
        { status: 404 }
      )
    }

    if (
      parsed.data.name !== existing.name &&
      (await isCategoryNameTaken(parsed.data.name))
    ) {
      return NextResponse.json(
        { error: 'Já existe uma categoria com esse nome.' },
        { status: 409 }
      )
    }

    const updated = await renameCategory(id, parsed.data.name)
    return NextResponse.json(updated)
  } catch (err) {
    console.error('[PATCH /api/blog/categories/:id]', err)
    return NextResponse.json(
      { error: 'Erro ao renomear categoria' },
      { status: 500 }
    )
  }
}
