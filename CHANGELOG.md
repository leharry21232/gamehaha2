# Changelog

## Unreleased
- Map 1 audit: removed the shortcut that closed the neighborhood from anywhere; the player must return to the bánh tráng cart to leave the map and resume preparation.
- Rebalanced large economy windfalls: boss reward 500k→120k, Flow masterpiece x5→x2, Tarot/Viral multipliers x3→x1.5, and reduced lottery, VIP tips, raid and cash-pickup payouts. Cooking inputs, ingredient prices, save data and progression requirements remain unchanged.
- Expanded Map 1 conversations with first-visit and return-visit dialogue plus morning/noon/afternoon context at nine non-cart stops; clarified the grocery shopkeeper as a separate character from Cô Năm. Visit counts are session-only and narrative-only.

## Unreleased
- Added follow-up dialogue for Chú Bảy/Cô Sáu and Tí/Bà Tư after their respective neighborhood side quests are completed.
- Prevented background movement/interactions while a neighborhood quest dialog is open; Escape closes dialogs without accepting or declining. E now closes an open map/journal panel instead of interacting with a hidden NPC, and Escape closes the panel.
- Added the first explorable neighborhood slice using the existing 2D pixel-art scene: collision-aware movement, six local interaction points with dialogue, and Tester Panel map QA controls. No economy, inventory, save, or cooking-loop behavior is changed.
- Added collision-aware neighborhood exploration using the existing pixel-art SVG map, with six walkable interaction points and contextual NPC/store dialogue.
- Added keyboard and touch movement through shared world rules, plus Tester Panel map teleport/QA controls and regression tests.
- Map interactions are informational only in this slice; they do not alter cash, inventory, mission progress, or the cooking loop.
- Expanded Chapter 1 into a four-step story mission chain ending at level 5, while preserving existing mission IDs for old browser saves.
- Added Tester Panel controls for lifetime order count and earnings to test story progression, and ensured claimed mission rewards persist across reloads.
- Confirmed the intended save model: game progress and the active session stay in the current browser profile's localStorage; no account or cloud sync. Added isolation regression coverage.
- Tester Panel adds a live inventory inspector, a guarded customer-queue test action, and a guarded Saigon-rain trigger using existing gameplay logic.
- Tester Panel includes safe controls to set cash, player level/XP, and remaining day time; changes persist through the existing save systems.

- 2026-11-18: Added an isolated, read-only Tester Panel foundation (F2 / ?debug=1) with live HUD diagnostics and save export/copy.
- 2026-11-18: Added per-ingredient topping removal controls so players can remove a specific selected topping and refund its stock; retained global undo.


## M6 – Chapter 1 neighborhood integration
- Connected the map Journal tab to the live Chapter 1 mission snapshot, including progress, status, reward, and the existing reward-claim API.
- Made Cô Năm's neighborhood dialogue reflect the current story mission and progress.


## M6 – Neighborhood NPCs
- Added four named neighborhood NPCs (Cô Sáu, Tí giao hàng, chú Bảy, bà Tư) with distinct pixel-art sprites, map labels, interaction ranges, and dialogue.
- Kept all NPC interactions narrative-only and reused the existing keyboard/touch interaction flow.


## M6 – Neighborhood ambience
- Added non-blocking neighborhood ambience events that change across in-game morning, noon, and afternoon and rotate by game day.
- Added a compact map card for current neighborhood activity; events are narrative-only and do not alter economy, inventory, missions, saves, or the cooking loop.


## M6 – Level-gated market expansion
- Added four purchasable topping ingredients with level unlocks: Cheese (Lv. 2), Boba (Lv. 3), Durian (Lv. 5), and Coconut Milk (Lv. 6). Unlocking grants purchase access only; stock must still be purchased.
- Enforced unlock levels in both the market UI and GameEngine, and made new topping usage consume inventory with removal/undo returning stock.
- Kept version-1 browser saves compatible by migrating missing new inventory fields to zero without changing existing stock.
- Expanded the top HUD with live level/XP progress and current story-mission progress alongside the existing money and day timer.

## M6 – Interactive neighborhood event
- Added an optional, one-time curious visitor conversation near the bánh tráng cart. It is narrative-only and leaves the existing E-to-cart flow untouched.

## M6 – Neighborhood side quest
- Added an optional side quest from Chú Bảy: accept or defer his request, then deliver a message to Cô Sáu.
- Added an in-map objective/completion tracker and regression tests for valid NPC progression.
- Kept the quest session-only and narrative-only: no money, item, XP, time, main-mission, save, or cooking-loop changes.

## M6 – Second neighborhood side quest
- Added Tí's optional “Chuyến hàng cuối ngõ” story: accept or defer his request, then tell Bà Tư the parcel is on its way.
- Added an independent objective/completion tracker, offer modal, and regression tests to prevent cross-completing either side quest.
- Kept both side quests session-only and narrative-only with no save, economy, inventory, XP, time, main-mission, or cooking-loop effects.

## M6 – Neighborhood quest journal
- Added both optional neighborhood side quests to the map Journal with live “Not accepted / In progress / Completed” states and next-NPC guidance.
- The journal reads the existing session state only; no save schema, quest progression, economy, or cooking-loop changes.


## M6 – Responsive neighborhood journal
- Repositioned the map information/journal panel into the safe area above the bottom controls and enabled independent vertical scrolling for touch devices.
- Constrained both optional-quest offer dialogs to the viewport height so their accept/defer actions remain reachable on short screens.


## M6 – Map 1 exploration guide
- Reworked the in-map Guide panel into a structured first-time-player guide for keyboard/touch movement, interaction, returning to the bánh tráng cart, and all ten neighborhood stops.
- The guide now remains visible even when the player is standing near an NPC; nearby-location context appears as a supplemental section instead of replacing the guide.
- UI-only change: no quest, save, economy, inventory, time, or cooking-loop behavior changed.


## M6 – Responsive HUD cho Map 1
- Giới hạn chiều rộng hai thẻ thông tin đầu màn hình trên điện thoại để tránh chồng lấn.
- Cho các tab và nút hành động ở bảng điều khiển tự co giãn/xuống dòng trên màn hình hẹp.
- Chỉ thay đổi lớp trình bày; giữ nguyên logic bản đồ, nhiệm vụ và bán hàng.


## M6 – Ánh sáng khu phố theo thời điểm
- Thêm sắc độ ánh sáng môi trường nhẹ cho buổi sáng, buổi trưa và buổi chiều, đồng bộ với thẻ nhịp sống khu phố.
- Lớp phủ chỉ trang trí, không chặn thao tác và không tác động gameplay.


## M7 – Mobile layout and neighborhood movement
- Made the Map 1 scene show the complete neighborhood on narrow and tall screens instead of cropping the edges of the map.
- Reworked the top HUD cards, information panels, tabs, and touch controls for phone safe areas and short landscape viewports.
- Removed the automatic portrait-orientation lock so the game follows the player's actual phone orientation.
- Replaced one-step keyboard/tap jumps with elapsed-time movement, normalized diagonal speed, and press-and-hold touch controls. Player rendering updates between lightweight UI position commits rather than forcing a full game render on every animation frame.


## 2026-11-21 — Mobile cooking layout pass
- Compact portrait order-card text and four-step progress labels to prevent collisions.
- Replace the desktop mouse-cutting instruction with a short touch-first message that wraps inside the viewport.
- Make cooking HUD actions wrap and reduce their touch-button footprint on narrow screens.
- Add layout regression tests for common portrait and landscape sizes.
