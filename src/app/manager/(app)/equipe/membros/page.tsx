import type { Metadata } from 'next'
import { TeamTable } from '../_components/team-table'

export const metadata: Metadata = {
  title: 'Equipe — Membros | Gestor LEMM',
}

export default function EquipeMembrosPage() {
  return (
    <div className="mx-auto max-w-[1400px] px-6 pb-16 pt-8">
      <TeamTable />
    </div>
  )
}
