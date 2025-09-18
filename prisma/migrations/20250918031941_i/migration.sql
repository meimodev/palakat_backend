/*
  Warnings:

  - You are about to drop the column `location` on the `Location` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[locationId]` on the table `Activity` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `latitude` on the `Location` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `longitude` on the `Location` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "public"."Location" DROP COLUMN "location",
DROP COLUMN "latitude",
ADD COLUMN     "latitude" DECIMAL(9,6) NOT NULL,
DROP COLUMN "longitude",
ADD COLUMN     "longitude" DECIMAL(9,6) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Activity_locationId_key" ON "public"."Activity"("locationId");
