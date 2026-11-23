import {
  NPC_VISUAL_META,
  SAIGON_PALETTE,
  TUNING_CONFIG,
  type LightingPreset,
  type NpcVisualMeta,
} from './config';

export type FacingDirection = 'down' | 'up' | 'left' | 'right';
export type VehicleKind = 'motorbike' | 'ba_gac' | 'bicycle' | 'car';

export interface TrafficVehicle {
  id: number;
  kind: VehicleKind;
  x: number;
  lane: 0 | 1 | 2;
  dir: 1 | -1;
  speed: number;
  bodyColor: string;
  helmetColor: string;
}

/** Vẽ hình chữ nhật tọa độ nguyên để giữ nét pixel art sắc cạnh */
export function pxRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  color: string,
) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
}

/** Vẽ hình chữ nhật có viền pixel tối mảnh */
function pxBox(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  fill: string,
  border: string = SAIGON_PALETTE.woodDark,
) {
  pxRect(ctx, x, y, w, h, border);
  if (w > 2 && h > 2) {
    pxRect(ctx, x + 1, y + 1, w - 2, h - 2, fill);
  }
}

/** Vẽ nhãn chữ sắc nét trên bảng hiệu bằng tọa độ pixel thực (HiDPI), không bị mờ khi scale Canvas */
function drawSignText(
  ctx: CanvasRenderingContext2D,
  text: string,
  cx: number,
  cy: number,
  color: string,
  fontPx = 6,
  maxVirtualWidth?: number,
  shadowColor: string | null = SAIGON_PALETTE.woodDark,
) {
  ctx.save();
  const m = ctx.getTransform();
  const scaleX = Math.max(1, Math.abs(m.a));
  const scaleY = Math.max(1, Math.abs(m.d));
  const devCx = Math.round(cx * m.a + m.e);
  const devCy = Math.round(cy * m.d + m.f);
  const devFontPx = Math.max(11, Math.round(fontPx * scaleY));
  const devMaxW = maxVirtualWidth ? Math.max(24, Math.round(maxVirtualWidth * scaleX)) : undefined;

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.imageSmoothingEnabled = true;
  ctx.font = `700 ${devFontPx}px "Pixelify Sans", "Plus Jakarta Sans", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  if (shadowColor && shadowColor !== color) {
    const offset = Math.max(1, Math.round(scaleY * 0.4));
    ctx.fillStyle = shadowColor;
    if (devMaxW !== undefined) {
      ctx.fillText(text, devCx + offset, devCy + offset, devMaxW);
    } else {
      ctx.fillText(text, devCx + offset, devCy + offset);
    }
  }

  ctx.fillStyle = color;
  if (devMaxW !== undefined) {
    ctx.fillText(text, devCx, devCy, devMaxW);
  } else {
    ctx.fillText(text, devCx, devCy);
  }
  ctx.restore();
}

/**
 * Vẽ bầu trời và dãy nhà phố ống Sài Gòn 2 tầng (Tạp hóa, Ăn vặt, Nước giải khát, Sạp chợ).
 * Chú ý đặt bảng hiệu ở phần mái hiên tầng trệt (khoảng y = 76..86% của vùng nhà)
 * để HUD góc trên không bao giờ che mất tên tiệm.
 */
export function drawSkyAndShophouses(
  ctx: CanvasRenderingContext2D,
  worldLeftPx: number,
  worldRightPx: number,
  streetW: number,
  housesBottomY: number,
  lighting: LightingPreset,
  timeSec: number,
) {
  const skyGrad = ctx.createLinearGradient(0, 0, 0, housesBottomY);
  skyGrad.addColorStop(0, lighting.skyTop);
  skyGrad.addColorStop(1, lighting.skyBottom);
  ctx.fillStyle = skyGrad;
  ctx.fillRect(Math.floor(worldLeftPx) - 8, 0, Math.ceil(worldRightPx - worldLeftPx) + 16, Math.ceil(housesBottomY));

  // Mây pixel trôi nhẹ ban ngày hoặc sao lấp lánh ban đêm
  if (lighting.lampsOn) {
    for (let i = 0; i < 16; i += 1) {
      const sx = ((i * 53 + 17) % (streetW + 80)) - 40;
      const sy = 5 + ((i * 19) % 24);
      const twinkle = Math.sin(timeSec * 2.2 + i) > 0.2 ? 1 : 0.45;
      ctx.globalAlpha = twinkle;
      pxRect(ctx, sx, sy, 1, 1, SAIGON_PALETTE.goldNeon);
    }
    ctx.globalAlpha = 1;
  } else {
    const cloudDrift = (timeSec * 2.5) % (streetW + 80);
    for (let c = 0; c < 3; c += 1) {
      const cx = ((c * 165 + cloudDrift) % (streetW + 80)) - 40;
      const cy = 8 + (c % 2) * 8;
      pxRect(ctx, cx, cy, 22, 4, SAIGON_PALETTE.creamWall);
      pxRect(ctx, cx + 4, cy - 3, 12, 3, SAIGON_PALETTE.creamWall);
    }
  }

  // Các căn nhà phố ống sát nhau từ x = -40 tới streetW + 40 để không lộ viền khi màn hình siêu rộng
  const houses = [
    { x: -48, w: 50, wall: SAIGON_PALETTE.ochreWall, trim: SAIGON_PALETTE.brickShadow, roof: SAIGON_PALETTE.roofIron, sign: '', signBg: SAIGON_PALETTE.signBlue, signText: SAIGON_PALETTE.creamWall, ac: false, shutter: true, lantern: false },
    { x: 2, w: 108, wall: SAIGON_PALETTE.ochreWall, trim: SAIGON_PALETTE.brickWall, roof: SAIGON_PALETTE.roofRed, sign: 'TẠP HÓA', signBg: SAIGON_PALETTE.signRed, signText: SAIGON_PALETTE.goldNeon, ac: true, shutter: false, lantern: true },
    { x: 110, w: 108, wall: SAIGON_PALETTE.creamWall, trim: SAIGON_PALETTE.woodMid, roof: SAIGON_PALETTE.roofIron, sign: 'ĂN VẶT', signBg: SAIGON_PALETTE.emberOrange, signText: SAIGON_PALETTE.creamWall, ac: true, shutter: true, lantern: false },
    { x: 218, w: 108, wall: SAIGON_PALETTE.mintWall, trim: SAIGON_PALETTE.leafDark, roof: SAIGON_PALETTE.roofRed, sign: 'NƯỚC GIẢI KHÁT', signBg: SAIGON_PALETTE.signBlue, signText: SAIGON_PALETTE.goldNeon, ac: true, shutter: false, lantern: true },
    { x: 326, w: 112, wall: SAIGON_PALETTE.ochreWall, trim: SAIGON_PALETTE.brickWall, roof: SAIGON_PALETTE.roofIron, sign: 'SẠP CHỢ', signBg: SAIGON_PALETTE.signRed, signText: SAIGON_PALETTE.creamWall, ac: false, shutter: true, lantern: true },
    { x: 438, w: 56, wall: SAIGON_PALETTE.creamWall, trim: SAIGON_PALETTE.brickShadow, roof: SAIGON_PALETTE.roofRed, sign: '', signBg: SAIGON_PALETTE.signBlue, signText: SAIGON_PALETTE.creamWall, ac: false, shutter: false, lantern: false },
  ];

  const roofTopY = Math.round(housesBottomY * 0.14);
  const floorTwoBottomY = Math.round(housesBottomY * 0.6);

  for (let idx = 0; idx < houses.length; idx += 1) {
    const h = houses[idx];
    if (h.x + h.w < worldLeftPx - 20 || h.x > worldRightPx + 20) continue;

    // Tường nhà chính
    pxBox(ctx, h.x, roofTopY + 6, h.w, housesBottomY - roofTopY - 6, h.wall, SAIGON_PALETTE.woodDark);

    // Mái ngói / mái tôn xéo pixel
    pxBox(ctx, h.x - 1, roofTopY, h.w + 2, 7, h.roof, SAIGON_PALETTE.woodDark);
    for (let rx = h.x + 2; rx < h.x + h.w - 2; rx += 6) {
      pxRect(ctx, rx, roofTopY + 1, 2, 5, SAIGON_PALETTE.woodDark);
    }

    // Tầng lầu 2: Cửa sổ + Ban công sắt uốn + Chậu cây + Cục nóng điều hòa
    const winX = h.x + 12;
    const winY = roofTopY + 13;
    const winW = Math.min(28, h.w - 26);
    const winH = floorTwoBottomY - winY - 8;
    if (winW > 12 && winH > 10) {
      const windowGlow = lighting.lampsOn ? SAIGON_PALETTE.goldNeon : '#A9C9C7';
      pxBox(ctx, winX, winY, winW, winH, windowGlow, SAIGON_PALETTE.woodDark);
      pxRect(ctx, winX + Math.floor(winW / 2), winY + 1, 1, winH - 2, SAIGON_PALETTE.woodDark);
      pxRect(ctx, winX + 1, winY + Math.floor(winH / 2), winW - 2, 1, SAIGON_PALETTE.woodDark);

      // Rèm vải nhỏ bên cửa sổ
      pxRect(ctx, winX + 1, winY + 1, 4, winH - 2, h.trim);
      pxRect(ctx, winX + winW - 5, winY + 1, 4, winH - 2, h.trim);

      // Ban công sắt uốn tầng 2
      const balY = floorTwoBottomY - 10;
      pxRect(ctx, winX - 6, balY, winW + 12, 2, SAIGON_PALETTE.woodDark);
      pxRect(ctx, winX - 6, balY + 8, winW + 14, 3, h.trim);
      for (let bx = winX - 4; bx <= winX + winW + 4; bx += 4) {
        pxRect(ctx, bx, balY + 1, 1, 7, SAIGON_PALETTE.denimDark);
      }
      // Chậu hoa giấy / cây xanh trên ban công
      pxRect(ctx, winX - 3, balY - 4, 6, 4, SAIGON_PALETTE.brickWall);
      pxRect(ctx, winX - 5, balY - 8, 10, 4, SAIGON_PALETTE.leafMid);
      pxRect(ctx, winX - 2, balY - 9, 3, 2, SAIGON_PALETTE.signRed);
      pxRect(ctx, winX + 4, balY - 7, 3, 2, SAIGON_PALETTE.goldNeon);
    }

    // Cục nóng điều hòa + ống đồng
    if (h.ac && h.w >= 90) {
      const acX = h.x + h.w - 24;
      const acY = roofTopY + 18;
      pxBox(ctx, acX, acY, 16, 11, SAIGON_PALETTE.creamWall, SAIGON_PALETTE.woodDark);
      pxRect(ctx, acX + 2, acY + 2, 7, 7, SAIGON_PALETTE.denimDark);
      pxRect(ctx, acX + 10, acY + 3, 4, 1, SAIGON_PALETTE.woodDark);
      pxRect(ctx, acX + 10, acY + 5, 4, 1, SAIGON_PALETTE.woodDark);
      pxRect(ctx, acX + 10, acY + 7, 4, 1, SAIGON_PALETTE.woodDark);
    }

    // Gờ tường phân tầng
    pxRect(ctx, h.x, floorTwoBottomY, h.w, 3, h.trim);

    // Tầng trệt: Mái hiên + Cửa cuốn / Rèm sọc + Bảng hiệu tiếng Việt
    const groundY = floorTwoBottomY + 3;
    const doorH = housesBottomY - groundY;
    if (h.shutter) {
      pxBox(ctx, h.x + 10, groundY + 12, h.w - 20, doorH - 12, '#7D8D8F', SAIGON_PALETTE.woodDark);
      for (let sy = groundY + 15; sy < housesBottomY - 2; sy += 4) {
        pxRect(ctx, h.x + 11, sy, h.w - 22, 1, SAIGON_PALETTE.denimDark);
      }
    } else {
      const interiorColor = lighting.lampsOn ? '#E3B96E' : '#5E4B3E';
      pxBox(ctx, h.x + 12, groundY + 12, h.w - 24, doorH - 12, interiorColor, SAIGON_PALETTE.woodDark);
      // Mái bạt sọc trước cửa
      for (let ax = h.x + 8; ax < h.x + h.w - 8; ax += 6) {
        const stripe = ((ax - h.x) / 6) % 2 === 0 ? SAIGON_PALETTE.signRed : SAIGON_PALETTE.creamWall;
        pxRect(ctx, ax, groundY + 10, 6, 6, stripe);
      }
      pxRect(ctx, h.x + 8, groundY + 16, h.w - 16, 1, SAIGON_PALETTE.woodDark);
    }

    // Bảng hiệu cửa hàng tiếng Việt nằm gọn trên mặt tiền tầng trệt (không bị HUD che)
    if (h.sign) {
      const signW = Math.min(h.w - 10, 90);
      const signX = h.x + Math.round((h.w - signW) / 2);
      const signY = groundY + 1;
      pxBox(ctx, signX, signY, signW, 12, h.signBg, SAIGON_PALETTE.woodDark);
      if (lighting.lampsOn) {
        ctx.save();
        ctx.globalAlpha = 0.25 * TUNING_CONFIG.eveningLampGlow;
        pxRect(ctx, signX - 2, signY - 1, signW + 4, 14, SAIGON_PALETTE.goldNeon);
        ctx.restore();
      }
      drawSignText(
        ctx,
        h.sign,
        signX + signW / 2,
        signY + 6.5,
        h.signText,
        6,
        signW - 6,
        SAIGON_PALETTE.woodDark,
      );
    }

    // Đèn lồng đỏ treo trước hiên
    if (h.lantern) {
      const lx = h.x + 6;
      const ly = groundY + 4 + Math.round(Math.sin(timeSec * 2 + idx) * 0.5);
      pxRect(ctx, lx + 2, groundY, 1, 4, SAIGON_PALETTE.woodDark);
      pxBox(ctx, lx, ly, 5, 6, SAIGON_PALETTE.signRed, SAIGON_PALETTE.woodDark);
      pxRect(ctx, lx + 1, ly + 1, 3, 4, lighting.lampsOn ? SAIGON_PALETTE.goldNeon : SAIGON_PALETTE.emberOrange);
    }
  }

  // Cột điện + mạng nhện dây điện Sài Gòn chằng chịt trên cao
  const poleXs = [4, 214, 434];
  for (const px of poleXs) {
    if (px < worldLeftPx - 20 || px > worldRightPx + 20) continue;
    pxRect(ctx, px, 6, 4, housesBottomY - 6, SAIGON_PALETTE.curbStone);
    pxRect(ctx, px + 1, 6, 1, housesBottomY - 6, SAIGON_PALETTE.creamWall);
    pxRect(ctx, px - 5, 11, 14, 2, SAIGON_PALETTE.woodDark);
    pxRect(ctx, px - 4, 18, 12, 2, SAIGON_PALETTE.woodDark);
    // Hộp công tơ điện
    pxBox(ctx, px - 1, 42, 6, 8, SAIGON_PALETTE.creamWall, SAIGON_PALETTE.woodDark);
  }

  // Dây điện võng tự nhiên giữa các cột điện
  ctx.save();
  ctx.strokeStyle = SAIGON_PALETTE.woodDark;
  ctx.lineWidth = 1;
  const wireSpans = [
    [6, 216, 12, 18],
    [6, 216, 19, 25],
    [216, 436, 12, 19],
    [216, 436, 19, 26],
    [-40, 6, 14, 12],
    [436, 490, 14, 16],
  ];
  for (const [x1, x2, y1, sag] of wireSpans) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.quadraticCurveTo((x1 + x2) / 2, y1 + sag, x2, y1);
    ctx.stroke();
  }
  ctx.restore();
}

/**
 * Vẽ vỉa hè gạch bông Sài Gòn, bó vỉa đá, cống thoát nước, trụ đèn đường, thùng rác và xe máy đậu.
 */
export function drawSidewalkAndRoadBase(
  ctx: CanvasRenderingContext2D,
  worldLeftPx: number,
  worldRightPx: number,
  housesBottomY: number,
  sidewalkBottomY: number,
  canvasH: number,
  lighting: LightingPreset,
  timeSec: number,
) {
  const startX = Math.floor(worldLeftPx / 16) * 16 - 16;
  const endX = Math.ceil(worldRightPx / 16) * 16 + 16;
  const swH = Math.ceil(sidewalkBottomY - housesBottomY);

  // Nền vỉa hè gạch bông
  pxRect(ctx, startX, housesBottomY, endX - startX, swH, SAIGON_PALETTE.tileMid);
  for (let gx = startX; gx < endX; gx += 16) {
    for (let gy = Math.floor(housesBottomY); gy < Math.floor(sidewalkBottomY) - 6; gy += 12) {
      const checker = ((Math.floor(gx / 16) + Math.floor((gy - housesBottomY) / 12)) % 2) === 0;
      pxRect(ctx, gx + 1, gy + 1, 14, 10, checker ? SAIGON_PALETTE.tileLight : SAIGON_PALETTE.tileMid);
      // Họa tiết gạch bông con giữa ô
      pxRect(ctx, gx + 7, gy + 5, 2, 2, SAIGON_PALETTE.tileGrout);
    }
    pxRect(ctx, gx, housesBottomY, 1, swH - 6, SAIGON_PALETTE.tileGrout);
  }

  // Bóng hiên nhà đổ xuống mép trên vỉa hè
  ctx.save();
  ctx.globalAlpha = 0.2;
  pxRect(ctx, startX, housesBottomY, endX - startX, 5, SAIGON_PALETTE.woodDark);
  ctx.restore();

  // Bó vỉa đá granite ngăn cách vỉa hè và lòng đường
  const curbY = Math.round(sidewalkBottomY - 6);
  pxRect(ctx, startX, curbY, endX - startX, 6, SAIGON_PALETTE.curbStone);
  pxRect(ctx, startX, curbY, endX - startX, 2, SAIGON_PALETTE.creamWall);
  for (let cx = startX; cx < endX; cx += 24) {
    pxRect(ctx, cx, curbY, 1, 6, SAIGON_PALETTE.woodDark);
  }

  // Lòng đường nhựa Sài Gòn
  const roadY = curbY + 6;
  const roadH = Math.ceil(canvasH - roadY) + 4;
  pxRect(ctx, startX, roadY, endX - startX, roadH, SAIGON_PALETTE.asphaltDark);

  // Bóng râm sát lề đường + nắp cống thoát nước
  pxRect(ctx, startX, roadY, endX - startX, 3, SAIGON_PALETTE.denimDark);
  for (const drainX of [52, 200, 355]) {
    pxBox(ctx, drainX, roadY + 2, 12, 4, SAIGON_PALETTE.curbStone, SAIGON_PALETTE.woodDark);
    pxRect(ctx, drainX + 2, roadY + 3, 2, 2, SAIGON_PALETTE.woodDark);
    pxRect(ctx, drainX + 6, roadY + 3, 2, 2, SAIGON_PALETTE.woodDark);
  }

  // Vạch kẻ đường vàng nét đứt giữa đường
  const laneMidY = Math.round(roadY + roadH * 0.48);
  for (let lx = startX; lx < endX; lx += 30) {
    pxRect(ctx, lx, laneMidY, 16, 2, SAIGON_PALETTE.laneYellow);
  }
  // Hạt sỏi nhỏ trên mặt đường
  for (let gx = startX + 7; gx < endX; gx += 43) {
    pxRect(ctx, gx, roadY + Math.round(roadH * 0.25), 2, 1, SAIGON_PALETTE.asphaltMid);
    pxRect(ctx, gx + 19, roadY + Math.round(roadH * 0.78), 2, 1, SAIGON_PALETTE.asphaltMid);
  }

  // Trụ đèn đường vỉa hè (bật sáng vàng ấm vào buổi tối)
  for (const lampX of [184, 412]) {
    if (lampX < worldLeftPx - 24 || lampX > worldRightPx + 24) continue;
    const baseY = curbY - 1;
    pxRect(ctx, lampX, baseY - 46, 3, 46, SAIGON_PALETTE.denimDark);
    pxRect(ctx, lampX - 2, baseY - 4, 7, 4, SAIGON_PALETTE.curbStone);
    pxRect(ctx, lampX - 4, baseY - 47, 9, 3, SAIGON_PALETTE.denimDark);
    pxRect(ctx, lampX - 5, baseY - 44, 6, 3, lighting.lampsOn ? SAIGON_PALETTE.goldNeon : SAIGON_PALETTE.creamWall);
    if (lighting.lampsOn) {
      const pulse = 0.85 + Math.sin(timeSec * 3 + lampX) * 0.1;
      ctx.save();
      const grad = ctx.createRadialGradient(lampX - 2, baseY - 42, 2, lampX - 2, baseY - 14, 44);
      grad.addColorStop(0, `rgba(255, 209, 92, ${0.42 * pulse * TUNING_CONFIG.eveningLampGlow})`);
      grad.addColorStop(1, 'rgba(255, 209, 92, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(lampX - 46, baseY - 50, 92, 76);
      ctx.restore();
    }
  }

  // Thùng rác xanh công cộng + 1 chiếc xe máy đậu gọn sát vỉa hè
  const binX = 166;
  const binY = Math.round(housesBottomY + 6);
  pxBox(ctx, binX, binY, 8, 11, SAIGON_PALETTE.leafMid, SAIGON_PALETTE.woodDark);
  pxRect(ctx, binX - 1, binY, 10, 3, SAIGON_PALETTE.leafDark);

  // Xe máy dựng gần quán nước / vỉa hè (trang trí nền tĩnh)
  const parkedX = 228;
  const parkedY = Math.round(housesBottomY + 12);
  pxRect(ctx, parkedX + 2, parkedY + 8, 5, 5, SAIGON_PALETTE.woodDark); // bánh sau
  pxRect(ctx, parkedX + 15, parkedY + 8, 5, 5, SAIGON_PALETTE.woodDark); // bánh trước
  pxBox(ctx, parkedX + 4, parkedY + 4, 14, 5, SAIGON_PALETTE.signRed, SAIGON_PALETTE.woodDark); // thân xe
  pxRect(ctx, parkedX + 5, parkedY + 2, 7, 2, SAIGON_PALETTE.woodDark); // yên xe
  pxRect(ctx, parkedX + 15, parkedY - 1, 3, 6, SAIGON_PALETTE.curbStone); // cổ lái
}

/** Vẽ cây xanh vỉa hè (trái và phải, trùng khớp collision rect) */
export function drawStreetTree(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  footY: number,
  timeSec: number,
  seed = 0,
) {
  const sway = Math.round(Math.sin(timeSec * 1.4 + seed) * 0.8);
  // Bóng râm dưới gốc cây
  ctx.save();
  ctx.globalAlpha = 0.22;
  pxRect(ctx, centerX - 14, footY - 3, 28, 6, SAIGON_PALETTE.woodDark);
  ctx.restore();

  // Bồn gạch nhỏ quanh gốc
  pxBox(ctx, centerX - 8, footY - 5, 16, 6, SAIGON_PALETTE.brickWall, SAIGON_PALETTE.woodDark);
  pxRect(ctx, centerX - 6, footY - 4, 12, 3, SAIGON_PALETTE.woodMid);

  // Thân cây
  pxBox(ctx, centerX - 3, footY - 30, 6, 26, SAIGON_PALETTE.woodMid, SAIGON_PALETTE.woodDark);
  pxRect(ctx, centerX - 1, footY - 27, 2, 20, SAIGON_PALETTE.woodLight);

  // Tán lá nhiều lớp pixel
  pxBox(ctx, centerX - 17 + sway, footY - 48, 34, 22, SAIGON_PALETTE.leafDark, SAIGON_PALETTE.woodDark);
  pxRect(ctx, centerX - 14 + sway, footY - 52, 28, 18, SAIGON_PALETTE.leafMid);
  pxRect(ctx, centerX - 10 + sway, footY - 54, 18, 8, SAIGON_PALETTE.leafLight);
  pxRect(ctx, centerX + 4 + sway, footY - 45, 9, 6, SAIGON_PALETTE.leafLight);
}

/**
 * Vẽ XE BÁNH TRÁNG — điểm nhấn trung tâm của góc phố Sài Gòn.
 * Đầy đủ: mái bạt sọc, bảng giá, bếp than đỏ lửa, bánh tráng nướng, trứng cút,
 * hành phi, xoài bào, khô bò, bao bì treo, đèn vàng ấm, khói bếp, và khách xếp hàng!
 */
export function drawBanhTrangCart(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  footY: number,
  lighting: LightingPreset,
  timeSec: number,
) {
  const w = 78;
  const x = Math.round(centerX - w / 2);
  const y = Math.round(footY - 56);

  // Bóng đổ dưới xe
  ctx.save();
  ctx.globalAlpha = 0.25;
  pxRect(ctx, x - 3, footY - 3, w + 6, 7, SAIGON_PALETTE.woodDark);
  ctx.restore();

  // 2 bánh xe đẩy
  pxBox(ctx, x + 7, footY - 10, 10, 10, SAIGON_PALETTE.denimDark, SAIGON_PALETTE.woodDark);
  pxRect(ctx, x + 10, footY - 7, 4, 4, SAIGON_PALETTE.creamWall);
  pxBox(ctx, x + w - 17, footY - 10, 10, 10, SAIGON_PALETTE.denimDark, SAIGON_PALETTE.woodDark);
  pxRect(ctx, x + w - 14, footY - 7, 4, 4, SAIGON_PALETTE.creamWall);

  // Thân xe gỗ & sơn đỏ gạch ấm
  pxBox(ctx, x + 3, y + 24, w - 6, 26, SAIGON_PALETTE.brickWall, SAIGON_PALETTE.woodDark);
  // Bảng giá viết tay gắn thân xe
  pxBox(ctx, x + 8, y + 32, 26, 15, SAIGON_PALETTE.woodDark, SAIGON_PALETTE.woodLight);
  drawSignText(ctx, '20K', x + 21, y + 40, SAIGON_PALETTE.goldNeon, 6.2, 22, null);

  // Bếp than nướng bánh tráng bên phải thân xe + lửa bập bùng
  pxBox(ctx, x + 41, y + 29, 27, 16, SAIGON_PALETTE.denimDark, SAIGON_PALETTE.woodDark);
  pxRect(ctx, x + 43, y + 31, 23, 5, SAIGON_PALETTE.emberOrange);
  const flicker = Math.sin(timeSec * 14) > 0 ? 1 : 0;
  pxRect(ctx, x + 46, y + 30 - flicker, 4, 4 + flicker, SAIGON_PALETTE.goldNeon);
  pxRect(ctx, x + 54, y + 29 + flicker, 5, 5 - flicker, SAIGON_PALETTE.goldNeon);
  pxRect(ctx, x + 61, y + 31 - flicker, 3, 3 + flicker, SAIGON_PALETTE.signRed);

  // Mặt quầy & tủ kính trưng bày topping
  pxBox(ctx, x + 4, y + 11, w - 8, 15, '#D7E8E1', SAIGON_PALETTE.woodDark);
  pxRect(ctx, x + 5, y + 23, w - 10, 3, SAIGON_PALETTE.creamWall);
  // Khay nguyên liệu: xoài vàng, khô bò đỏ, hành phi nâu, rau răm xanh, trứng cút trắng
  pxRect(ctx, x + 7, y + 19, 8, 4, SAIGON_PALETTE.goldNeon); // xoài
  pxRect(ctx, x + 17, y + 19, 8, 4, SAIGON_PALETTE.signRed); // khô bò
  pxRect(ctx, x + 27, y + 19, 7, 4, SAIGON_PALETTE.woodLight); // hành phi
  pxRect(ctx, x + 36, y + 19, 7, 4, SAIGON_PALETTE.leafMid); // rau răm
  // Trứng cút nhỏ xinh
  for (let q = 0; q < 4; q += 1) {
    pxRect(ctx, x + 46 + q * 3, y + 20, 2, 2, SAIGON_PALETTE.creamWall);
  }
  // Xấp bánh tráng nướng tròn trên vỉ
  pxBox(ctx, x + 58, y + 16, 11, 7, SAIGON_PALETTE.ochreWall, SAIGON_PALETTE.woodMid);
  pxRect(ctx, x + 61, y + 18, 2, 2, SAIGON_PALETTE.signRed);
  pxRect(ctx, x + 65, y + 19, 2, 2, SAIGON_PALETTE.leafMid);

  // Cọc chống mái & túi bao bì treo lủng lẳng
  pxRect(ctx, x + 4, y + 3, 2, 22, SAIGON_PALETTE.woodDark);
  pxRect(ctx, x + w - 6, y + 3, 2, 22, SAIGON_PALETTE.woodDark);
  pxRect(ctx, x + 6, y + 12, 4, 6, SAIGON_PALETTE.creamWall); // bịch nilon
  pxRect(ctx, x + 11, y + 12, 4, 6, SAIGON_PALETTE.smokeCream);

  // Mái bạt sọc đỏ - kem & bảng hiệu BÁNH TRÁNG phía trên
  for (let mx = x; mx < x + w; mx += 6) {
    const col = ((mx - x) / 6) % 2 === 0 ? SAIGON_PALETTE.signRed : SAIGON_PALETTE.creamWall;
    pxRect(ctx, mx, y + 2, Math.min(6, x + w - mx), 6, col);
  }
  pxRect(ctx, x, y + 2, w, 1, SAIGON_PALETTE.woodDark);
  pxRect(ctx, x, y + 8, w, 1, SAIGON_PALETTE.woodDark);

  // Bảng hiệu vàng BÁNH TRÁNG (chữ tối sắc nét trên nền vàng, không đổ bóng đúp gây nhòe)
  pxBox(ctx, x + 5, y - 11, w - 10, 13, SAIGON_PALETTE.goldNeon, SAIGON_PALETTE.woodDark);
  drawSignText(ctx, 'BÁNH TRÁNG', x + w / 2, y - 4.5, SAIGON_PALETTE.woodDark, 6.4, w - 16, null);

  // Bóng đèn tròn treo giữa quầy (sáng rực vào buổi chiều/tối)
  const bulbX = x + Math.round(w / 2);
  const bulbY = y + 10;
  pxRect(ctx, bulbX, y + 8, 1, 2, SAIGON_PALETTE.woodDark);
  pxRect(ctx, bulbX - 1, bulbY, 3, 3, SAIGON_PALETTE.goldNeon);
  if (lighting.lampsOn || lighting.shortLabel === 'Chiều') {
    ctx.save();
    const grad = ctx.createRadialGradient(bulbX, bulbY + 2, 2, bulbX, bulbY + 8, 34);
    grad.addColorStop(0, `rgba(255, 209, 92, ${lighting.lampsOn ? 0.55 : 0.25})`);
    grad.addColorStop(1, 'rgba(255, 209, 92, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(bulbX - 34, bulbY - 22, 68, 60);
    ctx.restore();
  }

  // Hai vị khách nhỏ đứng xếp hàng cạnh bên phải quầy bánh tráng (tạo cảm giác buôn bán nhộn nhịp)
  const bob1 = Math.round(Math.sin(timeSec * 3.1) * 0.8);
  const bob2 = Math.round(Math.sin(timeSec * 2.6 + 1.5) * 0.8);
  // Khách 1 (học sinh áo trắng)
  const q1x = x + w + 2;
  const q1y = footY - 19 + bob1;
  pxRect(ctx, q1x + 2, q1y, 5, 5, SAIGON_PALETTE.skinWarm);
  pxRect(ctx, q1x + 2, q1y - 1, 5, 2, SAIGON_PALETTE.woodDark);
  pxBox(ctx, q1x + 1, q1y + 5, 7, 7, SAIGON_PALETTE.creamWall, SAIGON_PALETTE.woodDark);
  pxRect(ctx, q1x + 2, q1y + 12, 2, 6, SAIGON_PALETTE.denimDark);
  pxRect(ctx, q1x + 5, q1y + 12, 2, 6, SAIGON_PALETTE.denimDark);
  // Khách 2 (chị gái áo xanh)
  const q2x = q1x + 10;
  const q2y = footY - 18 + bob2;
  pxRect(ctx, q2x + 2, q2y, 5, 5, SAIGON_PALETTE.skinWarm);
  pxRect(ctx, q2x + 1, q2y - 1, 7, 3, SAIGON_PALETTE.brickShadow);
  pxBox(ctx, q2x + 1, q2y + 5, 7, 7, SAIGON_PALETTE.signBlue, SAIGON_PALETTE.woodDark);
  pxRect(ctx, q2x + 2, q2y + 12, 2, 6, SAIGON_PALETTE.woodDark);
  pxRect(ctx, q2x + 5, q2y + 12, 2, 6, SAIGON_PALETTE.woodDark);
}

/** Vẽ Quán nước chú Ba (ghế nhựa thấp, bàn kim loại, bình trà đá, mái che) */
export function drawDrinkStall(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  footY: number,
  lighting: LightingPreset,
) {
  const w = 60;
  const x = Math.round(centerX - w / 2);
  const y = Math.round(footY - 48);

  ctx.save();
  ctx.globalAlpha = 0.22;
  pxRect(ctx, x - 2, footY - 3, w + 4, 6, SAIGON_PALETTE.woodDark);
  ctx.restore();

  // Khung sạp & quầy pha chế
  pxBox(ctx, x + 4, y + 12, w - 8, 34, SAIGON_PALETTE.woodLight, SAIGON_PALETTE.woodDark);
  pxBox(ctx, x + 10, y + 18, w - 20, 14, '#A9D0C6', SAIGON_PALETTE.woodDark);
  // Bình trà đá & ly nhựa trên quầy
  pxBox(ctx, x + 14, y + 21, 7, 9, SAIGON_PALETTE.emberOrange, SAIGON_PALETTE.woodDark);
  pxBox(ctx, x + 25, y + 23, 5, 7, SAIGON_PALETTE.goldNeon, SAIGON_PALETTE.woodDark);
  pxRect(ctx, x + 34, y + 25, 4, 5, SAIGON_PALETTE.creamWall);

  // Mái che dốc màu ngói
  pxBox(ctx, x, y, w, 12, SAIGON_PALETTE.roofRed, SAIGON_PALETTE.woodDark);
  pxBox(ctx, x + 5, y + 1, w - 10, 10, SAIGON_PALETTE.signBlue, SAIGON_PALETTE.woodDark);
  drawSignText(ctx, 'QUÁN NƯỚC', x + w / 2, y + 6, SAIGON_PALETTE.goldNeon, 5.8, w - 14, SAIGON_PALETTE.woodDark);

  if (lighting.lampsOn) {
    ctx.save();
    ctx.globalAlpha = 0.25;
    pxRect(ctx, x + 8, y + 16, w - 16, 16, SAIGON_PALETTE.goldNeon);
    ctx.restore();
  }

  // Bàn inox thấp + 2 ghế nhựa đỏ/xanh vỉa hè đặc trưng Sài Gòn
  const tableX = x + w + 2;
  pxRect(ctx, tableX, footY - 10, 12, 2, SAIGON_PALETTE.creamWall);
  pxRect(ctx, tableX + 2, footY - 8, 1, 7, SAIGON_PALETTE.curbStone);
  pxRect(ctx, tableX + 9, footY - 8, 1, 7, SAIGON_PALETTE.curbStone);
  pxRect(ctx, tableX + 4, footY - 12, 3, 2, SAIGON_PALETTE.goldNeon); // ly trà tắc
  // Ghế nhựa đỏ
  pxBox(ctx, tableX - 7, footY - 7, 6, 4, SAIGON_PALETTE.signRed, SAIGON_PALETTE.woodDark);
  pxRect(ctx, tableX - 6, footY - 3, 1, 3, SAIGON_PALETTE.signRed);
  pxRect(ctx, tableX - 3, footY - 3, 1, 3, SAIGON_PALETTE.signRed);
  // Ghế nhựa xanh
  pxBox(ctx, tableX + 13, footY - 7, 6, 4, SAIGON_PALETTE.signBlue, SAIGON_PALETTE.woodDark);
  pxRect(ctx, tableX + 14, footY - 3, 1, 3, SAIGON_PALETTE.signBlue);
  pxRect(ctx, tableX + 17, footY - 3, 1, 3, SAIGON_PALETTE.signBlue);
}

/** Các tiểu cảnh nhỏ gắn với nghề của từng NPC */
export function drawNpcCornerProps(
  ctx: CanvasRenderingContext2D,
  streetW: number,
  housesBottomY: number,
  sidewalkBottomY: number,
) {
  const pctX = (p: number) => Math.round((p / 100) * streetW);
  const pctY = (ly: number) => {
    const t = (ly - 33) / (56 - 33);
    const minY = housesBottomY + (sidewalkBottomY - housesBottomY) * 0.22;
    const maxY = housesBottomY + (sidewalkBottomY - housesBottomY) * 0.88;
    return Math.round(minY + t * (maxY - minY));
  };

  // Góc hoa Cô Sáu (trái dưới)
  const fx = pctX(4.2);
  const fy = pctY(54.5);
  pxBox(ctx, fx, fy - 7, 7, 7, SAIGON_PALETTE.woodLight, SAIGON_PALETTE.woodDark);
  pxRect(ctx, fx + 1, fy - 11, 5, 4, SAIGON_PALETTE.goldNeon);
  pxRect(ctx, fx + 2, fy - 12, 2, 2, SAIGON_PALETTE.signRed);
  pxBox(ctx, fx + 9, fy - 6, 6, 6, SAIGON_PALETTE.brickWall, SAIGON_PALETTE.woodDark);
  pxRect(ctx, fx + 10, fy - 10, 4, 4, SAIGON_PALETTE.creamWall);

  // Xe giao hàng Tí đậu sát hiên trên
  const tx = pctX(54.5);
  const ty = pctY(35);
  pxRect(ctx, tx, ty - 5, 4, 4, SAIGON_PALETTE.woodDark);
  pxRect(ctx, tx + 11, ty - 5, 4, 4, SAIGON_PALETTE.woodDark);
  pxBox(ctx, tx + 2, ty - 9, 11, 5, SAIGON_PALETTE.signBlue, SAIGON_PALETTE.woodDark);
  pxBox(ctx, tx, ty - 14, 7, 6, SAIGON_PALETTE.goldNeon, SAIGON_PALETTE.woodDark);

  // Góc sửa xe Chú Bảy (bên phải quán nước)
  const rx = pctX(83.5);
  const ry = pctY(53.5);
  // Lốp xe dựng + ống bơm + bảng cờ lê
  pxBox(ctx, rx, ry - 10, 8, 10, SAIGON_PALETTE.denimDark, SAIGON_PALETTE.woodDark);
  pxRect(ctx, rx + 2, ry - 8, 4, 6, SAIGON_PALETTE.tileMid);
  pxRect(ctx, rx + 10, ry - 12, 2, 12, SAIGON_PALETTE.emberOrange); // ống bơm
  pxRect(ctx, rx + 8, ry - 12, 6, 2, SAIGON_PALETTE.woodDark);

  // Ghế thấp Bà Tư ngồi hóng mát bên phải
  const bx = pctX(96);
  const by = pctY(53);
  pxBox(ctx, bx, by - 5, 6, 4, SAIGON_PALETTE.signBlue, SAIGON_PALETTE.woodDark);
}

/**
 * Vẽ nhân vật pixel art (Người chơi & 5 NPC) với:
 * - Bóng đổ dưới chân biến đổi theo buổi trong ngày
 * - Animation idle (nhún nhẹ + quay đầu) & đi bộ 4 hướng
 * - Trang phục & vật dụng đặc trưng từng người (giỏ hoa, mâm đồ ăn, thùng giao hàng, cờ lê, quạt)
 */
export function drawCharacterPixelSprite(
  ctx: CanvasRenderingContext2D,
  meta: NpcVisualMeta,
  cx: number,
  footY: number,
  options: {
    isMoving: boolean;
    facing: FacingDirection;
    timeSec: number;
    lighting: LightingPreset;
    isNearby?: boolean;
    seed?: number;
  },
) {
  const { isMoving, facing, timeSec, lighting, isNearby = false, seed = 0 } = options;
  const x = Math.round(cx);
  const y = Math.round(footY);

  // Bóng đổ dưới chân
  ctx.save();
  ctx.globalAlpha = 0.28;
  const shadowW = 12;
  const shadowH = Math.max(3, Math.round(4 * lighting.shadowScaleY));
  const shadowOx = Math.round(lighting.shadowSkewX * 4);
  pxRect(ctx, x - Math.floor(shadowW / 2) + shadowOx, y - 2, shadowW, shadowH, SAIGON_PALETTE.woodDark);
  ctx.restore();

  // Vòng sáng dưới chân nếu đang ở gần để tương tác
  if (isNearby) {
    const pulse = Math.sin(timeSec * 6) > 0 ? 1 : 0;
    ctx.save();
    ctx.strokeStyle = SAIGON_PALETTE.goldNeon;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x - 9 - pulse, y - 4, 18 + pulse * 2, 5);
    ctx.restore();
  }

  // Nhịp đi bộ hoặc nhún nhẹ đứng yên
  const walkCycle = isMoving ? Math.sin(timeSec * 14) : 0;
  const bobY = isMoving
    ? Math.abs(Math.round(Math.sin(timeSec * 14))) * -1
    : Math.sin(timeSec * 2.4 + seed) > 0.4
      ? -1
      : 0;
  const glanceOffset = !isMoving && Math.sin(timeSec * 0.9 + seed * 2) > 0.8 ? 1 : 0;

  const legL = isMoving ? Math.round(walkCycle * 2) : 0;
  const legR = isMoving ? Math.round(-walkCycle * 2) : 0;
  const armSwing = isMoving ? Math.round(walkCycle * 2) : 0;

  const topY = y - 23 + bobY;

  // Chân / quần
  pxRect(ctx, x - 4, topY + 15 + Math.min(0, legL), 3, 7, meta.pants);
  pxRect(ctx, x + 1, topY + 15 + Math.min(0, legR), 3, 7, meta.pants);
  // Dép / giày
  pxRect(ctx, x - 5, topY + 21 + Math.min(0, legL), 4, 2, SAIGON_PALETTE.woodDark);
  pxRect(ctx, x + 1, topY + 21 + Math.min(0, legR), 4, 2, SAIGON_PALETTE.woodDark);

  // Thân áo
  pxBox(ctx, x - 5, topY + 7, 10, 9, meta.shirt, SAIGON_PALETTE.woodDark);
  pxRect(ctx, x - 4, topY + 13, 8, 2, meta.shirtShade);

  // Tạp dề nhỏ cho người chơi ("Bạn")
  if (meta.id === 'player') {
    pxRect(ctx, x - 3, topY + 10, 6, 6, SAIGON_PALETTE.creamWall);
  }

  // Hai tay
  pxRect(ctx, x - 7, topY + 8 + armSwing, 2, 6, SAIGON_PALETTE.skinWarm);
  pxRect(ctx, x + 5, topY + 8 - armSwing, 2, 6, SAIGON_PALETTE.skinWarm);

  // Đầu & tóc
  pxBox(ctx, x - 4, topY, 8, 7, SAIGON_PALETTE.skinWarm, SAIGON_PALETTE.woodDark);
  pxRect(ctx, x - 4, topY, 8, 2, meta.hair);
  if (facing === 'up') {
    pxRect(ctx, x - 4, topY + 1, 8, 5, meta.hair);
  } else {
    const eyeShift = facing === 'left' ? -1 : facing === 'right' ? 1 : glanceOffset;
    pxRect(ctx, x - 2 + eyeShift, topY + 3, 1, 2, SAIGON_PALETTE.woodDark);
    pxRect(ctx, x + 1 + eyeShift, topY + 3, 1, 2, SAIGON_PALETTE.woodDark);
  }

  // Nón / mũ bảo hiểm
  if (meta.hatColor) {
    pxBox(ctx, x - 5, topY - 2, 10, 3, meta.hatColor, SAIGON_PALETTE.woodDark);
    if (facing === 'right') pxRect(ctx, x + 4, topY, 2, 1, SAIGON_PALETTE.woodDark);
    if (facing === 'left') pxRect(ctx, x - 6, topY, 2, 1, SAIGON_PALETTE.woodDark);
  }

  // Đạo cụ đặc trưng theo nghề của từng NPC
  if (meta.prop === 'FLOWERS') {
    // Giỏ hoa cúc & hoa hồng trên tay Cô Sáu
    pxBox(ctx, x - 9, topY + 9, 5, 5, SAIGON_PALETTE.woodLight, SAIGON_PALETTE.woodDark);
    pxRect(ctx, x - 9, topY + 6, 2, 3, SAIGON_PALETTE.goldNeon);
    pxRect(ctx, x - 6, topY + 7, 2, 2, SAIGON_PALETTE.signRed);
    pxRect(ctx, x - 7, topY + 5, 2, 2, SAIGON_PALETTE.leafMid);
  } else if (meta.prop === 'PARCEL') {
    // Thùng hàng vàng của Tí giao hàng
    pxBox(ctx, x + 5, topY + 8, 6, 6, SAIGON_PALETTE.goldNeon, SAIGON_PALETTE.woodDark);
    pxRect(ctx, x + 6, topY + 10, 4, 1, SAIGON_PALETTE.woodMid);
  } else if (meta.prop === 'WRENCH') {
    // Cờ lê bạc trên tay Chú Bảy
    pxRect(ctx, x - 8, topY + 6, 2, 7, SAIGON_PALETTE.creamWall);
    pxRect(ctx, x - 9, topY + 5, 4, 2, SAIGON_PALETTE.curbStone);
  } else if (meta.prop === 'TRAY') {
    // Mâm bánh / đĩa nhỏ của Cô Năm
    pxRect(ctx, x + 5, topY + 11, 6, 2, SAIGON_PALETTE.woodLight);
    pxRect(ctx, x + 6, topY + 9, 4, 2, SAIGON_PALETTE.emberOrange);
  } else if (meta.prop === 'FAN') {
    // Quạt nan & khăn choàng Bà Tư
    pxRect(ctx, x - 3, topY + 7, 6, 2, SAIGON_PALETTE.creamWall);
    const fanWave = Math.sin(timeSec * 4) > 0 ? 1 : 0;
    pxRect(ctx, x + 6, topY + 8 + fanWave, 4, 4, SAIGON_PALETTE.ochreWall);
  }
}

/** Vẽ chân dung pixel nhỏ cho hộp thoại Visual Novel (khớp 100% NPC đang nói) */
export function getNpcVisualMeta(id: string): NpcVisualMeta {
  if (id in NPC_VISUAL_META) {
    return NPC_VISUAL_META[id as NpcVisualMeta['id']];
  }
  return NPC_VISUAL_META.player;
}

/** Vẽ xe cộ chạy qua lại trên lòng đường (xe máy nhiều màu, xe ba gác, xe đạp, ô tô) */
export function drawTrafficVehicle(
  ctx: CanvasRenderingContext2D,
  vehicle: TrafficVehicle,
  laneY: number,
  lighting: LightingPreset,
  timeSec: number,
) {
  const x = Math.round(vehicle.x);
  const y = Math.round(laneY);
  const bounce = Math.sin(timeSec * 16 + vehicle.id) > 0 ? 0 : -1;

  ctx.save();
  ctx.translate(x, y);
  if (vehicle.dir < 0) {
    ctx.scale(-1, 1);
  }

  // Bóng xe trên mặt đường
  ctx.globalAlpha = 0.25;
  pxRect(ctx, -14, -2, 28, 4, SAIGON_PALETTE.woodDark);
  ctx.globalAlpha = 1;

  if (vehicle.kind === 'motorbike') {
    // Bánh xe
    pxBox(ctx, -11, -6, 6, 6, SAIGON_PALETTE.woodDark, SAIGON_PALETTE.curbStone);
    pxBox(ctx, 5, -6, 6, 6, SAIGON_PALETTE.woodDark, SAIGON_PALETTE.curbStone);
    // Thân xe máy
    pxBox(ctx, -9, -11 + bounce, 18, 5, vehicle.bodyColor, SAIGON_PALETTE.woodDark);
    pxRect(ctx, -6, -12 + bounce, 8, 2, SAIGON_PALETTE.woodDark); // yên
    pxRect(ctx, 6, -16 + bounce, 2, 6, SAIGON_PALETTE.curbStone); // đầu xe
    // Đèn pha
    pxRect(ctx, 8, -14 + bounce, 2, 3, SAIGON_PALETTE.goldNeon);
    if (lighting.lampsOn) {
      ctx.globalAlpha = 0.28;
      ctx.fillStyle = SAIGON_PALETTE.goldNeon;
      ctx.beginPath();
      ctx.moveTo(10, -13 + bounce);
      ctx.lineTo(30, -18 + bounce);
      ctx.lineTo(30, -6 + bounce);
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 1;
    }
    // Người lái + nón bảo hiểm
    pxBox(ctx, -3, -19 + bounce, 6, 8, vehicle.bodyColor === SAIGON_PALETTE.signRed ? SAIGON_PALETTE.signBlue : SAIGON_PALETTE.emberOrange, SAIGON_PALETTE.woodDark);
    pxBox(ctx, -2, -25 + bounce, 6, 6, vehicle.helmetColor, SAIGON_PALETTE.woodDark);
    pxRect(ctx, -1, -22 + bounce, 4, 2, SAIGON_PALETTE.skinWarm);
  } else if (vehicle.kind === 'ba_gac') {
    // Xe ba gác chở hàng Sài Gòn
    pxBox(ctx, -16, -6, 6, 6, SAIGON_PALETTE.woodDark, SAIGON_PALETTE.curbStone);
    pxBox(ctx, -7, -6, 6, 6, SAIGON_PALETTE.woodDark, SAIGON_PALETTE.curbStone);
    pxBox(ctx, 9, -6, 6, 6, SAIGON_PALETTE.woodDark, SAIGON_PALETTE.curbStone);
    // Thùng chở hàng
    pxBox(ctx, -17, -18 + bounce, 19, 12, SAIGON_PALETTE.woodLight, SAIGON_PALETTE.woodDark);
    pxRect(ctx, -15, -21 + bounce, 14, 3, SAIGON_PALETTE.ochreWall); // thùng carton
    // Đầu lái
    pxBox(ctx, 2, -13 + bounce, 11, 7, SAIGON_PALETTE.signBlue, SAIGON_PALETTE.woodDark);
    pxBox(ctx, 3, -21 + bounce, 5, 8, SAIGON_PALETTE.leafMid, SAIGON_PALETTE.woodDark);
    pxBox(ctx, 3, -26 + bounce, 5, 5, vehicle.helmetColor, SAIGON_PALETTE.woodDark);
  } else if (vehicle.kind === 'bicycle') {
    // Xe đạp
    pxBox(ctx, -10, -7, 7, 7, SAIGON_PALETTE.asphaltDark, SAIGON_PALETTE.curbStone);
    pxBox(ctx, 4, -7, 7, 7, SAIGON_PALETTE.asphaltDark, SAIGON_PALETTE.curbStone);
    pxRect(ctx, -7, -9 + bounce, 13, 2, SAIGON_PALETTE.leafMid);
    pxRect(ctx, 5, -14 + bounce, 2, 6, SAIGON_PALETTE.curbStone);
    pxBox(ctx, -4, -19 + bounce, 5, 8, SAIGON_PALETTE.creamWall, SAIGON_PALETTE.woodDark);
    pxBox(ctx, -3, -24 + bounce, 5, 5, SAIGON_PALETTE.ochreWall, SAIGON_PALETTE.woodDark);
  } else {
    // Ô tô / Taxi con nhỏ
    pxBox(ctx, -19, -13 + bounce, 38, 9, vehicle.bodyColor, SAIGON_PALETTE.woodDark);
    pxBox(ctx, -11, -20 + bounce, 22, 8, vehicle.bodyColor, SAIGON_PALETTE.woodDark);
    pxRect(ctx, -9, -18 + bounce, 8, 5, '#A9D0C6');
    pxRect(ctx, 1, -18 + bounce, 8, 5, '#A9D0C6');
    pxRect(ctx, -3, -22 + bounce, 6, 2, SAIGON_PALETTE.goldNeon); // mào taxi
    pxBox(ctx, -14, -6, 7, 7, SAIGON_PALETTE.woodDark, SAIGON_PALETTE.creamWall);
    pxBox(ctx, 8, -6, 7, 7, SAIGON_PALETTE.woodDark, SAIGON_PALETTE.creamWall);
    pxRect(ctx, 17, -11 + bounce, 2, 3, SAIGON_PALETTE.goldNeon);
    if (lighting.lampsOn) {
      ctx.globalAlpha = 0.3;
      ctx.fillStyle = SAIGON_PALETTE.goldNeon;
      ctx.beginPath();
      ctx.moveTo(19, -10 + bounce);
      ctx.lineTo(42, -16 + bounce);
      ctx.lineTo(42, -3 + bounce);
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  ctx.restore();
}
