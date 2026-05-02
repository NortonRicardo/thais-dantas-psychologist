import type { ReactNode } from 'react'
import { ManagerNav } from '../_components/manager-nav'

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
          className="flex w-full flex-wrap items-center gap-2 px-4 py-2"
          style={{
            background: '#071525',
            borderRadius: '0 0 1rem 1rem',
            boxShadow: headerShadow,
          }}
          role="banner"
        >
          <div className="flex shrink-0 items-center">
            <span className="text-[1.125rem] font-semibold leading-7 text-[#e4e4e7]">
              LEMM
            </span>
          </div>
          <ManagerNav />
        </header>
      </div>
      {children}
    </>
  )
}
