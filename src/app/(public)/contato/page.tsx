import type { Metadata } from 'next'
import Link from 'next/link'

import { WHATSAPP_BOOKING_URL } from '../_constants/contact-links'
import { homeNavItems } from '../_constants/home-nav-items'
import { ContatoSection } from './_components/contato-section'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Contato | Thais Dantas',
  description: 'Entre em contato com Thais Dantas.',
}

export default function ContatoPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#556040] px-6 py-6 sm:px-10 sm:py-8">
      {/* ── NAV ──────────────────────────────────────────────────────────── */}
      <header>
        <div className="mx-auto flex max-w-5xl items-center gap-4 sm:gap-5">
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

      {/* ── CONTENT ──────────────────────────────────────────────────────── */}
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col">
        <ContatoSection />
      </div>
    </div>
  )
}
