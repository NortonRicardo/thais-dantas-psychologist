import { PublicFooter } from './public-footer'
import { PublicHeader } from './public-header'

export function LabLanding() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-neutral-900">
      <PublicHeader />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-6 pb-20">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Thais Dantas
        </h1>
        <p className="mt-4 max-w-lg text-base leading-relaxed text-neutral-600 sm:text-lg">
          Psicóloga. Atendimento com escuta qualificada, acolhimento e cuidado
          em cada encontro.
        </p>
      </main>
      <PublicFooter />
    </div>
  )
}
