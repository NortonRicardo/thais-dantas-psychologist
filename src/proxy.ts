import { NextRequest, NextResponse } from 'next/server'
import { betterFetch } from '@better-fetch/fetch'
import type { Session } from 'better-auth/types'

// Rate limit para tentativas não autenticadas: 30 req/min por IP
const rlMap = new Map<string, { count: number; resetAt: number }>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rlMap.get(ip)
  if (!entry || entry.resetAt < now) {
    rlMap.set(ip, { count: 1, resetAt: now + 60_000 })
    return false
  }
  if (entry.count >= 30) return true
  entry.count++
  return false
}

function getIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  )
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Passa direto: endpoints internos do Better Auth
  if (pathname.startsWith('/api/auth')) return NextResponse.next()

  // Passa direto: página de login
  if (pathname === '/manager/login') return NextResponse.next()

  // Verifica sessão
  const { data: session } = await betterFetch<Session>('/api/auth/get-session', {
    baseURL: process.env.BETTER_AUTH_BASE_URL ?? req.nextUrl.origin,
    headers: { cookie: req.headers.get('cookie') ?? '' },
  })

  if (session) return NextResponse.next()

  // Sem sessão — aplica rate limit antes de qualquer resposta
  if (isRateLimited(getIp(req))) {
    return NextResponse.json(
      { error: 'Muitas requisições. Tente novamente em instantes.' },
      { status: 429, headers: { 'Retry-After': '60' } }
    )
  }

  // /manager/* → redireciona para login
  if (pathname.startsWith('/manager')) {
    const loginUrl = req.nextUrl.clone()
    loginUrl.pathname = '/manager/login'
    return NextResponse.redirect(loginUrl)
  }

  // /api/* (todos os métodos, incluindo GET) → exige autenticação
  // As páginas públicas (/) buscam dados direto no banco via Server Components,
  // portanto nenhum endpoint de API deve ser acessível sem sessão.
  if (pathname.startsWith('/api/')) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/manager/:path*', '/api/:path*'],
}
