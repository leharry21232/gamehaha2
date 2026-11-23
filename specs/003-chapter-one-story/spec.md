# Feature: Chapter 1 story progression

## Problem
The game already has three sequential story missions, but they are presented as three different chapters. Chapter 1 in the game specification spans the player's first steps from level 1 through level 5. The current mission chain ends at level 3 and therefore does not deliver a complete opening chapter.

## Goals
- Present the existing opening missions as one Chapter 1 story arc.
- Extend the arc to a clear level-5 finale.
- Preserve existing mission IDs so saves that already completed earlier missions remain valid.
- Make mission progress testable through the existing Tester Panel.
- Ensure claimed rewards survive reload and Continue.

## Non-goals
- Do not change cooking, topping selection, timing, order scoring, or customer behavior.
- Do not implement Chapter 2 or new business systems.
- Do not add cloud saves, accounts, save import, or save reset.

## User stories
1. As a new player, I see one coherent Chapter 1 mission chain rather than missions labeled as separate chapters.
2. As a player, I unlock the next mission only after claiming the previous mission's reward.
3. As a player, I can complete the opening chapter by reaching level 5.
4. As a player, my earlier mission completion records remain recognized after the update.
5. As a tester, I can set lifetime order and earnings counters to verify mission thresholds.

## Acceptance criteria
- Existing IDs `story_first_customers`, `story_build_reputation`, and `story_level_three` remain unchanged.
- All four missions display `Chương 1 · Xe đẩy đầu ngõ` until the final reward is claimed.
- The final mission requires level 5 and has a one-time reward.
- After all four rewards are claimed, the journal shows Chapter 1 complete.
- Tester Panel uses a clamped GameEngine debug method for lifetime order and earnings counters.
- Claiming a mission reward updates active cash, persisted progression wallet, and session save.
- Unit tests cover order, threshold, legacy IDs, and completed chapter state.
