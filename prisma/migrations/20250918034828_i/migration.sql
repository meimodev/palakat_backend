-- CreateIndex
CREATE INDEX "Activity_date_idx" ON "public"."Activity"("date");

-- CreateIndex
CREATE INDEX "Activity_supervisorId_idx" ON "public"."Activity"("supervisorId");

-- CreateIndex
CREATE INDEX "Approver_activityId_idx" ON "public"."Approver"("activityId");

-- CreateIndex
CREATE INDEX "Approver_membershipId_idx" ON "public"."Approver"("membershipId");
