# Implementation Plan: Undo and Remove Topping Selection

## Technical Context
- Gameplay mutations are owned by `src/game/engine.ts`.
- Canvas hitboxes are defined in `src/game/layout.ts`.
- Canvas controls are rendered in `src/game/renderer.ts`.
- Long-term wallet data is handled by `src/game/progression.ts`; the active run balance is `GameEngine.money`.

## Design
1. Preserve a per-order history of successfully added topping IDs.
2. Keep global undo (last added topping) for quick correction.
3. Add a minus control to each topping card with a positive selected count; removing a specific type must not remove later toppings of another type.
4. Refund one unit only for the four stock-backed toppings, matching addTopping's deduction behavior.
5. Remove the matching latest flying visual, otherwise the latest landed visual.
6. Keep New Game's starter-wallet reset at the final start transition after location confirmation; verify both active-run money and persisted progression wallet are set to the configured starter value.
7. Preserve existing recipe requirements, scoring, preparation sequence, and save/continue semantics.

## Risks
- Removing a topping while its visual is flying must not leave a delayed duplicate.
- Specific removal must delete the matching occurrence from history, not simply pop the stack.
- Money display and saved wallet must not diverge after New Game.

## Validation
- `npm test`, `npm run lint`, and `npm run build`.
- Manual: New Game -> choose location -> confirm -> verify starting balance; add multiple topping types -> remove a non-last type -> verify only that type/count/stock changes; undo last topping; verify no removal after leaving TOPPINGS.
- Tester Panel currently is not present in the inspected `src/` tree; do not claim panel coverage until it exists.
