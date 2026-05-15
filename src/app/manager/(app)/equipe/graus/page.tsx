import { TeamDegreeLevelsTable } from '../_components/team-degree-levels-table'

export const metadata = {
  title: 'Equipe — Graus | Gestor LEMM',
}

export default function EquipeGrausPage() {
  return (
    <div className="mx-auto max-w-[1400px] px-6 pb-16 pt-8">
      <TeamDegreeLevelsTable />
    </div>
  )
}
