import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  integer,
  index,
  primaryKey,
  customType,
} from 'drizzle-orm/pg-core'

const bytea = customType<{ data: Buffer }>({
  dataType() {
    return 'bytea'
  },
})

/** Informações de contato exibidas na página pública /contato (registro único) */
export const contactInfo = pgTable('contact_info', {
  id: uuid('id').defaultRandom().primaryKey(),
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
export const contactChannels = pgTable(
  'contact_channels',
  {
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
  },
  t => [index('idx_contact_channels_info_id').on(t.contactInfoId, t.sortOrder)]
)

export type ContactChannel = typeof contactChannels.$inferSelect
export type NewContactChannel = typeof contactChannels.$inferInsert

/** Categorias disponíveis para os artigos do blog. */
export const blogCategories = pgTable('blog_categories', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull().unique(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
})

export type BlogCategory = typeof blogCategories.$inferSelect
export type NewBlogCategory = typeof blogCategories.$inferInsert

/** Artigos do blog público. */
export const blogPosts = pgTable(
  'blog_posts',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    title: text('title').notNull(),
    subtitle: text('subtitle'),
    excerpt: text('excerpt').notNull().default(''),
    slug: text('slug').notNull().unique(),
    coverImageUrl: text('cover_image_url'),
    bodyHtml: text('body_html').notNull().default(''),
    published: boolean('published').notNull().default(false),
    publishedAt: timestamp('published_at', { withTimezone: true }),
    views: integer('views').notNull().default(0),
    readTimeMinutes: integer('read_time_minutes').notNull().default(1),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  t => [index('idx_blog_posts_published').on(t.published, t.publishedAt)]
)

export type BlogPost = typeof blogPosts.$inferSelect
export type NewBlogPost = typeof blogPosts.$inferInsert

/** Imagens do blog (capa e inline), guardadas como bytes no próprio banco. */
export const blogImages = pgTable('blog_images', {
  id: uuid('id').defaultRandom().primaryKey(),
  data: bytea('data').notNull(),
  contentType: text('content_type').notNull().default('image/webp'),
  width: integer('width'),
  height: integer('height'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
})

export type BlogImage = typeof blogImages.$inferSelect
export type NewBlogImage = typeof blogImages.$inferInsert

/** Associação N:N entre artigos e categorias (um artigo pode ter várias). */
export const blogPostCategories = pgTable(
  'blog_post_categories',
  {
    postId: uuid('post_id')
      .notNull()
      .references(() => blogPosts.id, { onDelete: 'cascade' }),
    categoryId: uuid('category_id')
      .notNull()
      .references(() => blogCategories.id, { onDelete: 'cascade' }),
  },
  t => [
    primaryKey({ columns: [t.postId, t.categoryId] }),
    index('idx_blog_post_categories_category_id').on(t.categoryId),
  ]
)

export type BlogPostCategory = typeof blogPostCategories.$inferSelect

/** Visitas ao site (uma linha por page load público, via beacon do client). */
export const pageViews = pgTable(
  'page_views',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    path: text('path').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  t => [index('idx_page_views_created_at').on(t.createdAt)]
)

export type PageView = typeof pageViews.$inferSelect
export type NewPageView = typeof pageViews.$inferInsert

/** Histórico de leituras por artigo (permite calcular "mais lido" por período). */
export const blogPostViews = pgTable(
  'blog_post_views',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    postId: uuid('post_id')
      .notNull()
      .references(() => blogPosts.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  t => [index('idx_blog_post_views_post_id').on(t.postId, t.createdAt)]
)

export type BlogPostView = typeof blogPostViews.$inferSelect

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

export const authSessions = pgTable(
  'auth_session',
  {
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
  },
  t => [index('idx_auth_session_user_id').on(t.userId)]
)

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
