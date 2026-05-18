import { cn } from '@/lib/utils'

const glass = {
  background:
    'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0))',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  border: '1px solid rgba(255,255,255,0.18)',
  boxShadow: '0 8px 32px 0 rgba(0,0,0,0.37)',
} as const

const yearGlass = {
  background:
    'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.03))',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: '1px solid rgba(255,255,255,0.22)',
  boxShadow: '0 4px 24px 0 rgba(0,0,0,0.5)',
} as const

export type TimelineEntryProps = {
  id: string
  year: string
  title: string
  description: string
}

function TimelineCard({
  title,
  description,
  className,
}: {
  title: string
  description: string
  className?: string
}) {
  return (
    <div
      className={cn('rounded-2xl px-5 py-5', className)}
      style={glass}
    >
      <p className="text-sm font-semibold text-white/90">{title}</p>
      <p className="mt-2 text-xs leading-relaxed text-white/55">
        {description}
      </p>
    </div>
  )
}

function YearBubble({ year }: { year: string }) {
  return (
    <div
      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-xs font-bold tracking-widest text-white/90"
      style={yearGlass}
    >
      {year}
    </div>
  )
}

type Props = { entries: TimelineEntryProps[] }

export function Timeline({ entries }: Props) {
  if (entries.length === 0) {
    return (
      <div className="mt-12 w-full pb-16">
        <p className="text-center text-sm text-white/35">
          Linha do tempo em atualização.
        </p>
      </div>
    )
  }

  return (
    <div className="mt-8 w-full pb-16 md:mt-12">
      {/* Mobile: linha à esquerda, cartões à direita */}
      <div className="relative md:hidden">
        <div className="absolute left-7 top-0 h-full w-px bg-linear-to-b from-transparent via-white/20 to-transparent" />
        <div className="flex flex-col gap-6">
          {entries.map(event => (
            <div key={event.id} className="relative flex items-start gap-4">
              <div className="shrink-0">
                <YearBubble year={event.year} />
              </div>
              <div className="min-w-0 flex-1 pt-3">
                <TimelineCard
                  title={event.title}
                  description={event.description}
                  className="w-full"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop: alternado com linha central */}
      <div className="relative hidden md:flex md:flex-col md:items-center">
        <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-linear-to-b from-transparent via-white/20 to-transparent" />
        <div className="flex w-full flex-col">
          {entries.map((event, i) => {
            const isLeft = i % 2 === 0
            return (
              <div
                key={event.id}
                className={cn(
                  'relative flex items-center justify-center gap-0',
                  i > 0 && '-mt-4'
                )}
              >
                <div className="flex w-1/2 justify-end pr-8">
                  {isLeft ? (
                    <TimelineCard
                      title={event.title}
                      description={event.description}
                      className="max-w-xs sm:max-w-sm"
                    />
                  ) : (
                    <div />
                  )}
                </div>

                <YearBubble year={event.year} />

                <div className="flex w-1/2 justify-start pl-8">
                  {!isLeft ? (
                    <TimelineCard
                      title={event.title}
                      description={event.description}
                      className="max-w-xs sm:max-w-sm"
                    />
                  ) : (
                    <div />
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
