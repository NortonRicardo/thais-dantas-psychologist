import type { Metadata } from 'next'
import { ContatoWorkspace } from './_components/contato-workspace'

export const metadata: Metadata = {
  title: 'Contato | Gestor LEMM',
}

export default function ContatoManagerPage() {
  return (
    <div className="mx-auto max-w-[1400px] px-6 pb-16 pt-8">
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-white/90">Contato</h1>
        <p className="mt-0.5 text-sm text-white/40">
          Informações do diretor e canais públicos de contato.
        </p>
      </div>
      <ContatoWorkspace />
    </div>
  )
}
