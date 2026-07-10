CREATE TABLE "blog_post_categories" (
	"post_id" uuid NOT NULL,
	"category_id" uuid NOT NULL,
	CONSTRAINT "blog_post_categories_post_id_category_id_pk" PRIMARY KEY("post_id","category_id")
);
--> statement-breakpoint
ALTER TABLE "blog_post_categories" ADD CONSTRAINT "blog_post_categories_post_id_blog_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_post_categories" ADD CONSTRAINT "blog_post_categories_category_id_blog_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."blog_categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_blog_post_categories_category_id" ON "blog_post_categories" USING btree ("category_id");--> statement-breakpoint
-- Preserva a categoria de cada artigo existente na nova relação N:N.
INSERT INTO "blog_post_categories" ("post_id", "category_id")
SELECT bp.id, bc.id
FROM "blog_posts" bp
JOIN "blog_categories" bc ON bc.name = bp.category
ON CONFLICT DO NOTHING;
--> statement-breakpoint
ALTER TABLE "blog_posts" DROP COLUMN "category";