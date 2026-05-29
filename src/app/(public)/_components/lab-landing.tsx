import { ArrowRight, ChevronDown } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { homeNavItems } from '../_constants/home-nav-items'

export function LabLanding() {
  return (
    <div className="text-[#2D2D2D]">
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative flex min-h-svh flex-col overflow-hidden bg-[#B8AEA4]">

        {/* Nav */}
        <header className="relative z-30 px-5 py-6 sm:px-10 sm:py-8">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            {/* Nav — pill próprio que funde para transparente no lado direito */}
            <nav
              aria-label="Navegação principal"
              className="mr-5 flex-1 rounded-full bg-[linear-gradient(to_right,rgba(255,255,255,0.18),rgba(255,255,255,0.18)_45%,rgba(255,255,255,0.12)_60%,rgba(255,255,255,0.06)_75%,rgba(255,255,255,0.02)_88%,transparent)] px-6 py-2.5 backdrop-blur-sm sm:px-8 sm:py-3"
            >
              <ul className="flex list-none gap-x-5 p-0 sm:gap-x-8">
                {homeNavItems.map(({ href, label }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm font-medium text-white/80 transition-colors hover:text-white"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Botão — elemento separado, sem nenhum container compartilhado */}
            <Link
              href="/contato"
              className="shrink-0 rounded-full bg-white/95 px-4 py-2 text-sm font-medium text-[#7A6E65] shadow-sm transition-colors hover:bg-white sm:px-6 sm:py-2.5"
            >
              Agendar horário
            </Link>
          </div>
        </header>

        {/* Background display text */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex flex-col justify-between overflow-hidden px-6 py-16 sm:px-10 sm:py-20"
        >
          <span
            className="mt-[5%] select-none self-start font-[family-name:var(--font-cinzel)] font-light italic leading-none tracking-tight text-[#C5BDB7]/50"
            style={{ fontSize: 'clamp(60px, 11vw, 180px)' }}
          >
            Thais
          </span>
          <span
            className="mb-[5%] select-none self-end font-[family-name:var(--font-cinzel)] font-light italic leading-none tracking-tight text-[#C5BDB7]/50"
            style={{ fontSize: 'clamp(60px, 11vw, 180px)' }}
          >
            Dantas
          </span>
        </div>

        {/* Chair image */}
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-8 pb-36 pt-24 sm:pb-32 sm:pt-20">
          <Image
            src="/chair.png"
            alt="Consultório com duas cadeiras e mesa de apoio"
            width={960}
            height={640}
            priority
            className="h-auto w-full max-w-lg object-contain brightness-75 sm:max-w-xl lg:max-w-2xl"
          />
        </div>

        {/* Bottom bar */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 px-6 pb-7 sm:px-10 sm:pb-9">
          <div className="pointer-events-auto mx-auto grid max-w-7xl grid-cols-[auto_1fr_auto] items-end gap-6">

            {/* Stats – bottom left */}
            <div className="hidden flex-col gap-1.5 lg:flex">
              <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/75">
                Psicóloga CRP registrada
              </p>
              <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/75">
                Atendimento online e presencial
              </p>
              <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/75">
                Sessões sigilosas
              </p>
            </div>

            {/* Description – bottom center */}
            <p className="text-center text-[10px] font-medium uppercase leading-loose tracking-[0.18em] text-white/80 sm:text-[11px]">
              Um espaço calmo e livre de julgamentos para trabalhar ansiedade,
              esgotamento, relacionamentos e autoestima.{' '}
              <br className="hidden sm:block" />
              Sessões online ou presenciais, com acompanhamento personalizado.
            </p>

            {/* More – bottom right */}
            <div className="flex items-center gap-2.5">
              <Link
                href="#sobre"
                className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/80 transition-opacity hover:opacity-100"
              >
                Mais
              </Link>
              <Link
                href="#sobre"
                aria-label="Ver mais conteúdo"
                className="flex size-8 items-center justify-center rounded-full border border-white/60 text-white/80 transition-colors hover:border-white hover:text-white"
              >
                <ChevronDown className="size-3.5" strokeWidth={2} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTENT SECTIONS ─────────────────────────────────────────────── */}
      <div className="bg-[#F4F0EA]">

        <section
          id="sobre"
          className="scroll-mt-20 border-t border-[#B8AEA4]/30 px-6 py-24 sm:px-10"
        >
          <div className="mx-auto max-w-3xl">
            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#B8AEA4]">
              Sobre
            </span>
            <p className="mt-5 text-xl leading-relaxed text-[#2D2D2D]/90 sm:text-2xl sm:leading-relaxed">
              Sou Thais Dantas, psicóloga dedicada a oferecer um ambiente seguro
              e acolhedor. Cada encontro é conduzido com escuta qualificada,
              respeito ao seu ritmo e foco no que faz sentido para você.
            </p>
          </div>
        </section>

        <section
          id="terapia"
          className="scroll-mt-20 border-t border-[#B8AEA4]/30 px-6 py-24 sm:px-10"
        >
          <div className="mx-auto max-w-3xl">
            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#B8AEA4]">
              Terapia
            </span>
            <p className="mt-5 text-xl leading-relaxed text-[#2D2D2D]/90 sm:text-2xl sm:leading-relaxed">
              O processo terapêutico pode ajudar a compreender padrões
              emocionais, desenvolver recursos internos e construir relações
              mais saudáveis consigo e com os outros — sempre com
              confidencialidade e cuidado.
            </p>
          </div>
        </section>

        <section
          id="consultas"
          className="scroll-mt-20 border-t border-[#B8AEA4]/30 px-6 py-24 sm:px-10"
        >
          <div className="mx-auto max-w-3xl">
            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#B8AEA4]">
              Consultas
            </span>
            <p className="mt-5 text-xl leading-relaxed text-[#2D2D2D]/90 sm:text-2xl sm:leading-relaxed">
              Atendimentos online ou presenciais, com horários combinados
              previamente. Para agendar ou tirar dúvidas, entre em contato.
            </p>
            <Link
              href="/contato"
              className="mt-10 inline-flex items-center gap-2 rounded-full border border-[#B8AEA4] px-6 py-3 text-sm font-medium text-[#7A6E65] transition-colors hover:bg-[#B8AEA4]/10"
            >
              Agendar uma consulta
              <ArrowRight className="size-3.5" strokeWidth={2} />
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
