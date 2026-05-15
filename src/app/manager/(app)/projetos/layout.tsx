'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/manager/projetos/lista', label: 'Projetos' },
  { href: '/manager/projetos/categorias', label: 'Categorias' },
  { href: '/manager/projetos/temas', label: 'Temas' },
] as const

export default function ProjetosLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="mx-auto max-w-[1400px] px-6">
      <div className="flex min-h-[calc(100vh-3.5rem)] gap-8 pb-8 lg:gap-10">
        <aside className="mt-8 w-52 shrink-0 self-stretch rounded-xl bg-white/[0.08] p-3 pt-6">
          <div className="flex flex-col gap-1">
            <p className="px-3 text-xs font-semibold uppercase tracking-wider text-white/45">
              Projetos
            </p>
            <nav aria-label="Projetos" className="flex flex-col gap-0.5">
              {NAV_ITEMS.map(item => {
                const isCurrent =
                  pathname === item.href || pathname.startsWith(`${item.href}/`)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'w-full rounded-md px-3 py-2 text-left text-sm transition-colors',
                      isCurrent
                        ? 'bg-white/10 font-medium text-white/90'
                        : 'text-white/50 hover:bg-white/5 hover:text-white/75'
                    )}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </div>
        </aside>

        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  )
}
