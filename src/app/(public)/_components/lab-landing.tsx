import Link from 'next/link'
import { Orbitron } from 'next/font/google'

import { cn } from '@/lib/utils'

import { PlexusBackground } from './plexus-background'

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  variable: '--font-orbitron',
})

const navItems = [
  { href: '#', label: 'Projetos' },
  { href: '#', label: 'Artigos' },
  { href: '#', label: 'Eventos' },
  { href: '#', label: 'Data SheLeads' },
] as const

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
          className="pointer-events-none absolute inset-0 z-1 bg-[url(https://www.transparenttextures.com/patterns/carbon-fibre.png)] opacity-[0.12]"
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

        <header className="absolute left-0 top-0 z-10 flex w-full items-center justify-between px-[8%] py-10 max-[900px]:px-[6%] max-[900px]:py-6">
          <div
            className={cn(
              'text-2xl font-black tracking-[6px] text-white [text-shadow:0_0_10px_rgba(255,255,255,0.3)]',
              fontOrbitron
            )}
          >
            LEMM
          </div>
          <nav className="max-[900px]:hidden" aria-label="Navegação principal">
            <ul className="m-0 flex list-none gap-6 p-0 lg:gap-10">
              {navItems.map(({ href, label }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-[0.85rem] font-normal uppercase tracking-[2px] text-[#8892b0] transition-[color,text-shadow] duration-300 hover:text-[#00d4ff] hover:[text-shadow:0_0_8px_rgba(0,212,255,0.6)]"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </header>

        <div className="relative z-6 max-w-[850px] pt-14 max-[900px]:pt-12">
          <p
            className={cn(
              'mb-8 flex items-center gap-[15px] text-[0.9rem] font-bold tracking-[5px] text-[#5aebff]',
              "before:h-0.5 before:w-[50px] before:shrink-0 before:bg-[#5aebff] before:content-['']",
              "after:h-0.5 after:w-[50px] after:shrink-0 after:bg-[#5aebff] after:content-['']",
              fontOrbitron
            )}
          >
            LABORATÓRIO DE PESQUISA AVANÇADA
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
