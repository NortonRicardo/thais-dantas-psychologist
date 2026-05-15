import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  integer,
  customType,
  primaryKey,
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
  /** Se false, oculto na equipe pública; mantém vínculos em projetos. */
  active: boolean('active').default(true).notNull(),
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

/** Categorias de projetos (TCC, Plataforma, …) — CRUD no gestor */
export const projectCategories = pgTable('project_categories', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull().unique(),
  /** Classes Tailwind para selos no gestor (ex.: bg-sky-500/15 text-sky-300 border-sky-500/30) */
  color: text('color').notNull(),
  /** Estilos inline do selo na página pública (rgba) */
  chipBg: text('chip_bg').notNull(),
  chipBorder: text('chip_border').notNull(),
  chipText: text('chip_text').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
})

export type ProjectCategory = typeof projectCategories.$inferSelect
export type NewProjectCategory = typeof projectCategories.$inferInsert

/** Temas transversais (Clima, Matemática, …) — CRUD no gestor */
export const projectThemes = pgTable('project_themes', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull().unique(),
  /** Slug estável para query ?tema= na página pública */
  slug: text('slug').notNull().unique(),
  color: text('color').notNull(),
  pillColor: text('pill_color').notNull(),
  /** Estilos dos botões de filtro na página pública /projetos */
  filterBg: text('filter_bg').notNull(),
  filterBorder: text('filter_border').notNull(),
  filterText: text('filter_text').notNull(),
  filterActiveBg: text('filter_active_bg').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
})

export type ProjectTheme = typeof projectThemes.$inferSelect
export type NewProjectTheme = typeof projectThemes.$inferInsert

/** Projetos de pesquisa, TCC, dissertações e plataformas do LEMM */
export const projects = pgTable('projects', {
  id: uuid('id').defaultRandom().primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  categoryId: uuid('category_id')
    .notNull()
    .references(() => projectCategories.id, { onDelete: 'restrict' }),
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

export const projectProjectThemes = pgTable(
  'project_project_themes',
  {
    projectId: uuid('project_id')
      .notNull()
      .references(() => projects.id, { onDelete: 'cascade' }),
    themeId: uuid('theme_id')
      .notNull()
      .references(() => projectThemes.id, { onDelete: 'cascade' }),
  },
  t => ({
    pk: primaryKey({ columns: [t.projectId, t.themeId] }),
  })
)

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

// ─── Better Auth tables ──────────────────────────────────────────────────────

export const authUsers = pgTable('auth_user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
  username: text('username').unique(),
  displayUsername: text('display_username'),
})

export const authSessions = pgTable('auth_session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id')
    .notNull()
    .references(() => authUsers.id, { onDelete: 'cascade' }),
})

export const authAccounts = pgTable('auth_account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => authUsers.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
})

export const authVerifications = pgTable('auth_verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at'),
  updatedAt: timestamp('updated_at'),
})
