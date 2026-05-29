import { eq } from 'drizzle-orm'
import { db } from './index'
import { authUsers, contactChannels, contactInfo } from './schema'
import { auth } from '@/lib/auth'

const seedChannels = [
  { label: 'E-mail', iconKey: 'mail', value: 'contato@thaisdantas.com.br', sortOrder: 0 },
  { label: 'WhatsApp', iconKey: 'message-circle', value: '+55 62 9 0000-0000', sortOrder: 1 },
  { label: 'Instagram', iconKey: 'instagram', value: 'https://instagram.com/thaisdantas', sortOrder: 2 },
] as const

async function main() {
  console.warn('🌱 Seeding contato…')

  await db.delete(contactChannels)
  await db.delete(contactInfo)

  const [info] = await db
    .insert(contactInfo)
    .values({
      mapUrl:
        'https://maps.google.com/maps?q=-16.6784792,-49.2453736&z=17&output=embed',
    })
    .returning({ id: contactInfo.id })

  if (!info) throw new Error('Falha ao criar contact_info')

  await db.insert(contactChannels).values(
    seedChannels.map(ch => ({
      contactInfoId: info.id,
      label: ch.label,
      iconKey: ch.iconKey,
      value: ch.value,
      sortOrder: ch.sortOrder,
    }))
  )

  console.warn('✅ Contato inserido.')

  console.warn('🌱 Criando usuário admin…')
  const adminUsername = process.env.ADMIN_USERNAME
  const adminPassword = process.env.ADMIN_PASSWORD

  if (!adminUsername || !adminPassword) {
    console.warn(
      '⚠️  ADMIN_USERNAME ou ADMIN_PASSWORD não definidos no .env — admin ignorado.'
    )
  } else {
    const [existing] = await db
      .select({ id: authUsers.id })
      .from(authUsers)
      .where(eq(authUsers.username, adminUsername))
      .limit(1)

    if (existing) {
      console.warn(`⚠️  Admin "${adminUsername}" já existe — ignorado.`)
    } else {
      try {
        await auth.api.signUpEmail({
          body: {
            name: adminUsername,
            email: `${adminUsername}@thais-dantas.internal`,
            password: adminPassword,
            username: adminUsername,
          },
        })
        console.warn(`✅ Admin "${adminUsername}" criado.`)
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err)
        console.error('❌ Falha ao criar admin:', msg)
      }
    }
  }

  process.exit(0)
}

main().catch(err => {
  console.error('❌ Seed falhou:', err)
  process.exit(1)
})
