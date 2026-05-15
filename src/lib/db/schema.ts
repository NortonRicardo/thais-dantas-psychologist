import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  integer,
  customType,
} from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'

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
  recordingLink: text('recording_link'),
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

/** Parceiros da Parcerias (página Infraestrutura) */
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

/** Equipamentos exibidos em Infraestrutura (vários registros; cada um com módulos) */
export const hardware = pgTable('hardware', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
})

export type Hardware = typeof hardware.$inferSelect
export type NewHardware = typeof hardware.$inferInsert

/** Módulos do hardware (título + ícone + descrição; ordem pelo índice na lista) */
export const hardwareModules = pgTable('hardware_modules', {
  id: uuid('id').defaultRandom().primaryKey(),
  hardwareId: uuid('hardware_id')
    .notNull()
    .references(() => hardware.id, { onDelete: 'cascade' }),
  title: text('title').notNull().default(''),
  /** Vazio = sem ícone na UI */
  iconKey: text('icon_key').notNull().default(''),
  description: text('description').notNull(),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
})

export type HardwareModule = typeof hardwareModules.$inferSelect
export type NewHardwareModule = typeof hardwareModules.$inferInsert

/** Informações de contato exibidas na página pública /contato (registro único) */
export const contactInfo = pgTable('contact_info', {
  id: uuid('id').defaultRandom().primaryKey(),
  directorTeamMemberId: uuid('director_team_member_id').references(
    () => teamMembers.id,
    { onDelete: 'set null' }
  ),
  mapUrl: text('map_url').notNull().default(''),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
})

export type ContactInfo = typeof contactInfo.$inferSelect
export type NewContactInfo = typeof contactInfo.$inferInsert

/** Canais de contato dinâmicos (e-mail, telefone, redes sociais, etc.) */
export const contactChannels = pgTable('contact_channels', {
  id: uuid('id').defaultRandom().primaryKey(),
  contactInfoId: uuid('contact_info_id')
    .notNull()
    .references(() => contactInfo.id, { onDelete: 'cascade' }),
  label: text('label').notNull(),
  iconKey: text('icon_key').notNull().default('mail'),
  value: text('value').notNull(),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
})

export type ContactChannel = typeof contactChannels.$inferSelect
export type NewContactChannel = typeof contactChannels.$inferInsert

/** Categorias da equipe (agrupamento na página pública /equipe) */
export const teamCategories = pgTable('team_categories', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  /** Classe Tailwind de fundo, ex.: bg-sky-500 (paleta do gestor) */
  color: text('color').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
})

export type TeamCategory = typeof teamCategories.$inferSelect
export type NewTeamCategory = typeof teamCategories.$inferInsert

/** Tratamento exibido antes do nome (Dr., Prof. Dr., …) — CRUD em /manager/equipe/tratamentos */
export const teamNamePrefixes = pgTable('team_name_prefixes', {
  id: uuid('id').defaultRandom().primaryKey(),
  label: text('label').notNull().unique(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
})

export type TeamNamePrefix = typeof teamNamePrefixes.$inferSelect
export type NewTeamNamePrefix = typeof teamNamePrefixes.$inferInsert

/** Grau acadêmico (Graduação, Mestrado, Doutorado, …) — CRUD em /manager/equipe/graus */
export const teamDegreeLevels = pgTable('team_degree_levels', {
  id: uuid('id').defaultRandom().primaryKey(),
  label: text('label').notNull().unique(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
})

export type TeamDegreeLevel = typeof teamDegreeLevels.$inferSelect
export type NewTeamDegreeLevel = typeof teamDegreeLevels.$inferInsert

/** Membros da equipe exibidos na página pública /equipe */
export const teamMembers = pgTable('team_members', {
  id: uuid('id').defaultRandom().primaryKey(),
  categoryId: uuid('category_id')
    .notNull()
    .references(() => teamCategories.id, { onDelete: 'restrict' }),
  namePrefixId: uuid('name_prefix_id').references(() => teamNamePrefixes.id, {
    onDelete: 'set null',
  }),
  degreeLevelId: uuid('degree_level_id').references(() => teamDegreeLevels.id, {
    onDelete: 'set null',
  }),
  /** Instituição de formação principal (faculdade, centro, INPE, …) */
  formationInstitution: text('formation_institution'),
  name: text('name').notNull(),
  /** Área, cargo ou resumo profissional (complementa grau + instituição) */
  qualification: text('qualification').notNull(),
  description: text('description'),
  /** URL completa do perfil (https://www.linkedin.com/in/…) */
  linkedinUrl: text('linkedin_url'),
  /** Currículo Lattes (lattes.cnpq.br ou buscatextual.cnpq.br) */
  lattesUrl: text('lattes_url'),
  photo: bytea('photo'),
  photoMimeType: text('photo_mime_type'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
})

export type TeamMember = typeof teamMembers.$inferSelect
export type NewTeamMember = typeof teamMembers.$inferInsert

/** Projetos de pesquisa, TCC, dissertações e plataformas do LEMM */
export const projects = pgTable('projects', {
  id: uuid('id').defaultRandom().primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  /** 'TCC' | 'Iniciação Científica' | 'Mestrado' | 'Plataforma' | 'Pesquisa' */
  category: text('category').notNull(),
  themes: text('themes')
    .array()
    .notNull()
    .default(sql`ARRAY[]::text[]`),
  description: text('description').notNull(),
  image: bytea('image'),
  imageMimeType: text('image_mime_type'),
  authors: text('authors')
    .array()
    .notNull()
    .default(sql`ARRAY[]::text[]`),
  startDate: timestamp('start_date', { withTimezone: true }).notNull(),
  endDate: timestamp('end_date', { withTimezone: true }),
  gitUrl: text('git_url'),
  publicationUrl: text('publication_url'),
  advisorId: uuid('advisor_id').references(() => teamMembers.id, {
    onDelete: 'set null',
  }),
  coAdvisorId: uuid('co_advisor_id').references(() => teamMembers.id, {
    onDelete: 'set null',
  }),
  researchLeadId: uuid('research_lead_id').references(() => teamMembers.id, {
    onDelete: 'set null',
  }),
  pdf: bytea('pdf'),
  pdfMimeType: text('pdf_mime_type'),
  pdfPath: text('pdf_path'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
})

export type Project = typeof projects.$inferSelect
export type NewProject = typeof projects.$inferInsert

/** Tipos de evento gerenciados pelo gestor (ex: Palestra, Workshop) */
export const eventTypes = pgTable('event_types', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull().unique(),
  iconKey: text('icon_key').notNull().default('calendar'),
  color: text('color').notNull().default('bg-blue-500'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
})

export type EventType = typeof eventTypes.$inferSelect
export type NewEventType = typeof eventTypes.$inferInsert
