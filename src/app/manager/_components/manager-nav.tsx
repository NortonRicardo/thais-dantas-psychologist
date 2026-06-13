'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/manager', label: 'Início', exact: true },
  { href: '/manager/contato', label: 'Contato', exact: false },
  { href: '/manager/blog', label: 'Blog', exact: false },
]

export function ManagerNav() {
  const pathname = usePathname()
  return (
    <ul className="pointer-events-none absolute inset-0 flex list-none items-center justify-center gap-x-4 p-0 sm:gap-x-8">
      {navItems.map(({ href, label, exact }) => {
        const isCurrent = exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`)
        return (
          <li key={label} className="pointer-events-auto">
            <Link
              href={href}
              className={cn(
                'text-sm font-medium transition-colors',
                isCurrent ? 'text-white' : 'text-white/70 hover:text-white',
              )}
            >
              {label}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

export function ManagerLogout() {
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/auth', { method: 'DELETE' })
    router.replace('/manager/login')
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="flex shrink-0 items-center gap-1.5 rounded-full bg-white/95 px-4 py-2 text-sm font-medium text-[#3A4424] shadow-sm transition-colors hover:bg-white sm:px-5 sm:py-2.5"
    >
      <LogOut size={13} />
      Sair
    </button>
  )
}
