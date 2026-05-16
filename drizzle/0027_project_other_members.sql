ALTER TABLE "projects" DROP COLUMN IF EXISTS "authors";

CREATE TABLE IF NOT EXISTS "project_other_members" (
  "project_id" uuid NOT NULL REFERENCES "projects"("id") ON DELETE CASCADE,
  "member_id"  uuid NOT NULL REFERENCES "team_members"("id") ON DELETE CASCADE,
  "sort_order" integer NOT NULL DEFAULT 0,
  PRIMARY KEY ("project_id", "member_id")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_pom_project_id" ON "project_other_members" ("project_id");
