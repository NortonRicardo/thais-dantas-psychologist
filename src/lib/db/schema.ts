import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  customType,
} from 'drizzle-orm/pg-core'

const bytea = customType<{ data: Buffer }>({
  dataType() {
    return 'bytea'
  },
})

export const events = pgTable('events', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  date: timestamp('date', { withTimezone: true }).notNull(),
  type: text('type').notNull(), // 'Palestra' | 'Minicurso' | 'Mesa-Redonda' | 'Workshop' | 'Defesa' | 'Encontro'
  speaker: text('speaker'),
  organizer: text('organizer'),
  link: text('link'),
  meetLink: text('meet_link'),
  featured: boolean('featured').default(false).notNull(),
  image: bytea('image'),
  imageMimeType: text('image_mime_type'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
})

export type Event = typeof events.$inferSelect
export type NewEvent = typeof events.$inferInsert

/** Marcos da linha do tempo na página Sobre Nós (mês/ano; ordenação pela data) */
export const aboutTimelineEntries = pgTable('about_timeline_entries', {
  id: uuid('id').defaultRandom().primaryKey(),
  date: timestamp('date', { withTimezone: true }).notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
})

export type AboutTimelineEntry = typeof aboutTimelineEntries.$inferSelect
export type NewAboutTimelineEntry = typeof aboutTimelineEntries.$inferInsert

/** Parceiros da rede de colaboração (página Infraestrutura) */
export const collaborationPartners = pgTable('collaboration_partners', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
})

export type CollaborationPartner = typeof collaborationPartners.$inferSelect
export type NewCollaborationPartner = typeof collaborationPartners.$inferInsert

/** Plataformas desenvolvidas (Infraestrutura) */
export const developedPlatforms = pgTable('developed_platforms', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  projectLink: text('project_link'),
  platformLink: text('platform_link'),
  badge: text('badge'),
  iconKey: text('icon_key').default('cloud-sun').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
})

export type DevelopedPlatform = typeof developedPlatforms.$inferSelect
export type NewDevelopedPlatform = typeof developedPlatforms.$inferInsert
