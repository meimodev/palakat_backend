-- Remove MembershipPosition.columnId and its foreign key to Column

-- Drop FK if it exists
ALTER TABLE "public"."MembershipPosition"
  DROP CONSTRAINT IF EXISTS "MembershipPosition_columnId_fkey";

-- Drop index if it exists (defensive)
DROP INDEX IF EXISTS "public"."MembershipPosition_columnId_idx";

-- Drop the column
ALTER TABLE "public"."MembershipPosition"
  DROP COLUMN IF EXISTS "columnId";

