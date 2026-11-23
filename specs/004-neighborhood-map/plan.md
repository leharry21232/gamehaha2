# Implementation plan

1. Audit the existing SVG neighborhood overlay, movement state, and world data; retain the current renderer.
2. Add pure normalized-coordinate movement, sidewalk bounds, collision rectangles, and nearby-interaction lookup in `src/game/world.ts`.
3. Add six data-driven interaction points with contextual descriptions and dialogue.
4. Wire keyboard and touch controls in `App.tsx` to the shared movement function.
5. Make E / the touch interaction button invoke the nearest point; preserve the cart's existing return-to-preparation behavior.
6. Add a Tester Panel map tab for opening the map and teleporting to interaction points.
7. Add unit tests and update project decision/task/changelog records.
8. Run the full test suite, TypeScript check, and production build; then complete browser QA.

## Risks
- Existing player coordinates are viewport percentages; map hitboxes must use the same coordinate system.
- The drink stall and cart occupy part of the sidewalk, so collision rectangles must leave a reachable approach path.
- Map interaction must not mutate business state or interfere with the cooking engine.
- The map overlay is opened from both new-game onboarding and morning preparation; both entry paths must remain valid.
