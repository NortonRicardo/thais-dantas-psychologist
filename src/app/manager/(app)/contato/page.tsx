import type { Metadata } from 'next'
import { ContatoWorkspace } from './_components/contato-workspace'

export const metadata: Metadata = {
  title: 'Contato | Gestor LEMM',
}

export default function ContatoManagerPage() {
  return (
    <div className="mx-auto max-w-[1400px] px-6 pb-16 pt-8">
      <ContatoWorkspace />
    </div>
  )
}
