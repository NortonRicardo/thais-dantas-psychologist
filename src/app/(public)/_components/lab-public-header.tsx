'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { cn } from '@/lib/utils'

import { labNavItems } from '../_constants/lab-nav-items'

const fontOrbitron = '[font-family:var(--font-orbitron),sans-serif]'

type LabPublicHeaderProps = {
  /** Hero da home: fixo no topo; páginas internas: fluxo normal. */
  variant?: 'absolute' | 'static'
  className?: string
}

function linkActive(pathname: string, href: string) {
  if (href === '#' || !href.startsWith('/')) return false
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function LabPublicHeader({
  variant = 'static',
  className,
}: LabPublicHeaderProps) {
  const pathname = usePathname()

  return (
    <header
      className={cn(
        'flex w-full items-center justify-between',
        variant === 'absolute' &&
          'absolute left-0 top-0 z-10 px-[8%] py-10 max-[900px]:px-[6%] max-[900px]:py-6',
        variant === 'static' && 'relative z-10 py-6 max-[900px]:py-5',
        className
      )}
    >
      <Link
        href="/"
        className={cn(
          'text-2xl font-black tracking-[6px] text-white [text-shadow:0_0_10px_rgba(255,255,255,0.3)]',
          fontOrbitron
        )}
      >
        LEMM
      </Link>
      <nav className="max-[900px]:hidden" aria-label="Navegação principal">
        <ul className="m-0 flex list-none gap-4 p-0 lg:gap-6">
          {labNavItems.map(({ href, label }) => {
            const active = linkActive(pathname, href)
            return (
              <li key={label}>
                <Link
                  href={href}
                  className={cn(
                    'text-[0.85rem] uppercase tracking-[2px] transition-[color,text-shadow,font-weight] duration-300',
                    active
                      ? 'font-semibold text-[#00d4ff] [text-shadow:0_0_8px_rgba(0,212,255,0.5)]'
                      : 'font-normal text-[#8892b0] hover:text-[#00d4ff] hover:[text-shadow:0_0_8px_rgba(0,212,255,0.6)]'
                  )}
                >
                  {label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </header>
  )
}
