import { DevelopedPlatformsTable } from './_components/developed-platforms-table'

export const metadata = {
  title: 'Plataformas | Gestor LEMM',
}

export default function PlataformasManagerPage() {
  return (
    <div className="mx-auto max-w-[1400px] px-6 pb-16 pt-8">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-white/90">
          Plataformas desenvolvidas
        </h1>
        <p className="mt-0.5 text-sm text-white/40">
          Cadastro exibido na página pública Infraestrutura — links do projeto e
          da plataforma são opcionais.
        </p>
      </div>
      <DevelopedPlatformsTable />
    </div>
  )
}
