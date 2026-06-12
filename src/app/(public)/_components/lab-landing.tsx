import { ArrowRight, ChevronDown } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { homeNavItems } from '../_constants/home-nav-items'
import { WHATSAPP_BOOKING_URL } from '../_constants/contact-links'

export function LabLanding() {
  return (
    <div className="text-[#2D2D2D]">
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative flex min-h-svh flex-col overflow-hidden bg-[#556040]">
        {/* Nav */}
        <header className="relative z-30 px-5 py-6 sm:px-10 sm:py-8">
          <div className="absolute top-full inset-x-0 px-5 pt-5 sm:px-10 sm:pt-6">
            <div className="mx-auto flex max-w-7xl justify-between">
              <div className="flex flex-col items-start gap-0.5">
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/70">Artigos & Reflexões</p>
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/70">Saúde Mental no Dia a Dia</p>
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/70">Publicações em Breve</p>
              </div>
              <div className="flex flex-col items-end gap-0.5">
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/70">Psicóloga CRP registrada</p>
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/70">Atendimento online e presencial</p>
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/70">Sessões sigilosas</p>
              </div>
            </div>
          </div>
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
              className="shrink-0 rounded-full bg-white/95 px-4 py-2 text-sm font-medium text-[#3A4424] shadow-sm transition-colors hover:bg-white sm:px-6 sm:py-2.5"
            >
              Agendar horário
            </a>
          </div>
        </header>

        {/* Chair image */}
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-8 pb-28 pt-36 sm:pb-24 sm:pt-40 lg:pt-44">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-[40%] w-full bg-[linear-gradient(to_bottom,transparent_0%,rgba(24,32,26,0.30)_50%,rgba(24,32,26,0.62)_100%)]"
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

        {/* Topics – 3 columns, above chair */}
        <div className="pointer-events-none absolute inset-x-0 top-[32%] z-30 hidden px-6 sm:px-10 lg:block">
          <div className="mx-auto flex max-w-5xl justify-between">
            <div className="flex flex-col gap-1">
              {['Obesidade', 'Emagrecimento'].map((t) => (
                <p key={t} className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/30">{t}</p>
              ))}
            </div>
            <div className="flex flex-col items-center gap-1">
              {['Terapia Cognitivo Comportamental', 'Transtornos Alimentares'].map((t) => (
                <p key={t} className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/30">{t}</p>
              ))}
            </div>
            <div className="flex flex-col items-end gap-1">
              {['Cirurgia Bariátrica', 'Endometriose'].map((t) => (
                <p key={t} className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/30">{t}</p>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 px-6 pb-7 sm:px-10 sm:pb-9">
          <div className="pointer-events-auto relative mx-auto flex max-w-7xl items-end">
            {/* Description – centered absolutely */}
            <p className="pointer-events-none absolute inset-x-0 bottom-0 mx-auto max-w-[1100px] text-center text-[10px] font-medium uppercase leading-loose tracking-[0.18em] text-white/80 sm:text-[11px]">
              <span className="block">Um espaço calmo e livre de julgamentos para trabalhar ansiedade, esgotamento, relacionamentos e autoestima.</span>
              <span className="block">Sessões online ou presenciais, com acompanhamento personalizado.</span>
            </p>

            {/* More – bottom right */}
            <div className="pointer-events-auto ml-auto flex items-center gap-2.5">
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
      <div className="bg-[#D4DCBA]">
        <section
          id="sobre"
          className="scroll-mt-20 border-t border-[#556040]/30 px-6 py-24 sm:px-10"
        >
          <div className="mx-auto max-w-3xl">
            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#556040]">
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
          id="especialidades"
          className="scroll-mt-20 border-t border-[#556040]/30 px-6 py-24 sm:px-10"
        >
          <div className="mx-auto max-w-5xl">
            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#556040]">
              Especialidades
            </span>
            <div className="mt-10 grid grid-cols-1 gap-px sm:grid-cols-[1fr_1px_1fr]">
              <div className="flex flex-col">
                <span className="mb-6 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#556040]/50">
                  Saúde & Corpo
                </span>
                {['Obesidade', 'Emagrecimento', 'Cirurgia Bariátrica', 'Endometriose'].map((t) => (
                  <p
                    key={t}
                    className="border-t border-[#556040]/15 py-5 text-xl text-[#2D2D2D]/80"
                  >
                    {t}
                  </p>
                ))}
              </div>
              <div className="hidden bg-[#556040]/15 sm:block" />
              <div className="mt-12 flex flex-col sm:mt-0 sm:pl-16">
                <span className="mb-6 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#556040]/50">
                  Abordagem
                </span>
                {['Transtornos Alimentares', 'Terapia Cognitivo Comportamental'].map((t) => (
                  <p
                    key={t}
                    className="border-t border-[#556040]/15 py-5 text-xl text-[#2D2D2D]/80"
                  >
                    {t}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          id="terapia"
          className="scroll-mt-20 border-t border-[#556040]/30 px-6 py-24 sm:px-10"
        >
          <div className="mx-auto max-w-3xl">
            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#556040]">
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
          className="scroll-mt-20 border-t border-[#556040]/30 px-6 py-24 sm:px-10"
        >
          <div className="mx-auto max-w-3xl">
            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#556040]">
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
              className="mt-10 inline-flex items-center gap-2 rounded-full border border-[#556040] px-6 py-3 text-sm font-medium text-[#3A4424] transition-colors hover:bg-[#556040]/10"
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
