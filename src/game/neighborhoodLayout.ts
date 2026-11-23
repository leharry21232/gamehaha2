/** Quy đổi tọa độ lối đi logic (33..56%) sang dải vỉa hè của bản đồ dọc. */
export const PORTRAIT_WORLD_LAYOUT = {
  logicalMinY: 33,
  logicalMaxY: 56,
  screenMinY: 43,
  screenMaxY: 62,
} as const;

export function getPortraitWorldTop(logicalY: number): number {
  const safeY = Math.max(
    PORTRAIT_WORLD_LAYOUT.logicalMinY,
    Math.min(PORTRAIT_WORLD_LAYOUT.logicalMaxY, Number.isFinite(logicalY) ? logicalY : PORTRAIT_WORLD_LAYOUT.logicalMinY),
  );
  const progress = (safeY - PORTRAIT_WORLD_LAYOUT.logicalMinY) /
    (PORTRAIT_WORLD_LAYOUT.logicalMaxY - PORTRAIT_WORLD_LAYOUT.logicalMinY);
  return PORTRAIT_WORLD_LAYOUT.screenMinY +
    progress * (PORTRAIT_WORLD_LAYOUT.screenMaxY - PORTRAIT_WORLD_LAYOUT.screenMinY);
}
