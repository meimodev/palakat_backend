-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "public"."ApprovalStatus" AS ENUM ('UNCONFIRMED', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "public"."Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "public"."Bipra" AS ENUM ('PKB', 'WKI', 'PMD', 'RMJ', 'ASM');

-- CreateEnum
CREATE TYPE "public"."ActivityType" AS ENUM ('SERVICE', 'EVENT', 'ANNOUNCEMENT');

-- CreateEnum
CREATE TYPE "public"."Book" AS ENUM ('NKB', 'NNBT', 'KJ', 'DSL');

-- CreateTable
CREATE TABLE "public"."Church" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "email" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "locationId" INTEGER NOT NULL,

    CONSTRAINT "Church_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Column" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "churchId" INTEGER NOT NULL,

    CONSTRAINT "Column_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Membership" (
    "id" SERIAL NOT NULL,
    "baptize" BOOLEAN NOT NULL DEFAULT false,
    "sidi" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "accountId" INTEGER NOT NULL,
    "columnId" INTEGER NOT NULL,
    "churchId" INTEGER NOT NULL,

    CONSTRAINT "Membership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MembershipPosition" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "membershipId" INTEGER NOT NULL,
    "churchId" INTEGER NOT NULL,
    "columnId" INTEGER NOT NULL,

    CONSTRAINT "MembershipPosition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Account" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "passwordHash" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "claimed" BOOLEAN NOT NULL DEFAULT false,
    "failedLoginAttempts" INTEGER NOT NULL DEFAULT 0,
    "lockUntil" TIMESTAMP(3),
    "refreshTokenHash" TEXT,
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenJti" TEXT,
    "gender" "public"."Gender" NOT NULL,
    "married" BOOLEAN NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Activity" (
    "id" SERIAL NOT NULL,
    "supervisorId" INTEGER NOT NULL,
    "bipra" "public"."Bipra" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "locationId" INTEGER,
    "date" TIMESTAMP(3),
    "note" TEXT,
    "fileUrl" TEXT,
    "activityType" "public"."ActivityType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Location" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "public"."Song" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "index" INTEGER NOT NULL,
    "book" "public"."Book" NOT NULL,
    "link" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Song_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SongPart" (
    "id" SERIAL NOT NULL,
    "index" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "songId" INTEGER NOT NULL,

    CONSTRAINT "SongPart_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Church_locationId_key" ON "public"."Church"("locationId");

-- CreateIndex
CREATE INDEX "Church_name_idx" ON "public"."Church"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Column_churchId_name_key" ON "public"."Column"("churchId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Membership_accountId_key" ON "public"."Membership"("accountId");

-- CreateIndex
CREATE INDEX "Membership_churchId_columnId_idx" ON "public"."Membership"("churchId", "columnId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_phone_key" ON "public"."Account"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Account_email_key" ON "public"."Account"("email");

-- CreateIndex
CREATE INDEX "Activity_date_idx" ON "public"."Activity"("date");

-- CreateIndex
CREATE INDEX "Activity_supervisorId_idx" ON "public"."Activity"("supervisorId");

-- CreateIndex
CREATE INDEX "Activity_supervisorId_date_idx" ON "public"."Activity"("supervisorId", "date");

-- CreateIndex
CREATE INDEX "Activity_activityType_idx" ON "public"."Activity"("activityType");

-- CreateIndex
CREATE INDEX "Activity_bipra_idx" ON "public"."Activity"("bipra");

-- CreateIndex
CREATE INDEX "Approver_activityId_idx" ON "public"."Approver"("activityId");

-- CreateIndex
CREATE INDEX "Approver_membershipId_idx" ON "public"."Approver"("membershipId");

-- CreateIndex
CREATE INDEX "Approver_status_idx" ON "public"."Approver"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Approver_activityId_membershipId_key" ON "public"."Approver"("activityId", "membershipId");

-- CreateIndex
CREATE UNIQUE INDEX "Song_index_key" ON "public"."Song"("index");

-- CreateIndex
CREATE INDEX "SongPart_songId_idx" ON "public"."SongPart"("songId");

-- CreateIndex
CREATE UNIQUE INDEX "SongPart_songId_index_key" ON "public"."SongPart"("songId", "index");

-- AddForeignKey
ALTER TABLE "public"."Church" ADD CONSTRAINT "Church_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "public"."Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Column" ADD CONSTRAINT "Column_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "public"."Church"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Membership" ADD CONSTRAINT "Membership_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "public"."Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Membership" ADD CONSTRAINT "Membership_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "public"."Church"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Membership" ADD CONSTRAINT "Membership_columnId_fkey" FOREIGN KEY ("columnId") REFERENCES "public"."Column"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MembershipPosition" ADD CONSTRAINT "MembershipPosition_membershipId_fkey" FOREIGN KEY ("membershipId") REFERENCES "public"."Membership"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MembershipPosition" ADD CONSTRAINT "MembershipPosition_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "public"."Church"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MembershipPosition" ADD CONSTRAINT "MembershipPosition_columnId_fkey" FOREIGN KEY ("columnId") REFERENCES "public"."Column"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Activity" ADD CONSTRAINT "Activity_supervisorId_fkey" FOREIGN KEY ("supervisorId") REFERENCES "public"."Membership"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Activity" ADD CONSTRAINT "Activity_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "public"."Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Approver" ADD CONSTRAINT "Approver_membershipId_fkey" FOREIGN KEY ("membershipId") REFERENCES "public"."Membership"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Approver" ADD CONSTRAINT "Approver_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "public"."Activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SongPart" ADD CONSTRAINT "SongPart_songId_fkey" FOREIGN KEY ("songId") REFERENCES "public"."Song"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

