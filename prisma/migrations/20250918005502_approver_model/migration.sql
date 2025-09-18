/*
  Warnings:

  - You are about to drop the `_ApproverActivities` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."ApprovalStatus" AS ENUM ('UNCONFIRMED', 'APPROVED', 'REJECTED');

-- DropForeignKey
ALTER TABLE "public"."_ApproverActivities" DROP CONSTRAINT "_ApproverActivities_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_ApproverActivities" DROP CONSTRAINT "_ApproverActivities_B_fkey";

-- DropTable
DROP TABLE "public"."_ApproverActivities";

-- CreateTable
CREATE TABLE "public"."Approver" (
    "id" SERIAL NOT NULL,
    "membershipId" INTEGER NOT NULL,
    "activityId" INTEGER NOT NULL,
    "status" "public"."ApprovalStatus" NOT NULL DEFAULT 'UNCONFIRMED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Approver_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Approver_activityId_membershipId_key" ON "public"."Approver"("activityId", "membershipId");

-- AddForeignKey
ALTER TABLE "public"."Approver" ADD CONSTRAINT "Approver_membershipId_fkey" FOREIGN KEY ("membershipId") REFERENCES "public"."Membership"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Approver" ADD CONSTRAINT "Approver_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "public"."Activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;
