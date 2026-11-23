/**
 * Cấu hình bảng màu, kích thước bản đồ pixel art Sài Gòn và các thông số có thể tinh chỉnh.
 * Giữ tối đa ~24 màu chủ đạo ấm áp, nhất quán theo phong cách pixel art 2D nhìn ngang.
 */

export type TimeOfDayLighting = 'morning' | 'noon' | 'afternoon' | 'evening';

/** Bảng màu giới hạn (~24 màu ấm Sài Gòn) dùng chung cho nhà, vỉa hè, đường, xe cộ và NPC */
export const SAIGON_PALETTE = {
  // Bầu trời & ánh sáng
  skyTop: '#6BA7B8',
  skyHorizon: '#F4CFA0',
  skyNightTop: '#161F33',
  skyNightHorizon: '#2B3654',

  // Nhà phố ống & mái tôn / gạch
  brickWall: '#B86446',
  brickShadow: '#8C4732',
  ochreWall: '#E6BA7A',
  creamWall: '#F2DCAD',
  mintWall: '#9EC5B2',
  roofRed: '#A84232',
  roofIron: '#68797E',
  woodDark: '#3A261D',
  woodMid: '#7B4F35',
  woodLight: '#C78F52',

  // Cây xanh & thiên nhiên
  leafDark: '#2F5F42',
  leafMid: '#4C8B52',
  leafLight: '#7EB863',

  // Vỉa hè gạch bông & đường nhựa
  tileLight: '#DFCFB0',
  tileMid: '#C7B28E',
  tileGrout: '#927D60',
  curbStone: '#8A8173',
  asphaltDark: '#3B4449',
  asphaltMid: '#4B555B',
  laneYellow: '#F3C85F',

  // Điểm nhấn biển hiệu, đèn lồng, bếp than
  signRed: '#C84436',
  signBlue: '#28649C',
  goldNeon: '#FFD15C',
  emberOrange: '#F0752E',
  smokeCream: '#EFE6D5',
  skinWarm: '#DFA77F',
  denimDark: '#2D3A4B',
} as const;

/** Kích thước thế giới logic & dải tỉ lệ dọc (nhà phố - vỉa hè - lòng đường) */
export const MAP_METRICS = {
  /** Tổng chiều rộng thế giới bản đồ tính bằng pixel ảo (tương ứng x = 0..100%) */
  streetPixelWidth: 440,
  /** Chiều cao chuẩn ở chế độ ngang/desktop */
  landscapeVirtualHeight: 256,
  /** Chiều cao chuẩn ở chế độ dọc trên điện thoại (giúp đường phố đầy màn hình, không dải hẹp) */
  portraitVirtualHeight: 288,
  /** Tỉ lệ chiều cao các tầng không gian (tổng = 1.0) */
  housesEndRatio: 0.35, // 0% -> 35%: dãy nhà phố ống 2 tầng + dây điện
  sidewalkEndRatio: 0.72, // 35% -> 72%: vỉa hè gạch bông (không gian chính)
  // 72% -> 100%: lòng đường nhựa (~28% chiều cao, vừa đủ xe chạy nhộn nhịp)

  /** Dải Y logic đi bộ trong world.ts (33..56) ánh xạ vào khoảng an toàn trên vỉa hè */
  walkableLogicalMinY: 33,
  walkableLogicalMaxY: 56,
  sidewalkScreenMinRatio: 0.43,
  sidewalkScreenMaxRatio: 0.69,
} as const;

/** Cấu hình tốc độ giao thông và mật độ hiệu ứng (dễ tinh chỉnh ở Bước 4) */
export const TUNING_CONFIG = {
  /** Hệ số tốc độ xe chạy trên đường (1.0 = mặc định, 1.3 = đông đúc hơn) */
  trafficSpeedMultiplier: 1.0,
  /** Số lượng phương tiện hoạt động đồng thời trên lòng đường */
  vehicleCount: 7,
  /** Số lượng hạt bụi / lá rơi / khói nhẹ (giữ thấp để đảm bảo 60fps trên mobile) */
  maxAmbientParticles: 26,
  /** Độ tối màn đêm (0.0 -> 0.55) */
  eveningDarknessAlpha: 0.42,
  /** Độ sáng quầng đèn đường & bảng hiệu ban đêm (0.0 -> 1.0) */
  eveningLampGlow: 0.88,
  /** Khoảng đệm tránh mép màn hình khi clamp nhãn tên NPC (px CSS) */
  nameplateClampPadding: 8,
} as const;

export interface LightingPreset {
  label: string;
  shortLabel: string;
  skyTop: string;
  skyBottom: string;
  tintColor: string;
  tintAlpha: number;
  shadowSkewX: number;
  shadowScaleY: number;
  lampsOn: boolean;
  mistAlpha: number;
}

export const LIGHTING_PRESETS: Record<TimeOfDayLighting, LightingPreset> = {
  morning: {
    label: 'BUỔI SÁNG',
    shortLabel: 'Sáng',
    skyTop: '#7DB9C9',
    skyBottom: '#F9DFB4',
    tintColor: '#FFE5B4',
    tintAlpha: 0.12,
    shadowSkewX: -0.35,
    shadowScaleY: 0.75,
    lampsOn: false,
    mistAlpha: 0.14,
  },
  noon: {
    label: 'BUỔI TRƯA',
    shortLabel: 'Trưa',
    skyTop: '#569FC2',
    skyBottom: '#F4DFB8',
    tintColor: '#FFF7D1',
    tintAlpha: 0.06,
    shadowSkewX: 0.05,
    shadowScaleY: 0.45,
    lampsOn: false,
    mistAlpha: 0,
  },
  afternoon: {
    label: 'BUỔI CHIỀU',
    shortLabel: 'Chiều',
    skyTop: '#7B7EA8',
    skyBottom: '#F29F63',
    tintColor: '#FF9B4B',
    tintAlpha: 0.18,
    shadowSkewX: 0.45,
    shadowScaleY: 0.9,
    lampsOn: false,
    mistAlpha: 0.04,
  },
  evening: {
    label: 'BUỔI TỐI',
    shortLabel: 'Tối',
    skyTop: '#161F33',
    skyBottom: '#2B3654',
    tintColor: '#121B33',
    tintAlpha: TUNING_CONFIG.eveningDarknessAlpha,
    shadowSkewX: 0.1,
    shadowScaleY: 0.6,
    lampsOn: true,
    mistAlpha: 0.05,
  },
};

export interface NpcVisualMeta {
  id: 'player' | 'co_sau' | 'co_nam' | 'shipper_ti' | 'chu_bay' | 'ba_tu';
  shortName: string;
  role: string;
  shirt: string;
  shirtShade: string;
  pants: string;
  hair: string;
  hatColor?: string;
  prop: 'NONE' | 'FLOWERS' | 'TRAY' | 'PARCEL' | 'WRENCH' | 'FAN';
}

export const NPC_VISUAL_META: Record<NpcVisualMeta['id'], NpcVisualMeta> = {
  player: {
    id: 'player',
    shortName: 'Bạn',
    role: 'Chủ xe bánh tráng',
    shirt: '#2E869E',
    shirtShade: '#1E5C6E',
    pants: '#2D3A4B',
    hair: '#29272B',
    hatColor: '#F3C85F',
    prop: 'NONE',
  },
  co_sau: {
    id: 'co_sau',
    shortName: 'Cô Sáu bán hoa',
    role: 'Người bán hoa góc ngõ',
    shirt: '#C86D8E',
    shirtShade: '#984766',
    pants: '#343D4D',
    hair: '#4B3228',
    prop: 'FLOWERS',
  },
  co_nam: {
    id: 'co_nam',
    shortName: 'Cô Năm hàng xóm',
    role: 'Hàng xóm thân thiện',
    shirt: '#CC6348',
    shirtShade: '#99412D',
    pants: '#34414B',
    hair: '#523A2E',
    prop: 'TRAY',
  },
  shipper_ti: {
    id: 'shipper_ti',
    shortName: 'Tí giao hàng',
    role: 'Shipper chạy đơn khu phố',
    shirt: '#288C9A',
    shirtShade: '#1B616C',
    pants: '#2D3A4B',
    hair: '#26282E',
    hatColor: '#F3C85F',
    prop: 'PARCEL',
  },
  chu_bay: {
    id: 'chu_bay',
    shortName: 'Chú Bảy sửa xe',
    role: 'Thợ sửa xe lâu năm',
    shirt: '#5A8152',
    shirtShade: '#3E5B38',
    pants: '#374046',
    hair: '#5A4A42',
    hatColor: '#D4B06A',
    prop: 'WRENCH',
  },
  ba_tu: {
    id: 'ba_tu',
    shortName: 'Bà Tư hàng xóm',
    role: 'Bà Tư cuối ngõ',
    shirt: '#8366A4',
    shirtShade: '#5C4578',
    pants: '#2E323D',
    hair: '#B8B0A6',
    prop: 'FAN',
  },
};
