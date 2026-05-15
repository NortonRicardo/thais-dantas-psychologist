import { TeamPrefixesTable } from '../_components/team-prefixes-table'

export const metadata = {
  title: 'Equipe — Tratamentos | Gestor LEMM',
}

export default function EquipeTratamentosPage() {
  return (
    <div className="mx-auto max-w-[1400px] px-6 pb-16 pt-8">
      <TeamPrefixesTable />
    </div>
  )
}
