2025-09-30 - GPT-5

- Noted service pagination pattern: use `$transaction([count, findMany])` and return `{ data, total }`. Applied to `AccountService.findAll` with optional `churchId` filter.
  - Also note: sanitize responses by selecting non-sensitive account fields by default in listings.
  - Tiered search strategy for account listing: try direct `Account.name`, fallback to `Membership.column.name`, then `Membership.membershipPositions.name`.
  - When `search` is present, append the matched source to the response message (`OK - <source>`).
  - Account listing supports optional `position` filter (case-insensitive match on `MembershipPosition.name`).

2025-09-25 - Noted: On FK issues for `Membership.columnId`, add service-level guards and validations; keep seed data consistent with Prisma models. Updated code accordingly.

2025-09-25 - Noted: `Membership.churchId` and relation can be nullable; services derive `churchId` from `columnId` when absent. Migrations set FK to ON DELETE SET NULL.
2025-09-25 - Noted: `Column.churchId` and relation can be nullable; FK changed to ON DELETE SET NULL. No service changes required.
2025-09-25 - Noted: `MembershipPosition.membershipId` and `churchId` can be nullable; FKs set to ON DELETE SET NULL. Services accept optional filters and create/update inputs.

## AI Memories Log

2025-09-24: Implemented Location CRUD (module, controller, service, list DTO) and wired into app.module; updated AI-log.md accordingly.

### Current memory state — 2025-09-18

- **Generate seed updates with model changes**: Whenever the user changes a Prisma model, proactively generate or update appropriate seeding for that model (update `prisma/seed.ts` accordingly).
- **Per-prompt AI activity logging**: For every user prompt, append an entry to `AI-log.md` at the repo root that includes the model name (GPT-5) and the current date, plus a brief list of actions taken.
- **Log memories to AI-log-memories.md**: Maintain `AI-log-memories.md` at the repo root. On any memory change or on each prompt, update the file to reflect the current memory state with date-stamped entries.

2025-09-18 - Updated memory state

- Maintain AI-log-memories.md at the repo root. On any memory change or on each prompt, update the file to reflect the current memory state with date-stamped entries.
- For every user prompt, append an entry to AI-log.md at the repo root that includes the model name (GPT-5) and the current date, plus a brief list of actions taken.
- Whenever the user changes a Prisma model, proactively generate or update appropriate seeding for that model (update prisma/seed.ts accordingly).

2025-09-22 - Per-prompt maintenance

- Appended per-prompt log entries for analysis session.

2025-09-22 - Per-prompt maintenance

- Updated seed in response to Prisma model changes (Church fields)
- Continued per-prompt logging in `AI-log.md`
- Logged update to include membership counts in column list

2025-09-22 - Per-prompt maintenance

- Implemented CRUD for `MembershipPosition` mirroring `column`/`song-part` patterns
- Wired new module into `app.module.ts`
- [2025-09-22] Planned sign-in mechanism; no memory changes required; no Prisma model edits yet.

2025-09-22 - Per-prompt maintenance

- Updated sign-in to accept `identifier` (email or phone) + password
- No memory state changes required; no Prisma model change

2025-09-22 - Per-prompt maintenance

- Ensured seeded `Account` records use password "password" (hashed) in `prisma/seed.ts`

2025-09-22 - Per-prompt maintenance

- Added `claimed` (Boolean, default false) to `Account` model; updated seed accordingly

2025-09-23 - Per-prompt maintenance

- Updated Prisma model: removed `Church.address`
- Updated seed to reflect model change
- Logged actions to `AI-log.md`

2025-09-23 - Per-prompt maintenance

- Made `Church.location` required; ensured seed already creates a location for each church
- Logged actions to `AI-log.md`

2025-09-23 - Per-prompt maintenance

- Noted Prisma `Decimal` fields (`Location.latitude/longitude`) serialize as strings in JSON
- No memory change required

2025-09-23 - Per-prompt maintenance

- Updated schema to use Float for `Location.latitude/longitude`
- Seed updated to use numeric lat/long

2025-09-24 - Per-prompt maintenance

- Refactored seeder to generate numeric-only phone numbers starting with 0 (12–13 digits)
- Continued per-prompt logging in `AI-log.md`

2025-09-24 - Per-prompt maintenance

- Addressed FK violation on `MembershipPosition_columnId_fkey` by deleting dependents before `Column`
- Logged action in `AI-log.md`; no memory policy changes required

2025-09-24 - Per-prompt maintenance

- Removed `MembershipPosition.columnId` from Prisma model and related back-relation
- Updated seed and services accordingly; logged actions in `AI-log.md`

2025-09-28 - Per-prompt maintenance

- Updated `MembershipPositionService.findOne` to be null-safe when `membership` is missing
- Continued per-prompt logging in `AI-log.md`

2025-09-29 - Per-prompt maintenance
2025-10-01 - GPT-5

- Logged pattern: lightweight count endpoints should accept optional filters and use `PrismaService.account.count` with a minimal `where` shape to keep them fast.
- For counts by church, rely on `membership.churchId` relation filter.

- Reviewed seed and package files to suggest performance and maintainability optimizations
- No memory policy change

2025-10-02 - GPT-5

- Per user request, updated seeding to create 20 accounts with memberships under a single church. Memory policy unchanged. Continuing per-prompt logging to `AI-log.md` and maintaining this file.
