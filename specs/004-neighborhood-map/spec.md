# Feature: Neighborhood map exploration

## Problem
The project already contains a pixel-art SVG neighborhood scene and a basic player marker, but movement is restricted to a narrow strip, map objects have no collision, and the map's location panel does not provide real interactions. The map therefore feels like a visual preview rather than a small explorable RPG space.

## Goals
- Reuse the existing pixel-art neighborhood scene and preserve its visual direction.
- Let the player walk around the current bánh tráng neighborhood using keyboard and touch controls.
- Keep the player inside the sidewalk play area and prevent walking through major props.
- Provide six nearby interaction points: bánh tráng cart, tạp hóa cô Năm, sạp ăn vặt, quán nước chú Ba, cổng chợ, and cô Năm hàng xóm.
- Show short contextual dialogue when the player interacts with a location or NPC.
- Provide Tester Panel controls to open the map and teleport to each interaction point.
- Keep movement and interaction rules in pure, unit-testable world functions.

## Non-goals
- Do not expand to a city-wide map or add other districts.
- Do not add shopping transactions, inventory changes, staff systems, or side activities in this slice.
- Do not change the cooking/order/timing/scoring loop.
- Do not change save schema, wallet, inventory, mission progress, or vendor-location ownership.
- Do not change the official Spec Kit M5 scope (decorations, skins, difficulty, and audio).

## User stories
1. As a player, I can walk along the neighborhood sidewalk using WASD, arrow keys, or on-screen directional buttons.
2. As a player, I cannot walk through the bánh tráng cart, drink stall, trees, or outside the walkable sidewalk.
3. As a player, I can approach local businesses and the neighbor NPC and press E or the interaction button to read a short dialogue.
4. As a player, I can return to the existing morning-preparation flow by interacting with my bánh tráng cart.
5. As a tester, I can open the neighborhood and teleport to every interaction point without modifying business data.

## Acceptance criteria
- Keyboard and touch movement both use the same movement/collision function.
- Movement remains inside the configured sidewalk bounds.
- Collision prevents crossing configured solid map objects while allowing axis sliding.
- All six interaction points are within walkable space and have a name, description, radius, and dialogue.
- The nearest valid interaction point is selected.
- Interacting with the cart closes the map and returns to the existing preparation screen.
- Other interactions are informational only and do not change cash, inventory, missions, or saves.
- Tester Panel exposes map open and per-location teleport controls.
- Unit tests cover movement bounds, collision, axis sliding, interaction selection, and reachable interaction points.
