import type { Metadata } from 'next'

import { PublicShell } from '../_components/public-shell'
import { ContatoSection } from './_components/contato-section'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Contato | Thais Dantas',
  description: 'Entre em contato com Thais Dantas.',
}

export default function ContatoPage() {
  return (
    <PublicShell>
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 pb-16">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Contato
        </h1>
        <p className="mt-3 max-w-lg text-base text-neutral-600 sm:text-lg">
          Canais para agendamento e informações.
        </p>
        <ContatoSection />
      </main>
    </PublicShell>
  )
}
