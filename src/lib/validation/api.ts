import { NextResponse } from 'next/server'
import { z } from 'zod'

const uuidParamSchema = z.string().uuid({
  error: 'Identificador inválido.',
})

export function validationErrorResponse(error: z.ZodError) {
  return NextResponse.json(
    { error: error.issues[0]?.message ?? 'Dados inválidos.' },
    { status: 400 }
  )
}

export function uuidParamSafeParse(id: string) {
  return uuidParamSchema.safeParse(id)
}
