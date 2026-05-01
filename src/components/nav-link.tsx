'use client'

import Link, { LinkProps } from 'next/link'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export type NavLinkProps = Omit<LinkProps, 'className'> & {
  children: ReactNode
  className?: string
  /** Quando true, ativo só se pathname for exatamente o href. Quando false, ativo se pathname começar com href */
  exact?: boolean
}

export function NavLink({
  children,
  className,
  exact,
  href,
  ...props
}: NavLinkProps) {
  const pathname = usePathname() ?? ''
  const hrefStr =
    typeof href === 'string'
      ? href
      : ((href as { pathname?: string }).pathname ?? '')
  // exact: só ativo na URL exata (ex.: Home em /app). !exact: ativo na URL ou em sub-rotas (ex.: Cadastros em /app/registry/category)
  const isCurrent = exact
    ? pathname === hrefStr || pathname === `${hrefStr}/`
    : pathname === hrefStr || pathname.startsWith(`${hrefStr}/`)

  return (
    <Link
      href={href}
      data-current={isCurrent}
      className={cn(className)}
      {...props}
    >
      {children}
    </Link>
  )
}
