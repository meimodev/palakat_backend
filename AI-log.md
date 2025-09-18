2025-09-18 - GPT-5
- Installed deps, ran typecheck
- Fixed Prisma seed (supervisor connect, proper location create)
- Switched Prisma client to default '@prisma/client' and regenerated client
- Fixed imports in services/controllers
- Build, lint, migrate status OK; ran seeding successfully
# AI Interaction Log

## 2025-09-17 — GPT-5

- Set up automatic per-prompt logging to `AI-log.md` at the repo root.
- Saved preference to generate/update Prisma seeding when models change.
- Created this initial log entry.

## 2025-09-18 — GPT-5

- Renamed `Activity.membership` to `supervisor` and added `approver` relation.
- Updated seed script to populate `supervisorId` and optional `approverId`.
- Refactored `Activity.approver` to many-to-many `approvers` with `Membership`.
- Updated `prisma/seed.ts` to connect approvers via `approvers.connect`.
- Prepared to run Prisma migration and regenerate client types.
