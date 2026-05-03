import { NextRequest, NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { contactInfo } from '@/lib/db/schema'

const SELECTED_FIELDS = {
  id: contactInfo.id,
  directorName: contactInfo.directorName,
  directorRole: contactInfo.directorRole,
  email: contactInfo.email,
  phone: contactInfo.phone,
  linkedin: contactInfo.linkedin,
  directorPhotoMimeType: contactInfo.directorPhotoMimeType,
  createdAt: contactInfo.createdAt,
  updatedAt: contactInfo.updatedAt,
}

async function getOrCreate() {
  const rows = await db.select(SELECTED_FIELDS).from(contactInfo).limit(1)
  if (rows[0]) return rows[0]

  const [created] = await db
    .insert(contactInfo)
    .values({ directorName: '', directorRole: '', email: '', phone: '', linkedin: '' })
    .returning(SELECTED_FIELDS)
  return created
}

export async function GET() {
  try {
    const row = await getOrCreate()
    return NextResponse.json({ ...row, hasPhoto: !!row.directorPhotoMimeType })
  } catch (err) {
    console.error('[GET /api/contato]', err)
    return NextResponse.json({ error: 'Erro ao buscar contato' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const fd = await req.formData()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const patch: Record<string, any> = {
      directorName: (fd.get('directorName') as string)?.trim() ?? '',
      directorRole: (fd.get('directorRole') as string)?.trim() ?? '',
      email: (fd.get('email') as string)?.trim() ?? '',
      phone: (fd.get('phone') as string)?.trim() ?? '',
      linkedin: (fd.get('linkedin') as string)?.trim() ?? '',
      updatedAt: new Date(),
    }

    if (fd.get('removePhoto') === 'true') {
      patch.directorPhoto = null
      patch.directorPhotoMimeType = null
    }

    const photoFile = fd.get('photo') as File | null
    if (photoFile && photoFile.size > 0) {
      patch.directorPhoto = Buffer.from(await photoFile.arrayBuffer())
      patch.directorPhotoMimeType = photoFile.type
    }

    const existing = await getOrCreate()
    const [updated] = await db
      .update(contactInfo)
      .set(patch)
      .where(eq(contactInfo.id, existing.id))
      .returning(SELECTED_FIELDS)

    return NextResponse.json({ ...updated, hasPhoto: !!updated.directorPhotoMimeType })
  } catch (err) {
    console.error('[PUT /api/contato]', err)
    return NextResponse.json({ error: 'Erro ao atualizar contato' }, { status: 500 })
  }
}
