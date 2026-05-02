import { NextRequest, NextResponse } from 'next/server'

const SESSION_COOKIE = 'lemm_session'

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname === '/manager/login') return NextResponse.next()

  const session = req.cookies.get(SESSION_COOKIE)?.value

  if (pathname.startsWith('/manager')) {
    if (session !== 'authenticated') {
      const url = req.nextUrl.clone()
      url.pathname = '/manager/login'
      return NextResponse.redirect(url)
    }
  }

  if (pathname.startsWith('/api/events') && req.method !== 'GET') {
    if (session !== 'authenticated') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }
  }

  if (pathname.startsWith('/api/about-timeline') && req.method !== 'GET') {
    if (session !== 'authenticated') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }
  }

  if (
    pathname.startsWith('/api/collaboration-partners') &&
    req.method !== 'GET'
  ) {
    if (session !== 'authenticated') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }
  }

  if (pathname.startsWith('/api/developed-platforms') && req.method !== 'GET') {
    if (session !== 'authenticated') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/manager/:path*',
    '/api/events/:path*',
    '/api/events',
    '/api/about-timeline/:path*',
    '/api/about-timeline',
    '/api/collaboration-partners/:path*',
    '/api/collaboration-partners',
    '/api/developed-platforms/:path*',
    '/api/developed-platforms',
  ],
}
