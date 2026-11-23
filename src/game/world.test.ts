import test from 'node:test';
import assert from 'node:assert/strict';
import { canChangeVendorLocation, canUseWorldActivity, findNearbyWorldActivity, findNearbyWorldLocation, getVendorLocation, isSystemUnlocked, isWorldPositionWalkable, moveWorldPlayer, VENDOR_LOCATIONS, WORLD_ACTIVITIES, WORLD_INTERACTABLES, WORLD_WALKABLE_BOUNDS, WORLD_LANDMARKS, PEDESTRIAN_ROUTES, getNeighborhoodEvent, getNeighborhoodDialogue, isNeighborhoodDialogueLocationId, CURIOUS_CART_VISITOR_EVENT, getNeighborhoodHelpQuestAction, NEIGHBORHOOD_HELP_QUEST, getNeighborhoodParcelQuestAction, NEIGHBORHOOD_PARCEL_QUEST, getWorldMovementDelta, WORLD_PLAYER_SPEED, type WorldInteractable } from './world';

test('all five vendor locations have distinct grounded costs and valid multipliers', () => {
  assert.equal(VENDOR_LOCATIONS.length, 5);
  for (const location of VENDOR_LOCATIONS) {
    assert.ok(location.rentPerDay > 0);
    assert.ok(location.orderMultiplier > 0);
    assert.ok(location.incidentMultiplier > 0);
  }
});

test('unknown vendor location safely falls back to the first location', () => {
  assert.equal(getVendorLocation('UNKNOWN').id, 'CONG_VIEN');
});

test('location changes are only allowed before a new game or at end of day', () => {
  assert.equal(canChangeVendorLocation('TITLE_MENU'), true);
  assert.equal(canChangeVendorLocation('END_OF_DAY'), true);
  assert.equal(canChangeVendorLocation('MORNING_PREP'), false);
  assert.equal(canChangeVendorLocation('PLAYING'), false);
});

test('side activities require level 5 and at least one staff member', () => {
  assert.equal(isSystemUnlocked('SIDE_ACTIVITIES', 4, true), false);
  assert.equal(isSystemUnlocked('SIDE_ACTIVITIES', 5, false), false);
  assert.equal(isSystemUnlocked('SIDE_ACTIVITIES', 5, true), true);
  assert.equal(isSystemUnlocked('STAFF', 5, false), true);
});

test('minigame locations unlock only at level 5 with a hired staff member', () => {
  for (const activity of WORLD_ACTIVITIES) {
    assert.equal(canUseWorldActivity(activity, 4, 2), false);
    assert.equal(canUseWorldActivity(activity, 5, 0), false);
    assert.equal(canUseWorldActivity(activity, 5, 1), true);
  }
});

test('minigame interaction requires the player to walk within the activity radius', () => {
  const activity = WORLD_ACTIVITIES[0];
  assert.equal(findNearbyWorldActivity(activity.x, activity.y)?.id, activity.id);
  assert.equal(findNearbyWorldActivity(90, 90), null);
});

test('street scene includes distinct park, shops, food stall, sidewalk and road areas', () => {
  const kinds = new Set(WORLD_LANDMARKS.map((landmark) => landmark.kind));
  for (const kind of ['PARK', 'MARKET', 'FOOD_STALL', 'SIDEWALK', 'ROAD']) {
    assert.ok(kinds.has(kind as (typeof WORLD_LANDMARKS)[number]['kind']));
  }
});

test('neighborhood event schedule follows morning, noon, and afternoon game-time thirds', () => {
  const morning = getNeighborhoodEvent(1, 90, 90);
  const noon = getNeighborhoodEvent(1, 45, 90);
  const afternoon = getNeighborhoodEvent(1, 0, 90);

  assert.equal(morning.dayPart, 'MORNING');
  assert.equal(noon.dayPart, 'NOON');
  assert.equal(afternoon.dayPart, 'AFTERNOON');
  assert.ok(morning.description.length > 20);
  assert.ok(noon.description.length > 20);
  assert.ok(afternoon.description.length > 20);
});

test('neighborhood events rotate by in-game day without random or economy side effects', () => {
  const dayOne = getNeighborhoodEvent(1, 90, 90);
  const dayTwo = getNeighborhoodEvent(2, 90, 90);

  assert.notEqual(dayOne.title, dayTwo.title);
  assert.equal(getNeighborhoodEvent(0, 90, 90).dayPart, 'MORNING');
  assert.equal(getNeighborhoodEvent(1, Number.NaN, 90).dayPart, 'MORNING');
  assert.equal(getNeighborhoodEvent(1, 45, 0).dayPart, 'MORNING');
});

test('pedestrian routes have unique ids and movement animations', () => {
  assert.ok(PEDESTRIAN_ROUTES.length >= 3);
  assert.equal(new Set(PEDESTRIAN_ROUTES.map((route) => route.id)).size, PEDESTRIAN_ROUTES.length);
  for (const route of PEDESTRIAN_ROUTES) {
    assert.ok(route.emoji.length > 0);
    assert.ok(route.top.endsWith('%'));
    assert.ok(route.delay.length > 0);
  }
});


test('world movement speed is frame-rate independent and no longer depends on keyboard repeat', () => {
  const oneFrame = getWorldMovementDelta(1, 0, 1 / 60);
  assert.ok(Math.abs(oneFrame.x - (WORLD_PLAYER_SPEED.x / 60)) < 0.000001);
  assert.equal(oneFrame.y, 0);
  const twoFrames = getWorldMovementDelta(1, 0, 1 / 30);
  assert.ok(Math.abs(twoFrames.x - oneFrame.x * 2) < 0.000001);
});

test('diagonal world movement is normalized and background-tab frame gaps cannot teleport the player', () => {
  const diagonal = getWorldMovementDelta(1, 1, 1 / 60);
  assert.ok(Math.abs(diagonal.x / diagonal.y - WORLD_PLAYER_SPEED.x / WORLD_PLAYER_SPEED.y) < 0.000001);
  const delayedFrame = getWorldMovementDelta(1, 0, 5);
  assert.equal(delayedFrame.x, WORLD_PLAYER_SPEED.x * 0.05);
  assert.equal(delayedFrame.y, 0);
  assert.deepEqual(getWorldMovementDelta(0, 0, 1 / 60), { x: 0, y: 0 });
});

test('neighborhood movement stays inside the walkable sidewalk bounds', () => {
  const moved = moveWorldPlayer({ x: 48, y: 45 }, 100, -100);
  assert.equal(moved.x, 96);
  assert.equal(moved.y, 33);
});

test('neighborhood movement collides with solid map objects', () => {
  const blockedByCart = moveWorldPlayer({ x: 40, y: 38 }, -15, 0);
  assert.equal(blockedByCart.x, 40);

  const blockedByDrinkStall = moveWorldPlayer({ x: 50, y: 45 }, 20, 0);
  assert.equal(blockedByDrinkStall.x, 50);
});

test('movement slides along obstacles instead of freezing both axes', () => {
  const moved = moveWorldPlayer({ x: 40, y: 38 }, -15, 5);
  assert.equal(moved.x, 40);
  assert.equal(moved.y, 43);
});

test('all neighborhood businesses and the neighbor have interaction dialogue', () => {
  assert.equal(WORLD_INTERACTABLES.length, 10);
  for (const location of WORLD_INTERACTABLES) {
    assert.ok(location.name.length > 0);
    assert.ok(location.description.length > 0);
    assert.ok(location.interactionText.length > 0);
    assert.ok(location.radius > 0);
  }
});

test('four new neighborhood NPCs have distinct dialogue and reachable positions', () => {
  const npcIds = ['co_nam', 'co_sau', 'shipper_ti', 'chu_bay', 'ba_tu'];
  const npcs = WORLD_INTERACTABLES.filter((location) => location.kind === 'NPC');

  assert.equal(npcs.length, 5);
  for (const id of npcIds) {
    const npc = WORLD_INTERACTABLES.find((location) => location.id === id);
    assert.ok(npc, `missing NPC: ${id}`);
    assert.ok(npc.interactionText.length > 20, `missing dialogue: ${id}`);
    assert.equal(isWorldPositionWalkable({ x: npc.x, y: npc.y }), true, id);
    assert.equal(findNearbyWorldLocation(npc.x, npc.y)?.id, id);
  }
});

test('nearby interaction selects the closest location within its own radius', () => {
  assert.equal(findNearbyWorldLocation(36, 48)?.id, 'cart');
  assert.equal(findNearbyWorldLocation(74, 48)?.id, 'drink_stall');
  assert.equal(findNearbyWorldLocation(50, 45), null);
});

test('all authored interaction points are on reachable sidewalk tiles', () => {
  for (const location of WORLD_INTERACTABLES) {
    assert.equal(isWorldPositionWalkable({ x: location.x, y: location.y }), true, location.id);
  }
  assert.equal(findNearbyWorldLocation(48, 45), null);
});


test('player can reach the grocery shop by walking around the cart along the lower sidewalk', () => {
  let position = { x: 48, y: 45 };
  position = moveWorldPlayer(position, 0, 11);
  position = moveWorldPlayer(position, -36, 0);
  position = moveWorldPlayer(position, 0, -23);

  assert.deepEqual(position, { x: 12, y: 33 });
  assert.equal(isWorldPositionWalkable(position), true);
  assert.equal(findNearbyWorldLocation(position.x, position.y)?.id, 'grocery');
});


test('curious cart visitor is a narrative-only optional interaction', () => {
  assert.equal(CURIOUS_CART_VISITOR_EVENT.id, 'curious_cart_visitor');
  assert.match(CURIOUS_CART_VISITOR_EVENT.dialogue, /xe bánh tráng mới mở/i);
  assert.equal(Object.keys(CURIOUS_CART_VISITOR_EVENT).sort().join(','), 'dialogue,id,title');
});

test('neighbor help quest is opt-in and can be deferred without losing the offer', () => {
  assert.equal(getNeighborhoodHelpQuestAction('chu_bay', 'AVAILABLE'), 'OFFER');
  assert.equal(getNeighborhoodHelpQuestAction('co_sau', 'AVAILABLE'), 'DIALOGUE');
  assert.equal(getNeighborhoodHelpQuestAction('chu_bay', 'ACCEPTED'), 'REMIND');
  assert.equal(getNeighborhoodHelpQuestAction('chu_bay', 'COMPLETED'), 'DIALOGUE');
});

test('neighbor help quest completes only when the accepted message reaches Co Sau', () => {
  assert.equal(getNeighborhoodHelpQuestAction('co_sau', 'ACCEPTED'), 'DELIVER');
  assert.equal(getNeighborhoodHelpQuestAction('shipper_ti', 'ACCEPTED'), 'DIALOGUE');
  assert.equal(getNeighborhoodHelpQuestAction('ba_tu', 'ACCEPTED'), 'DIALOGUE');
  assert.equal(NEIGHBORHOOD_HELP_QUEST.giverId, 'chu_bay');
  assert.equal(NEIGHBORHOOD_HELP_QUEST.targetId, 'co_sau');
  assert.match(NEIGHBORHOOD_HELP_QUEST.objective, /Cô Sáu/);
});

test('parcel side quest is optional and can be deferred or revisited with Ti', () => {
  assert.equal(getNeighborhoodParcelQuestAction('shipper_ti', 'AVAILABLE'), 'OFFER');
  assert.equal(getNeighborhoodParcelQuestAction('ba_tu', 'AVAILABLE'), 'DIALOGUE');
  assert.equal(getNeighborhoodParcelQuestAction('shipper_ti', 'ACCEPTED'), 'REMIND');
  assert.equal(getNeighborhoodParcelQuestAction('shipper_ti', 'COMPLETED'), 'DIALOGUE');
  assert.equal(NEIGHBORHOOD_PARCEL_QUEST.giverId, 'shipper_ti');
  assert.equal(NEIGHBORHOOD_PARCEL_QUEST.targetId, 'ba_tu');
  assert.match(NEIGHBORHOOD_PARCEL_QUEST.objective, /Bà Tư/);
});

test('parcel side quest completes only at Ba Tu and does not cross-complete the first quest', () => {
  assert.equal(getNeighborhoodParcelQuestAction('ba_tu', 'ACCEPTED'), 'DELIVER');
  assert.equal(getNeighborhoodParcelQuestAction('co_sau', 'ACCEPTED'), 'DIALOGUE');
  assert.equal(getNeighborhoodParcelQuestAction('chu_bay', 'ACCEPTED'), 'DIALOGUE');
  assert.equal(getNeighborhoodHelpQuestAction('ba_tu', 'ACCEPTED'), 'DIALOGUE');
  assert.equal(getNeighborhoodParcelQuestAction('co_sau', 'COMPLETED'), 'DIALOGUE');
});

test('completed neighborhood quests are acknowledged by both the giver and recipient', async () => {
  const { getNeighborhoodQuestFollowUpDialogue } = await import('./world');
  assert.match(getNeighborhoodQuestFollowUpDialogue('chu_bay', 'COMPLETED', 'AVAILABLE') ?? '', /Cô Sáu ghé lấy xe rồi/i);
  assert.match(getNeighborhoodQuestFollowUpDialogue('co_sau', 'COMPLETED', 'AVAILABLE') ?? '', /lấy được xe rồi/i);
  assert.match(getNeighborhoodQuestFollowUpDialogue('shipper_ti', 'AVAILABLE', 'COMPLETED') ?? '', /Bà Tư nhận được tin rồi/i);
  assert.match(getNeighborhoodQuestFollowUpDialogue('ba_tu', 'AVAILABLE', 'COMPLETED') ?? '', /Tí giao hàng tới rồi/i);
});

test('quest follow-up dialogue does not appear before completion or for unrelated NPCs', async () => {
  const { getNeighborhoodQuestFollowUpDialogue } = await import('./world');
  assert.equal(getNeighborhoodQuestFollowUpDialogue('chu_bay', 'ACCEPTED', 'AVAILABLE'), null);
  assert.equal(getNeighborhoodQuestFollowUpDialogue('co_sau', 'AVAILABLE', 'ACCEPTED'), null);
  assert.equal(getNeighborhoodQuestFollowUpDialogue('ba_tu', 'AVAILABLE', 'AVAILABLE'), null);
  assert.equal(getNeighborhoodQuestFollowUpDialogue('co_nam', 'COMPLETED', 'COMPLETED'), null);
});

test('every neighborhood interaction is reachable from the default spawn with real keyboard step sizes', () => {
  const queue = [{ x: 48, y: 45 }];
  const visited = new Set(['48.000,45.000']);
  const reachableIds = new Set<string>();
  const steps = [
    { x: -2.5, y: 0 },
    { x: 2.5, y: 0 },
    { x: 0, y: -1.5 },
    { x: 0, y: 1.5 },
  ];

  for (let cursor = 0; cursor < queue.length; cursor += 1) {
    const position = queue[cursor];
    const nearby = findNearbyWorldLocation(position.x, position.y);
    if (nearby) reachableIds.add(nearby.id);

    for (const step of steps) {
      const next = moveWorldPlayer(position, step.x, step.y);
      const key = `${next.x.toFixed(3)},${next.y.toFixed(3)}`;
      if (key !== `${position.x.toFixed(3)},${position.y.toFixed(3)}` && !visited.has(key)) {
        visited.add(key);
        queue.push(next);
      }
    }
  }

  assert.deepEqual(
    [...reachableIds].sort(),
    WORLD_INTERACTABLES.map((location) => location.id).sort(),
    'every business and NPC must be interactable from the default map spawn',
  );
});


test('all four solid neighborhood obstacles block entry from the sidewalk', () => {
  const cases = [
    { id: 'left tree', start: { x: 9, y: 40 }, dx: -5, dy: 0 },
    { id: 'cart', start: { x: 40, y: 38 }, dx: -15, dy: 0 },
    { id: 'drink stall', start: { x: 50, y: 45 }, dx: 20, dy: 0 },
    { id: 'right tree', start: { x: 84, y: 40 }, dx: 5, dy: 0 },
  ];

  for (const obstacle of cases) {
    const moved = moveWorldPlayer(obstacle.start, obstacle.dx, obstacle.dy);
    assert.equal(moved.x, obstacle.start.x, `player must not pass through ${obstacle.id}`);
    assert.equal(moved.y, obstacle.start.y, `blocked horizontal movement must not shift ${obstacle.id} test vertically`);
  }
});

test('overlapping interaction radii always select the nearest target and resolve exact ties consistently', () => {
  const locations: WorldInteractable[] = [
    { ...WORLD_INTERACTABLES[0], id: 'cart', x: 0, y: 0, radius: 6 },
    { ...WORLD_INTERACTABLES[1], id: 'grocery', x: 8, y: 0, radius: 6 },
  ];

  assert.equal(findNearbyWorldLocation(5, 0, locations)?.id, 'grocery');
  assert.equal(findNearbyWorldLocation(4, 0, locations)?.id, 'cart');
  assert.equal(findNearbyWorldLocation(15, 0, locations), null);
});

test('all nine non-cart stops have distinct first-visit and return dialogue for all dayparts', () => {
  const ids = WORLD_INTERACTABLES.map((location) => location.id).filter(isNeighborhoodDialogueLocationId);
  assert.equal(ids.length, 9);
  const firstVisitLines = ids.map((id) => getNeighborhoodDialogue(id, 'MORNING', 0));
  assert.equal(new Set(firstVisitLines).size, ids.length);
  for (const id of ids) {
    assert.notEqual(getNeighborhoodDialogue(id, 'MORNING', 0), getNeighborhoodDialogue(id, 'MORNING', 1), id + ' should acknowledge a return visit');
    for (const dayPart of ['MORNING', 'NOON', 'AFTERNOON'] as const) {
      assert.ok(getNeighborhoodDialogue(id, dayPart, 0).length > 40, id + ' first visit ' + dayPart);
      assert.ok(getNeighborhoodDialogue(id, dayPart, 1).length > 40, id + ' return visit ' + dayPart);
    }
  }
});

test('grocery shop and Cô Năm are clearly different map characters', () => {
  const grocery = WORLD_INTERACTABLES.find((location) => location.id === 'grocery');
  const coNam = WORLD_INTERACTABLES.find((location) => location.id === 'co_nam');
  assert.equal(grocery?.name, 'Tạp hóa đầu ngõ');
  assert.match(grocery?.description ?? '', /cô chủ tiệm/i);
  assert.match(getNeighborhoodDialogue('grocery', 'MORNING'), /Cô chủ tiệm/);
  assert.equal(coNam?.name, 'Cô Năm hàng xóm');
  assert.match(getNeighborhoodDialogue('co_nam', 'MORNING'), /Cô Năm/);
});


test('Cô Năm spawn is spaced away from the player and still interactable', () => {
  const coNam = WORLD_INTERACTABLES.find((location) => location.id === 'co_nam');
  assert.deepEqual({ x: coNam?.x, y: coNam?.y }, { x: 56, y: 55 });
  assert.equal(findNearbyWorldLocation(48, 45), null);
  assert.equal(findNearbyWorldLocation(56, 55)?.id, 'co_nam');
});


test('all neighborhood NPC interaction anchors stay within the sidewalk walkable band', () => {
  const npcs = WORLD_INTERACTABLES.filter((location) => location.kind === 'NPC');
  assert.equal(npcs.length, 5);
  for (const npc of npcs) {
    assert.ok(npc.y >= WORLD_WALKABLE_BOUNDS.minY, `${npc.name} is above the sidewalk band`);
    assert.ok(npc.y <= WORLD_WALKABLE_BOUNDS.maxY, `${npc.name} is below the sidewalk band`);
  }
});
