import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'
import { db } from '@/lib/db'
import { blogImages } from '@/lib/db/schema'

const ALLOWED_MIME = new Set([
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
])
const MAX_SIZE_BYTES = 8 * 1024 * 1024
const MAX_DIMENSION = 2000

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file')

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: 'Arquivo não enviado.' },
        { status: 400 }
      )
    }
    if (!ALLOWED_MIME.has(file.type)) {
      return NextResponse.json(
        { error: 'Formato de imagem não suportado.' },
        { status: 400 }
      )
    }
    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { error: 'Imagem muito grande (máx. 8MB).' },
        { status: 400 }
      )
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const processed = await sharp(buffer)
      .rotate()
      .resize({
        width: MAX_DIMENSION,
        height: MAX_DIMENSION,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: 85 })
      .toBuffer()

    const metadata = await sharp(processed).metadata()

    const [created] = await db
      .insert(blogImages)
      .values({
        data: processed,
        contentType: 'image/webp',
        width: metadata.width ?? null,
        height: metadata.height ?? null,
      })
      .returning({ id: blogImages.id })

    return NextResponse.json(
      {
        url: `/uploads/blog/${created.id}.webp`,
        width: metadata.width ?? null,
        height: metadata.height ?? null,
      },
      { status: 201 }
    )
  } catch (err) {
    console.error('[POST /api/blog/upload]', err)
    return NextResponse.json(
      { error: 'Erro ao enviar imagem.' },
      { status: 500 }
    )
  }
}
