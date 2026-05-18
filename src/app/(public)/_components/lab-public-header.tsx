'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'

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
  const [mobileOpen, setMobileOpen] = useState(false)

  // Fecha o menu ao navegar
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  // Trava o scroll do body enquanto o menu está aberto
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <>
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

        {/* Nav desktop */}
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

        {/* Botão hambúrguer — só mobile */}
        <button
          type="button"
          onClick={() => setMobileOpen(o => !o)}
          className="flex h-9 w-9 items-center justify-center text-white/70 transition-colors hover:text-white min-[900px]:hidden"
          aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      {/* Menu mobile fullscreen */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-[#050a0f] min-[900px]:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Menu de navegação"
        >
          {/* Topo do overlay */}
          <div className="flex shrink-0 items-center justify-between px-[6%] py-6">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className={cn(
                'text-2xl font-black tracking-[6px] text-white',
                fontOrbitron
              )}
            >
              LEMM
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="flex h-9 w-9 items-center justify-center text-white/60 transition-colors hover:text-white"
              aria-label="Fechar menu"
            >
              <X size={22} />
            </button>
          </div>

          {/* Links */}
          <nav
            className="flex flex-1 flex-col justify-center px-[8%]"
            aria-label="Navegação mobile"
          >
            <ul className="m-0 flex list-none flex-col gap-7 p-0">
              {labNavItems.map(({ href, label }) => {
                const active = linkActive(pathname, href)
                return (
                  <li key={label}>
                    <Link
                      href={href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        'block text-[1.4rem] font-black uppercase tracking-[3px] transition-colors duration-200',
                        fontOrbitron,
                        active ? 'text-[#00d4ff]' : 'text-white/55 hover:text-white'
                      )}
                    >
                      {label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>
      )}
    </>
  )
}
