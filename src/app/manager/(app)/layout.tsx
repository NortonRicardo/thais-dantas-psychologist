import type { ReactNode } from 'react'
import Link from 'next/link'
import { ManagerNav, ManagerLogout } from '../_components/manager-nav'

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="px-6 py-6 sm:px-10 sm:py-8">
        <div className="mx-auto flex max-w-7xl items-center gap-4 sm:gap-5">
          <nav
            aria-label="Gestor"
            className="relative flex min-w-0 flex-1 items-center rounded-full bg-[linear-gradient(to_right,rgba(255,255,255,0.18),rgba(255,255,255,0.18)_45%,rgba(255,255,255,0.12)_60%,rgba(255,255,255,0.06)_75%,rgba(255,255,255,0.02)_88%,transparent)] py-2.5 pl-5 pr-3 backdrop-blur-sm sm:py-3 sm:pl-8 sm:pr-4"
          >
            <Link
              href="/manager/contato"
              className="relative z-10 shrink-0 font-[family-name:var(--font-cinzel)] text-sm font-medium tracking-wide text-white transition-colors hover:text-white/90 sm:text-base"
            >
              Thais Dantas
            </Link>
            <ManagerNav />
          </nav>
          <ManagerLogout />
        </div>
      </div>
      {children}
    </>
  )
}
