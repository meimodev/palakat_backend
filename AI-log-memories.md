## AI Memories Log

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
