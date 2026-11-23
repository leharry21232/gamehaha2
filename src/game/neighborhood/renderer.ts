import type { WorldInteractable } from '../world';
import {
  LIGHTING_PRESETS,
  MAP_METRICS,
  NPC_VISUAL_META,
  SAIGON_PALETTE,
  TUNING_CONFIG,
  type TimeOfDayLighting,
} from './config';
import {
  drawBanhTrangCart,
  drawCharacterPixelSprite,
  drawDrinkStall,
  drawNpcCornerProps,
  drawSidewalkAndRoadBase,
  drawSkyAndShophouses,
  drawStreetTree,
  drawTrafficVehicle,
  pxRect,
  type FacingDirection,
  type TrafficVehicle,
} from './sprites';

export interface NeighborhoodRenderInput {
  player: { x: number; y: number };
  isPlayerMoving: boolean;
  playerFacing: FacingDirection;
  npcs: readonly WorldInteractable[];
  nearbyLocationId: WorldInteractable['id'] | null;
  lighting: TimeOfDayLighting;
  rainActive: boolean;
  /** Khoảng an toàn trên/dưới (px CSS) để nhãn tên không đè vào HUD hay nút dưới */
  safeInsets: { top: number; bottom: number; left: number; right: number };
}

interface AmbientParticle {
  kind: 'smoke' | 'leaf' | 'dust';
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
}

interface RainDrop {
  x: number;
  y: number;
  speed: number;
  len: number;
}

interface NameplateBox {
  id: string;
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
  isPlayer: boolean;
  isNearby: boolean;
  anchorX: number;
  anchorY: number;
}

/**
 * Bộ dựng đồ họa Canvas 2D cho bản đồ Khu phố Bánh Tráng Sài Gòn.
 * - Tự co giãn theo tỉ lệ màn hình (dọc, ngang, tablet, PC) với devicePixelRatio.
 * - Giữ pixel art sắc nét (imageSmoothingEnabled = false), khóa ~60fps nhẹ trên điện thoại.
 */
export class NeighborhoodCanvasRenderer {
  private cameraX = 0;
  private cameraInitialized = false;
  private vehicles: TrafficVehicle[] = [];
  private particles: AmbientParticle[] = [];
  private raindrops: RainDrop[] = [];
  private smokeTimer = 0;
  private leafTimer = 0;
  private lastCssW = 0;
  private lastCssH = 0;

  constructor() {
    this.initTraffic();
    this.initAmbientParticles();
  }

  private initTraffic() {
    const colors = [
      SAIGON_PALETTE.signRed,
      SAIGON_PALETTE.signBlue,
      SAIGON_PALETTE.goldNeon,
      SAIGON_PALETTE.leafMid,
      SAIGON_PALETTE.creamWall,
    ];
    const helmets = [
      SAIGON_PALETTE.goldNeon,
      SAIGON_PALETTE.signRed,
      SAIGON_PALETTE.creamWall,
      SAIGON_PALETTE.signBlue,
    ];
    const kinds: TrafficVehicle['kind'][] = [
      'motorbike',
      'ba_gac',
      'motorbike',
      'bicycle',
      'motorbike',
      'car',
      'motorbike',
    ];
    this.vehicles = Array.from({ length: TUNING_CONFIG.vehicleCount }, (_, i) => {
      const dir: 1 | -1 = i % 2 === 0 ? 1 : -1;
      const kind = kinds[i % kinds.length];
      const baseSpeed =
        kind === 'bicycle'
          ? 24
          : kind === 'ba_gac'
            ? 34
            : kind === 'car'
              ? 64
              : 46 + (i % 3) * 11;
      return {
        id: i,
        kind,
        x: ((i * 78) % (MAP_METRICS.streetPixelWidth + 80)) - 40,
        lane: (i % 3) as 0 | 1 | 2,
        dir,
        speed: baseSpeed,
        bodyColor: kind === 'car' ? SAIGON_PALETTE.goldNeon : colors[i % colors.length],
        helmetColor: helmets[i % helmets.length],
      };
    });
  }

  private initAmbientParticles() {
    this.particles = Array.from({ length: 10 }, (_, i) => ({
      kind: 'dust',
      x: (i * 47) % MAP_METRICS.streetPixelWidth,
      y: 95 + ((i * 29) % 100),
      vx: (i % 2 === 0 ? 1 : -1) * (3 + (i % 3)),
      vy: -1.2,
      life: (i * 0.7) % 5,
      maxLife: 5,
      size: 1,
    }));
    this.raindrops = Array.from({ length: 42 }, (_, i) => ({
      x: (i * 23) % MAP_METRICS.streetPixelWidth,
      y: (i * 37) % 300,
      speed: 170 + (i % 4) * 35,
      len: 7 + (i % 3) * 3,
    }));
  }

  /** Cập nhật xe cộ & hạt hiệu ứng nhẹ theo thời gian thực */
  public update(dtSeconds: number, housesBottomY: number, sidewalkBottomY: number, rainActive: boolean) {
    const dt = Math.min(0.05, Math.max(0, dtSeconds));
    const wrapMin = -55;
    const wrapMax = MAP_METRICS.streetPixelWidth + 55;

    for (const v of this.vehicles) {
      v.x += v.dir * v.speed * TUNING_CONFIG.trafficSpeedMultiplier * dt;
      if (v.dir > 0 && v.x > wrapMax) v.x = wrapMin;
      if (v.dir < 0 && v.x < wrapMin) v.x = wrapMax;
    }

    // Khói bếp than từ xe bánh tráng (x ~ 27%, ngay trên bếp than)
    this.smokeTimer += dt;
    if (this.smokeTimer >= 0.34 && this.particles.length < TUNING_CONFIG.maxAmbientParticles) {
      this.smokeTimer = 0;
      const cartPxX = 0.24 * MAP_METRICS.streetPixelWidth + 16;
      const grillY = housesBottomY + (sidewalkBottomY - housesBottomY) * 0.42;
      this.particles.push({
        kind: 'smoke',
        x: cartPxX + (Math.random() - 0.5) * 8,
        y: grillY,
        vx: 3 + Math.random() * 4,
        vy: -11 - Math.random() * 5,
        life: 0,
        maxLife: 1.6,
        size: 2,
      });
    }

    // Lá rụng nhẹ từ 2 cây xanh vỉa hè
    this.leafTimer += dt;
    if (this.leafTimer >= 1.3 && this.particles.length < TUNING_CONFIG.maxAmbientParticles) {
      this.leafTimer = 0;
      const fromLeft = Math.random() < 0.5;
      const treeX = (fromLeft ? 0.035 : 0.895) * MAP_METRICS.streetPixelWidth;
      this.particles.push({
        kind: 'leaf',
        x: treeX + (Math.random() - 0.5) * 18,
        y: housesBottomY - 6,
        vx: (Math.random() - 0.3) * 8,
        vy: 12 + Math.random() * 6,
        life: 0,
        maxLife: 3.2,
        size: 2,
      });
    }

    for (let i = this.particles.length - 1; i >= 0; i -= 1) {
      const p = this.particles[i];
      p.life += dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      if (p.kind === 'leaf') {
        p.vx += Math.sin(p.life * 4) * 5 * dt;
      }
      if (p.life >= p.maxLife) {
        if (p.kind === 'dust') {
          p.life = 0;
          p.x = Math.random() * MAP_METRICS.streetPixelWidth;
          p.y = housesBottomY + Math.random() * (sidewalkBottomY - housesBottomY);
        } else {
          this.particles.splice(i, 1);
        }
      }
    }

    if (rainActive) {
      for (const drop of this.raindrops) {
        drop.x -= drop.speed * 0.28 * dt;
        drop.y += drop.speed * dt;
        if (drop.y > 310) {
          drop.y = -10;
          drop.x = Math.random() * (MAP_METRICS.streetPixelWidth + 60);
        }
        if (drop.x < -30) drop.x = MAP_METRICS.streetPixelWidth + 30;
      }
    }
  }

  /** Chuyển đổi Y logic (33..56) sang Y pixel ảo trên dải vỉa hè */
  private logicalYToPixelY(logicalY: number, virtualH: number): number {
    const clamped = Math.max(
      MAP_METRICS.walkableLogicalMinY,
      Math.min(MAP_METRICS.walkableLogicalMaxY, logicalY),
    );
    const t =
      (clamped - MAP_METRICS.walkableLogicalMinY) /
      (MAP_METRICS.walkableLogicalMaxY - MAP_METRICS.walkableLogicalMinY);
    const minPx = virtualH * MAP_METRICS.sidewalkScreenMinRatio;
    const maxPx = virtualH * MAP_METRICS.sidewalkScreenMaxRatio;
    return minPx + t * (maxPx - minPx);
  }

  public render(
    canvas: HTMLCanvasElement,
    input: NeighborhoodRenderInput,
    timeSec: number,
    dtSeconds: number,
  ) {
    const rect = canvas.getBoundingClientRect();
    const cssW = Math.max(1, Math.round(rect.width));
    const cssH = Math.max(1, Math.round(rect.height));
    const dpr = Math.min(window.devicePixelRatio || 1, 3);

    if (
      this.lastCssW !== cssW ||
      this.lastCssH !== cssH ||
      canvas.width !== Math.round(cssW * dpr) ||
      canvas.height !== Math.round(cssH * dpr)
    ) {
      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);
      this.lastCssW = cssW;
      this.lastCssH = cssH;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const aspect = cssW / cssH;
    const isPortrait = aspect < 1.15;
    const virtualH = isPortrait
      ? MAP_METRICS.portraitVirtualHeight
      : MAP_METRICS.landscapeVirtualHeight;
    const virtualW = Math.max(120, Math.round(virtualH * aspect));
    const streetW = MAP_METRICS.streetPixelWidth;

    const housesBottomY = Math.round(virtualH * MAP_METRICS.housesEndRatio);
    const sidewalkBottomY = Math.round(virtualH * MAP_METRICS.sidewalkEndRatio);

    this.update(dtSeconds, housesBottomY, sidewalkBottomY, input.rainActive);

    // Camera ngang bám theo người chơi (trên màn hình rộng sẽ căn giữa toàn con phố)
    const playerWorldX = (input.player.x / 100) * streetW;
    let targetCamX: number;
    if (virtualW >= streetW) {
      targetCamX = -Math.round((virtualW - streetW) / 2);
    } else {
      targetCamX = Math.max(0, Math.min(streetW - virtualW, playerWorldX - virtualW / 2));
    }

    if (!this.cameraInitialized) {
      this.cameraX = targetCamX;
      this.cameraInitialized = true;
    } else {
      this.cameraX += (targetCamX - this.cameraX) * Math.min(1, dtSeconds * 10 + 0.12);
    }

    const scaleX = (cssW * dpr) / virtualW;
    const scaleY = (cssH * dpr) / virtualH;
    const lighting = LIGHTING_PRESETS[input.lighting];

    // 1. Vẽ thế giới pixel art (tắt làm mượt để giữ nét pixel art sắc cạnh)
    ctx.save();
    ctx.imageSmoothingEnabled = false;
    ctx.setTransform(scaleX, 0, 0, scaleY, -Math.round(this.cameraX * scaleX), 0);

    const viewLeft = this.cameraX - 30;
    const viewRight = this.cameraX + virtualW + 30;

    // Bầu trời + dãy nhà phố ống Sài Gòn + dây điện
    drawSkyAndShophouses(ctx, viewLeft, viewRight, streetW, housesBottomY, lighting, timeSec);

    // Vỉa hè gạch bông + lòng đường + trụ đèn + thùng rác + xe đậu
    drawSidewalkAndRoadBase(
      ctx,
      viewLeft,
      viewRight,
      housesBottomY,
      sidewalkBottomY,
      virtualH,
      lighting,
      timeSec,
    );

    // Tiểu cảnh nghề nghiệp quanh vỉa hè
    drawNpcCornerProps(ctx, streetW, housesBottomY, sidewalkBottomY);

    // 2. Sắp xếp chiều sâu (Y-sorting) cho cây, xe bánh tráng, quán nước, NPC và người chơi
    interface DepthItem {
      sortY: number;
      draw: () => void;
    }
    const depthItems: DepthItem[] = [];

    // Hai cây xanh (khớp với collision left_tree x=0..7, right_tree x=86..93)
    depthItems.push({
      sortY: this.logicalYToPixelY(47, virtualH),
      draw: () =>
        drawStreetTree(ctx, 0.035 * streetW, this.logicalYToPixelY(47, virtualH), timeSec, 0),
    });
    depthItems.push({
      sortY: this.logicalYToPixelY(46, virtualH),
      draw: () =>
        drawStreetTree(ctx, 0.895 * streetW, this.logicalYToPixelY(46, virtualH), timeSec, 2.2),
    });

    // Xe bánh tráng (trung tâm x=24%, khớp collision x=14..34, y=32..54)
    const cartFootY = this.logicalYToPixelY(53, virtualH);
    depthItems.push({
      sortY: cartFootY,
      draw: () => drawBanhTrangCart(ctx, 0.24 * streetW, cartFootY, lighting, timeSec),
    });

    // Quán nước chú Ba (trung tâm x=64.5%, khớp collision x=57..72, y=31..52)
    const stallFootY = this.logicalYToPixelY(51, virtualH);
    depthItems.push({
      sortY: stallFootY,
      draw: () => drawDrinkStall(ctx, 0.645 * streetW, stallFootY, lighting),
    });

    // 5 NPC cố định trên vỉa hè
    input.npcs.forEach((npc, index) => {
      const npcX = (npc.x / 100) * streetW;
      const npcY = this.logicalYToPixelY(npc.y, virtualH);
      const meta = NPC_VISUAL_META[npc.id as keyof typeof NPC_VISUAL_META];
      if (!meta) return;
      depthItems.push({
        sortY: npcY,
        draw: () =>
          drawCharacterPixelSprite(ctx, meta, npcX, npcY, {
            isMoving: false,
            facing: 'down',
            timeSec,
            lighting,
            isNearby: input.nearbyLocationId === npc.id,
            seed: index * 1.7,
          }),
      });
    });

    // Người chơi ("Bạn")
    const playerY = this.logicalYToPixelY(input.player.y, virtualH);
    depthItems.push({
      sortY: playerY,
      draw: () =>
        drawCharacterPixelSprite(ctx, NPC_VISUAL_META.player, playerWorldX, playerY, {
          isMoving: input.isPlayerMoving,
          facing: input.playerFacing,
          timeSec,
          lighting,
          isNearby: false,
          seed: 0.4,
        }),
    });

    depthItems.sort((a, b) => a.sortY - b.sortY);
    for (const item of depthItems) {
      item.draw();
    }

    // 3. Giao thông đường phố (3 làn xe theo hướng chạy)
    const roadTopY = sidewalkBottomY + 12;
    const roadSpan = Math.max(24, virtualH - roadTopY - 6);
    const laneYs = [
      roadTopY + roadSpan * 0.22,
      roadTopY + roadSpan * 0.56,
      roadTopY + roadSpan * 0.88,
    ];
    for (const v of this.vehicles) {
      if (v.x < viewLeft - 45 || v.x > viewRight + 45) continue;
      drawTrafficVehicle(ctx, v, laneYs[v.lane], lighting, timeSec);
    }

    // 4. Hạt hiệu ứng nhẹ (khói bếp, lá rơi, bụi nắng, mưa nhẹ)
    for (const p of this.particles) {
      const alpha = p.kind === 'smoke' ? Math.max(0, 0.65 * (1 - p.life / p.maxLife)) : 0.7;
      ctx.globalAlpha = alpha;
      const color =
        p.kind === 'smoke'
          ? SAIGON_PALETTE.smokeCream
          : p.kind === 'leaf'
            ? SAIGON_PALETTE.leafLight
            : SAIGON_PALETTE.goldNeon;
      pxRect(ctx, p.x, p.y, p.size, p.size, color);
    }
    ctx.globalAlpha = 1;

    if (input.rainActive) {
      ctx.save();
      ctx.strokeStyle = 'rgba(205, 232, 245, 0.55)';
      ctx.lineWidth = 1;
      for (const drop of this.raindrops) {
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x - drop.len * 0.28, drop.y + drop.len);
        ctx.stroke();
      }
      ctx.restore();
    }

    // 5. Lớp phủ chu kỳ thời gian (Sáng sương mờ, Trưa nắng, Chiều cam, Tối dịu)
    if (lighting.mistAlpha > 0) {
      ctx.save();
      ctx.globalAlpha = lighting.mistAlpha;
      ctx.fillStyle = SAIGON_PALETTE.creamWall;
      ctx.fillRect(viewLeft, 0, virtualW + 60, housesBottomY + 14);
      ctx.restore();
    }
    if (lighting.tintAlpha > 0) {
      ctx.save();
      ctx.globalAlpha = lighting.tintAlpha;
      ctx.fillStyle = lighting.tintColor;
      ctx.fillRect(viewLeft, 0, virtualW + 60, virtualH);
      ctx.restore();
    }

    ctx.restore();

    // 6. Vẽ nhãn tên NPC + Bạn (tự động tránh chồng lấn & kẹp gọn trong màn hình)
    this.drawSmartNameplates(ctx, cssW, cssH, dpr, virtualW, virtualH, streetW, input);
  }

  /**
   * Vẽ nhãn tên của 5 NPC và "Bạn" bằng tọa độ CSS HiDPI:
   * - Tự động phát hiện va chạm hình chữ nhật (AABB) và đẩy giãn theo chiều dọc/ngang
   * - Clamp chặt vào trong vùng an toàn của màn hình, không bao giờ bị cắt mép
   */
  private drawSmartNameplates(
    ctx: CanvasRenderingContext2D,
    cssW: number,
    cssH: number,
    dpr: number,
    virtualW: number,
    virtualH: number,
    streetW: number,
    input: NeighborhoodRenderInput,
  ) {
    ctx.save();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const fontSize = cssW < 520 ? 11 : 12;
    ctx.font = `700 ${fontSize}px "Pixelify Sans", "Plus Jakarta Sans", sans-serif`;

    const padX = 7;
    const boxH = fontSize + 8;
    const safeLeft = input.safeInsets.left + TUNING_CONFIG.nameplateClampPadding;
    const safeRight = cssW - input.safeInsets.right - TUNING_CONFIG.nameplateClampPadding;
    const safeTop = input.safeInsets.top + 6;
    const safeBottom = cssH - input.safeInsets.bottom - 8;

    const toScreenX = (worldPctX: number) =>
      (((worldPctX / 100) * streetW - this.cameraX) / virtualW) * cssW;
    const toScreenY = (logicalY: number) =>
      (this.logicalYToPixelY(logicalY, virtualH) / virtualH) * cssH;
    const spriteCssHeight = (26 / virtualH) * cssH;

    const boxes: NameplateBox[] = [];

    // Nhãn "Bạn"
    const pSx = toScreenX(input.player.x);
    const pSy = toScreenY(input.player.y) - spriteCssHeight - boxH - 4;
    const pText = 'Bạn';
    const pW = Math.ceil(ctx.measureText(pText).width + padX * 2);
    boxes.push({
      id: 'player',
      label: pText,
      x: pSx - pW / 2,
      y: pSy,
      w: pW,
      h: boxH,
      isPlayer: true,
      isNearby: false,
      anchorX: pSx,
      anchorY: toScreenY(input.player.y) - spriteCssHeight,
    });

    // Nhãn 5 NPC (chỉ vẽ những NPC đang nằm trong hoặc gần khung nhìn hiện tại)
    for (const npc of input.npcs) {
      const sx = toScreenX(npc.x);
      if (sx < -60 || sx > cssW + 60) continue;
      const sy = toScreenY(npc.y) - spriteCssHeight - boxH - 4;
      const label = npc.name;
      const w = Math.ceil(ctx.measureText(label).width + padX * 2);
      boxes.push({
        id: npc.id,
        label,
        x: sx - w / 2,
        y: sy,
        w,
        h: boxH,
        isPlayer: false,
        isNearby: input.nearbyLocationId === npc.id,
        anchorX: sx,
        anchorY: toScreenY(npc.y) - spriteCssHeight,
      });
    }

    // Clamp bước 1 vào trong vùng an toàn màn hình
    const clampBox = (b: NameplateBox) => {
      b.x = Math.max(safeLeft, Math.min(safeRight - b.w, b.x));
      b.y = Math.max(safeTop, Math.min(safeBottom - b.h, b.y));
    };
    boxes.forEach(clampBox);

    // Xử lý tránh chồng lấn giữa các nhãn (lặp tối đa 4 lượt để ổn định vị trí)
    for (let pass = 0; pass < 4; pass += 1) {
      for (let i = 0; i < boxes.length; i += 1) {
        for (let j = i + 1; j < boxes.length; j += 1) {
          const a = boxes[i];
          const b = boxes[j];
          const overlapX = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
          const overlapY = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
          if (overlapX > -4 && overlapY > -3) {
            // Đẩy nhãn b lên trên hoặc xuống dưới nếu chạm nhãn a
            const pushY = overlapY + 5;
            if (b.y - pushY >= safeTop) {
              b.y -= pushY;
            } else {
              b.y += pushY;
            }
            clampBox(b);
          }
        }
      }
    }

    // Vẽ từng nhãn với viền pixel gỗ ấm Sài Gòn
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (const box of boxes) {
      const bx = Math.round(box.x);
      const by = Math.round(box.y);
      const bw = Math.round(box.w);
      const bh = Math.round(box.h);

      // Đổ bóng khối pixel
      ctx.fillStyle = 'rgba(20, 16, 12, 0.72)';
      ctx.fillRect(bx + 2, by + 2, bw, bh);

      // Nền nhãn
      ctx.fillStyle = box.isPlayer
        ? '#9EE4A8'
        : box.isNearby
          ? '#FFD15C'
          : '#FFF0C9';
      ctx.fillRect(bx, by, bw, bh);

      // Viền ngoài
      ctx.strokeStyle = box.isPlayer ? '#1E4631' : '#4A3022';
      ctx.lineWidth = 2;
      ctx.strokeRect(bx + 0.5, by + 0.5, bw - 1, bh - 1);

      // Chữ tiếng Việt sắc nét
      ctx.fillStyle = '#241710';
      ctx.fillText(box.label, bx + bw / 2, by + bh / 2 + 0.5);
    }

    ctx.restore();
  }
}
