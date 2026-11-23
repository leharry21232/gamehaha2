import type { PlayerProgress } from './progression';

export interface StoryMissionSnapshot {
  id: string;
  chapter: string;
  title: string;
  description: string;
  npcName: string;
  storyText: string;
  progress: number;
  target: number;
  reward: number;
  completed: boolean;
  allCompleted: boolean;
}

type MissionDefinition = Omit<StoryMissionSnapshot, 'progress' | 'completed' | 'allCompleted'> & {
  objective: 'ORDERS' | 'EARNINGS' | 'LEVEL';
};

// Chapter 1 covers the player's first steps from a sidewalk cart to a stable small business.
// Keep mission IDs stable: they are persisted in each browser profile.
const STORY_MISSIONS: MissionDefinition[] = [
  {
    id: 'story_first_customers',
    chapter: 'Chương 1 · Xe đẩy đầu ngõ',
    title: 'Ba vị khách đầu tiên',
    description: 'Hoàn thành 3 đơn hàng để chứng minh xe bánh tráng của bạn có thể trụ vững.',
    npcName: 'Cô Sáu',
    storyText: '“Mới dọn ra bán hả con? Cứ làm ngon, sạch sẽ, khách quen sẽ tự tìm tới.”',
    objective: 'ORDERS',
    target: 3,
    reward: 15000,
  },
  {
    id: 'story_build_reputation',
    chapter: 'Chương 1 · Xe đẩy đầu ngõ',
    title: 'Gây dựng tiếng thơm',
    description: 'Đạt tổng doanh thu trọn đời 100.000đ. Đừng để khách phải chờ quá lâu nhé!',
    npcName: 'Anh shipper Tí',
    storyText: '“Quán đông là nhờ khách truyền miệng đó. Giữ chất lượng ổn định là có đơn đều!”',
    objective: 'EARNINGS',
    target: 100000,
    reward: 25000,
  },
  {
    id: 'story_level_three',
    chapter: 'Chương 1 · Xe đẩy đầu ngõ',
    title: 'Lên đời chủ quán',
    description: 'Đạt cấp độ 3 để mở thêm kỹ năng và chuẩn bị cho những thử thách lớn hơn.',
    npcName: 'Chú Bảy',
    storyText: '“Làm ăn có tâm thì sớm muộn cũng lên đời. Tới cấp 3 rồi, tính chuyện lớn hơn được đó!”',
    objective: 'LEVEL',
    target: 3,
    reward: 40000,
  },
  {
    id: 'story_chapter_one_mastery',
    chapter: 'Chương 1 · Xe đẩy đầu ngõ',
    title: 'Có chỗ đứng ở khu phố',
    description: 'Đạt cấp độ 5 để chứng minh xe bánh tráng đã trở thành một địa chỉ quen thuộc.',
    npcName: 'Bà Tư',
    storyText: '“Con đã tự đứng vững trên vỉa hè rồi. Giữ lấy cái tâm làm nghề, chặng đường phía trước còn dài lắm.”',
    objective: 'LEVEL',
    target: 5,
    reward: 60000,
  },
];

const STORAGE_KEY = 'banh_trang_tron_story_missions_v1';

export function loadCompletedMissionIds(storage?: Pick<Storage, 'getItem'>): string[] {
  try {
    const raw = storage?.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((id): id is string => typeof id === 'string' && STORY_MISSIONS.some((mission) => mission.id === id));
  } catch {
    return [];
  }
}

export function saveCompletedMissionIds(ids: string[], storage?: Pick<Storage, 'setItem'>): void {
  try {
    storage?.setItem(STORAGE_KEY, JSON.stringify([...new Set(ids)].filter((id) => STORY_MISSIONS.some((mission) => mission.id === id))));
  } catch {
    // Keep the game playable when browser storage is unavailable.
  }
}

export function getStoryMissionSnapshot(progress: PlayerProgress, completedIds: string[]): StoryMissionSnapshot {
  const completed = new Set(completedIds);
  const mission = STORY_MISSIONS.find((item) => !completed.has(item.id));
  if (!mission) {
    return {
      id: 'story_complete',
      chapter: 'Chương 1 · Hoàn thành',
      title: 'Một xe bánh tráng có tiếng',
      description: 'Bạn đã hoàn thành chương đầu tiên. Những câu chuyện mới sẽ được mở rộng ở bản cập nhật tiếp theo.',
      npcName: 'Cả xóm vỉa hè',
      storyText: '“Quán của bạn giờ đã có chỗ đứng. Nhưng Sài Gòn còn nhiều thử thách đang chờ phía trước…”',
      progress: 1,
      target: 1,
      reward: 0,
      completed: true,
      allCompleted: true,
    };
  }

  const value = mission.objective === 'ORDERS'
    ? progress.completedOrders
    : mission.objective === 'EARNINGS'
      ? progress.lifetimeEarnings
      : progress.level;
  return {
    id: mission.id,
    chapter: mission.chapter,
    title: mission.title,
    description: mission.description,
    npcName: mission.npcName,
    storyText: mission.storyText,
    progress: Math.min(mission.target, value),
    target: mission.target,
    reward: mission.reward,
    completed: value >= mission.target,
    allCompleted: false,
  };
}

export function claimStoryMissionReward(
  progress: PlayerProgress,
  completedIds: string[],
): { completedIds: string[]; reward: number } | null {
  const snapshot = getStoryMissionSnapshot(progress, completedIds);
  if (!snapshot.completed || snapshot.allCompleted) return null;
  return {
    completedIds: [...completedIds, snapshot.id],
    reward: snapshot.reward,
  };
}
