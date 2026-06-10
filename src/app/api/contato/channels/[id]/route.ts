import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { compactContactChannelSortOrders } from '@/lib/db/contact-channel-order'
import { contactChannels } from '@/lib/db/schema'
import {
  uuidParamSafeParse,
  validationErrorResponse,
} from '@/lib/validation/api'

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const idParsed = uuidParamSafeParse(id)
    if (!idParsed.success) return validationErrorResponse(idParsed.error)

    const [removed] = await db
      .delete(contactChannels)
      .where(eq(contactChannels.id, id))
      .returning({ contactInfoId: contactChannels.contactInfoId })

    if (!removed) {
      return NextResponse.json(
        { error: 'Canal não encontrado' },
        { status: 404 }
      )
    }

    await compactContactChannelSortOrders(removed.contactInfoId)
    revalidateTag('contato', 'max')
    return new NextResponse(null, { status: 204 })
  } catch (err) {
    console.error('[DELETE /api/contato/channels/:id]', err)
    return NextResponse.json(
      { error: 'Erro ao remover canal' },
      { status: 500 }
    )
  }
}
