import { EventosLayout } from './_components/eventos-layout'

export const metadata = {
  title: 'Eventos | Gestor LEMM',
}

export default function EventosManagerPage() {
  return (
    <div className="mx-auto max-w-[1400px] px-6">
      <EventosLayout />
    </div>
  )
}
