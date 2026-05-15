'use client'

import { useRef, useState } from 'react'
import { TeamMemberThumb } from '@/components/team-member-thumb'
import { COLOR_HEX_MAP } from '@/components/constants/colors'
import type { PublicEventData, PublicEventTypeData } from '@/lib/http/events'
import {
  CalendarDays,
  ChevronDown,
  ExternalLink,
  MapPin,
  Search,
  Users,
  Video,
  X,
} from 'lucide-react'

const glass = {
  background:
    'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0))',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  border: '1px solid rgba(255,255,255,0.18)',
  boxShadow: '0 8px 32px 0 rgba(0,0,0,0.37)',
} as const

const FALLBACK_COLOR = {
  bg: 'rgba(255,255,255,0.08)',
  border: 'rgba(255,255,255,0.2)',
  text: 'rgba(255,255,255,0.6)',
}

function hexToRgb(hex: string): [number, number, number] {
  const v = hex.replace('#', '')
  return [
    parseInt(v.slice(0, 2), 16),
    parseInt(v.slice(2, 4), 16),
    parseInt(v.slice(4, 6), 16),
  ]
}

function buildBadgeColor(tailwindClass: string) {
  const hex = COLOR_HEX_MAP[tailwindClass]
  if (!hex) return FALLBACK_COLOR
  const family = tailwindClass.match(/^bg-([a-z]+)-\d+$/)?.[1]
  const textHex = (family && COLOR_HEX_MAP[`bg-${family}-400`]) ?? hex
  const [r, g, b] = hexToRgb(hex)
  const [tr, tg, tb] = hexToRgb(textHex)
  return {
    bg: `rgba(${r},${g},${b},0.18)`,
    border: `rgba(${r},${g},${b},0.35)`,
    text: `rgb(${tr},${tg},${tb})`,
  }
}

function buildTypeColorMap(types: PublicEventTypeData[]) {
  return Object.fromEntries(types.map(t => [t.name, buildBadgeColor(t.color)]))
}

const MONTHS = [
  'jan',
  'fev',
  'mar',
  'abr',
  'mai',
  'jun',
  'jul',
  'ago',
  'set',
  'out',
  'nov',
  'dez',
]

function formatDate(iso: string) {
  const d = new Date(iso)
  const dd = String(d.getUTCDate()).padStart(2, '0')
  const mon = MONTHS[d.getUTCMonth()]
  const yr = d.getUTCFullYear()
  return `${dd} ${mon} ${yr}`
}
function formatTime(iso: string) {
  const d = new Date(iso)
  const hh = String(d.getUTCHours()).padStart(2, '0')
  const mm = String(d.getUTCMinutes()).padStart(2, '0')
  return `${hh}:${mm}`
}
function isPast(iso: string) {
  return new Date(iso) < new Date()
}
function imageUrl(event: PublicEventData) {
  return `/api/events/${event.id}/image?t=${new Date(event.updatedAt).getTime()}`
}

type ColorMap = Record<string, { bg: string; border: string; text: string }>

function TypeBadge({ type, colorMap }: { type: string; colorMap: ColorMap }) {
  const c = colorMap[type] ?? FALLBACK_COLOR
  return (
    <span
      className="rounded-full px-2.5 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[2px]"
      style={{
        background: c.bg,
        border: `1px solid ${c.border}`,
        color: c.text,
      }}
    >
      {type}
    </span>
  )
}

function FeaturedCard({
  event,
  colorMap,
}: {
  event: PublicEventData
  colorMap: ColorMap
}) {
  const past = isPast(event.date)
  return (
    <div className="relative overflow-hidden rounded-3xl" style={glass}>
      {event.imageMimeType && (
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl(event)}
            alt=""
            className="h-full w-full object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050a0f]/95 via-[#050a0f]/70 to-transparent" />
        </div>
      )}
      <div className="relative z-10 flex flex-col gap-5 px-8 py-10 sm:px-12 sm:py-12">
        <div className="flex flex-wrap items-center gap-3">
          <TypeBadge type={event.type} colorMap={colorMap} />
          {past ? (
            <span className="rounded-full border border-white/15 bg-white/5 px-2.5 py-0.5 text-[0.6rem] uppercase tracking-[2px] text-white/40">
              Encerrado
            </span>
          ) : (
            <span className="rounded-full border border-cyan-400/40 bg-cyan-400/10 px-2.5 py-0.5 text-[0.6rem] uppercase tracking-[2px] text-cyan-300">
              Em destaque
            </span>
          )}
        </div>

        <div className="max-w-2xl">
          <h2 className="text-xl font-black leading-tight tracking-tight text-white sm:text-2xl">
            {event.title}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-white/60">
            {event.description}
          </p>
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
            <span className="flex items-center gap-2">
              <TeamMemberThumb
                memberId={event.speakerMemberId ?? ''}
                displayName={event.speaker}
                photoMimeType={event.speakerPhotoMimeType}
                updatedAtIso={event.speakerMemberUpdatedAt}
                sizePx={28}
              />
              <span>{event.speaker}</span>
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
          {!past && event.meetLink && (
            <a
              href={event.meetLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-fit items-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-400/10 px-5 py-2 text-xs font-medium text-cyan-300 transition-colors hover:bg-cyan-400/20"
            >
              <Video size={11} /> Entrar na sala
            </a>
          )}
          {past && event.recordingLink && (
            <a
              href={event.recordingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-fit items-center gap-2 rounded-full border border-violet-400/40 bg-violet-400/10 px-5 py-2 text-xs font-medium text-violet-300 transition-colors hover:bg-violet-400/20"
            >
              <Video size={11} /> Assistir gravação
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

function EventCard({
  event,
  colorMap,
}: {
  event: PublicEventData
  colorMap: ColorMap
}) {
  const past = isPast(event.date)
  return (
    <div
      className="flex flex-col gap-4 rounded-2xl px-6 py-7 transition-opacity"
      style={{ ...glass, opacity: past ? 0.6 : 1 }}
    >
      <div className="flex items-start justify-between gap-2">
        <TypeBadge type={event.type} colorMap={colorMap} />
        {past && (
          <span className="text-[0.6rem] uppercase tracking-[2px] text-white/30">
            Encerrado
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2">
        <h3 className="text-sm font-bold leading-snug text-white/90">
          {event.title}
        </h3>
        <p className="line-clamp-3 text-xs leading-relaxed text-white/50">
          {event.description}
        </p>
      </div>

      <div className="mt-auto flex items-center gap-4 border-t border-white/10 pt-4">
        <div className="flex flex-1 flex-col gap-1.5 text-[0.68rem] text-white/40">
          <span className="flex items-center gap-1.5">
            <CalendarDays size={11} strokeWidth={1.5} />
            {formatDate(event.date)} · {formatTime(event.date)}
          </span>
          {event.speaker && (
            <span className="flex items-center gap-2">
              <TeamMemberThumb
                memberId={event.speakerMemberId ?? ''}
                displayName={event.speaker}
                photoMimeType={event.speakerPhotoMimeType}
                updatedAtIso={event.speakerMemberUpdatedAt}
                sizePx={22}
              />
              <span className="min-w-0 truncate">{event.speaker}</span>
            </span>
          )}
          {event.organizer && (
            <span className="flex items-center gap-1.5">
              <Users size={11} strokeWidth={1.5} /> {event.organizer}
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

        {!past && event.meetLink && (
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
        {past && event.recordingLink && (
          <div className="flex shrink-0 items-center justify-center">
            <a
              href={event.recordingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-full border border-violet-400/35 bg-violet-400/10 px-3 py-1.5 text-[0.7rem] font-medium text-violet-300 transition-colors hover:bg-violet-400/20"
            >
              <Video size={11} /> Ver gravação
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

function TypeFilterPopover({
  value,
  onChange,
  types,
  colorMap,
}: {
  value: string
  onChange: (v: string) => void
  types: PublicEventTypeData[]
  colorMap: ColorMap
}) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const filtered = types.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase())
  )

  function select(v: string) {
    onChange(v)
    setOpen(false)
    setSearch('')
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => {
          setOpen(o => !o)
          setTimeout(() => inputRef.current?.focus(), 0)
        }}
        className="flex w-48 items-center justify-between gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm backdrop-blur-sm transition-colors hover:bg-white/10"
      >
        {value ? (
          <span className="flex items-center gap-2 text-white/80">
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: colorMap[value]?.text ?? '#fff' }}
            />
            {value}
          </span>
        ) : (
          <span className="text-white/40">Tipo</span>
        )}
        <ChevronDown size={13} className="text-white/30" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-full z-20 mt-1 w-48 overflow-hidden rounded-xl border border-white/10 bg-[#050f1a] shadow-2xl">
            <div className="border-b border-white/10 p-2">
              <div className="relative">
                <Search
                  size={12}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none"
                />
                <input
                  ref={inputRef}
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Buscar…"
                  className="w-full rounded-lg bg-white/5 py-1.5 pl-7 pr-2 text-sm text-white/80 placeholder:text-white/25 outline-none"
                />
              </div>
            </div>
            <div
              className="max-h-52 overflow-y-auto p-1"
              onWheel={e => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => select('')}
                className={`w-full rounded-lg px-3 py-1.5 text-left text-sm transition-colors ${!value ? 'bg-white/10 text-white/90' : 'text-white/50 hover:bg-white/5 hover:text-white/80'}`}
              >
                Todos os tipos
              </button>
              {filtered.map(t => (
                <button
                  key={t.name}
                  type="button"
                  onClick={() => select(t.name)}
                  className={`flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-left text-sm transition-colors ${value === t.name ? 'bg-white/10 text-white/90' : 'text-white/60 hover:bg-white/5 hover:text-white/80'}`}
                >
                  <span
                    className="h-2 w-2 rounded-full shrink-0"
                    style={{ background: colorMap[t.name]?.text ?? '#fff' }}
                  />
                  {t.name}
                </button>
              ))}
              {filtered.length === 0 && (
                <p className="py-2 text-center text-xs text-white/25">
                  Sem resultados
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

type Props = { events: PublicEventData[]; eventTypes: PublicEventTypeData[] }

export function EventsSection({ events, eventTypes }: Props) {
  const colorMap = buildTypeColorMap(eventTypes)
  const [filterTitle, setFilterTitle] = useState('')
  const [filterType, setFilterType] = useState('')

  const hasFilters = filterTitle || filterType

  function applyFilters(list: PublicEventData[]) {
    return list.filter(e => {
      if (
        filterTitle &&
        !e.title.toLowerCase().includes(filterTitle.toLowerCase())
      )
        return false
      if (filterType && e.type !== filterType) return false
      return true
    })
  }

  function sortByDateDesc(list: PublicEventData[]) {
    return [...list].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )
  }

  const featuredList = sortByDateDesc(events.filter(e => e.featured))
  const rest = sortByDateDesc(events.filter(e => !e.featured))
  const upcoming = sortByDateDesc(
    applyFilters(rest.filter(e => !isPast(e.date)))
  )
  const past = sortByDateDesc(applyFilters(rest.filter(e => isPast(e.date))))

  return (
    <div className="flex w-full flex-col gap-10 pb-16">
      {/* Header row: title+lead on left, filters on right */}
      <div className="flex flex-wrap items-end justify-between gap-4 pt-2">
        <div>
          <h1 className="mb-2 text-xl font-black uppercase tracking-tight text-white sm:text-2xl [font-family:var(--font-orbitron),sans-serif]">
            Eventos
          </h1>
          <p className="max-w-prose text-base leading-relaxed text-slate-300">
            Conferências, workshops, seminários e desafios científicos do
            ecossistema LEMM.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none"
            />
            <input
              type="text"
              value={filterTitle}
              onChange={e => setFilterTitle(e.target.value)}
              placeholder="Buscar por título…"
              className="w-[26rem] rounded-xl border border-white/10 bg-white/5 py-2 pl-8 pr-8 text-sm text-white/80 placeholder:text-white/35 outline-none backdrop-blur-sm focus:border-white/20"
            />
            {filterTitle && (
              <button
                onClick={() => setFilterTitle('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
              >
                <X size={12} />
              </button>
            )}
          </div>

          <TypeFilterPopover
            value={filterType}
            onChange={setFilterType}
            types={eventTypes}
            colorMap={colorMap}
          />

          <button
            type="button"
            disabled={!hasFilters}
            onClick={() => {
              setFilterTitle('')
              setFilterType('')
            }}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/40 backdrop-blur-sm transition-colors hover:bg-white/10 hover:text-white/60 disabled:cursor-not-allowed disabled:text-white/20 disabled:opacity-50 disabled:hover:bg-white/5"
          >
            <X size={12} /> Limpar
          </button>
        </div>
      </div>

      {!hasFilters &&
        featuredList.map(event => (
          <FeaturedCard key={event.id} event={event} colorMap={colorMap} />
        ))}

      {upcoming.length > 0 && (
        <div>
          <p className="mb-5 text-sm font-semibold uppercase tracking-[3px] text-white/50">
            Próximos eventos
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {upcoming.map(e => (
              <EventCard key={e.id} event={e} colorMap={colorMap} />
            ))}
          </div>
        </div>
      )}

      {past.length > 0 && (
        <div>
          <p className="mb-5 text-sm font-semibold uppercase tracking-[3px] text-white/30">
            Eventos anteriores
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {past.map(e => (
              <EventCard key={e.id} event={e} colorMap={colorMap} />
            ))}
          </div>
        </div>
      )}

      {hasFilters && upcoming.length === 0 && past.length === 0 && (
        <p className="mt-4 text-center text-sm text-white/30">
          Nenhum evento encontrado para os filtros aplicados.
        </p>
      )}

      {events.length === 0 && (
        <p className="mt-12 text-center text-sm text-white/30">
          Nenhum evento cadastrado ainda.
        </p>
      )}
    </div>
  )
}
