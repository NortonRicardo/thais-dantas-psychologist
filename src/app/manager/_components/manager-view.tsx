import Image from 'next/image'
import Link from 'next/link'
import { Orbitron } from 'next/font/google'

import { cn } from '@/lib/utils'

import { PlexusBackground } from '../../(public)/_components/plexus-background'

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  variable: '--font-orbitron',
})

const fontOrbitron = '[font-family:var(--font-orbitron),sans-serif]'

const navItems = [
  { href: '#eventos', label: 'Eventos' },
  { href: '#projetos', label: 'Projetos' },
] as const

const cards = [
  {
    id: 'eventos' as const,
    title: 'Eventos',
    description:
      'Calendário e cadastro de eventos: palestras, workshops e encontros do laboratório.',
    href: '#eventos',
  },
  {
    id: 'projetos' as const,
    title: 'Projetos',
    description:
      'Linhas de pesquisa, equipes e entregas — organize e acompanhe os projetos do LEMM.',
    href: '#projetos',
  },
] as const

export function ManagerView() {
  return (
    <div
      className={cn(
        orbitron.variable,
        'relative min-h-screen bg-[#050a0f] text-white'
      )}
    >
      <section
        className="relative isolate flex min-h-screen w-full flex-col bg-[radial-gradient(circle_at_left_center,rgba(0,212,255,0.08)_0%,transparent_40%),radial-gradient(circle_at_75%_50%,#002d5a_0%,#050a0f_65%)] px-[6%] pb-16 pt-6 max-[900px]:px-[5%]"
        aria-label="Área do gestor LEMM"
      >
        <PlexusBackground networkColor="0, 212, 255" />
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

        <header
          className={cn(
            'relative z-10 mx-auto mb-10 w-full max-w-5xl rounded-b-2xl border border-white/10 border-t-0 bg-zinc-950/90 px-6 py-4 shadow-[0_12px_40px_rgba(0,0,0,0.55),0_0_1px_rgba(0,212,255,0.15)] backdrop-blur-md max-[900px]:px-4',
            fontOrbitron
          )}
        >
          <nav className="flex justify-center" aria-label="Navegação do gestor">
            <ul className="m-0 flex list-none flex-wrap items-center justify-center gap-8 p-0 sm:gap-12">
              {navItems.map(({ href, label }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-[0.9rem] font-normal uppercase tracking-[2px] text-white transition-[color,text-shadow] duration-300 hover:text-[#00d4ff] hover:[text-shadow:0_0_8px_rgba(0,212,255,0.6)]"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </header>

        <div className="relative z-6 flex flex-1 flex-col items-center">
          <div className="mb-12 flex w-full max-w-lg justify-center px-4">
            <Image
              src="/add-files.svg"
              alt=""
              width={280}
              height={259}
              className="h-auto w-full max-w-[280px] drop-shadow-[0_0_24px_rgba(0,212,255,0.25)]"
              priority
            />
          </div>

          <div className="grid w-full max-w-3xl grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
            {cards.map(card => (
              <article
                key={card.id}
                id={card.id}
                className="flex flex-col rounded-xl border border-white/10 bg-[rgba(8,12,20,0.65)] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-sm"
              >
                <h2
                  className={cn(
                    'mb-2 text-lg font-bold tracking-wide text-white',
                    fontOrbitron
                  )}
                >
                  {card.title}
                </h2>
                <p className="mb-6 flex-1 text-sm leading-relaxed text-slate-400">
                  {card.description}
                </p>
                <Link
                  href={card.href}
                  className={cn(
                    'inline-flex w-fit items-center gap-1.5 text-sm font-medium text-[#5aebff] transition-[color,filter] hover:text-[#00d4ff]',
                    fontOrbitron
                  )}
                >
                  Acessar
                  <span aria-hidden className="text-base leading-none">
                    →
                  </span>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
