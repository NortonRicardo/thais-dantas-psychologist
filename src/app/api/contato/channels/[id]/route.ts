import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { contactChannels } from '@/lib/db/schema'

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await db.delete(contactChannels).where(eq(contactChannels.id, id))
    revalidateTag('contato')
    return new NextResponse(null, { status: 204 })
  } catch (err) {
    console.error('[DELETE /api/contato/channels/:id]', err)
    return NextResponse.json({ error: 'Erro ao remover canal' }, { status: 500 })
  }
}
