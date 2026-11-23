import type { Rect } from './layout';
import type { Point2D } from './types';

export interface CutGuide {
  index: number;
  a: Point2D;
  b: Point2D;
  mid: Point2D;
  /** Đoạn cắt kéo dài nhẹ qua mép cuộn bánh để splitPolygonBySegment luôn cắt dứt khoát */
  cutA: Point2D;
  cutB: Point2D;
}

/**
 * Tạo N - 1 đường hướng dẫn cắt chia đều theo chiều dài của hình chữ nhật cuộn bánh.
 * - pieces <= 1: trả về [] (không cần cắt).
 * - pieces = 4: trả về 3 đường chia đều 1/4, 2/4, 3/4 vuông góc với cạnh dài.
 */
export function buildCutGuides(rect: Rect, pieces: number): CutGuide[] {
  const target = Math.floor(pieces);
  if (target <= 1 || rect.w <= 0 || rect.h <= 0) {
    return [];
  }

  const guides: CutGuide[] = [];
  const isHorizontalLong = rect.w >= rect.h;
  const overhang = 22;

  for (let i = 1; i < target; i++) {
    const t = i / target;
    if (isHorizontalLong) {
      const gx = rect.x + rect.w * t;
      const a: Point2D = { x: gx, y: rect.y - 4 };
      const b: Point2D = { x: gx, y: rect.y + rect.h + 4 };
      guides.push({
        index: i - 1,
        a,
        b,
        mid: { x: gx, y: rect.y + rect.h * 0.5 },
        cutA: { x: gx, y: rect.y - overhang },
        cutB: { x: gx, y: rect.y + rect.h + overhang },
      });
    } else {
      const gy = rect.y + rect.h * t;
      const a: Point2D = { x: rect.x - 4, y: gy };
      const b: Point2D = { x: rect.x + rect.w + 4, y: gy };
      guides.push({
        index: i - 1,
        a,
        b,
        mid: { x: rect.x + rect.w * 0.5, y: gy },
        cutA: { x: rect.x - overhang, y: gy },
        cutB: { x: rect.x + rect.w + overhang, y: gy },
      });
    }
  }

  return guides;
}

function pointToSegmentDist(p: Point2D, a: Point2D, b: Point2D): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const lenSq = dx * dx + dy * dy;
  if (lenSq <= 0.0001) return Math.hypot(p.x - a.x, p.y - a.y);
  const t = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / lenSq));
  const projX = a.x + t * dx;
  const projY = a.y + t * dy;
  return Math.hypot(p.x - projX, p.y - projY);
}

/**
 * Tìm đường hướng dẫn chưa cắt gần nhất nằm trong bán kính snapRadius
 * dựa trên điểm chạm (tap) hoặc đoạn vuốt (ptA -> ptB).
 */
export function findSnapCutGuide(
  ptA: Point2D,
  ptB: Point2D | null,
  guides: readonly CutGuide[],
  cutMask: readonly boolean[],
  snapRadius: number
): CutGuide | null {
  let bestGuide: CutGuide | null = null;
  let bestDist = snapRadius;

  for (const g of guides) {
    if (cutMask[g.index]) continue;

    let dist = pointToSegmentDist(ptA, g.a, g.b);
    if (ptB) {
      dist = Math.min(dist, pointToSegmentDist(ptB, g.a, g.b));
      const midPt: Point2D = { x: (ptA.x + ptB.x) * 0.5, y: (ptA.y + ptB.y) * 0.5 };
      dist = Math.min(dist, pointToSegmentDist(midPt, g.a, g.b));
    }

    if (dist <= bestDist) {
      bestDist = dist;
      bestGuide = g;
    }
  }

  return bestGuide;
}
