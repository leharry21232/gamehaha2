import type { CityDistrictId } from './types';

export interface VendorLocation {
  id: CityDistrictId;
  name: string;
  rentPerDay: number;
  customerTraffic: 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH';
  competition: 'LOW' | 'MEDIUM' | 'HIGH';
  orderMultiplier: number;
  incidentMultiplier: number;
  description: string;
  unlockLevel: number;
}

export const VENDOR_LOCATIONS: readonly VendorLocation[] = [
  { id: 'CONG_VIEN', name: 'Công viên 23/9', rentPerDay: 15000, customerTraffic: 'MEDIUM', competition: 'LOW', orderMultiplier: 0.95, incidentMultiplier: 0.8, description: 'Khách ổn định, ít cạnh tranh, phù hợp người mới.', unlockLevel: 1 },
  { id: 'DAI_HOC', name: 'Khu đại học', rentPerDay: 20000, customerTraffic: 'HIGH', competition: 'MEDIUM', orderMultiplier: 1.05, incidentMultiplier: 1, description: 'Đông sinh viên, khách nhạy cảm với giá.', unlockLevel: 1 },
  { id: 'CHO_BEN_THANH', name: 'Chợ Bến Thành', rentPerDay: 30000, customerTraffic: 'VERY_HIGH', competition: 'HIGH', orderMultiplier: 1.15, incidentMultiplier: 1.15, description: 'Lượng khách lớn, cạnh tranh và chi phí cao.', unlockLevel: 1 },
  { id: 'NGA_TU', name: 'Ngã tư Hàng Xanh', rentPerDay: 22000, customerTraffic: 'HIGH', competition: 'MEDIUM', orderMultiplier: 1.1, incidentMultiplier: 1.1, description: 'Nhiều người qua lại, nhịp bán hàng nhanh.', unlockLevel: 1 },
  { id: 'PHO_DI_BO', name: 'Phố đi bộ Nguyễn Huệ', rentPerDay: 35000, customerTraffic: 'VERY_HIGH', competition: 'HIGH', orderMultiplier: 1.25, incidentMultiplier: 1.3, description: 'Đông khách vào buổi tối nhưng chi phí và rủi ro cao.', unlockLevel: 1 },
] as const;

export function getVendorLocation(id: string): VendorLocation {
  return VENDOR_LOCATIONS.find((location) => location.id === id) ?? VENDOR_LOCATIONS[0];
}

export function canChangeVendorLocation(screen: string): boolean {
  return screen === 'TITLE_MENU' || screen === 'END_OF_DAY';
}

export type MajorGameSystem =
  | 'WORLD'
  | 'BUSINESS'
  | 'ECONOMY'
  | 'STAFF'
  | 'PROGRESSION'
  | 'SIDE_ACTIVITIES';

export interface SystemUnlock {
  system: MajorGameSystem;
  minimumLevel: number;
  requiresStaff: boolean;
}

export const SYSTEM_UNLOCKS: readonly SystemUnlock[] = [
  { system: 'WORLD', minimumLevel: 1, requiresStaff: false },
  { system: 'BUSINESS', minimumLevel: 1, requiresStaff: false },
  { system: 'ECONOMY', minimumLevel: 1, requiresStaff: false },
  { system: 'PROGRESSION', minimumLevel: 1, requiresStaff: false },
  { system: 'STAFF', minimumLevel: 5, requiresStaff: false },
  { system: 'SIDE_ACTIVITIES', minimumLevel: 5, requiresStaff: true },
] as const;

export function isSystemUnlocked(system: MajorGameSystem, level: number, hasStaff: boolean): boolean {
  const rule = SYSTEM_UNLOCKS.find((item) => item.system === system);
  return Boolean(rule && level >= rule.minimumLevel && (!rule.requiresStaff || hasStaff));
}

export type WorldActivityId = 'TAROT' | 'LOTTERY' | 'STOCKS';

export interface WorldActivity {
  id: WorldActivityId;
  name: string;
  icon: string;
  x: number;
  y: number;
  description: string;
  unlockLevel: number;
  requiresStaff: boolean;
}

export const WORLD_ACTIVITIES: readonly WorldActivity[] = [
  { id: 'TAROT', name: 'Góc bói Tarot', icon: '🔮', x: 18, y: 49, description: 'Gặp cô bói bài và thử vận may.', unlockLevel: 5, requiresStaff: true },
  { id: 'LOTTERY', name: 'Quầy vé số', icon: '🎟️', x: 50, y: 25, description: 'Thử vận may với những tấm vé số.', unlockLevel: 5, requiresStaff: true },
  { id: 'STOCKS', name: 'Bảng chứng khoán', icon: '📈', x: 84, y: 54, description: 'Theo dõi thị trường và thử đầu tư.', unlockLevel: 5, requiresStaff: true },
] as const;

export function canUseWorldActivity(activity: WorldActivity, level: number, totalStaff: number): boolean {
  return level >= activity.unlockLevel && (!activity.requiresStaff || totalStaff > 0);
}

export function findNearbyWorldActivity(
  x: number,
  y: number,
  activities: readonly WorldActivity[] = WORLD_ACTIVITIES,
  radius = 14,
): WorldActivity | null {
  return activities.find((activity) => Math.hypot(x - activity.x, y - activity.y) <= radius) ?? null;
}

export interface WorldLandmark {
  id: string;
  name: string;
  kind: 'PARK' | 'MARKET' | 'FOOD_STALL' | 'SIDEWALK' | 'ROAD';
  x: number;
  y: number;
  width: number;
  height: number;
}

export const WORLD_LANDMARKS: readonly WorldLandmark[] = [
  { id: 'park', name: 'Công viên nhỏ', kind: 'PARK', x: 2, y: 8, width: 25, height: 27 },
  { id: 'market', name: 'Dãy cửa hàng', kind: 'MARKET', x: 31, y: 7, width: 37, height: 25 },
  { id: 'food-stall', name: 'Xe bánh tráng', kind: 'FOOD_STALL', x: 68, y: 30, width: 26, height: 28 },
  { id: 'sidewalk-top', name: 'Vỉa hè phía trên', kind: 'SIDEWALK', x: 4, y: 35, width: 92, height: 9 },
  { id: 'main-road', name: 'Đường phố', kind: 'ROAD', x: 3, y: 46, width: 94, height: 34 },
  { id: 'sidewalk-bottom', name: 'Vỉa hè phía dưới', kind: 'SIDEWALK', x: 4, y: 82, width: 92, height: 12 },
] as const;

export interface PedestrianRoute {
  id: string;
  emoji: string;
  label: string;
  animation: 'walk-east' | 'walk-west' | 'walk-short';
  top: string;
  delay: string;
}

export const PEDESTRIAN_ROUTES: readonly PedestrianRoute[] = [
  { id: 'student', emoji: '🎒', label: 'Sinh viên', animation: 'walk-east', top: '39%', delay: '0s' },
  { id: 'office', emoji: '👜', label: 'Nhân viên văn phòng', animation: 'walk-west', top: '84%', delay: '-3s' },
  { id: 'shipper', emoji: '🛵', label: 'Shipper', animation: 'walk-short', top: '62%', delay: '-5s' },
  { id: 'local', emoji: '🧍🏻‍♀️', label: 'Người đi đường', animation: 'walk-east', top: '88%', delay: '-8s' },
] as const;

export type NeighborhoodDayPart = 'MORNING' | 'NOON' | 'AFTERNOON';

export interface NeighborhoodEvent {
  dayPart: NeighborhoodDayPart;
  dayPartLabel: string;
  title: string;
  description: string;
  trafficLabel: string;
}

const NEIGHBORHOOD_EVENTS: Record<NeighborhoodDayPart, readonly Pick<NeighborhoodEvent, 'title' | 'description'>[]> = {
  MORNING: [
    { title: 'Phố bắt đầu thức giấc', description: 'Cô Sáu đang bày hoa, Tí tranh thủ nhận những đơn giao đầu tiên trong ngày.' },
    { title: 'Tiếng rao đầu ngõ', description: 'Các sạp hàng vừa mở cửa. Người đi làm và sinh viên bắt đầu qua lại đông hơn.' },
  ],
  NOON: [
    { title: 'Giờ nghỉ trưa', description: 'Quán nước chú Ba có thêm khách ghé nghỉ chân, tiếng trò chuyện rộn ràng bên vỉa hè.' },
    { title: 'Chợ trưa nhộn nhịp', description: 'Cổng chợ đông người mua bán. Chú Bảy nhắc mọi người chừa lối cho xe qua.' },
  ],
  AFTERNOON: [
    { title: 'Phố dịu lại', description: 'Bà Tư ngồi hóng mát trước hiên, vài người hàng xóm dừng lại hỏi thăm nhau.' },
    { title: 'Chuẩn bị tan tầm', description: 'Tí kiểm tra chuyến giao cuối buổi, các cửa tiệm bắt đầu chuẩn bị cho giờ đông khách.' },
  ],
};

export function getNeighborhoodEvent(day: number, dayTimeLeft: number, dayDuration: number): NeighborhoodEvent {
  const safeDuration = Math.max(1, Number.isFinite(dayDuration) ? dayDuration : 1);
  const safeTimeLeft = Math.min(safeDuration, Math.max(0, Number.isFinite(dayTimeLeft) ? dayTimeLeft : safeDuration));
  const elapsedRatio = 1 - safeTimeLeft / safeDuration;
  const dayPart: NeighborhoodDayPart = elapsedRatio < 1 / 3
    ? 'MORNING'
    : elapsedRatio < 2 / 3
      ? 'NOON'
      : 'AFTERNOON';
  const events = NEIGHBORHOOD_EVENTS[dayPart];
  const dayIndex = Math.max(1, Math.floor(Number.isFinite(day) ? day : 1)) - 1;
  const event = events[dayIndex % events.length];
  const dayPartLabel = dayPart === 'MORNING' ? 'BUỔI SÁNG' : dayPart === 'NOON' ? 'BUỔI TRƯA' : 'BUỔI CHIỀU';
  const trafficLabel = dayPart === 'MORNING' ? 'Phố đang đông dần' : dayPart === 'NOON' ? 'Nhộn nhịp giờ trưa' : 'Nhịp phố chậm lại';

  return { dayPart, dayPartLabel, title: event.title, description: event.description, trafficLabel };
}


export interface WorldPosition {
  x: number;
  y: number;
}

export const WORLD_PLAYER_SPEED = { x: 12, y: 7.2 } as const;

export function getWorldMovementDelta(inputX: number, inputY: number, elapsedSeconds: number): WorldPosition {
  const x = Number.isFinite(inputX) ? Math.max(-1, Math.min(1, inputX)) : 0;
  const y = Number.isFinite(inputY) ? Math.max(-1, Math.min(1, inputY)) : 0;
  const magnitude = Math.hypot(x, y);
  const seconds = Number.isFinite(elapsedSeconds) ? Math.max(0, Math.min(0.05, elapsedSeconds)) : 0;
  if (magnitude === 0 || seconds === 0) return { x: 0, y: 0 };
  return {
    x: (x / magnitude) * WORLD_PLAYER_SPEED.x * seconds,
    y: (y / magnitude) * WORLD_PLAYER_SPEED.y * seconds,
  };
}

export interface WorldInteractable {
  id: 'cart' | 'grocery' | 'snack_shop' | 'drink_stall' | 'market_stall' | 'co_nam' | 'co_sau' | 'shipper_ti' | 'chu_bay' | 'ba_tu';
  name: string;
  x: number;
  y: number;
  radius: number;
  kind: 'BUSINESS' | 'NPC';
  description: string;
  interactionText: string;
}

export const WORLD_WALKABLE_BOUNDS = {
  minX: 4,
  maxX: 96,
  minY: 33,
  maxY: 56,
} as const;

// Percent-based collision rectangles match the neighborhood SVG's viewBox.
export const WORLD_COLLISION_RECTS = [
  { id: 'left_tree', x: 0, y: 34, width: 7, height: 15 },
  { id: 'cart', x: 14, y: 32, width: 20, height: 22 },
  { id: 'drink_stall', x: 57, y: 31, width: 15, height: 21 },
  { id: 'right_tree', x: 86, y: 33, width: 7, height: 15 },
] as const;

export const WORLD_INTERACTABLES: readonly WorldInteractable[] = [
  {
    id: 'cart',
    name: 'Xe bánh tráng',
    x: 36,
    y: 48,
    radius: 9,
    kind: 'BUSINESS',
    description: 'Chiếc xe bánh tráng của bạn. Đây là nơi bắt đầu một ca bán hàng.',
    interactionText: 'Bạn đã đến xe bánh tráng. Nhấn E để quay lại khu chuẩn bị và bắt đầu bán hàng.',
  },
  {
    id: 'grocery',
    name: 'Tạp hóa đầu ngõ',
    x: 12,
    y: 33,
    radius: 7,
    kind: 'BUSINESS',
    description: 'Tiệm tạp hóa nhỏ ở đầu dãy phố, do cô chủ tiệm vui tính trông coi.',
    interactionText: 'Cô chủ tiệm: “Mới dọn xe ra bán hả con? Cứ xem giá kỹ rồi hãy lấy hàng, bán buôn phải tính từng đồng đó nghen!”',
  },
  {
    id: 'snack_shop',
    name: 'Sạp ăn vặt',
    x: 38,
    y: 33,
    radius: 7,
    kind: 'BUSINESS',
    description: 'Sạp đồ ăn vặt thơm mùi bánh nướng và đồ ăn buổi sáng.',
    interactionText: 'Chủ sạp: “Buổi sáng khách đông lắm đó. Bán ngon, giữ giá dễ chịu là khách nhớ mặt liền!”',
  },
  {
    id: 'drink_stall',
    name: 'Quán nước chú Ba',
    x: 74,
    y: 48,
    radius: 8,
    kind: 'BUSINESS',
    description: 'Quán nước nhỏ cạnh vỉa hè, nơi người trong xóm thường dừng chân trò chuyện.',
    interactionText: 'Chú Ba: “Đường này sáng nào cũng đông. Con cứ bán từ từ, làm có tâm thì khách sẽ quay lại.”',
  },
  {
    id: 'market_stall',
    name: 'Cổng chợ',
    x: 84,
    y: 33,
    radius: 8,
    kind: 'BUSINESS',
    description: 'Lối vào dãy sạp chợ. Người mua bán bắt đầu nhộn nhịp từ sáng sớm.',
    interactionText: 'Tiếng loa chợ vang lên: “Chợ đã mở cửa! Bà con mua bán nhớ giữ lối đi thông thoáng nhé!”',
  },
  {
    id: 'co_nam',
    name: 'Cô Năm hàng xóm',
    x: 56,
    y: 55,
    radius: 7,
    kind: 'NPC',
    description: 'Một người hàng xóm thân thiện đang quan sát xe bánh tráng mới mở.',
    interactionText: 'Cô Năm: “Xe mới nhìn sạch sẽ đó. Nhớ chào khách và đừng để người ta phải chờ lâu nghe con!”',
  },
  {
    id: 'co_sau',
    name: 'Cô Sáu bán hoa',
    x: 7,
    y: 54,
    radius: 7,
    kind: 'NPC',
    description: 'Cô Sáu bán hoa ở góc vỉa hè, lúc nào cũng vui vẻ và hay để ý chuyện trong xóm.',
    interactionText: 'Cô Sáu: “Sáng nay hoa cúc đẹp lắm con. Mở hàng nhớ cười tươi, người ta thấy vui thì dễ ghé lại lắm!”',
  },
  {
    id: 'shipper_ti',
    name: 'Tí giao hàng',
    x: 51,
    y: 35,
    radius: 7,
    kind: 'NPC',
    description: 'Tí là shipper trẻ thường dừng lại đầu phố để xem đơn giao trong ngày.',
    interactionText: 'Tí: “Em chạy đơn quanh mấy con hẻm này suốt. Quán nào làm nhanh, gói gọn là khách đặt lại liền anh ơi!”',
  },
  {
    id: 'chu_bay',
    name: 'Chú Bảy sửa xe',
    x: 80,
    y: 54,
    radius: 7,
    kind: 'NPC',
    description: 'Chú Bảy sửa xe lâu năm, thường ngồi trước tiệm nhìn dòng người qua lại.',
    interactionText: 'Chú Bảy: “Xe cộ chạy ngoài đường đông lắm. Con kê xe gọn vào lề, chừa lối cho bà con đi nghen!”',
  },
  {
    id: 'ba_tu',
    name: 'Bà Tư hàng xóm',
    x: 93,
    y: 53,
    radius: 7,
    kind: 'NPC',
    description: 'Bà Tư sống ở cuối dãy phố, thích trò chuyện và cập nhật tin tức khu xóm.',
    interactionText: 'Bà Tư: “Ở xóm này người ta quý nhau cái tình. Con bán đàng hoàng, giữ vệ sinh là bà con thương thôi!”',
  },
] as const;

export type NeighborhoodDialogueLocationId = Exclude<WorldInteractable['id'], 'cart'>;

interface NeighborhoodDialogueEntry {
  firstVisit: string;
  returnVisit: string;
  dayPart: Record<NeighborhoodDayPart, string>;
}

// Conversation is presentation-only. Visit counts live in React session state and are not saved.
const NEIGHBORHOOD_DIALOGUES: Record<NeighborhoodDialogueLocationId, NeighborhoodDialogueEntry> = {
  grocery: {
    firstVisit: 'Cô chủ tiệm: “Mới dọn xe ra bán hả con? Cứ xem giá kỹ rồi hãy lấy hàng, bán buôn phải tính từng đồng đó nghen!”',
    returnVisit: 'Cô chủ tiệm: “Lại ghé nữa hả? Có món nào sắp hết thì ghi ra giấy, đi một vòng mua đủ sẽ đỡ mất công chạy tới chạy lui.”',
    dayPart: { MORNING: 'Sáng nay cô vừa nhập thêm mấy thùng nước, hàng mới còn xếp ở trong.', NOON: 'Trưa rồi, cô đang tranh thủ kiểm lại sổ hàng trước khi khách đông.', AFTERNOON: 'Chiều xuống cô thường chốt lại món nào bán chạy để mai lấy thêm.' },
  },
  snack_shop: {
    firstVisit: 'Chủ sạp: “Bên này toàn món ăn vặt quen thuộc thôi. Khách nhớ một sạp nhỏ nhiều khi vì cái vị thân quen chứ chẳng cần cầu kỳ đâu!”',
    returnVisit: 'Chủ sạp: “Lại gặp em rồi! Hôm nay có mẻ bánh mới, thơm tới tận đầu ngõ luôn đó.”',
    dayPart: { MORNING: 'Mẻ bánh đầu ngày vừa ra lò, còn nóng giòn.', NOON: 'Giờ này mấy bạn học sinh, sinh viên hay ghé mua món ăn lót dạ.', AFTERNOON: 'Xế chiều là lúc sạp đông nhất, ai đi ngang cũng muốn ăn chút gì.' },
  },
  drink_stall: {
    firstVisit: 'Chú Ba: “Ngồi nghỉ chân chút không con? Bán hàng cả buổi nhớ uống nước, đừng mải lo cho khách rồi quên mình.”',
    returnVisit: 'Chú Ba: “Quen mặt rồi nghen! Có chuyện gì ở khu này cứ hỏi, chú ngồi đây nhìn phố từ sáng tới chiều mà.”',
    dayPart: { MORNING: 'Sáng chú hay pha trà nóng, mấy cô chú đi chợ ghé làm một ly.', NOON: 'Trưa nắng, khách tìm bóng mát với ly nước mát nhiều hơn hẳn.', AFTERNOON: 'Tầm này dân tan làm bắt đầu ghé uống nước, kể chuyện cuối ngày.' },
  },
  market_stall: {
    firstVisit: 'Tiếng loa chợ: “Bà con đi chợ nhớ coi kỹ hàng, hỏi giá trước khi mua và nhường lối cho người phía sau nhé!”',
    returnVisit: 'Tiếng loa chợ: “Quý khách lại ghé chợ. Các sạp vẫn mở cửa, bà con mua bán vui vẻ và giữ gìn vệ sinh chung!”',
    dayPart: { MORNING: 'Các sạp rau và đồ tươi vừa bày hàng, người đi chợ đang lựa món cho bữa nhà.', NOON: 'Chợ thưa khách hơn một chút, tiểu thương tranh thủ ăn trưa và sắp lại quầy.', AFTERNOON: 'Người tan ca ghé mua đồ cho bữa tối, lối vào chợ lại rộn ràng.' },
  },
  co_nam: {
    firstVisit: 'Cô Năm: “Cô ở xóm này lâu rồi, có gì chưa quen cứ hỏi cô. Mới bắt đầu làm ăn thì cứ từ tốn, đừng nóng ruột nghe con.”',
    returnVisit: 'Cô Năm: “Con lại đi thăm bà con trong xóm đó hả? Nhớ giữ sức, làm ăn lâu dài quan trọng hơn một buổi đông khách.”',
    dayPart: { MORNING: 'Cô vừa tưới mấy chậu cây trước hiên, nghe tiếng xe con là biết con bắt đầu ngày mới.', NOON: 'Cô đang tránh nắng trong hiên, thấy con ghé thì vui vì xóm mình có người qua lại hỏi thăm.', AFTERNOON: 'Cô đang quét sân, chiều nào cũng thích ngồi nhìn bà con đi làm về.' },
  },
  co_sau: {
    firstVisit: 'Cô Sáu: “Cô bán hoa ở góc này quen rồi. Hoa đẹp thì vui mắt, nhưng người bán vui vẻ mới khiến khách muốn quay lại con à!”',
    returnVisit: 'Cô Sáu: “Lại ghé thăm cô hả? Hôm nào rảnh đứng ngắm hoa một chút, nhìn màu sắc tươi tắn tự nhiên thấy nhẹ lòng.”',
    dayPart: { MORNING: 'Cô đang tỉa lại mấy cành cúc mới nhập, bông nào cũng còn đẫm sương.', NOON: 'Cô chuyển mấy chậu hoa vào chỗ râm để tránh nắng gắt.', AFTERNOON: 'Cô đang bó những bó hoa cuối ngày cho khách ghé mua mang về.' },
  },
  shipper_ti: {
    firstVisit: 'Tí: “Em chạy giao hàng quanh mấy con hẻm này nè. Địa chỉ càng rõ, gói đồ càng gọn thì người nhận càng vui!”',
    returnVisit: 'Tí: “Anh/chị lại đây à? Em thuộc gần hết đường trong khu này rồi, hẻm nào đông xe em cũng biết giờ né.”',
    dayPart: { MORNING: 'Em đang gom đơn đầu ngày, tranh thủ giao trước khi đường đông.', NOON: 'Trưa nắng chạy xe mệt lắm, em tranh thủ nghỉ vài phút rồi đi tiếp.', AFTERNOON: 'Đơn cuối buổi đang tới, em cố giao xong trước giờ đường đông nghẹt.' },
  },
  chu_bay: {
    firstVisit: 'Chú Bảy: “Đồ đạc hư thì sửa được, chứ chạy xe ẩu dễ nguy hiểm lắm. Con kê xe gọn, chừa lối cho người ta đi nghen!”',
    returnVisit: 'Chú Bảy: “Lại ghé chơi hả? Có tiếng động lạ thì đem chú coi, đừng để hư nặng rồi mới sửa.”',
    dayPart: { MORNING: 'Chú đang bơm bánh cho khách đi làm, đầu ngày ai cũng vội.', NOON: 'Nắng trưa làm chú nghỉ tay một chút, chiều mát mới sửa tiếp.', AFTERNOON: 'Giờ tan tầm xe cộ đông, chú kiểm tra phanh với đèn cho khách trước khi về.' },
  },
  ba_tu: {
    firstVisit: 'Bà Tư: “Ở xóm này quý nhất là biết hỏi thăm nhau. Con buôn bán đàng hoàng, gặp ai cũng vui vẻ thì bà con thương thôi.”',
    returnVisit: 'Bà Tư: “Con lại ghé đó à? Có chuyện vui buồn gì cứ kể bà nghe, cuối ngõ này lúc nào cũng có người ngồi hóng chuyện.”',
    dayPart: { MORNING: 'Bà đang chuẩn bị đi chợ, còn dặn mấy nhà gần đây nhớ khóa cửa cẩn thận.', NOON: 'Bà vừa ăn cơm xong, ngồi nghỉ dưới mái hiên tránh nắng.', AFTERNOON: 'Bà đem ghế ra trước cửa hóng gió, chờ con cháu đi học đi làm về.' },
  },
};

export function isNeighborhoodDialogueLocationId(id: WorldInteractable['id']): id is NeighborhoodDialogueLocationId {
  return id !== 'cart';
}

export function getNeighborhoodDialogue(locationId: NeighborhoodDialogueLocationId, dayPart: NeighborhoodDayPart, visitCount = 0): string {
  const dialogue = NEIGHBORHOOD_DIALOGUES[locationId];
  const greeting = visitCount <= 0 ? dialogue.firstVisit : dialogue.returnVisit;
  return greeting + ' ' + dialogue.dayPart[dayPart];
}

function isInsideWorldCollision(position: WorldPosition, padding = 1.2): boolean {
  return WORLD_COLLISION_RECTS.some((rect) =>
    position.x + padding > rect.x &&
    position.x - padding < rect.x + rect.width &&
    position.y + padding > rect.y &&
    position.y - padding < rect.y + rect.height
  );
}

export function isWorldPositionWalkable(position: WorldPosition): boolean {
  return position.x >= WORLD_WALKABLE_BOUNDS.minX &&
    position.x <= WORLD_WALKABLE_BOUNDS.maxX &&
    position.y >= WORLD_WALKABLE_BOUNDS.minY &&
    position.y <= WORLD_WALKABLE_BOUNDS.maxY &&
    !isInsideWorldCollision(position);
}

export function moveWorldPlayer(
  position: WorldPosition,
  deltaX: number,
  deltaY: number,
): WorldPosition {
  const nextX = Math.max(WORLD_WALKABLE_BOUNDS.minX, Math.min(WORLD_WALKABLE_BOUNDS.maxX, position.x + deltaX));
  const nextY = Math.max(WORLD_WALKABLE_BOUNDS.minY, Math.min(WORLD_WALKABLE_BOUNDS.maxY, position.y + deltaY));

  const horizontal = { x: nextX, y: position.y };
  const afterHorizontal = isInsideWorldCollision(horizontal) ? position.x : horizontal.x;
  const vertical = { x: afterHorizontal, y: nextY };
  const afterVertical = isInsideWorldCollision(vertical) ? position.y : vertical.y;

  return { x: afterHorizontal, y: afterVertical };
}

export function findNearbyWorldLocation(
  x: number,
  y: number,
  locations: readonly WorldInteractable[] = WORLD_INTERACTABLES,
): WorldInteractable | null {
  let nearest: WorldInteractable | null = null;
  let nearestDistance = Number.POSITIVE_INFINITY;

  for (const location of locations) {
    const distance = Math.hypot(x - location.x, y - location.y);
    if (distance <= location.radius && distance < nearestDistance) {
      nearest = location;
      nearestDistance = distance;
    }
  }

  return nearest;
}


// One-time, optional neighborhood conversation. This is presentation-only: it has no gameplay payload.
export const CURIOUS_CART_VISITOR_EVENT = {
  id: 'curious_cart_visitor',
  title: 'Một vị khách tò mò',
  dialogue: 'Một bạn trẻ dừng xe trước quầy: “Ủa, xe bánh tráng mới mở hả? Nhìn topping hấp dẫn ghê! Bạn mới bán ở khu này phải không?” Bạn mỉm cười: “Ừ, mình mới bắt đầu. Khi nào thèm thì ghé ủng hộ nha!” Người khách gật đầu rồi tiếp tục đi dạo quanh phố.',
} as const;

export type NeighborhoodHelpQuestStatus = 'AVAILABLE' | 'ACCEPTED' | 'COMPLETED';
export type NeighborhoodHelpQuestAction = 'OFFER' | 'REMIND' | 'DELIVER' | 'DIALOGUE';

export const NEIGHBORHOOD_HELP_QUEST = {
  id: 'neighbor_message_for_co_sau',
  title: 'Lời nhắn của Chú Bảy',
  giverId: 'chu_bay',
  targetId: 'co_sau',
  offerDialogue: 'Chú Bảy: “Chú vừa sửa xong chiếc xe đạp cho Cô Sáu bán hoa. Con tiện ghé qua thì nhắn cô ấy biết xe đã sửa xong, khi nào rảnh ghé lấy giúp chú nha?”',
  acceptedDialogue: 'Chú Bảy: “Cảm ơn con nghen! Con gặp Cô Sáu thì nhắn cô ấy chiếc xe đạp đã sửa xong rồi, cứ ghé chú lấy bất cứ lúc nào.”',
  reminderDialogue: 'Chú Bảy: “Nếu gặp Cô Sáu thì con nhắn giúp chú chuyện chiếc xe đạp đã sửa xong nha!”',
  completedDialogue: 'Cô Sáu: “À, chú Bảy sửa xong xe rồi hả con? Cảm ơn con đã ghé báo tin nghen! Có dịp cô sẽ ghé xe bánh tráng ủng hộ.”',
  objective: 'Ghé gặp Cô Sáu bán hoa và chuyển lời nhắn của Chú Bảy.',
} as const;

export function getNeighborhoodHelpQuestAction(
  npcId: WorldInteractable['id'],
  status: NeighborhoodHelpQuestStatus,
): NeighborhoodHelpQuestAction {
  if (npcId === NEIGHBORHOOD_HELP_QUEST.giverId) {
    return status === 'AVAILABLE' ? 'OFFER' : status === 'ACCEPTED' ? 'REMIND' : 'DIALOGUE';
  }
  if (npcId === NEIGHBORHOOD_HELP_QUEST.targetId && status === 'ACCEPTED') return 'DELIVER';
  return 'DIALOGUE';
}

export type NeighborhoodParcelQuestStatus = 'AVAILABLE' | 'ACCEPTED' | 'COMPLETED';
export type NeighborhoodParcelQuestAction = 'OFFER' | 'REMIND' | 'DELIVER' | 'DIALOGUE';

export const NEIGHBORHOOD_PARCEL_QUEST = {
  id: 'last_delivery_for_ba_tu',
  title: 'Chuyến hàng cuối ngõ',
  giverId: 'shipper_ti',
  targetId: 'ba_tu',
  offerDialogue: 'Tí: “Anh/chị ơi, em còn một gói hàng của Bà Tư mà sắp trễ chuyến. Bà ở cuối ngõ kia, anh/chị ghé báo giúp em là em sẽ mang hàng tới ngay được không?”',
  acceptedDialogue: 'Tí: “May quá, cảm ơn anh/chị! Em sẽ tranh thủ chạy qua ngay sau khi giao xong đơn này.”',
  reminderDialogue: 'Tí: “Nếu gặp Bà Tư, anh/chị nhắn giúp em là gói hàng sắp được giao tới nha!”',
  completedDialogue: 'Bà Tư: “Tí vừa gọi báo rồi, cảm ơn con đã nhắn giúp. Có người trong xóm hỗ trợ nhau vậy vui ghê!”',
  objective: 'Ghé gặp Bà Tư và báo gói hàng của Tí sắp được giao tới.',
} as const;

export function getNeighborhoodParcelQuestAction(
  npcId: WorldInteractable['id'],
  status: NeighborhoodParcelQuestStatus,
): NeighborhoodParcelQuestAction {
  if (npcId === NEIGHBORHOOD_PARCEL_QUEST.giverId) {
    return status === 'AVAILABLE' ? 'OFFER' : status === 'ACCEPTED' ? 'REMIND' : 'DIALOGUE';
  }
  if (npcId === NEIGHBORHOOD_PARCEL_QUEST.targetId && status === 'ACCEPTED') return 'DELIVER';
  return 'DIALOGUE';
}

// After a side quest is complete, its giver and recipient acknowledge the player's help.
export function getNeighborhoodQuestFollowUpDialogue(
  npcId: WorldInteractable['id'],
  helpStatus: NeighborhoodHelpQuestStatus,
  parcelStatus: NeighborhoodParcelQuestStatus,
): string | null {
  if (helpStatus === 'COMPLETED') {
    if (npcId === NEIGHBORHOOD_HELP_QUEST.giverId) {
      return 'Chú Bảy: “Cô Sáu ghé lấy xe rồi, chú cảm ơn con đã chuyển lời giúp chú nghen!”';
    }
    if (npcId === NEIGHBORHOOD_HELP_QUEST.targetId) {
      return 'Cô Sáu: “Nhờ con báo tin mà cô lấy được xe rồi. Bữa nào cô ghé mua bánh tráng ủng hộ con nha!”';
    }
  }

  if (parcelStatus === 'COMPLETED') {
    if (npcId === NEIGHBORHOOD_PARCEL_QUEST.giverId) {
      return 'Tí: “Bà Tư nhận được tin rồi, cảm ơn anh/chị đã giúp em nha. Em chạy đơn tiếp đây!”';
    }
    if (npcId === NEIGHBORHOOD_PARCEL_QUEST.targetId) {
      return 'Bà Tư: “Tí giao hàng tới rồi con. Nhờ con báo tin trước nên bà đỡ phải chờ lâu, cảm ơn con nghen!”';
    }
  }

  return null;
}
