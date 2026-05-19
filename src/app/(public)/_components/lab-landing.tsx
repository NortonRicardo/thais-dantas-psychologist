import { Orbitron } from 'next/font/google'

import { cn } from '@/lib/utils'

import { LabPublicHeader } from './lab-public-header'
import { PlexusBackground } from './plexus-background'

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  variable: '--font-orbitron',
})

const fontOrbitron = '[font-family:var(--font-orbitron),sans-serif]'

export function LabLanding() {
  return (
    <div
      className={cn(
        orbitron.variable,
        'relative min-h-screen bg-[#050a0f] text-white'
      )}
    >
      <section
        className="relative isolate flex min-h-screen w-full flex-col justify-center bg-[radial-gradient(circle_at_left_center,rgba(0,212,255,0.08)_0%,transparent_40%),radial-gradient(circle_at_75%_50%,#002d5a_0%,#050a0f_65%)] px-[8%]"
        aria-label="Introdução LEMM"
      >
        <PlexusBackground />
        <div
          className="pointer-events-none absolute inset-0 z-1 opacity-[0.07]"
          style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)', backgroundSize: '20px 20px' }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute bottom-0 left-0 z-4 h-[40vh] w-full bg-linear-to-t from-black to-transparent"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute right-0 top-0 z-4 h-full w-[18vw] min-w-[120px] max-w-[240px] bg-linear-to-l from-black/45 to-transparent"
          aria-hidden
        />

        <LabPublicHeader variant="absolute" />

        <div className="relative z-6 max-w-[850px] pt-14 max-[900px]:pt-24 max-[600px]:pt-28">
          <p
            className={cn(
              'mb-8 flex items-center gap-[15px] text-[0.9rem] font-bold tracking-[5px] text-[#5aebff]',
              'max-[600px]:text-[0.7rem] max-[600px]:tracking-[2px] max-[600px]:gap-2',
              "before:h-0.5 before:w-[50px] before:shrink-0 before:bg-[#5aebff] before:content-[''] max-[600px]:before:w-[24px]",
              "after:h-0.5 after:w-[50px] after:shrink-0 after:bg-[#5aebff] after:content-[''] max-[600px]:after:w-[24px]",
              fontOrbitron
            )}
          >
            LABORATÓRIO DE ESTATÍSTICA E MODELAGEM MATEMÁTICA
          </p>

          <h1
            className={cn(
              'mb-8 w-full min-w-0 whitespace-normal font-black uppercase leading-[1.05] tracking-tight text-white lg:whitespace-nowrap',
              'text-[clamp(1.65rem,5vw,3.75rem)] max-[900px]:text-[1.8rem]',
              fontOrbitron
            )}
          >
            CIÊNCIA QUE ANTECIPA.
          </h1>

          <div
            className={cn(
              'mb-6 flex items-center gap-3 text-xs font-normal uppercase tracking-[2px] text-white/55',
              'before:flex-1 before:h-px before:bg-white/15 before:content-[""]',
              'after:flex-1 after:h-px after:bg-white/15 after:content-[""]',
              'sm:text-sm sm:tracking-[2.5px]',
              fontOrbitron
            )}
          >
            INOVAÇÃO QUE TRANSFORMA
          </div>

          <p className="max-w-136 text-[0.9375rem] font-normal leading-relaxed text-slate-300 antialiased sm:text-[1.0625rem] sm:leading-[1.75]">
            Explorando a convergência entre clima, inteligência artificial,
            modelagem matemática e computação de alto desempenho. No LEMM, a
            ciência transforma dados em previsões, desafios em soluções e
            conhecimento em impacto real.
          </p>
        </div>
      </section>
    </div>
  )
}
