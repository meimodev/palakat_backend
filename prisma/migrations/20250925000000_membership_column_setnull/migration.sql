-- Make Membership.columnId nullable and set FK to ON DELETE SET NULL
ALTER TABLE "Membership" DROP CONSTRAINT IF EXISTS "Membership_columnId_fkey";
ALTER TABLE "Membership" ALTER COLUMN "columnId" DROP NOT NULL;
ALTER TABLE "Membership"
  ADD CONSTRAINT "Membership_columnId_fkey"
  FOREIGN KEY ("columnId") REFERENCES "Column" ("id")
  ON DELETE SET NULL
  ON UPDATE CASCADE;

-- Make Membership.churchId nullable and set FK to ON DELETE SET NULL
ALTER TABLE "Membership" DROP CONSTRAINT IF EXISTS "Membership_churchId_fkey";
ALTER TABLE "Membership" ALTER COLUMN "churchId" DROP NOT NULL;
ALTER TABLE "Membership"
  ADD CONSTRAINT "Membership_churchId_fkey"
  FOREIGN KEY ("churchId") REFERENCES "Church" ("id")
  ON DELETE SET NULL
  ON UPDATE CASCADE;

-- Make Column.churchId nullable and set FK to ON DELETE SET NULL
ALTER TABLE "Column" DROP CONSTRAINT IF EXISTS "Column_churchId_fkey";
ALTER TABLE "Column" ALTER COLUMN "churchId" DROP NOT NULL;
ALTER TABLE "Column"
  ADD CONSTRAINT "Column_churchId_fkey"
  FOREIGN KEY ("churchId") REFERENCES "Church" ("id")
  ON DELETE SET NULL
  ON UPDATE CASCADE;

-- Make MembershipPosition.membershipId nullable and set FK to ON DELETE SET NULL
ALTER TABLE "MembershipPosition" DROP CONSTRAINT IF EXISTS "MembershipPosition_membershipId_fkey";
ALTER TABLE "MembershipPosition" ALTER COLUMN "membershipId" DROP NOT NULL;
ALTER TABLE "MembershipPosition"
  ADD CONSTRAINT "MembershipPosition_membershipId_fkey"
  FOREIGN KEY ("membershipId") REFERENCES "Membership" ("id")
  ON DELETE SET NULL
  ON UPDATE CASCADE;

-- Make MembershipPosition.churchId nullable and set FK to ON DELETE SET NULL
ALTER TABLE "MembershipPosition" DROP CONSTRAINT IF EXISTS "MembershipPosition_churchId_fkey";
ALTER TABLE "MembershipPosition" ALTER COLUMN "churchId" DROP NOT NULL;
ALTER TABLE "MembershipPosition"
  ADD CONSTRAINT "MembershipPosition_churchId_fkey"
  FOREIGN KEY ("churchId") REFERENCES "Church" ("id")
  ON DELETE SET NULL
  ON UPDATE CASCADE;


