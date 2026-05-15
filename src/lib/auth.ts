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
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 dias
    updateAge: 60 * 60 * 24,     // renova o cookie se tiver > 1 dia velho
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,            // cache local de 5 min — evita hit no DB a cada request
    },
  },
  advanced: {
    cookiePrefix: '__Host',
  },
})
