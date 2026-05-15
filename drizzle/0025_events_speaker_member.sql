ALTER TABLE "events" ADD COLUMN "speaker_member_id" uuid;

UPDATE "events" AS e
SET "speaker_member_id" = sub.id
FROM (
  SELECT
    tm.id,
    CASE
      WHEN np.label IS NOT NULL AND trim(np.label) <> '' THEN trim(np.label) || ' ' || trim(tm.name)
      ELSE trim(tm.name)
    END AS display_name
  FROM "team_members" tm
  LEFT JOIN "team_name_prefixes" np ON tm.name_prefix_id = np.id
) AS sub
WHERE e.speaker IS NOT NULL AND trim(e.speaker) = sub.display_name;

UPDATE "events" AS e
SET "speaker_member_id" = tm.id
FROM "team_members" tm
WHERE e.speaker_member_id IS NULL
  AND e.speaker IS NOT NULL
  AND trim(e.speaker) = trim(tm.name);

ALTER TABLE "events" ADD CONSTRAINT "events_speaker_member_id_team_members_id_fk"
FOREIGN KEY ("speaker_member_id") REFERENCES "team_members"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

ALTER TABLE "events" DROP COLUMN IF EXISTS "speaker";
