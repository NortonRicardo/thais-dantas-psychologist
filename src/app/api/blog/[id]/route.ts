import { NextRequest, NextResponse } from 'next/server'
import { deletePost, getPostById, updatePost } from '@/lib/db/blog-queries'
import { blogPostWriteSchema } from '@/lib/validation/blog-api'
import {
  uuidParamSafeParse,
  validationErrorResponse,
} from '@/lib/validation/api'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const idParsed = uuidParamSafeParse(id)
    if (!idParsed.success) return validationErrorResponse(idParsed.error)

    const post = await getPostById(id)
    if (!post) {
      return NextResponse.json(
        { error: 'Artigo não encontrado' },
        { status: 404 }
      )
    }
    return NextResponse.json(post)
  } catch (err) {
    console.error('[GET /api/blog/:id]', err)
    return NextResponse.json(
      { error: 'Erro ao buscar artigo' },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const idParsed = uuidParamSafeParse(id)
    if (!idParsed.success) return validationErrorResponse(idParsed.error)

    const raw = await req.json()
    const parsed = blogPostWriteSchema.safeParse(raw)
    if (!parsed.success) return validationErrorResponse(parsed.error)

    const updated = await updatePost(id, parsed.data)
    if (!updated) {
      return NextResponse.json(
        { error: 'Artigo não encontrado' },
        { status: 404 }
      )
    }
    return NextResponse.json(updated)
  } catch (err) {
    console.error('[PUT /api/blog/:id]', err)
    return NextResponse.json(
      { error: 'Erro ao atualizar artigo' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const idParsed = uuidParamSafeParse(id)
    if (!idParsed.success) return validationErrorResponse(idParsed.error)

    const removed = await deletePost(id)
    if (!removed) {
      return NextResponse.json(
        { error: 'Artigo não encontrado' },
        { status: 404 }
      )
    }
    return new NextResponse(null, { status: 204 })
  } catch (err) {
    console.error('[DELETE /api/blog/:id]', err)
    return NextResponse.json(
      { error: 'Erro ao remover artigo' },
      { status: 500 }
    )
  }
}
