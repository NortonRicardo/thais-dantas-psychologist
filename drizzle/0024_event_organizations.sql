CREATE TABLE IF NOT EXISTS "event_organizations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamptz DEFAULT now() NOT NULL,
	"updated_at" timestamptz DEFAULT now() NOT NULL,
	CONSTRAINT "event_organizations_name_unique" UNIQUE("name")
);

INSERT INTO "event_organizations" ("name")
SELECT DISTINCT trim("organizer") AS name
FROM "events"
WHERE "organizer" IS NOT NULL AND trim("organizer") <> ''
ON CONFLICT ("name") DO NOTHING;

ALTER TABLE "events" ADD COLUMN "organization_id" uuid;

UPDATE "events" AS e
SET "organization_id" = o.id
FROM "event_organizations" AS o
WHERE e.organizer IS NOT NULL AND trim(e.organizer) = o.name;

ALTER TABLE "events" ADD CONSTRAINT "events_organization_id_event_organizations_id_fk"
FOREIGN KEY ("organization_id") REFERENCES "event_organizations"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

ALTER TABLE "events" DROP COLUMN IF EXISTS "organizer";
