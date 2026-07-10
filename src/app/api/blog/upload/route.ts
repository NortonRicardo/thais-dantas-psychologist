import { randomUUID } from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'

const ALLOWED_MIME = new Set([
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
])
const MAX_SIZE_BYTES = 8 * 1024 * 1024
const MAX_DIMENSION = 2000
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'blog')

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

    await mkdir(UPLOAD_DIR, { recursive: true })
    const filename = `${randomUUID()}.webp`
    await writeFile(path.join(UPLOAD_DIR, filename), processed)

    return NextResponse.json(
      {
        url: `/uploads/blog/${filename}`,
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
