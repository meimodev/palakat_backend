/*
  Warnings:

  - You are about to drop the column `latitude` on the `Activity` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `Activity` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `Activity` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Activity" DROP COLUMN "latitude",
DROP COLUMN "location",
DROP COLUMN "longitude",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "locationId" INTEGER;

-- CreateTable
CREATE TABLE "public"."Location" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "latitude" TEXT NOT NULL,
    "longitude" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Activity" ADD CONSTRAINT "Activity_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "public"."Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;
