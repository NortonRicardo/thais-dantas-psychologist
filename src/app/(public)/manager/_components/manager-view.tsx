import Image from 'next/image'
import Link from 'next/link'

import { LabSceneShell } from '../../_components/lab-scene-shell'
import { PublicFooter } from '../../_components/public-footer'
import { cn } from '@/lib/utils'

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
    <>
      <LabSceneShell aria-label="Área do gestor LEMM">
        <header
          className={cn(
            'relative z-10 mx-auto mb-10 w-full max-w-5xl rounded-b-2xl border border-white/10 border-t-0 bg-zinc-950/90 px-6 py-4 shadow-[0_12px_40px_rgba(0,0,0,0.55),0_0_1px_rgba(0,212,255,0.15)] backdrop-blur-md max-[900px]:px-4',
            fontOrbitron
          )}
        >
          <nav
            className="flex justify-center"
            aria-label="Navegação do gestor"
          >
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
      </LabSceneShell>
      <PublicFooter />
    </>
  )
}
