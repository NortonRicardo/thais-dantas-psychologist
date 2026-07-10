import { NextRequest, NextResponse } from 'next/server'
import {
  createCategory,
  isCategoryNameTaken,
  listCategories,
} from '@/lib/db/blog-category-queries'
import { blogCategoryWriteSchema } from '@/lib/validation/blog-category-api'
import { validationErrorResponse } from '@/lib/validation/api'

export async function GET() {
  try {
    const items = await listCategories()
    return NextResponse.json(items)
  } catch (err) {
    console.error('[GET /api/blog/categories]', err)
    return NextResponse.json(
      { error: 'Erro ao buscar categorias' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const raw = await req.json()
    const parsed = blogCategoryWriteSchema.safeParse(raw)
    if (!parsed.success) return validationErrorResponse(parsed.error)

    if (await isCategoryNameTaken(parsed.data.name)) {
      return NextResponse.json(
        { error: 'Já existe uma categoria com esse nome.' },
        { status: 409 }
      )
    }

    const created = await createCategory(parsed.data.name)
    return NextResponse.json(created, { status: 201 })
  } catch (err) {
    console.error('[POST /api/blog/categories]', err)
    return NextResponse.json(
      { error: 'Erro ao criar categoria' },
      { status: 500 }
    )
  }
}
