import type { ReactNode } from 'react'
import Link from 'next/link'
import { ManagerLogout, ManagerNav } from '../_components/manager-nav'

const headerShadow = [
  '0 8px 8px rgba(0,0,0,0.1)',
  '0 4px 4px rgba(0,0,0,0.1)',
  '0 2px 2px rgba(0,0,0,0.1)',
  '0 0 0 1px rgba(0,0,0,0.1)',
  'inset 0 0 0 1px rgba(255,255,255,0.03)',
  'inset 0 1px 0 rgba(255,255,255,0.03)',
].join(', ')

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="mx-auto max-w-[1700px] px-4">
        <header
          className="grid w-full grid-cols-[1fr_auto_1fr] items-center gap-2 px-4 py-2"
          style={{
            background: '#071812',
            borderRadius: '0 0 1rem 1rem',
            boxShadow: headerShadow,
          }}
          role="banner"
        >
          <div className="flex min-w-0 shrink-0 items-center justify-self-start">
            <Link
              href="/manager/contato"
              className="text-[1.125rem] font-semibold leading-7 text-[#e4e4e7] hover:text-white transition-colors"
            >
              Thais Dantas
            </Link>
          </div>
          <ManagerNav />
          <div className="flex min-w-0 justify-end justify-self-end">
            <ManagerLogout />
          </div>
        </header>
      </div>
      {children}
    </>
  )
}
