import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'
import { db } from './index'
import { blogImages } from './schema'

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'blog')
const FILENAME_PATTERN =
  /^([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\.webp$/

async function migrateUploadsToDb() {
  let entries: string[]
  try {
    entries = await readdir(UPLOAD_DIR)
  } catch {
    console.warn('Nenhum diretório de uploads encontrado, nada a migrar.')
    return
  }

  let migrated = 0
  let skipped = 0

  for (const entry of entries) {
    const match = FILENAME_PATTERN.exec(entry)
    if (!match) {
      skipped++
      continue
    }

    const id = match[1]
    const data = await readFile(path.join(UPLOAD_DIR, entry))
    const metadata = await sharp(data).metadata()

    await db
      .insert(blogImages)
      .values({
        id,
        data,
        contentType: 'image/webp',
        width: metadata.width ?? null,
        height: metadata.height ?? null,
      })
      .onConflictDoNothing({ target: blogImages.id })

    migrated++
    console.warn(`Migrada: ${entry}`)
  }

  console.warn(
    `Concluído: ${migrated} imagem(ns) migrada(s), ${skipped} ignorada(s).`
  )
}

migrateUploadsToDb()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
