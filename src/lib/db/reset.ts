import postgres from 'postgres'

const client = postgres(process.env.DATABASE_URL!, { max: 1 })

async function reset() {
  console.log('Resetting database...')
  await client.unsafe(`
    DO $$ DECLARE r RECORD;
    BEGIN
      FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        EXECUTE 'DROP TABLE IF EXISTS public.' || quote_ident(r.tablename) || ' CASCADE';
      END LOOP;
    END $$;
  `)
  console.log('Database reset complete.')
  await client.end()
}

reset().catch((err) => {
  console.error(err)
  process.exit(1)
})
