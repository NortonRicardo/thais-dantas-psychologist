import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { username } from 'better-auth/plugins'
import { db } from '@/lib/db'
import {
  authUsers,
  authSessions,
  authAccounts,
  authVerifications,
} from '@/lib/db/schema'

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_BASE_URL ?? process.env.BETTER_AUTH_URL,
  trustedOrigins: process.env.BETTER_AUTH_URL
    ? [
        process.env.BETTER_AUTH_URL,
        process.env.BETTER_AUTH_URL.replace(
          /^(https?:\/\/)(?!www\.)/,
          '$1www.'
        ),
      ]
    : [],
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user: authUsers,
      session: authSessions,
      account: authAccounts,
      verification: authVerifications,
    },
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [username()],
  rateLimit: {
    enabled: true,
    window: 60,
    max: 100,
    storage: 'memory',
    customRules: {
      '/sign-in/username': { window: 60, max: 5 },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 dias
    updateAge: 60 * 60 * 24, // renova o cookie se tiver > 1 dia velho
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // cache local de 5 min — evita hit no DB a cada request
    },
  },
  advanced: {
    cookiePrefix: '__Host',
    defaultCookieAttributes: {
      sameSite: 'strict',
    },
  },
})
