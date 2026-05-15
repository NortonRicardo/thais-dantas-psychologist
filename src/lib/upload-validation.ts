import { NextResponse } from 'next/server'

const JPEG_MAGIC = [0xff, 0xd8, 0xff]
const PNG_MAGIC = [0x89, 0x50, 0x4e, 0x47]
const PDF_MAGIC = [0x25, 0x50, 0x44, 0x46]

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024
export const MAX_PDF_BYTES = 20 * 1024 * 1024

const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png'])
const ALLOWED_PDF_TYPES = new Set(['application/pdf'])

function matchesMagic(buf: Uint8Array, magic: number[]): boolean {
  return magic.every((b, i) => buf[i] === b)
}

function isValidImage(type: string, buf: Uint8Array): boolean {
  if (type === 'image/jpeg') return matchesMagic(buf, JPEG_MAGIC)
  if (type === 'image/png') return matchesMagic(buf, PNG_MAGIC)
  return false
}

export type UploadError = { error: string; status: number }

export function validateImageUpload(file: File, buf: Uint8Array): UploadError | null {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return { error: 'Formato inválido. Use JPEG ou PNG.', status: 415 }
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return { error: 'Imagem muito grande. Máximo 5 MB.', status: 413 }
  }
  if (!isValidImage(file.type, buf)) {
    return { error: 'Arquivo de imagem inválido ou corrompido.', status: 415 }
  }
  return null
}

export function validatePdfUpload(file: File, buf: Uint8Array): UploadError | null {
  if (!ALLOWED_PDF_TYPES.has(file.type)) {
    return { error: 'Formato inválido. Envie um PDF.', status: 415 }
  }
  if (file.size > MAX_PDF_BYTES) {
    return { error: 'PDF muito grande. Máximo 20 MB.', status: 413 }
  }
  if (!matchesMagic(buf, PDF_MAGIC)) {
    return { error: 'Arquivo PDF inválido ou corrompido.', status: 415 }
  }
  return null
}

export function uploadErrorResponse(err: UploadError) {
  return NextResponse.json({ error: err.error }, { status: err.status })
}
