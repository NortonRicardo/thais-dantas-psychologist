ALTER TABLE "about_timeline_entries" ADD COLUMN "date" timestamp with time zone;
UPDATE "about_timeline_entries" SET "date" = make_timestamptz(TRIM(BOTH FROM "year")::int, 1, 1, 0, 0, 0) WHERE "year" ~ '^[0-9]+$';
DELETE FROM "about_timeline_entries" WHERE "date" IS NULL;
ALTER TABLE "about_timeline_entries" DROP COLUMN "year";
ALTER TABLE "about_timeline_entries" DROP COLUMN "sort_order";
ALTER TABLE "about_timeline_entries" ALTER COLUMN "date" SET NOT NULL;
