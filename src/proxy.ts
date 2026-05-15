import { NextRequest, NextResponse } from 'next/server'
import { betterFetch } from '@better-fetch/fetch'
import type { Session } from 'better-auth/types'

const PROTECTED_API_PREFIXES = [
  '/api/team',
  '/api/projects',
  '/api/project-categories',
  '/api/project-themes',
  '/api/event-types',
  '/api/contato',
  '/api/hardware',
  '/api/hardware-modules',
  '/api/events',
  '/api/about-timeline',
  '/api/collaboration-partners',
  '/api/developed-platforms',
]

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Passa direto: endpoints internos do Better Auth
  if (pathname.startsWith('/api/auth')) return NextResponse.next()

  // Passa direto: página de login
  if (pathname === '/manager/login') return NextResponse.next()

  const needsAuth =
    pathname.startsWith('/manager') ||
    (req.method !== 'GET' &&
      PROTECTED_API_PREFIXES.some(p => pathname.startsWith(p)))

  if (!needsAuth) return NextResponse.next()

  const { data: session } = await betterFetch<Session>('/api/auth/get-session', {
    baseURL: req.nextUrl.origin,
    headers: { cookie: req.headers.get('cookie') ?? '' },
  })

  if (!session) {
    if (pathname.startsWith('/manager')) {
      const loginUrl = req.nextUrl.clone()
      loginUrl.pathname = '/manager/login'
      return NextResponse.redirect(loginUrl)
    }
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/manager/:path*', '/api/:path*'],
}
