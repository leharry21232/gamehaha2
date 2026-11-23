# Implementation plan

1. Extend the mission definition list with a level-five Chapter 1 finale; relabel the existing mission sequence without changing persisted IDs.
2. Add unit coverage for sequential mission progression, legacy completion IDs, and final chapter completion.
3. Add a clamped GameEngine debug method for lifetime mission counters and expose it in Tester Panel.
4. Fix mission reward persistence so active cash, progression wallet, and session save stay consistent.
5. Run tests, TypeScript check, production build, then perform browser QA on fresh and existing saves.

## Risks
- Mission IDs are persisted locally; changing existing IDs would cause players to repeat claimed missions. IDs must remain stable.
- Reward cash previously changed only the active engine balance. Persist both progression and session state to prevent reward loss after reload.
- Tester controls must remain isolated behind the existing debug panel and use a GameEngine API.
