'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/manager/equipe/membros', label: 'Equipe' },
  { href: '/manager/equipe/categorias', label: 'Categorias' },
  { href: '/manager/equipe/tratamentos', label: 'Tratamentos' },
  { href: '/manager/equipe/graus', label: 'Graus' },
] as const

export default function EquipeLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="mx-auto max-w-[1400px] px-6">
      <div className="flex min-h-[calc(100vh-3.5rem)] gap-0 pb-8">
        <aside className="mt-8 w-52 shrink-0 self-stretch rounded-xl bg-white/[0.08] p-3 pt-8">
          <p className="mb-2 px-3 text-sm font-semibold text-white/60">Equipe</p>
          <nav aria-label="Equipe" className="flex flex-col gap-0.5">
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
        </aside>

        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  )
}
