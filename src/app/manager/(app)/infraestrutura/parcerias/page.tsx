import { CollaborationPartnersTable } from './_components/collaboration-partners-table'

export const metadata = {
  title: 'Parcerias | Gestor LEMM',
}

export default function RedeColaboracaoManagerPage() {
  return (
    <div className="mx-auto max-w-[1400px] px-6 pb-16 pt-8">
      <CollaborationPartnersTable />
    </div>
  )
}
