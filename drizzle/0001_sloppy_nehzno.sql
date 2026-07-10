CREATE TABLE "blog_posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"subtitle" text,
	"excerpt" text DEFAULT '' NOT NULL,
	"slug" text NOT NULL,
	"category" text NOT NULL,
	"cover_image_url" text,
	"body_html" text DEFAULT '' NOT NULL,
	"published" boolean DEFAULT false NOT NULL,
	"published_at" timestamp with time zone,
	"views" integer DEFAULT 0 NOT NULL,
	"read_time_minutes" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "blog_posts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE INDEX "idx_blog_posts_published" ON "blog_posts" USING btree ("published","published_at");
