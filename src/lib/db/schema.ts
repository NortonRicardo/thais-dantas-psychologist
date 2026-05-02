import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  customType,
} from 'drizzle-orm/pg-core'

const bytea = customType<{ data: Buffer }>({
  dataType() { return 'bytea' },
})

export const events = pgTable('events', {
  id:            uuid('id').defaultRandom().primaryKey(),
  title:         text('title').notNull(),
  description:   text('description').notNull(),
  date:          timestamp('date', { withTimezone: true }).notNull(),
  type:          text('type').notNull(),   // 'Palestra' | 'Minicurso' | 'Mesa-Redonda' | 'Workshop' | 'Defesa' | 'Encontro'
  speaker:       text('speaker'),
  organizer:     text('organizer'),
  link:          text('link'),
  meetLink:      text('meet_link'),
  featured:      boolean('featured').default(false).notNull(),
  image:         bytea('image'),
  imageMimeType: text('image_mime_type'),
  createdAt:     timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt:     timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export type Event    = typeof events.$inferSelect
export type NewEvent = typeof events.$inferInsert
