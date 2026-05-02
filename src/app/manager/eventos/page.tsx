import { EventsTable } from './_components/events-table'

export const metadata = {
  title: 'Eventos | Gestor LEMM',
}

export default function EventosManagerPage() {
  return (
    <div className="mx-auto max-w-[1400px] px-6 pb-16 pt-8">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-white/90">Eventos</h1>
        <p className="mt-0.5 text-sm text-white/40">Gerencie palestras, workshops e encontros do laboratório.</p>
      </div>
      <EventsTable />
    </div>
  )
}
