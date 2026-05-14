import postgres from 'postgres'

const client = postgres(process.env.DATABASE_URL!, { max: 1 })

async function reset() {
  console.log('Resetting database...')
  await client.unsafe(`
    DROP SCHEMA public CASCADE;
    CREATE SCHEMA public;
    GRANT ALL ON SCHEMA public TO public;
  `)
  console.log('Database reset complete.')
  await client.end()
}

reset().catch((err) => {
  console.error(err)
  process.exit(1)
})
