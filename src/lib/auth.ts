import 'server-only'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const SESSION_COOKIE = 'lemm_session'
const PASSWORD = process.env.MANAGER_PASSWORD ?? ''

export function verifyPassword(password: string): boolean {
  if (!PASSWORD) return false
  return password === PASSWORD
}

export async function createSession(): Promise<void> {
  const jar = await cookies()
  jar.set(SESSION_COOKIE, 'authenticated', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
}

export async function destroySession(): Promise<void> {
  const jar = await cookies()
  jar.delete(SESSION_COOKIE)
}

export async function isAuthenticated(): Promise<boolean> {
  const jar = await cookies()
  return jar.get(SESSION_COOKIE)?.value === 'authenticated'
}

export async function requireAuth(): Promise<void> {
  const ok = await isAuthenticated()
  if (!ok) redirect('/manager/login')
}
