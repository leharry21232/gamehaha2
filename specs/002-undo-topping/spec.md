# Feature Specification: Undo Topping Selection

**Feature Branch**: `feature/gameplay-progression-garage`
**Status**: Implemented; automated validation pending
**Date**: 2026-11-18

## User Story

As a player preparing a bánh tráng order, I want to remove the most recently added topping when I tap too many or choose the wrong ingredient, so I can correct the current order without restarting it or wasting stock.

## Requirements

- **FR-001**: While the preparation step is `TOPPINGS`, the player can undo the most recently added topping.
- **FR-002**: Undo removes exactly one topping addition and preserves the order of earlier additions.
- **FR-003**: If the removed topping consumes inventory (`kho_bo`, `trung_cut`, `xoai`, or `rau_ram`), return exactly one unit to inventory.
- **FR-004**: Undo removes the matching visual ingredient whether it is still animating toward the dish or has already landed.
- **FR-005**: Provide a global undo control and per-ingredient remove controls, plus keyboard shortcuts: Backspace or Ctrl+Z.
- **FR-008**: The player can remove one unit of a specific previously selected topping without undoing later selections.
- **FR-006**: Undo is unavailable when no topping has been added and must not change inventory or order requirements.
- **FR-007**: Starting a new preparation board clears the undo history.

## Acceptance Scenarios

1. Given no toppings have been added, when the player uses undo, then no ingredient or inventory value changes.
2. Given the player adds three toppings, when the player presses undo once, then only the third topping is removed.
3. Given the player adds a stocked topping and undoes it, then its inventory count returns to the value before that addition.
4. Given an ingredient animation is in progress, when the player undoes that ingredient, then it does not later appear on the dish.
5. Given the player has moved beyond the `TOPPINGS` step, undo does not alter the order.
6. Given the player selected several topping types, when they press the minus control on one selected type, then only that type decreases by one and its stock is refunded when applicable.

## Constraints / Non-Goals

- Do not change topping requirements, order generation, scoring, recipe evaluation, timing, seasoning, rolling, cutting, or serving.
- Do not change the existing tutorial, progression, save/continue, event scheduling, or map systems.
- This feature only corrects topping selection within the active order.
