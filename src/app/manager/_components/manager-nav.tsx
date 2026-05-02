'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/manager', label: 'Home' },
  { href: '/manager/eventos', label: 'Eventos' },
]

export function ManagerNav() {
  const pathname = usePathname()
  return (
    <nav className="mx-auto flex flex-wrap items-center gap-1" aria-label="Principal">
      {navItems.map(({ href, label }) => {
        const isCurrent = pathname === href
        return (
          <Link
            key={label}
            href={href}
            className={cn(
              'inline-flex items-center rounded-md px-3 py-2 text-sm leading-5 transition-colors duration-150',
              isCurrent ? 'font-semibold text-[#fafafa]' : 'text-[#d4d4d8] hover:text-[#fafafa]'
            )}
          >
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
