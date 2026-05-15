'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/manager/projetos', label: 'Projetos' },
  { href: '/manager/eventos', label: 'Eventos' },
  { href: '/manager/equipe', label: 'Equipe' },
  { href: '/manager/sobre-nos', label: 'Sobre Nós' },
  { href: '/manager/infraestrutura', label: 'Infraestrutura' },
  { href: '/manager/contato', label: 'Contato' },
]

export function ManagerNav() {
  const pathname = usePathname()

  return (
    <nav
      className="flex flex-wrap items-center justify-center gap-1 justify-self-center"
      aria-label="Principal"
    >
      {navItems.map(({ href, label }) => {
        const isCurrent =
          href === '/manager/infraestrutura'
            ? pathname.startsWith('/manager/infraestrutura')
            : href === '/manager/equipe'
              ? pathname.startsWith('/manager/equipe')
              : pathname === href
        return (
          <Link
            key={label}
            href={href}
            className={cn(
              'inline-flex items-center rounded-md px-3 py-2 text-sm leading-5 transition-colors duration-150',
              isCurrent
                ? 'font-semibold text-[#fafafa]'
                : 'text-[#d4d4d8] hover:text-[#fafafa]'
            )}
          >
            {label}
          </Link>
        )
      })}
    </nav>
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
      className="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm text-white/35 transition-colors hover:text-white/70"
      title="Sair"
    >
      <LogOut size={14} />
      Sair
    </button>
  )
}
