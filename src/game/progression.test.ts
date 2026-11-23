import test from 'node:test';
import assert from 'node:assert/strict';
import {
  addProgress,
  buyDecoration,
  DECORATIONS,
  DIFFICULTY_SETTINGS,
  equipDecoration,
  getDecorationAttraction,
  getUnlockedSkills,
  getIngredientUnlockLevel,
  INITIAL_PLAYER_PROGRESS,
  resetWalletForNewGame,
  type PlayerProgress,
  loadPlayerProgress,
  savePlayerProgress,
  xpRequiredForLevel,
} from './progression';

test('starting a new game restores starter cash without erasing long-term progression', () => {
  const progressed: PlayerProgress = {
    ...INITIAL_PLAYER_PROGRESS,
    level: 4,
    xp: 35,
    lifetimeEarnings: 250000,
    completedOrders: 12,
    wallet: 0,
    ownedDecorations: ['sticker_pack'],
    equippedDecorations: ['sticker_pack'],
  };
  const freshRun = resetWalletForNewGame(progressed);
  assert.equal(freshRun.wallet, 120000);
  assert.equal(freshRun.level, 4);
  assert.equal(freshRun.xp, 35);
  assert.equal(freshRun.lifetimeEarnings, 250000);
  assert.equal(freshRun.completedOrders, 12);
  assert.deepEqual(freshRun.ownedDecorations, ['sticker_pack']);
  assert.deepEqual(freshRun.equippedDecorations, ['sticker_pack']);
});

test('XP thresholds increase by level and carry excess XP forward', () => {
  assert.equal(xpRequiredForLevel(1), 100);
  assert.equal(xpRequiredForLevel(2), 150);
  const almost = addProgress(INITIAL_PLAYER_PROGRESS, 99);
  assert.deepEqual([almost.level, almost.xp], [1, 99]);
  const levelUp = addProgress(almost, 1);
  assert.deepEqual([levelUp.level, levelUp.xp], [2, 0]);
  const multiLevel = addProgress(INITIAL_PLAYER_PROGRESS, 260);
  assert.deepEqual([multiLevel.level, multiLevel.xp], [3, 10]);
});

test('new topping ingredients unlock at their configured player levels', () => {
  assert.equal(getIngredientUnlockLevel('pho_mai'), 2);
  assert.equal(getIngredientUnlockLevel('tran_chau'), 3);
  assert.equal(getIngredientUnlockLevel('sau_rieng'), 5);
  assert.equal(getIngredientUnlockLevel('nuoc_cot_dua'), 6);
  assert.equal(getIngredientUnlockLevel('kho_bo'), 1);
});

test('progress counters are non-negative integers', () => {
  const result = addProgress(INITIAL_PLAYER_PROGRESS, -10, -200, -1);
  assert.equal(result.xp, 0);
  assert.equal(result.lifetimeEarnings, 0);
  assert.equal(result.completedOrders, 0);
});

test('decoration purchase checks level, balance and duplicate ownership', () => {
  const sticker = DECORATIONS.find((item) => item.id === 'sticker_pack')!;
  assert.equal(buyDecoration(INITIAL_PLAYER_PROGRESS, sticker.id, sticker.price - 1), null);
  const bought = buyDecoration(INITIAL_PLAYER_PROGRESS, sticker.id, sticker.price);
  assert.ok(bought);
  assert.equal(bought.remainingMoney, 0);
  assert.ok(bought.progress.ownedDecorations.includes(sticker.id));
  assert.equal(buyDecoration(bought.progress, sticker.id, sticker.price), null);
  assert.equal(buyDecoration(INITIAL_PLAYER_PROGRESS, 'neon_sign', 999999), null);
});

test('equipping requires ownership and replaces an item in the same slot', () => {
  const withSticker = {
    ...INITIAL_PLAYER_PROGRESS,
    ownedDecorations: ['sticker_pack', 'neon_sign'] as PlayerProgress['ownedDecorations'],
  };
  const equipped = equipDecoration(withSticker, 'sticker_pack');
  assert.deepEqual(equipped.equippedDecorations, ['sticker_pack']);
  assert.deepEqual(equipDecoration(equipped, 'neon_sign').equippedDecorations, ['sticker_pack', 'neon_sign']);
  assert.deepEqual(equipDecoration(INITIAL_PLAYER_PROGRESS, 'neon_sign'), INITIAL_PLAYER_PROGRESS);
  assert.equal(getDecorationAttraction(equipped), 2);
});

test('saved progress round-trips through storage', () => {
  let saved = '';
  savePlayerProgress(
    { ...INITIAL_PLAYER_PROGRESS, level: 2, xp: 20, lifetimeEarnings: 50000, completedOrders: 4 },
    { setItem: (_key, value) => { saved = value; } },
  );
  const loaded = loadPlayerProgress({ getItem: () => saved });
  assert.equal(loaded.level, 2);
  assert.equal(loaded.xp, 20);
  assert.equal(loaded.lifetimeEarnings, 50000);
  assert.equal(loaded.completedOrders, 4);
  assert.equal(loaded.wallet, 120000);
});

test('progress saves stay isolated between independent browser storage areas', () => {
  const browserA = new Map<string, string>();
  const browserB = new Map<string, string>();
  const storageA = {
    getItem: (key: string) => browserA.get(key) ?? null,
    setItem: (key: string, value: string) => { browserA.set(key, value); },
  };
  const storageB = {
    getItem: (key: string) => browserB.get(key) ?? null,
    setItem: (key: string, value: string) => { browserB.set(key, value); },
  };

  savePlayerProgress({ ...INITIAL_PLAYER_PROGRESS, level: 3, wallet: 45000 }, storageA);
  savePlayerProgress({ ...INITIAL_PLAYER_PROGRESS, level: 1, wallet: 120000 }, storageB);

  assert.equal(loadPlayerProgress(storageA).level, 3);
  assert.equal(loadPlayerProgress(storageA).wallet, 45000);
  assert.equal(loadPlayerProgress(storageB).level, 1);
  assert.equal(loadPlayerProgress(storageB).wallet, 120000);
});

test('invalid or corrupt saved progress safely falls back to defaults', () => {
  const invalid = JSON.stringify({ ...INITIAL_PLAYER_PROGRESS, level: -2, xp: 0 });
  assert.deepEqual(loadPlayerProgress({ getItem: () => invalid }), INITIAL_PLAYER_PROGRESS);
  assert.deepEqual(loadPlayerProgress({ getItem: () => '{broken json' }), INITIAL_PLAYER_PROGRESS);
});

test('loaded decorations are unique, owned and limited to one per slot', () => {
  const raw = JSON.stringify({
    ...INITIAL_PLAYER_PROGRESS,
    ownedDecorations: ['sticker_pack', 'neon_sign'],
    equippedDecorations: ['sticker_pack', 'sticker_pack', 'neon_sign'],
  });
  const loaded = loadPlayerProgress({ getItem: () => raw });
  assert.deepEqual(loaded.equippedDecorations, ['sticker_pack', 'neon_sign']);
});

test('difficulty tuning increases pressure from easy to hard', () => {
  assert.ok(DIFFICULTY_SETTINGS.EASY.customerSpawnMultiplier < DIFFICULTY_SETTINGS.HARD.customerSpawnMultiplier);
  assert.ok(DIFFICULTY_SETTINGS.EASY.customerPatienceMultiplier > DIFFICULTY_SETTINGS.HARD.customerPatienceMultiplier);
  assert.ok(DIFFICULTY_SETTINGS.EASY.policeChanceMultiplier < DIFFICULTY_SETTINGS.HARD.policeChanceMultiplier);
  assert.ok(DIFFICULTY_SETTINGS.EASY.rewardMultiplier < DIFFICULTY_SETTINGS.HARD.rewardMultiplier);
});

test('wallet balance persists and invalid values are normalized', () => {
  let saved = '';
  savePlayerProgress(
    { ...INITIAL_PLAYER_PROGRESS, wallet: 87500 },
    { setItem: (_key, value) => { saved = value; } },
  );
  assert.equal(loadPlayerProgress({ getItem: () => saved }).wallet, 87500);
  const invalidWallet = JSON.stringify({ ...INITIAL_PLAYER_PROGRESS, wallet: -50 });
  assert.equal(loadPlayerProgress({ getItem: () => invalidWallet }).wallet, 0);
});

test('fresh untouched profiles recover the starter wallet if an old save stored zero', () => {
  const legacyFreshSave = JSON.stringify({
    ...INITIAL_PLAYER_PROGRESS,
    wallet: 0,
    lifetimeEarnings: 0,
    completedOrders: 0,
  });
  assert.equal(loadPlayerProgress({ getItem: () => legacyFreshSave }).wallet, 120000);
});

test('a player who has completed orders can legitimately keep a zero wallet', () => {
  const spentSave = JSON.stringify({
    ...INITIAL_PLAYER_PROGRESS,
    wallet: 0,
    lifetimeEarnings: 25000,
    completedOrders: 2,
  });
  assert.equal(loadPlayerProgress({ getItem: () => spentSave }).wallet, 0);
});

test('passive skills unlock at the configured player levels', () => {
  assert.deepEqual(getUnlockedSkills(1), []);
  assert.deepEqual(getUnlockedSkills(3).map((skill) => skill.id), ['FAST_LEARNER']);
  assert.deepEqual(getUnlockedSkills(5).map((skill) => skill.id), ['FAST_LEARNER', 'CUSTOMER_CARE']);
  assert.deepEqual(getUnlockedSkills(8).map((skill) => skill.id), ['FAST_LEARNER', 'CUSTOMER_CARE', 'STREET_REPUTATION']);
});
