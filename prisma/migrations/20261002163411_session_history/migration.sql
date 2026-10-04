-- Hand-written so existing rows are kept; the end state matches what
-- `prisma migrate diff` generates for this schema change.

-- AlterTable: record who taught each session. Existing sessions get their
-- class's current teacher, the best information available.
ALTER TABLE "session" ADD COLUMN "teacher_id" UUID,
ADD COLUMN "cancellation_reason" TEXT;

UPDATE "session"
SET "teacher_id" = "class"."teacher_id"
FROM "class"
WHERE "class"."id" = "session"."class_id";

ALTER TABLE "session" ALTER COLUMN "teacher_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameTable: session_date_history becomes session_time_change, since each
-- row is one change to a session's start or end time. Postgres keeps the old
-- constraint names on a renamed table, so they are renamed to what Prisma
-- expects (renaming the primary key also renames its index).
ALTER TABLE "session_date_history" RENAME TO "session_time_change";
ALTER TABLE "session_time_change" RENAME CONSTRAINT "session_date_history_pkey" TO "session_time_change_pkey";
ALTER TABLE "session_time_change" RENAME CONSTRAINT "session_date_history_session_id_fkey" TO "session_time_change_session_id_fkey";

-- AlterTable: store a change's full previous and new times, not just the
-- start times.
ALTER TABLE "session_time_change" RENAME COLUMN "old_date" TO "previous_start_time";
ALTER TABLE "session_time_change" RENAME COLUMN "new_date" TO "new_start_time";
ALTER TABLE "session_time_change" RENAME COLUMN "modification_reason" TO "reason";
ALTER TABLE "session_time_change" RENAME COLUMN "modified_at" TO "changed_at";

ALTER TABLE "session_time_change" ADD COLUMN "previous_end_time" TIMESTAMP(3),
ADD COLUMN "new_end_time" TIMESTAMP(3),
ADD COLUMN "changed_by" TEXT;

-- Existing rows only recorded start times; assume the session's current length.
UPDATE "session_time_change"
SET "previous_end_time" = "session_time_change"."previous_start_time" + ("session"."end_time" - "session"."start_time"),
    "new_end_time" = "session_time_change"."new_start_time" + ("session"."end_time" - "session"."start_time")
FROM "session"
WHERE "session"."id" = "session_time_change"."session_id";

ALTER TABLE "session_time_change" ALTER COLUMN "previous_end_time" SET NOT NULL,
ALTER COLUMN "new_end_time" SET NOT NULL;

-- The log's own status and timestamps duplicated the session and `changed_at`.
ALTER TABLE "session_time_change" DROP COLUMN "status",
DROP COLUMN "created_at",
DROP COLUMN "updated_at";

-- CreateIndex
CREATE INDEX "session_time_change_session_id_idx" ON "session_time_change"("session_id");

-- CreateEnum: "Rescheduled" described a past change rather than a state. A
-- moved session is simply scheduled at its new time.
UPDATE "session" SET "status" = 'Scheduled' WHERE "status" = 'Rescheduled';

CREATE TYPE "session_status" AS ENUM ('Scheduled', 'Cancelled');

ALTER TABLE "session" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "session" ALTER COLUMN "status" TYPE "session_status" USING ("status"::text::"session_status");
ALTER TABLE "session" ALTER COLUMN "status" SET DEFAULT 'Scheduled';

-- DropEnum
DROP TYPE "status";
