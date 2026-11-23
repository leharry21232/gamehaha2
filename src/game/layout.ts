import type { ToppingId } from './types';
import { TOPPINGS } from './orders';

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface PrepLayout {
  width: number;
  mobileHubBottom: number;
  isCompact: boolean;
  height: number;
  counterY: number;
  customerX: number;
  customerY: number;
  bubbleRect: Rect;
  boardCenterX: number;
  boardCenterY: number;
  boardRadius: number;
  cuonCutBoardRect: Rect;
  matRect: Rect;
  rollRect: Rect;
  bowlCenterX: number;
  bowlCenterY: number;
  bowlRadius: number;
  trayRects: Record<ToppingId, Rect>;
  primaryBtn: Rect;
  secondaryBtn: Rect;
  limeHoldRect: Rect;
  chiliHoldRect: Rect;
  limeBarRect: Rect;
  chiliBarRect: Rect;
  shakeBtn: Rect;
  rollBtn: Rect;
}

export interface RaidLayout {
  width: number;
  height: number;
  roadX: number;
  roadW: number;
  laneCount: number;
  laneW: number;
  cartY: number;
  cartW: number;
  cartH: number;
  boostBtn: Rect;
}

export function pointInRect(px: number, py: number, r: Rect): boolean {
  return px >= r.x && px <= r.x + r.w && py >= r.y && py <= r.y + r.h;
}

export function getActiveCustomerRect(layout: PrepLayout): Rect {
  return {
    x: layout.customerX - 48,
    y: layout.customerY - 115,
    w: 96,
    h: 118,
  };
}

export function getWaitingCustomerRects(layout: PrepLayout, count: number): Rect[] {
  const rects: Rect[] = [];
  for (let i = 0; i < count; i++) {
    const wx = Math.min(layout.width - 70, layout.bubbleRect.x + layout.bubbleRect.w + 48 + i * 74);
    rects.push({
      x: wx - 30,
      y: layout.counterY - 96,
      w: 60,
      h: 92,
    });
  }
  return rects;
}

export function getAppeaseActiveRect(layout: PrepLayout): Rect {
  return {
    x: Math.max(12, layout.customerX - 66),
    y: layout.counterY + 4,
    w: 132,
    h: 28,
  };
}

export function getAppeaseWaitingRect(waitingRect: Rect): Rect {
  return {
    x: waitingRect.x - 12,
    y: waitingRect.y - 30,
    w: 84,
    h: 26,
  };
}

export function getLandladyRect(x: number, y: number): Rect {
  return {
    x: x - 44,
    y: y - 105,
    w: 88,
    h: 108,
  };
}

export function getLotterySellerRect(x: number, y: number): Rect {
  return {
    x: x - 42,
    y: y - 102,
    w: 84,
    h: 104,
  };
}

export function getElectricPoleRect(layout: PrepLayout): Rect {
  const poleW = layout.width >= 900 ? 64 : 50;
  const topY = Math.max(64, layout.counterY - 196);
  return {
    x: 10,
    y: topY,
    w: poleW,
    h: Math.max(120, layout.counterY - topY - 4),
  };
}

export interface FlowRhythmLayout {
  container: Rect;
  trackerRect: Rect;
  lanes: Rect[];
  padRects: Rect[];
  hitY: number;
}

export function getFlowLaneRects(layout: PrepLayout): FlowRhythmLayout {
  const cw = Math.min(560, layout.width - 36);
  const topY = layout.counterY + 52;
  const ch = Math.max(246, layout.height - topY - 18);
  const cx = layout.width * 0.5 - cw * 0.5;
  const padH = 54;
  const hitY = topY + ch - padH - 16;
  const trackerRect: Rect = {
    x: cx + 16,
    y: topY + 38,
    w: cw - 32,
    h: 30,
  };
  const laneTopY = trackerRect.y + trackerRect.h + 10;
  const laneGap = 10;
  const laneW = (cw - 36 - laneGap * 3) / 4;
  const lanes: Rect[] = [];
  const padRects: Rect[] = [];
  for (let i = 0; i < 4; i++) {
    const lx = cx + 18 + i * (laneW + laneGap);
    lanes.push({ x: lx, y: laneTopY, w: laneW, h: topY + ch - laneTopY - 14 });
    padRects.push({ x: lx, y: hitY - 22, w: laneW, h: padH });
  }
  return {
    container: { x: cx, y: topY, w: cw, h: ch },
    trackerRect,
    lanes,
    padRects,
    hitY,
  };
}

export function readSafeAreaInsets(): { top: number; right: number; bottom: number; left: number } {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return { top: 0, right: 0, bottom: 0, left: 0 };
  }
  const cs = getComputedStyle(document.documentElement);
  const parsePx = (v: string): number => {
    const n = parseFloat(v);
    return Number.isFinite(n) ? n : 0;
  };
  return {
    top: parsePx(cs.getPropertyValue('--sat')),
    right: parsePx(cs.getPropertyValue('--sar')),
    bottom: parsePx(cs.getPropertyValue('--sab')),
    left: parsePx(cs.getPropertyValue('--sal')),
  };
}

export function getQteArrowRects(w: number, h: number): Rect[] {
  const isNarrow = w < 420;
  const boxSize = isNarrow ? 48 : 54;
  const gap = isNarrow ? 10 : 14;
  const totalW = boxSize * 4 + gap * 3;
  const startX = w * 0.5 - totalW * 0.5;
  const y = h * 0.5 - 10;
  return [0, 1, 2, 3].map((i) => ({
    x: startX + i * (boxSize + gap),
    y,
    w: boxSize,
    h: boxSize,
  }));
}

export function getMobileHubBaseHeight(w: number, h: number): number {
  const width = Math.max(1, w);
  const height = Math.max(1, h);
  if (height < width && height <= 520) return 78;
  if (width <= 320 && height <= 500) return 136;
  if (width <= 360 || height <= 600) return 170;
  return 202;
}

export function computePrepLayout(w: number, h: number): PrepLayout {
  const insets = readSafeAreaInsets();
  const width = Math.max(1, w);
  const height = Math.max(1, h);
  const isShortLandscape = height < width && height <= 520;
  const isTinyPortrait = width <= 320 && height <= 500 && !isShortLandscape;
  const isCompact = width < 680 || isShortLandscape;
  const mobileHubBottom = isCompact
    ? getMobileHubBaseHeight(width, height) + Math.max(8, insets.top) + 4
    : 0;
  const safeTop = isCompact ? mobileHubBottom : Math.max(48, insets.top + 44);
  const safeBottom = Math.max(10, insets.bottom + 8);
  const counterY = isShortLandscape
    ? safeTop + 90
    : isCompact
      ? safeTop + 148
      : Math.max(safeTop + 150, Math.min(height * 0.38, 280));

  const maxSceneW = Math.max(1, Math.min(width - (isCompact ? 12 : 24), 1080));
  const sceneLeft = (width - maxSceneW) * 0.5;
  const customerX = isCompact
    ? Math.max(38, Math.min(58, width * 0.14))
    : sceneLeft + Math.min(130, maxSceneW * 0.16);
  const customerY = counterY - 6;

  const bubbleX = isCompact ? customerX + 44 : customerX + 90;
  const queueReserve = width >= 860 ? 185 : isCompact ? 8 : 110;
  const bubbleW = isCompact
    ? Math.max(1, Math.min(width - bubbleX - 10 - insets.right, width * 0.72))
    : Math.max(220, Math.min(580, sceneLeft + maxSceneW - bubbleX - queueReserve));
  const bubbleY = safeTop + 4;
  const bubbleH = Math.max(76, counterY - bubbleY - 10);

  const workTop = counterY + 14;
  const btnH = isCompact ? Math.max(42, Math.min(50, height * 0.07)) : 50;
  const btnY = Math.max(workTop + 64, height - safeBottom - btnH - 8);
  const workH = Math.max(1, btnY - workTop);

  // Reserve a dedicated vertical slot between the step header and the action
  // buttons. The board scales down when a phone is short instead of overflowing.
  const boardTop = workTop + (isCompact ? 10 : 24);
  const boardBottom = btnY - (isCompact ? 14 : 24);
  const boardSlotH = Math.max(1, boardBottom - boardTop);
  const boardRadius = isCompact
    ? Math.max(1, Math.min(126, (width - 28) / 2.6, boardSlotH / 2.08))
    : Math.max(1, Math.min(144, (boardSlotH / 2.08), maxSceneW * 0.18));
  const boardCenterX = width * 0.5;
  const boardCenterY = boardTop + boardSlotH * 0.5;

  const bowlCenterX = isShortLandscape ? Math.min(150, width * 0.22) : width * 0.5;
  const bowlRadius = isTinyPortrait
    ? Math.max(18, Math.min(32, Math.min(workH * 0.2, (width - 32) * 0.16)))
    : isShortLandscape
      ? Math.max(18, Math.min(32, Math.min(workH * 0.22, (width - 32) * 0.16)))
      : isCompact
        ? Math.max(42, Math.min(86, Math.min(workH * 0.2, (width - 32) * 0.22)))
        : Math.max(64, Math.min(124, Math.min(workH * 0.3, maxSceneW * 0.16)));
  const bowlCenterY = isTinyPortrait
    ? workTop + Math.min(14, workH * 0.12)
    : isShortLandscape
      ? workTop + workH * 0.5
      : isCompact
        ? Math.min(boardTop + bowlRadius + 12, workTop + Math.min(workH * 0.25, 118))
        : workTop + workH * 0.42;

  const matW = isShortLandscape
    ? Math.min(170, Math.max(120, bowlRadius * 3.4))
    : isCompact ? Math.max(1, Math.min(width - 24, 260)) : Math.min(320, bowlRadius * 2.55);
  const matH = isShortLandscape
    ? Math.min(120, Math.max(56, workH * 0.82))
    : isCompact ? Math.min(132, workH * 0.28) : Math.min(230, workH * 0.56);
  const matRect: Rect = {
    x: bowlCenterX - matW * 0.5,
    y: bowlCenterY - matH * 0.5,
    w: matW,
    h: matH,
  };

  const rollW = isCompact ? Math.max(1, Math.min(width - 24, 300)) : Math.min(390, maxSceneW * 0.54);
  const rollH = isCompact ? 64 : 82;
  const rollRect: Rect = {
    x: boardCenterX - rollW * 0.5,
    y: boardCenterY - rollH * 0.5,
    w: rollW,
    h: rollH,
  };
  // The visual cutting board must fit the viewport including its comic shadow.
  // The rice-paper polygon keeps its existing rollRect dimensions and hit-testing.
  const cuonBoardW = isCompact
    ? Math.min(width - 24, Math.max(rollW + 84, boardRadius * 2.85))
    : Math.max(rollW + 84, boardRadius * 2.85);
  const cuonCutBoardRect: Rect = {
    x: (width - cuonBoardW) * 0.5,
    y: boardCenterY - (boardRadius * 2.05) * 0.5,
    w: cuonBoardW,
    h: boardRadius * 2.05,
  };

  const trayRects = {} as Record<ToppingId, Rect>;
  if (isShortLandscape) {
    // Landscape phones use a side-by-side prep area: bowl on the left, ingredients on the right.
    const cols = 4;
    const gapX = 5;
    const gapY = 4;
    const sidePad = Math.max(bowlCenterX + bowlRadius + 14, matRect.x + matRect.w + 10, insets.left + 8);
    const rightPad = Math.max(8, insets.right + 6);
    const trayW = Math.max(1, Math.floor((width - sidePad - rightPad - gapX * (cols - 1)) / cols));
    const trayStartY = workTop + 2;
    const trayH = Math.max(24, Math.min(36, (btnY - trayStartY - gapY - 8) / 2));
    TOPPINGS.forEach((t, idx) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      trayRects[t.id] = {
        x: sidePad + col * (trayW + gapX),
        y: trayStartY + row * (trayH + gapY),
        w: trayW,
        h: trayH,
      };
    });
  } else if (isCompact) {
    const cols = 4;
    const gapX = 5;
    const gapY = isTinyPortrait || width <= 340 ? 4 : 6;
    const sidePad = Math.max(8, insets.left + 6);
    const trayW = Math.max(1, Math.floor((width - sidePad * 2 - gapX * (cols - 1)) / cols));
    const trayH = isTinyPortrait
      ? Math.max(28, Math.min(34, (btnY - (bowlCenterY + bowlRadius + 2) - 6) / 2))
      : Math.max(34, Math.min(54, (btnY - (bowlCenterY + bowlRadius + 12)) / 2.25));
    const gridStartY = isTinyPortrait
      ? Math.max(bowlCenterY + bowlRadius + 2, btnY - trayH * 2 - gapY - 4)
      : Math.max(bowlCenterY + bowlRadius + 8, btnY - trayH * 2 - gapY - 10);
    TOPPINGS.forEach((t, idx) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      trayRects[t.id] = {
        x: sidePad + col * (trayW + gapX),
        y: gridStartY + row * (trayH + gapY),
        w: trayW,
        h: trayH,
      };
    });
  } else {
    const trayW = Math.max(96, Math.min(170, (maxSceneW - bowlRadius * 2 - 72) * 0.46));
    const trayH = Math.max(40, Math.min(64, (workH - 84) / 4.4));
    const trayGapY = 8;
    const totalTrayH = trayH * 4 + trayGapY * 3;
    const trayStartY = Math.max(workTop + 40, bowlCenterY - totalTrayH * 0.5 - 6);
    const leftTrayX = Math.max(8, bowlCenterX - Math.max(bowlRadius, matW * 0.5) - 20 - trayW);
    const rightTrayX = Math.min(width - trayW - 8, bowlCenterX + Math.max(bowlRadius, matW * 0.5) + 20);
    TOPPINGS.forEach((t, idx) => {
      const isLeft = idx < 4;
      const row = idx % 4;
      trayRects[t.id] = {
        x: isLeft ? leftTrayX : rightTrayX,
        y: trayStartY + row * (trayH + trayGapY),
        w: trayW,
        h: trayH,
      };
    });
  }

  const gapBtns = isCompact ? 8 : 16;
  const availableBtnW = Math.max(1, width - (isCompact ? 24 : 48) - gapBtns);
  const secW = isCompact ? Math.min(116, availableBtnW * 0.36) : 132;
  const btnW = isCompact
    ? Math.max(1, Math.min(256, availableBtnW - secW))
    : Math.min(256, maxSceneW * 0.38);
  const totalBtnsW = secW + gapBtns + btnW;
  const secondaryBtn: Rect = {
    x: isCompact ? (width - totalBtnsW) * 0.5 : width * 0.5 - btnW * 0.5 + 72 - 148,
    y: btnY,
    w: secW,
    h: btnH,
  };
  const primaryBtn: Rect = {
    x: isCompact ? secondaryBtn.x + secW + gapBtns : width * 0.5 - btnW * 0.5 + 72,
    y: btnY,
    w: btnW,
    h: btnH,
  };

  const limeHoldW = isCompact ? Math.min(122, Math.floor(width * 0.33)) : 144;
  const gapHold = isCompact ? 8 : 18;
  const barW = isCompact ? Math.max(1, width - limeHoldW - gapHold - 24) : Math.min(340, maxSceneW * 0.48);
  const barH = isShortLandscape ? 14 : isTinyPortrait ? 18 : 26;
  const holdH = isShortLandscape ? 26 : isTinyPortrait ? 34 : isCompact ? 48 : 58;
  const seasonGap = isShortLandscape ? 4 : isTinyPortrait ? 6 : 16;
  const seasonStartY = isShortLandscape ? workTop + 2 : isTinyPortrait ? workTop + 6 : isCompact ? workTop + 24 : bowlCenterY - 56;
  const seasonLeftX = width * 0.5 - (limeHoldW + gapHold + barW) * 0.5;
  const limeHoldRect: Rect = { x: seasonLeftX, y: seasonStartY, w: limeHoldW, h: holdH };
  const limeBarRect: Rect = { x: seasonLeftX + limeHoldW + gapHold, y: seasonStartY + (holdH - barH) * 0.5, w: barW, h: barH };
  const chiliHoldRect: Rect = { x: seasonLeftX, y: seasonStartY + holdH + seasonGap, w: limeHoldW, h: holdH };
  const chiliBarRect: Rect = { x: seasonLeftX + limeHoldW + gapHold, y: seasonStartY + holdH + seasonGap + (holdH - barH) * 0.5, w: barW, h: barH };

  const shakeBtnW = isCompact ? Math.max(1, Math.min(264, width - 24)) : 276;
  const shakeBtn: Rect = { x: (width - shakeBtnW) * 0.5, y: btnY - 58, w: shakeBtnW, h: 48 };
  const rollBtnW = isCompact ? Math.max(1, Math.min(250, width - 24)) : 250;
  const rollBtn: Rect = { x: (width - rollBtnW) * 0.5, y: btnY, w: rollBtnW, h: 48 };

  return {
    width,
    height,
    mobileHubBottom,
    isCompact,
    counterY,
    customerX,
    customerY,
    bubbleRect: { x: bubbleX, y: bubbleY, w: bubbleW, h: bubbleH },
    boardCenterX,
    boardCenterY,
    boardRadius,
    cuonCutBoardRect,
    matRect,
    rollRect,
    bowlCenterX,
    bowlCenterY,
    bowlRadius,
    trayRects,
    primaryBtn,
    secondaryBtn,
    limeHoldRect,
    chiliHoldRect,
    limeBarRect,
    chiliBarRect,
    shakeBtn,
    rollBtn,
  };
}
export function getToppingRemoveRect(layout: PrepLayout, id: ToppingId): Rect {
  const tray = layout.trayRects[id];
  const size = Math.min(28, Math.max(22, tray.w * 0.2));
  return {
    x: tray.x + tray.w - size - 5,
    y: tray.y + 5,
    w: size,
    h: size,
  };
}

export function getToppingUndoRect(layout: PrepLayout): Rect {
  const centeredPrimaryX = layout.width * 0.5 - layout.primaryBtn.w * 0.5;
  if (layout.isCompact) {
    // On phones, keep undo in the left slot and the primary action in the right slot.
    return { ...layout.secondaryBtn, y: layout.primaryBtn.y };
  }
  return {
    ...layout.secondaryBtn,
    x: Math.max(12, centeredPrimaryX - layout.secondaryBtn.w - 12),
    y: layout.primaryBtn.y,
  };
}

export function computeRaidLayout(w: number, h: number): RaidLayout {
  const insets = readSafeAreaInsets();
  const isPortrait = w < 680;
  const safeBottom = Math.max(14, insets.bottom + 10);
  const laneCount = 4;
  const roadW = isPortrait ? Math.min(400, w - 24) : Math.min(560, Math.max(320, w * 0.54));
  const roadX = (w - roadW) * 0.5;
  const laneW = roadW / laneCount;
  const cartW = Math.min(88, laneW * 0.68);
  const cartH = cartW * 1.3;
  const cartY = h - cartH - safeBottom - (isPortrait ? 74 : 82);

  const boostBtn: Rect = isPortrait
    ? {
        x: w - 154 - Math.max(12, insets.right + 10),
        y: h - safeBottom - 54,
        w: 146,
        h: 50,
      }
    : {
        x: Math.min(w - 178, roadX + roadW + 24),
        y: h - safeBottom - 64,
        w: 158,
        h: 54,
      };

  return {
    width: w,
    height: h,
    roadX,
    roadW,
    laneCount,
    laneW,
    cartY,
    cartW,
    cartH,
    boostBtn,
  };
}
