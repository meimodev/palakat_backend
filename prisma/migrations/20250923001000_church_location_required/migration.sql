/*
  Migration: make Church.location required (locationId NOT NULL)
*/
-- AlterTable
ALTER TABLE "public"."Church" ALTER COLUMN "locationId" SET NOT NULL;


