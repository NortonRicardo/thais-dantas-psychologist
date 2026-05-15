'use client'

import { useState } from 'react'
import { EventsTable } from './events-table'
import { EventOrganizationsTable } from './event-organizations-table'
import { EventTypesTable } from './event-types-table'

type View = 'eventos' | 'tipo-evento' | 'organizacoes'

const NAV_ITEMS: { id: View; label: string }[] = [
  { id: 'eventos', label: 'Eventos' },
  { id: 'tipo-evento', label: 'Tipo de Evento' },
  { id: 'organizacoes', label: 'Organizações' },
]

export function EventosLayout() {
  const [view, setView] = useState<View>('eventos')

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] gap-0 pb-8">
      {/* Sidebar */}
      <aside className="w-52 shrink-0 rounded-xl bg-white/[0.08] p-3 pt-8 self-stretch mt-8">
        <p className="mb-2 px-3 text-sm font-semibold text-white/60">
          Eventos
        </p>
        <nav className="flex flex-col gap-0.5">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              type="button"
              onClick={() => setView(item.id)}
              className={`w-full rounded-md px-3 py-2 text-left text-sm transition-colors ${
                view === item.id
                  ? 'bg-white/10 font-medium text-white/90'
                  : 'text-white/50 hover:bg-white/5 hover:text-white/75'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Content */}
      <div className="flex-1 overflow-x-auto px-6 pb-16 pt-8">
        {view === 'eventos' && <EventsTable />}

        {view === 'tipo-evento' && <EventTypesTable />}

        {view === 'organizacoes' && <EventOrganizationsTable />}
      </div>
    </div>
  )
}
