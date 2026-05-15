import { CollaborationPartnersTable } from './_components/collaboration-partners-table'

export const metadata = {
  title: 'Parcerias | Gestor LEMM',
}

export default function RedeColaboracaoManagerPage() {
  return (
    <div className="mx-auto max-w-[1400px] px-6 pb-16 pt-8">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-white/90">Parcerias</h1>
        <p className="mt-0.5 text-sm text-white/40">
          Parceiros exibidos na seção homônima da página pública Infraestrutura.
        </p>
      </div>
      <CollaborationPartnersTable />
    </div>
  )
}
