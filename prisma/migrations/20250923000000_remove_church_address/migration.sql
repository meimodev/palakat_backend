/*
  Migration: remove address column from Church
*/
-- AlterTable
ALTER TABLE "public"."Church" DROP COLUMN IF EXISTS "address";


