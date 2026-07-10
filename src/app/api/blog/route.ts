import { NextRequest, NextResponse } from 'next/server'
import { createPost, listPostsForAdmin } from '@/lib/db/blog-queries'
import { blogPostWriteSchema } from '@/lib/validation/blog-api'
import { validationErrorResponse } from '@/lib/validation/api'

export async function GET() {
  try {
    const items = await listPostsForAdmin()
    return NextResponse.json(items)
  } catch (err) {
    console.error('[GET /api/blog]', err)
    return NextResponse.json(
      { error: 'Erro ao buscar artigos' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const raw = await req.json()
    const parsed = blogPostWriteSchema.safeParse(raw)
    if (!parsed.success) return validationErrorResponse(parsed.error)

    const created = await createPost(parsed.data)
    return NextResponse.json(created, { status: 201 })
  } catch (err) {
    console.error('[POST /api/blog]', err)
    return NextResponse.json({ error: 'Erro ao criar artigo' }, { status: 500 })
  }
}
