'use client'

import Image from 'next/image'
import { CalendarDays, ExternalLink, MapPin, Mic, Users, Video } from 'lucide-react'
import { events, type Event } from './events-data'

const glass = {
  background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0))',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  border: '1px solid rgba(255,255,255,0.18)',
  boxShadow: '0 8px 32px 0 rgba(0,0,0,0.37)',
} as const

const typeColor: Record<Event['type'], string> = {
  'Conferência': 'rgba(0,180,255,0.18)',
  'Workshop':    'rgba(160,0,255,0.18)',
  'Seminário':   'rgba(0,200,120,0.18)',
  'Desafio':     'rgba(255,140,0,0.18)',
  'Minicurso':   'rgba(0,160,255,0.18)',
  'Defesa':      'rgba(255,60,100,0.18)',
}
const typeBorder: Record<Event['type'], string> = {
  'Conferência': 'rgba(0,180,255,0.35)',
  'Workshop':    'rgba(160,0,255,0.35)',
  'Seminário':   'rgba(0,200,120,0.35)',
  'Desafio':     'rgba(255,140,0,0.35)',
  'Minicurso':   'rgba(0,160,255,0.35)',
  'Defesa':      'rgba(255,60,100,0.35)',
}
const typeText: Record<Event['type'], string> = {
  'Conferência': 'rgb(100,210,255)',
  'Workshop':    'rgb(210,130,255)',
  'Seminário':   'rgb(80,220,150)',
  'Desafio':     'rgb(255,180,60)',
  'Minicurso':   'rgb(80,190,255)',
  'Defesa':      'rgb(255,100,130)',
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}

function formatTime(iso: string) {
  const d = new Date(iso)
  return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

function isPast(iso: string) {
  return new Date(iso) < new Date()
}

function TypeBadge({ type }: { type: Event['type'] }) {
  return (
    <span
      className="rounded-full px-2.5 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[2px]"
      style={{ background: typeColor[type], border: `1px solid ${typeBorder[type]}`, color: typeText[type] }}
    >
      {type}
    </span>
  )
}

function FeaturedCard({ event }: { event: Event }) {
  const past = isPast(event.date)
  return (
    <div className="relative overflow-hidden rounded-3xl" style={glass}>
      {event.image && (
        <div className="absolute inset-0">
          <Image src={event.image} alt="" fill className="object-cover opacity-15" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050a0f]/95 via-[#050a0f]/70 to-transparent" />
        </div>
      )}
      <div className="relative z-10 flex flex-col gap-5 px-8 py-10 sm:px-12 sm:py-12">
        <div className="flex flex-wrap items-center gap-3">
          <TypeBadge type={event.type} />
          {past ? (
            <span className="rounded-full border border-white/15 bg-white/5 px-2.5 py-0.5 text-[0.6rem] uppercase tracking-[2px] text-white/40">Encerrado</span>
          ) : (
            <span className="rounded-full border border-cyan-400/40 bg-cyan-400/10 px-2.5 py-0.5 text-[0.6rem] uppercase tracking-[2px] text-cyan-300">Em destaque</span>
          )}
        </div>

        <div className="max-w-2xl">
          <h2 className="text-xl font-black leading-tight tracking-tight text-white sm:text-2xl">
            {event.title}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-white/60">{event.description}</p>
        </div>

        <div className="flex flex-wrap items-center gap-5 text-xs text-white/45">
          <span className="flex items-center gap-1.5">
            <CalendarDays size={13} strokeWidth={1.5} />
            {formatDate(event.date)} · {formatTime(event.date)}
          </span>
          {event.organizer && (
            <span className="flex items-center gap-1.5">
              <MapPin size={13} strokeWidth={1.5} />
              {event.organizer}
            </span>
          )}
          {event.speaker && (
            <span className="flex items-center gap-1.5">
              <Mic size={13} strokeWidth={1.5} />
              {event.speaker}
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          {event.link && (
            <a
              href={event.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-xs font-medium text-white/80 transition-colors hover:bg-white/15 hover:text-white"
            >
              Saiba mais <ExternalLink size={11} />
            </a>
          )}
          {event.meetLink && (
            <a
              href={event.meetLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-fit items-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-400/10 px-5 py-2 text-xs font-medium text-cyan-300 transition-colors hover:bg-cyan-400/20"
            >
              <Video size={11} /> Entrar na sala
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

function EventCard({ event }: { event: Event }) {
  const past = isPast(event.date)
  return (
    <div
      className="flex flex-col gap-4 rounded-2xl px-6 py-7 transition-opacity"
      style={{ ...glass, opacity: past ? 0.6 : 1 }}
    >
      <div className="flex items-start justify-between gap-2">
        <TypeBadge type={event.type} />
        {past && (
          <span className="text-[0.6rem] uppercase tracking-[2px] text-white/30">Encerrado</span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2">
        <h3 className="text-sm font-bold leading-snug text-white/90">{event.title}</h3>
        <p className="line-clamp-3 text-xs leading-relaxed text-white/50">{event.description}</p>
      </div>

      <div className="mt-auto flex items-center gap-4 border-t border-white/10 pt-4">
        {/* Coluna 1 — metadados alinhados à esquerda */}
        <div className="flex flex-1 flex-col gap-1.5 text-[0.68rem] text-white/40">
          <span className="flex items-center gap-1.5">
            <CalendarDays size={11} strokeWidth={1.5} />
            {formatDate(event.date)} · {formatTime(event.date)}
          </span>
          {event.speaker && (
            <span className="flex items-center gap-1.5">
              <Mic size={11} strokeWidth={1.5} />
              {event.speaker}
            </span>
          )}
          {event.organizer && (
            <span className="flex items-center gap-1.5">
              <Users size={11} strokeWidth={1.5} />
              {event.organizer}
            </span>
          )}
          {event.link && (
            <a
              href={event.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-white/35 transition-colors hover:text-white/60"
            >
              <ExternalLink size={11} /> Saiba mais
            </a>
          )}
        </div>

        {/* Coluna 2 — botão centralizado */}
        {event.meetLink && (
          <div className="flex shrink-0 items-center justify-center">
            <a
              href={event.meetLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-full border border-cyan-400/35 bg-cyan-400/10 px-3 py-1.5 text-[0.7rem] font-medium text-cyan-300 transition-colors hover:bg-cyan-400/20"
            >
              <Video size={11} /> Entrar na sala
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

export function EventsSection() {
  const featured = events.find(e => e.featured)
  const rest = events.filter(e => !e.featured).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
  const upcoming = rest.filter(e => !isPast(e.date))
  const past = rest.filter(e => isPast(e.date))

  return (
    <div className="mt-8 flex w-full flex-col gap-10 pb-16">
      {/* Destaque */}
      {featured && <FeaturedCard event={featured} />}

      {/* Próximos */}
      {upcoming.length > 0 && (
        <div>
          <p className="mb-5 text-sm font-semibold uppercase tracking-[3px] text-white/50">
            Próximos eventos
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {upcoming.map(e => <EventCard key={e.id} event={e} />)}
          </div>
        </div>
      )}

      {/* Passados */}
      {past.length > 0 && (
        <div>
          <p className="mb-5 text-sm font-semibold uppercase tracking-[3px] text-white/30">
            Eventos anteriores
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {past.map(e => <EventCard key={e.id} event={e} />)}
          </div>
        </div>
      )}
    </div>
  )
}
