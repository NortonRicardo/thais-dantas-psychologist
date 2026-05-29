'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { labNavItems } from '../_constants/lab-nav-items'
import { cn } from '@/lib/utils'

export function PublicHeader() {
  const pathname = usePathname()

  return (
    <header className="mx-auto flex w-full max-w-3xl items-center justify-between px-6 py-8">
      <Link href="/" className="text-lg font-bold tracking-tight text-neutral-900">
        Thais Dantas
      </Link>
      <nav aria-label="Navegação principal">
        <ul className="flex list-none gap-6 p-0">
          {labNavItems.map(({ href, label }) => {
            const active =
              pathname === href || pathname.startsWith(`${href}/`)
            return (
              <li key={label}>
                <Link
                  href={href}
                  className={cn(
                    'text-sm transition-colors',
                    active
                      ? 'font-medium text-neutral-900'
                      : 'text-neutral-600 hover:text-neutral-900'
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
