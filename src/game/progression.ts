import type { RawIngredientId } from './types';

export type GameDifficulty = 'EASY' | 'NORMAL' | 'HARD';

export type DecorationId =
  | 'neon_sign'
  | 'colorful_awning'
  | 'string_lights'
  | 'sticker_pack'
  | 'stainless_counter'
  | 'premium_menu';

export interface DecorationDefinition {
  id: DecorationId;
  name: string;
  description: string;
  price: number;
  attraction: number;
  unlockLevel: number;
  slot: 'SIGN' | 'ROOF' | 'LIGHTING' | 'BODY' | 'COUNTER' | 'MENU';
}

export interface PlayerProgress {
  version: 1;
  level: number;
  xp: number;
  lifetimeEarnings: number;
  completedOrders: number;
  wallet: number;
  ownedDecorations: DecorationId[];
  equippedDecorations: DecorationId[];
  difficulty: GameDifficulty;
}

export const DIFFICULTY_SETTINGS: Record<GameDifficulty, {
  label: string;
  customerSpawnMultiplier: number;
  customerPatienceMultiplier: number;
  policeChanceMultiplier: number;
  rewardMultiplier: number;
}> = {
  EASY: { label: 'Thư thả', customerSpawnMultiplier: 0.8, customerPatienceMultiplier: 1.3, policeChanceMultiplier: 0.65, rewardMultiplier: 0.85 },
  NORMAL: { label: 'Vỉa hè Sài Gòn', customerSpawnMultiplier: 1, customerPatienceMultiplier: 1, policeChanceMultiplier: 1, rewardMultiplier: 1 },
  HARD: { label: 'Căng thẳng', customerSpawnMultiplier: 1.25, customerPatienceMultiplier: 0.8, policeChanceMultiplier: 1.5, rewardMultiplier: 1.3 },
};

export interface PlayerSkillBonus {
  id: 'FAST_LEARNER' | 'CUSTOMER_CARE' | 'STREET_REPUTATION';
  level: number;
  name: string;
  description: string;
}

export function getIngredientUnlockLevel(id: RawIngredientId): number {
  const unlockLevels: Partial<Record<RawIngredientId, number>> = {
    pho_mai: 2,
    tran_chau: 3,
    sau_rieng: 5,
    nuoc_cot_dua: 6,
  };
  return unlockLevels[id] ?? 1;
}

export function getUnlockedSkills(level: number): PlayerSkillBonus[] {
  const skills: PlayerSkillBonus[] = [
    { id: 'FAST_LEARNER', level: 3, name: 'Học việc nhanh', description: '+10% XP nhận được từ đơn hàng.' },
    { id: 'CUSTOMER_CARE', level: 5, name: 'Giữ chân khách', description: '+5% thời gian chờ của khách.' },
    { id: 'STREET_REPUTATION', level: 8, name: 'Danh tiếng vỉa hè', description: '+5% tiền thưởng từ đơn hàng.' },
  ];
  return skills.filter((skill) => level >= skill.level);
}

export const DECORATIONS: DecorationDefinition[] = [
  { id: 'neon_sign', name: 'Bảng hiệu đèn neon', description: 'Bảng hiệu nổi bật, thu hút ánh nhìn từ xa.', price: 120000, attraction: 5, unlockLevel: 2, slot: 'SIGN' },
  { id: 'colorful_awning', name: 'Mái che sắc màu', description: 'Tạo điểm nhấn riêng cho xe bánh tráng.', price: 180000, attraction: 4, unlockLevel: 3, slot: 'ROOF' },
  { id: 'string_lights', name: 'Dây đèn trang trí', description: 'Không gian lung linh khi bán buổi tối.', price: 90000, attraction: 4, unlockLevel: 2, slot: 'LIGHTING' },
  { id: 'sticker_pack', name: 'Bộ sticker cá tính', description: 'Trang trí thân xe theo phong cách riêng.', price: 50000, attraction: 2, unlockLevel: 1, slot: 'BODY' },
  { id: 'stainless_counter', name: 'Quầy inox sạch sẽ', description: 'Quầy chế biến gọn gàng, chuyên nghiệp.', price: 250000, attraction: 6, unlockLevel: 4, slot: 'COUNTER' },
  { id: 'premium_menu', name: 'Bảng menu cao cấp', description: 'Menu bắt mắt giúp khách dễ chọn món.', price: 150000, attraction: 5, unlockLevel: 3, slot: 'MENU' },
];

export const INITIAL_PLAYER_PROGRESS: PlayerProgress = {
  version: 1,
  level: 1,
  xp: 0,
  lifetimeEarnings: 0,
  completedOrders: 0,
  wallet: 120000,
  ownedDecorations: [],
  equippedDecorations: [],
  difficulty: 'NORMAL',
};

export function resetWalletForNewGame(progress: PlayerProgress): PlayerProgress {
  return { ...progress, wallet: INITIAL_PLAYER_PROGRESS.wallet };
}

export function xpRequiredForLevel(level: number): number {
  return 100 + Math.max(0, level - 1) * 50;
}

export function addProgress(
  current: PlayerProgress,
  earnedXp: number,
  earnings = 0,
  completedOrders = 0,
): PlayerProgress {
  let level = current.level;
  let xp = current.xp + Math.max(0, Math.floor(earnedXp));

  while (xp >= xpRequiredForLevel(level)) {
    xp -= xpRequiredForLevel(level);
    level += 1;
  }

  return {
    ...current,
    level,
    xp,
    lifetimeEarnings: current.lifetimeEarnings + Math.max(0, Math.floor(earnings)),
    completedOrders: current.completedOrders + Math.max(0, Math.floor(completedOrders)),
  };
}

export function buyDecoration(
  progress: PlayerProgress,
  decorationId: DecorationId,
  money: number,
): { progress: PlayerProgress; remainingMoney: number } | null {
  const item = DECORATIONS.find((decoration) => decoration.id === decorationId);
  if (
    !item ||
    progress.ownedDecorations.includes(decorationId) ||
    progress.level < item.unlockLevel ||
    money < item.price
  ) return null;

  return {
    progress: {
      ...progress,
      ownedDecorations: [...progress.ownedDecorations, decorationId],
    },
    remainingMoney: money - item.price,
  };
}

export function equipDecoration(
  progress: PlayerProgress,
  decorationId: DecorationId,
): PlayerProgress {
  if (!progress.ownedDecorations.includes(decorationId)) return progress;
  const item = DECORATIONS.find((decoration) => decoration.id === decorationId);
  if (!item) return progress;

  const equippedDecorations = progress.equippedDecorations.filter((id) =>
    DECORATIONS.find((decoration) => decoration.id === id)?.slot !== item.slot
  );
  return { ...progress, equippedDecorations: [...equippedDecorations, decorationId] };
}

export function getDecorationAttraction(progress: PlayerProgress): number {
  return progress.equippedDecorations.reduce(
    (total, id) => total + (DECORATIONS.find((item) => item.id === id)?.attraction ?? 0),
    0,
  );
}

export function loadPlayerProgress(storage?: Pick<Storage, 'getItem'>): PlayerProgress {
  if (!storage) return INITIAL_PLAYER_PROGRESS;

  try {
    const raw = storage.getItem('banh_trang_player_progress_v1');
    if (!raw) return INITIAL_PLAYER_PROGRESS;
    const parsed = JSON.parse(raw) as Partial<PlayerProgress>;
    if (
      parsed.version !== 1 ||
      !Number.isInteger(parsed.level) ||
      (parsed.level ?? 0) < 1 ||
      !Number.isFinite(parsed.xp) ||
      (parsed.xp ?? -1) < 0 ||
      (parsed.xp ?? 0) >= xpRequiredForLevel(parsed.level ?? 1)
    ) {
      return INITIAL_PLAYER_PROGRESS;
    }

    const validIds = (value: unknown): DecorationId[] => Array.isArray(value)
      ? [...new Set(value.filter((id): id is DecorationId => DECORATIONS.some((item) => item.id === id)))]
      : [];
    const ownedDecorations = validIds(parsed.ownedDecorations);
    const equippedDecorations: DecorationId[] = [];
    const occupiedSlots = new Set<DecorationDefinition['slot']>();
    for (const id of validIds(parsed.equippedDecorations)) {
      const item = DECORATIONS.find((decoration) => decoration.id === id);
      if (item && ownedDecorations.includes(id) && !occupiedSlots.has(item.slot)) {
        equippedDecorations.push(id);
        occupiedSlots.add(item.slot);
      }
    }

    return {
      ...INITIAL_PLAYER_PROGRESS,
      ...parsed,
      lifetimeEarnings: Number.isFinite(parsed.lifetimeEarnings) ? Math.max(0, Math.floor(parsed.lifetimeEarnings ?? 0)) : 0,
      completedOrders: Number.isFinite(parsed.completedOrders) ? Math.max(0, Math.floor(parsed.completedOrders ?? 0)) : 0,
      wallet: Number.isFinite(parsed.wallet)
        ? (
          Math.floor(parsed.wallet ?? 120000) === 0 &&
          (parsed.lifetimeEarnings ?? 0) === 0 &&
          (parsed.completedOrders ?? 0) === 0
            ? INITIAL_PLAYER_PROGRESS.wallet
            : Math.max(0, Math.floor(parsed.wallet ?? 120000))
        )
        : INITIAL_PLAYER_PROGRESS.wallet,
      ownedDecorations,
      equippedDecorations,
      difficulty: parsed.difficulty === 'EASY' || parsed.difficulty === 'HARD'
        ? parsed.difficulty
        : 'NORMAL',
    };
  } catch {
    return INITIAL_PLAYER_PROGRESS;
  }
}

export function savePlayerProgress(
  progress: PlayerProgress,
  storage?: Pick<Storage, 'setItem'>,
): void {
  if (!storage) return;
  try {
    storage.setItem('banh_trang_player_progress_v1', JSON.stringify(progress));
  } catch {
    // Browser storage may be unavailable.
  }
}
