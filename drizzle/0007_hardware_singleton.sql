CREATE TABLE "hardware" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

INSERT INTO "hardware" ("title") VALUES ('Estação de trabalho LEMM');

ALTER TABLE "hardware_modules" ADD COLUMN "hardware_id" uuid;
UPDATE "hardware_modules" SET "hardware_id" = (SELECT "id" FROM "hardware" LIMIT 1);

ALTER TABLE "hardware_modules" ADD COLUMN "sort_order" integer NOT NULL DEFAULT 0;

UPDATE "hardware_modules" hm
SET "sort_order" = sub.rn
FROM (
	SELECT "id", (ROW_NUMBER() OVER (ORDER BY "created_at" ASC, "title" ASC) - 1)::integer AS rn
	FROM "hardware_modules"
) sub
WHERE hm."id" = sub."id";

UPDATE "hardware_modules"
SET "description" = CASE
	WHEN "badge" IS NOT NULL AND btrim("badge") <> ''
		THEN btrim("badge") || E'\n' || "title" || E'\n\n' || "description"
	ELSE "title" || E'\n\n' || "description"
END;

ALTER TABLE "hardware_modules" DROP COLUMN "title";
ALTER TABLE "hardware_modules" DROP COLUMN "badge";

UPDATE "hardware_modules"
SET "icon_key" = CASE lower(trim("icon_key"))
	WHEN 'cpu' THEN 'Cpu'
	WHEN 'memory-stick' THEN 'MemoryStick'
	WHEN 'monitor-check' THEN 'MonitorCheck'
	WHEN 'hard-drive' THEN 'HardDrive'
	WHEN 'server' THEN 'Server'
	ELSE "icon_key"
END;

ALTER TABLE "hardware_modules" ALTER COLUMN "hardware_id" SET NOT NULL;

ALTER TABLE "hardware_modules"
	ADD CONSTRAINT "hardware_modules_hardware_id_fkey"
	FOREIGN KEY ("hardware_id") REFERENCES "hardware"("id") ON DELETE CASCADE;

ALTER TABLE "hardware_modules" ALTER COLUMN "icon_key" DROP DEFAULT;
ALTER TABLE "hardware_modules" ALTER COLUMN "icon_key" SET DEFAULT 'Cpu';
