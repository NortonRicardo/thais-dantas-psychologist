import { ArrowRight, ChevronDown } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { homeNavItems } from '../_constants/home-nav-items'
import { WHATSAPP_BOOKING_URL } from '../_constants/contact-links'

export function LabLanding() {
  return (
    <div className="text-[#2D2D2D]">
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative flex min-h-svh flex-col overflow-hidden bg-[#6B7A50]">
        {/* Nav */}
        <header className="relative z-30 px-5 py-6 sm:px-10 sm:py-8">
          <div className="mx-auto flex max-w-7xl items-center gap-4 sm:gap-5">
            <nav
              aria-label="Navegação principal"
              className="relative flex min-w-0 flex-1 items-center rounded-full bg-[linear-gradient(to_right,rgba(255,255,255,0.18),rgba(255,255,255,0.18)_45%,rgba(255,255,255,0.12)_60%,rgba(255,255,255,0.06)_75%,rgba(255,255,255,0.02)_88%,transparent)] py-2.5 pl-5 pr-3 backdrop-blur-sm sm:py-3 sm:pl-8 sm:pr-4"
            >
              <Link
                href="/"
                className="relative z-10 shrink-0 font-[family-name:var(--font-cinzel)] text-sm font-medium tracking-wide text-white transition-colors hover:text-white/90 sm:text-base"
              >
                Thais Dantas
              </Link>

              <ul className="pointer-events-none absolute inset-0 flex list-none items-center justify-center gap-x-4 p-0 sm:gap-x-8">
                {homeNavItems.map(({ href, label }) => (
                  <li key={label} className="pointer-events-auto">
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

            <a
              href={WHATSAPP_BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 rounded-full bg-white/95 px-4 py-2 text-sm font-medium text-[#4A5530] shadow-sm transition-colors hover:bg-white sm:px-6 sm:py-2.5"
            >
              Agendar horário
            </a>
          </div>
        </header>

        {/* Chair image */}
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-8 pb-28 pt-36 sm:pb-24 sm:pt-40 lg:pt-44">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-[66%] z-[5] h-[26%] w-full bg-[radial-gradient(ellipse_100%_55%_at_50%_30%,rgba(24,32,26,0)_0%,rgba(24,32,26,0.03)_15%,rgba(24,32,26,0.08)_35%,rgba(24,32,26,0.11)_50%,rgba(24,32,26,0.04)_68%,transparent_85%)] blur-md sm:top-[67%] sm:h-[28%]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-[73%] z-[5] h-[22%] w-full bg-[radial-gradient(ellipse_100%_48%_at_50%_28%,rgba(24,32,26,0)_0%,rgba(24,32,26,0.02)_18%,rgba(24,32,26,0.07)_42%,rgba(24,32,26,0.03)_62%,transparent_80%)] blur-md sm:top-[74%] sm:h-[24%]"
          />

          <div className="relative z-10 w-full max-w-xl translate-y-4 sm:max-w-2xl sm:translate-y-6 lg:max-w-4xl lg:translate-y-8 xl:max-w-5xl">
            <Image
              src="/chair.png"
              alt="Consultório com duas cadeiras e mesa de apoio"
              width={960}
              height={640}
              priority
              className="relative z-10 h-auto w-full object-contain brightness-75"
            />
          </div>
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
            <p className="text-center text-[12px] font-medium uppercase leading-loose tracking-[0.18em] text-white/80 sm:text-[13px]">
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
      <div className="bg-[#E2E8CC]">
        <section
          id="sobre"
          className="scroll-mt-20 border-t border-[#6B7A50]/30 px-6 py-24 sm:px-10"
        >
          <div className="mx-auto max-w-3xl">
            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#6B7A50]">
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
          className="scroll-mt-20 border-t border-[#6B7A50]/30 px-6 py-24 sm:px-10"
        >
          <div className="mx-auto max-w-3xl">
            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#6B7A50]">
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
          className="scroll-mt-20 border-t border-[#6B7A50]/30 px-6 py-24 sm:px-10"
        >
          <div className="mx-auto max-w-3xl">
            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#6B7A50]">
              Consultas
            </span>
            <p className="mt-5 text-xl leading-relaxed text-[#2D2D2D]/90 sm:text-2xl sm:leading-relaxed">
              Atendimentos online ou presenciais, com horários combinados
              previamente. Para agendar ou tirar dúvidas, entre em contato.
            </p>
            <a
              href={WHATSAPP_BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-10 inline-flex items-center gap-2 rounded-full border border-[#6B7A50] px-6 py-3 text-sm font-medium text-[#4A5530] transition-colors hover:bg-[#6B7A50]/10"
            >
              Agendar uma consulta
              <ArrowRight className="size-3.5" strokeWidth={2} />
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
