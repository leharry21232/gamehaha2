import { useEffect, useRef, useState } from 'react';
import { BASE_MARKET_PRICES, RAW_INGREDIENTS } from '../orders';
import {
  NEIGHBORHOOD_HELP_QUEST,
  NEIGHBORHOOD_PARCEL_QUEST,
  WORLD_INTERACTABLES,
  getVendorLocation,
  type NeighborhoodEvent,
  type NeighborhoodHelpQuestStatus,
  type NeighborhoodParcelQuestStatus,
  type WorldInteractable,
} from '../world';
import type { GameHudSnapshot } from '../types';
import { LIGHTING_PRESETS, NPC_VISUAL_META, type TimeOfDayLighting } from './config';
import { NeighborhoodCanvasRenderer } from './renderer';
import { getNpcVisualMeta, type FacingDirection } from './sprites';

export type WorldPanelTab = 'MAP' | 'BAG' | 'JOURNAL' | 'PHONE' | null;

export interface NeighborhoodMapViewProps {
  hud: GameHudSnapshot;
  player: { x: number; y: number };
  nearbyLocation: WorldInteractable | null;
  neighborhoodEvent: NeighborhoodEvent;
  lighting: TimeOfDayLighting;
  selectedVendorSpot: string;
  worldPanel: WorldPanelTab;
  onChangePanel: (panel: WorldPanelTab) => void;
  worldNotice: string;
  onDismissNotice: () => void;
  cartVisitorEventSeen: boolean;
  onTriggerCuriousVisitor: () => void;
  onInteract: () => void;
  onClaimStoryMission: () => void;
  /** Điều khiển cảm ứng / joystick ảo dùng chung ref với vòng lặp di chuyển trong App.tsx */
  onSetTouchDirections: (dirs: Partial<Record<'up' | 'down' | 'left' | 'right', boolean>>) => void;
  /** Cho phép đọc vị trí tức thời từ playerRef trong App.tsx để animation 60fps không giật */
  getLivePlayerPosition: () => { x: number; y: number };
  helpQuestStatus: NeighborhoodHelpQuestStatus;
  helpQuestOfferOpen: boolean;
  onAcceptHelpQuest: () => void;
  onDeferHelpQuest: () => void;
  onCloseHelpQuestOffer: () => void;
  parcelQuestStatus: NeighborhoodParcelQuestStatus;
  parcelQuestOfferOpen: boolean;
  onAcceptParcelQuest: () => void;
  onDeferParcelQuest: () => void;
  onCloseParcelQuestOffer: () => void;
}

/** Icon pixel SVG nhất quán cho thanh nút dưới (Bản đồ, Túi đồ, Nhiệm vụ, Điện thoại) */
function PixelTabIcon({ tab }: { tab: Exclude<WorldPanelTab, null> }) {
  if (tab === 'MAP') {
    return (
      <svg viewBox="0 0 16 16" className="h-5 w-5 [image-rendering:pixelated]" shapeRendering="crispEdges" aria-hidden="true">
        <rect x="1" y="2" width="4" height="12" fill="#E8D19A" />
        <rect x="6" y="3" width="4" height="12" fill="#D4B572" />
        <rect x="11" y="2" width="4" height="12" fill="#E8D19A" />
        <rect x="3" y="5" width="3" height="2" fill="#4C8B52" />
        <rect x="7" y="7" width="3" height="3" fill="#C84436" />
        <rect x="12" y="4" width="2" height="5" fill="#28649C" />
      </svg>
    );
  }
  if (tab === 'BAG') {
    return (
      <svg viewBox="0 0 16 16" className="h-5 w-5 [image-rendering:pixelated]" shapeRendering="crispEdges" aria-hidden="true">
        <rect x="5" y="2" width="6" height="2" fill="#3A261D" />
        <rect x="3" y="4" width="10" height="10" fill="#B86446" />
        <rect x="4" y="5" width="8" height="4" fill="#E6BA7A" />
        <rect x="7" y="8" width="2" height="3" fill="#FFD15C" />
      </svg>
    );
  }
  if (tab === 'JOURNAL') {
    return (
      <svg viewBox="0 0 16 16" className="h-5 w-5 [image-rendering:pixelated]" shapeRendering="crispEdges" aria-hidden="true">
        <rect x="2" y="2" width="12" height="12" fill="#7B4F35" />
        <rect x="4" y="3" width="9" height="10" fill="#F2DCAD" />
        <rect x="5" y="5" width="6" height="2" fill="#C84436" />
        <rect x="5" y="8" width="6" height="1" fill="#3A261D" />
        <rect x="5" y="10" width="4" height="1" fill="#3A261D" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 16 16" className="h-5 w-5 [image-rendering:pixelated]" shapeRendering="crispEdges" aria-hidden="true">
      <rect x="4" y="1" width="8" height="14" fill="#2D3A4B" />
      <rect x="5" y="3" width="6" height="8" fill="#9EC5B2" />
      <rect x="6" y="4" width="4" height="2" fill="#FFD15C" />
      <rect x="7" y="12" width="2" height="2" fill="#F2DCAD" />
    </svg>
  );
}

/** Chân dung pixel thu nhỏ của NPC hoặc Xe bánh tráng trong hộp thoại Visual Novel */
function VisualNovelPortrait({ npcId }: { npcId: string }) {
  if (npcId === 'cart') {
    return (
      <svg viewBox="0 0 24 24" className="h-12 w-12 [image-rendering:pixelated]" shapeRendering="crispEdges" aria-hidden="true">
        <rect x="3" y="4" width="18" height="3" fill="#C84436" />
        <rect x="6" y="4" width="3" height="3" fill="#F2DCAD" />
        <rect x="12" y="4" width="3" height="3" fill="#F2DCAD" />
        <rect x="4" y="7" width="16" height="5" fill="#D7E8E1" />
        <rect x="4" y="12" width="16" height="7" fill="#B86446" />
        <rect x="6" y="19" width="3" height="3" fill="#2D3A4B" />
        <rect x="15" y="19" width="3" height="3" fill="#2D3A4B" />
      </svg>
    );
  }
  const meta = getNpcVisualMeta(npcId);
  return (
    <svg viewBox="0 0 20 24" className="h-12 w-10 [image-rendering:pixelated]" shapeRendering="crispEdges" aria-hidden="true">
      {meta.hatColor && <rect x="4" y="1" width="12" height="3" fill={meta.hatColor} />}
      <rect x="5" y="3" width="10" height="8" fill="#DFA77F" />
      <rect x="5" y="3" width="10" height="3" fill={meta.hair} />
      <rect x="7" y="7" width="1" height="2" fill="#3A261D" />
      <rect x="12" y="7" width="1" height="2" fill="#3A261D" />
      <rect x="4" y="11" width="12" height="8" fill={meta.shirt} />
      <rect x="6" y="19" width="3" height="4" fill={meta.pants} />
      <rect x="11" y="19" width="3" height="4" fill={meta.pants} />
      {meta.prop === 'FLOWERS' && <rect x="1" y="12" width="4" height="5" fill="#FFD15C" />}
      {meta.prop === 'PARCEL' && <rect x="15" y="12" width="4" height="5" fill="#FFD15C" />}
      {meta.prop === 'WRENCH' && <rect x="1" y="10" width="2" height="8" fill="#F2DCAD" />}
    </svg>
  );
}

/** Hộp thoại NPC phong cách Visual Novel (chân dung + tên + chữ chạy từng ký tự + nút tiếp tục) */
function WorldDialogueBox({
  npc,
  message,
  onContinue,
}: {
  npc: WorldInteractable;
  message: string;
  onContinue: () => void;
}) {
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    setCharCount(0);
    const timer = window.setInterval(() => {
      setCharCount((prev) => {
        if (prev >= message.length) {
          window.clearInterval(timer);
          return prev;
        }
        return Math.min(message.length, prev + 2);
      });
    }, 18);
    return () => window.clearInterval(timer);
  }, [message]);

  const isTyping = charCount < message.length;
  const visibleText = message.slice(0, charCount);
  const meta = getNpcVisualMeta(npc.id);

  return (
    <section
      role="dialog"
      aria-label={`Lời thoại của ${npc.name}`}
      style={{
        bottom: 'calc(max(12px, env(safe-area-inset-bottom)) + 108px)',
      }}
      className="pointer-events-auto absolute left-1/2 z-40 grid w-[min(94vw,540px)] -translate-x-1/2 grid-cols-[56px_minmax(0,1fr)] gap-3 border-[3px] border-[#4A2E1E] bg-[#241A15]/95 p-2.5 text-[#FFF2D1] shadow-[4px_4px_0_#110C09] sm:bottom-24 sm:grid-cols-[64px_minmax(0,1fr)] sm:p-3"
      onClick={() => {
        if (isTyping) setCharCount(message.length);
      }}
    >
      <div className="flex items-end justify-center border-2 border-[#A77E4C] bg-[#E8CFA0] p-1">
        <VisualNovelPortrait npcId={npc.id} />
      </div>
      <div className="flex min-w-0 flex-col justify-between gap-1.5">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#F2DCAD]/20 pb-1">
          <strong className="font-pixel text-sm font-bold tracking-wide text-[#FFD15C]">
            {npc.name}
          </strong>
          <span className="text-[10px] font-semibold text-[#C8DFC6]">
            {npc.kind === 'NPC' ? meta.role : 'Địa điểm khu phố'}
          </span>
        </div>
        <p className="max-h-20 overflow-y-auto allow-touch-scroll text-xs leading-relaxed text-[#FFF8E7] sm:text-sm">
          {visibleText}
          {isTyping && <span className="ml-0.5 inline-block h-3 w-1.5 animate-pulse bg-[#FFD15C] align-middle" />}
        </p>
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] text-[#E6BA7A]/80">
            {isTyping ? 'Chạm để hiện hết chữ' : 'Nhấn E hoặc Tiếp tục'}
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (isTyping) {
                setCharCount(message.length);
              } else {
                onContinue();
              }
            }}
            className="min-h-[38px] border-2 border-[#4A2E1E] bg-[#FFD15C] px-3.5 py-1 font-pixel text-xs font-bold text-[#241710] shadow-[2px_2px_0_#110C09] active:translate-y-0.5 hover:bg-[#FFE08A]"
          >
            {isTyping ? 'Hiện hết ▸' : 'Tiếp tục ▸'}
          </button>
        </div>
      </div>
    </section>
  );
}

/** Joystick ảo bán trong suốt cho ngón tay cái trái (hỗ trợ kéo mượt và giữ hướng) */
function VirtualThumbJoystick({
  onChangeDirections,
}: {
  onChangeDirections: (dirs: Partial<Record<'up' | 'down' | 'left' | 'right', boolean>>) => void;
}) {
  const padRef = useRef<HTMLDivElement | null>(null);
  const [knobOffset, setKnobOffset] = useState({ x: 0, y: 0 });
  const activePointerId = useRef<number | null>(null);

  const updateFromPointer = (clientX: number, clientY: number) => {
    const el = padRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const maxRadius = rect.width * 0.34;
    const dx = clientX - cx;
    const dy = clientY - cy;
    const dist = Math.hypot(dx, dy);
    const clampedDist = Math.min(maxRadius, dist);
    const angle = Math.atan2(dy, dx);
    const kx = dist > 0 ? Math.cos(angle) * clampedDist : 0;
    const ky = dist > 0 ? Math.sin(angle) * clampedDist : 0;
    setKnobOffset({ x: kx, y: ky });

    const deadzone = 8;
    onChangeDirections({
      left: dx < -deadzone,
      right: dx > deadzone,
      up: dy < -deadzone,
      down: dy > deadzone,
    });
  };

  const resetStick = () => {
    activePointerId.current = null;
    setKnobOffset({ x: 0, y: 0 });
    onChangeDirections({ up: false, down: false, left: false, right: false });
  };

  return (
    <div
      ref={padRef}
      role="group"
      aria-label="Joystick di chuyển"
      onPointerDown={(e) => {
        e.preventDefault();
        activePointerId.current = e.pointerId;
        e.currentTarget.setPointerCapture(e.pointerId);
        updateFromPointer(e.clientX, e.clientY);
      }}
      onPointerMove={(e) => {
        if (activePointerId.current !== e.pointerId) return;
        e.preventDefault();
        updateFromPointer(e.clientX, e.clientY);
      }}
      onPointerUp={(e) => {
        if (activePointerId.current !== e.pointerId) return;
        resetStick();
      }}
      onPointerCancel={resetStick}
      onLostPointerCapture={resetStick}
      className="relative flex h-24 w-24 touch-none items-center justify-center rounded-full border-2 border-[#E8CFA0]/55 bg-[#1B1410]/50 backdrop-blur-[2px] sm:h-24 sm:w-24"
    >
      {/* Mũi tên chỉ hướng mờ hỗ trợ nhìn nhanh */}
      <span className="pointer-events-none absolute top-1 text-[10px] font-bold text-[#F2DCAD]/65">▲</span>
      <span className="pointer-events-none absolute bottom-1 text-[10px] font-bold text-[#F2DCAD]/65">▼</span>
      <span className="pointer-events-none absolute left-1.5 text-[10px] font-bold text-[#F2DCAD]/65">◀</span>
      <span className="pointer-events-none absolute right-1.5 text-[10px] font-bold text-[#F2DCAD]/65">▶</span>
      <div
        style={{ transform: `translate(${knobOffset.x}px, ${knobOffset.y}px)` }}
        className="pointer-events-none h-10 w-10 rounded-full border-2 border-[#4A2E1E] bg-[#FFD15C]/85 shadow-[0_2px_0_#110C09]"
      />
    </div>
  );
}

/**
 * Giao diện bản đồ Khu phố Sài Gòn hoàn chỉnh:
 * - Canvas 2D pixel art full-screen 100dvh, hỗ trợ dọc & ngang, giữ tỉ lệ sắc nét
 * - HUD gọn ở góc trên (không che bảng hiệu cửa hàng)
 * - Joystick & cụm nút hành động bán trong suốt đặt dạt hai góc dưới
 */
export function NeighborhoodMapView(props: NeighborhoodMapViewProps) {
  const {
    hud,
    player,
    nearbyLocation,
    neighborhoodEvent,
    lighting,
    selectedVendorSpot,
    worldPanel,
    onChangePanel,
    worldNotice,
    onDismissNotice,
    cartVisitorEventSeen,
    onTriggerCuriousVisitor,
    onInteract,
    onClaimStoryMission,
    onSetTouchDirections,
    getLivePlayerPosition,
    helpQuestStatus,
    helpQuestOfferOpen,
    onAcceptHelpQuest,
    onDeferHelpQuest,
    onCloseHelpQuestOffer,
    parcelQuestStatus,
    parcelQuestOfferOpen,
    onAcceptParcelQuest,
    onDeferParcelQuest,
    onCloseParcelQuestOffer,
  } = props;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rendererRef = useRef<NeighborhoodCanvasRenderer | null>(null);
  const [eventExpanded, setEventExpanded] = useState(false);

  // Giữ state mới nhất trong ref để vòng lặp canvas 60fps không phải khởi tạo lại
  const latestPropsRef = useRef({
    nearbyLocation,
    lighting,
    rainActive: hud.rainActive,
    getLivePlayerPosition,
  });
  latestPropsRef.current = {
    nearbyLocation,
    lighting,
    rainActive: hud.rainActive,
    getLivePlayerPosition,
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!rendererRef.current) {
      rendererRef.current = new NeighborhoodCanvasRenderer();
    }
    const renderer = rendererRef.current;
    const npcs = WORLD_INTERACTABLES.filter((loc) => loc.kind === 'NPC');

    let rafId = 0;
    let lastTs = 0;
    let prevPos = latestPropsRef.current.getLivePlayerPosition();
    let facing: FacingDirection = 'down';

    const loop = (ts: number) => {
      const dt = lastTs === 0 ? 0.016 : Math.min(0.05, (ts - lastTs) / 1000);
      lastTs = ts;

      const cur = latestPropsRef.current;
      const pos = cur.getLivePlayerPosition();
      const dx = pos.x - prevPos.x;
      const dy = pos.y - prevPos.y;
      const isMoving = Math.abs(dx) > 0.004 || Math.abs(dy) > 0.004;
      if (isMoving) {
        if (Math.abs(dx) >= Math.abs(dy)) {
          facing = dx > 0 ? 'right' : 'left';
        } else {
          facing = dy > 0 ? 'down' : 'up';
        }
      }
      prevPos = pos;

      const isNarrow = window.innerWidth < 768;
      renderer.render(
        canvas,
        {
          player: pos,
          isPlayerMoving: isMoving,
          playerFacing: facing,
          npcs,
          nearbyLocationId: cur.nearbyLocation?.id ?? null,
          lighting: cur.lighting,
          rainActive: cur.rainActive,
          safeInsets: {
            top: isNarrow ? 64 : 60,
            bottom: isNarrow ? 116 : 84,
            left: 8,
            right: 8,
          },
        },
        ts / 1000,
        dt,
      );

      rafId = window.requestAnimationFrame(loop);
    };

    rafId = window.requestAnimationFrame(loop);
    return () => window.cancelAnimationFrame(rafId);
  }, []);

  const lightingMeta = LIGHTING_PRESETS[lighting];
  const vendorLocation = getVendorLocation(selectedVendorSpot);
  const missionPct = Math.min(
    100,
    (hud.storyMission.progress / Math.max(1, hud.storyMission.target)) * 100,
  );

  return (
    <div className="fixed inset-0 z-[80] h-[100dvh] w-full overflow-hidden bg-[#1B222C] text-[#FFF8E7] select-none touch-none">
      {/* Canvas 2D pixel art lấp đầy toàn màn hình */}
      <canvas
        ref={canvasRef}
        className="block h-full w-full [image-rendering:pixelated]"
        aria-label="Bản đồ khu phố Sài Gòn"
      />

      {/* HUD GÓC TRÊN TRÁI — Gọn, không che bảng hiệu tiệm phía dưới */}
      <header
        style={{
          top: 'max(8px, env(safe-area-inset-top))',
          left: 'max(8px, env(safe-area-inset-left))',
        }}
        className="pointer-events-auto absolute z-30 flex max-w-[min(62vw,280px)] flex-col gap-1 border-2 border-[#4A2E1E] bg-[#261B15]/88 px-2.5 py-1.5 shadow-[3px_3px_0_#110C09] backdrop-blur-[2px]"
      >
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs">
          <span className="font-pixel font-bold text-[#FFD15C] tabular-nums">
            {hud.money.toLocaleString('vi-VN')}đ
          </span>
          <span className="text-[11px] font-semibold text-[#F2DCAD]">
            Ngày {hud.day} · Cấp {hud.playerLevel}
          </span>
          <span className="border border-[#E6BA7A]/40 bg-[#4A3022] px-1.5 py-0.5 font-pixel text-[10px] font-bold text-[#FFE8B0]">
            {lightingMeta.shortLabel}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="truncate text-[10px] font-medium text-[#E8CFA0]">
            {hud.storyMission.title}
          </span>
          <span className="shrink-0 font-mono text-[10px] font-bold text-[#9EE4A8] tabular-nums">
            {hud.storyMission.progress}/{hud.storyMission.target}
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden bg-[#140E0A]">
          <div className="h-full bg-[#7EB863] transition-all" style={{ width: `${missionPct}%` }} />
        </div>
      </header>

      {/* CHIP NHỊP SỐNG GÓC TRÊN PHẢI — Thu gọn mặc định, chạm để xem chi tiết */}
      <div
        style={{
          top: 'max(8px, env(safe-area-inset-top))',
          right: 'max(8px, env(safe-area-inset-right))',
        }}
        className="pointer-events-auto absolute z-30 flex flex-col items-end gap-1"
      >
        <button
          type="button"
          onClick={() => setEventExpanded((v) => !v)}
          className="flex min-h-[38px] items-center gap-1.5 border-2 border-[#4A2E1E] bg-[#261B15]/88 px-2.5 py-1 text-left shadow-[3px_3px_0_#110C09] backdrop-blur-[2px] active:translate-y-0.5"
          aria-expanded={eventExpanded}
        >
          <span className="font-pixel text-[11px] font-bold text-[#FFD15C]">
            {neighborhoodEvent.title}
          </span>
          <span className="text-[10px] text-[#E6BA7A]">{eventExpanded ? '▲' : '▼'}</span>
        </button>
        {eventExpanded && (
          <div className="w-[min(78vw,270px)] border-2 border-[#4A2E1E] bg-[#261B15]/95 p-2.5 text-xs shadow-[3px_3px_0_#110C09]">
            <p className="font-pixel text-[11px] font-bold text-[#FFD15C]">
              {neighborhoodEvent.dayPartLabel} · {neighborhoodEvent.trafficLabel}
            </p>
            <p className="mt-1 leading-relaxed text-[#FFF2D1]">
              {neighborhoodEvent.description}
            </p>
          </div>
        )}
      </div>

      {/* NHẮC NHIỆM VỤ PHỤ NHỎ GỌN (nếu đang nhận) */}
      {(helpQuestStatus === 'ACCEPTED' || parcelQuestStatus === 'ACCEPTED') && !worldPanel && (
        <div
          style={{ top: 'max(66px, calc(env(safe-area-inset-top) + 58px))' }}
          className="pointer-events-none absolute left-1/2 z-20 -translate-x-1/2 border border-[#4A2E1E] bg-[#261B15]/85 px-2.5 py-1 text-center text-[10px] font-semibold text-[#FFD15C] shadow-[2px_2px_0_#110C09]"
        >
          {helpQuestStatus === 'ACCEPTED' ? NEIGHBORHOOD_HELP_QUEST.objective : NEIGHBORHOOD_PARCEL_QUEST.objective}
        </div>
      )}

      {/* CỤM ĐIỀU KHIỂN DƯỚI — Dạt hai góc, nửa trong suốt, chạm >= 44x44px */}
      <div
        style={{
          bottom: 'max(8px, env(safe-area-inset-bottom))',
          left: 'max(8px, env(safe-area-inset-left))',
          right: 'max(8px, env(safe-area-inset-right))',
        }}
        className="pointer-events-none absolute z-30 flex items-end justify-between gap-2"
      >
        {/* Góc trái: Joystick ảo cho điện thoại / máy tính bảng (ẩn khi dùng màn hình desktop lớn) */}
        <div className="pointer-events-auto lg:hidden">
          <VirtualThumbJoystick onChangeDirections={onSetTouchDirections} />
        </div>

        {/* Desktop: Gợi ý phím tắt gọn ở góc dưới trái */}
        <div className="pointer-events-none hidden border-2 border-[#4A2E1E] bg-[#261B15]/80 px-3 py-2 text-xs text-[#F2DCAD] shadow-[3px_3px_0_#110C09] lg:block">
          <span className="font-pixel font-bold text-[#FFD15C]">WASD / Mũi tên</span> để đi ·{' '}
          <span className="font-pixel font-bold text-[#FFD15C]">Phím E</span> để tương tác
        </div>

        {/* Góc phải: Nút tương tác nổi bật + Thanh 4 nút Bản đồ / Túi đồ / Nhiệm vụ / Điện thoại */}
        <div className="pointer-events-auto flex flex-col items-end gap-1.5">
          <div className="flex flex-wrap items-center justify-end gap-1.5">
            {nearbyLocation?.id === 'cart' && !cartVisitorEventSeen && (
              <button
                type="button"
                onClick={onTriggerCuriousVisitor}
                className="min-h-[44px] border-2 border-[#4A2E1E] bg-[#FFF0C9]/95 px-3 py-2 font-pixel text-xs font-bold text-[#241710] shadow-[3px_3px_0_#110C09] active:translate-y-0.5 hover:bg-[#FFE39A]"
              >
                💬 Khách tò mò
              </button>
            )}

            <button
              type="button"
              onClick={onInteract}
              className={`flex min-h-[44px] items-center gap-2 border-2 px-3.5 py-2 font-pixel text-xs font-bold shadow-[3px_3px_0_#110C09] transition-transform active:translate-y-0.5 ${
                nearbyLocation
                  ? 'border-[#4A2E1E] bg-[#FFD15C] text-[#241710] hover:bg-[#FFE08A]'
                  : 'border-[#4A2E1E] bg-[#3A281E]/85 text-[#F2DCAD]/85 hover:bg-[#4B3427]'
              }`}
            >
              <span className="grid h-6 w-6 place-items-center border border-[#4A2E1E] bg-[#FFF8E7] text-xs font-black text-[#241710]">
                E
              </span>
              <span className="flex flex-col items-start leading-tight">
                <span className="max-w-[140px] truncate">
                  {nearbyLocation ? nearbyLocation.name : 'Tương tác'}
                </span>
                {nearbyLocation && (
                  <span className="text-[9px] font-semibold text-[#5C3A23]">
                    Chạm E để tương tác
                  </span>
                )}
              </span>
            </button>
          </div>

          <nav
            aria-label="Thanh công cụ khu phố"
            className="grid grid-cols-4 gap-1.5 border-2 border-[#4A2E1E] bg-[#261B15]/82 p-1 shadow-[3px_3px_0_#110C09] backdrop-blur-[2px]"
          >
            {(
              [
                { id: 'MAP', label: 'Bản đồ' },
                { id: 'BAG', label: 'Túi đồ' },
                { id: 'JOURNAL', label: 'Nhiệm vụ' },
                { id: 'PHONE', label: 'Điện thoại' },
              ] as const
            ).map((item) => {
              const active = worldPanel === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => onChangePanel(active ? null : item.id)}
                  className={`flex min-h-[44px] min-w-[54px] flex-col items-center justify-center gap-0.5 border-2 px-1.5 py-1 transition-transform active:translate-y-0.5 sm:min-w-[66px] ${
                    active
                      ? 'border-[#FFD15C] bg-[#8D5A36] text-[#FFF8E7]'
                      : 'border-[#5C3E2A] bg-[#3B2B22]/90 text-[#F2DCAD] hover:bg-[#4D382B]'
                  }`}
                >
                  <PixelTabIcon tab={item.id} />
                  <span className="font-pixel text-[10px] font-bold leading-none whitespace-nowrap">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* HỘP THOẠI VISUAL NOVEL */}
      {worldNotice && nearbyLocation && !worldPanel && !helpQuestOfferOpen && !parcelQuestOfferOpen && (
        <WorldDialogueBox npc={nearbyLocation} message={worldNotice} onContinue={onDismissNotice} />
      )}

      {/* THÔNG BÁO KHI BẤM E Ở KHOẢNG TRỐNG */}
      {worldNotice && !nearbyLocation && !worldPanel && !helpQuestOfferOpen && !parcelQuestOfferOpen && (
        <div className="pointer-events-auto absolute left-1/2 top-24 z-40 flex w-[min(90vw,420px)] -translate-x-1/2 items-center justify-between gap-2 border-2 border-[#4A2E1E] bg-[#261B15]/95 px-3 py-2 text-xs text-[#FFF2D1] shadow-[3px_3px_0_#110C09]">
          <p className="leading-relaxed">{worldNotice}</p>
          <button
            type="button"
            onClick={onDismissNotice}
            className="min-h-[36px] min-w-[36px] shrink-0 border border-[#E6BA7A]/40 bg-[#4A3022] font-bold text-[#FFD15C]"
            aria-label="Đóng thông báo"
          >
            ×
          </button>
        </div>
      )}

      {/* MODAL BẢN ĐỒ / TÚI ĐỒ / NHIỆM VỤ / ĐIỆN THOẠI (chạm ra ngoài hoặc bấm × để đóng) */}
      {worldPanel && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F0B09]/65 p-3 backdrop-blur-[1px]"
          onClick={() => onChangePanel(null)}
        >
          <section
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-[82dvh] w-[min(94vw,560px)] flex-col border-[3px] border-[#4A2E1E] bg-[#261B15] text-[#FFF8E7] shadow-[6px_6px_0_#0D0806]"
          >
            <header className="flex items-center justify-between gap-3 border-b-2 border-[#4A2E1E] bg-[#3A281E] px-4 py-2.5">
              <div className="flex items-center gap-2">
                <PixelTabIcon tab={worldPanel} />
                <h2 className="font-pixel text-base font-bold text-[#FFD15C]">
                  {worldPanel === 'MAP'
                    ? 'Bản đồ khu phố'
                    : worldPanel === 'BAG'
                      ? 'Túi đồ & Nguyên liệu'
                      : worldPanel === 'JOURNAL'
                        ? 'Nhiệm vụ khu phố'
                        : 'Điện thoại khu phố'}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => onChangePanel(null)}
                aria-label="Đóng bảng thông tin"
                className="flex h-11 w-11 items-center justify-center border-2 border-[#4A2E1E] bg-[#C84436] font-pixel text-lg font-bold text-white shadow-[2px_2px_0_#110C09] active:translate-y-0.5 hover:bg-[#DB594B]"
              >
                ×
              </button>
            </header>

            <div className="allow-touch-scroll flex-1 space-y-3 overflow-y-auto p-4 text-xs">
              {worldPanel === 'MAP' && (
                <>
                  <div className="border-2 border-[#5C3E2A] bg-[#1D1410] p-3">
                    <p className="font-pixel text-xs font-bold text-[#FFD15C]">
                      Vị trí hiện tại của bạn: ({Math.round(player.x)}%, {Math.round(player.y)}%)
                    </p>
                    <p className="mt-1 leading-relaxed text-[#E8CFA0]">
                      Đi dọc vỉa hè bằng WASD / phím mũi tên / Joystick góc trái. Đến gần xe bánh tráng hoặc bà con trong hẻm rồi bấm E để trò chuyện hoặc mở ca bán.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {WORLD_INTERACTABLES.map((loc) => {
                      const dist = Math.hypot(player.x - loc.x, player.y - loc.y);
                      const isNear = nearbyLocation?.id === loc.id;
                      const dirHint =
                        Math.abs(loc.x - player.x) < 6
                          ? 'Ngay gần bạn'
                          : loc.x < player.x
                            ? 'Hướng bên trái'
                            : 'Hướng bên phải';
                      return (
                        <div
                          key={loc.id}
                          className={`border-2 p-2.5 ${
                            isNear
                              ? 'border-[#FFD15C] bg-[#3E2D20]'
                              : 'border-[#5C3E2A] bg-[#1D1410]'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-pixel text-xs font-bold text-[#FFF2D1]">
                              {loc.name}
                            </span>
                            <span className="text-[10px] font-semibold text-[#9EE4A8]">
                              {isNear ? 'Đang ở gần' : `${dirHint} (${Math.round(dist)}m)`}
                            </span>
                          </div>
                          <p className="mt-1 text-[11px] leading-relaxed text-[#E8CFA0]/90">
                            {loc.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

              {worldPanel === 'BAG' && (
                <>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    <div className="border-2 border-[#5C3E2A] bg-[#1D1410] p-2.5">
                      <span className="text-[10px] text-[#E6BA7A]">Tiền mặt</span>
                      <p className="mt-0.5 font-pixel text-base font-bold text-[#9EE4A8] tabular-nums">
                        {hud.money.toLocaleString('vi-VN')}đ
                      </p>
                    </div>
                    <div className="border-2 border-[#5C3E2A] bg-[#1D1410] p-2.5">
                      <span className="text-[10px] text-[#E6BA7A]">Xu nâng cấp</span>
                      <p className="mt-0.5 font-pixel text-base font-bold text-[#FFD15C] tabular-nums">
                        {hud.xu.toLocaleString('vi-VN')} Xu
                      </p>
                    </div>
                    <div className="col-span-2 border-2 border-[#5C3E2A] bg-[#1D1410] p-2.5 sm:col-span-1">
                      <span className="text-[10px] text-[#E6BA7A]">Cấp độ bán hàng</span>
                      <p className="mt-0.5 font-pixel text-base font-bold text-[#FFF2D1] tabular-nums">
                        Cấp {hud.playerLevel} ({hud.playerXp}/{hud.playerXpToNext} XP)
                      </p>
                    </div>
                  </div>

                  <div className="border-2 border-[#5C3E2A] bg-[#1D1410] p-3">
                    <p className="font-pixel text-xs font-bold text-[#FFD15C]">
                      Kho nguyên liệu trên xe (Tối đa {hud.maxStockPerItem}/món)
                    </p>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      {RAW_INGREDIENTS.map((ing) => {
                        const qty = hud.inventory[ing.id] ?? 0;
                        const marketPrice = hud.marketPrices[ing.id] ?? BASE_MARKET_PRICES[ing.id];
                        return (
                          <div
                            key={ing.id}
                            className="flex items-center justify-between border border-[#4A3022] bg-[#261B15] px-2.5 py-1.5"
                          >
                            <div>
                              <p className="font-semibold text-[#FFF2D1]">{ing.name}</p>
                              <p className="text-[10px] text-[#E6BA7A]">
                                Chợ: {marketPrice.toLocaleString('vi-VN')}đ
                              </p>
                            </div>
                            <span
                              className={`font-pixel text-xs font-bold tabular-nums ${
                                qty > 0 ? 'text-[#9EE4A8]' : 'text-[#E8CFA0]/60'
                              }`}
                            >
                              {qty}/{hud.maxStockPerItem}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}

              {worldPanel === 'JOURNAL' && (
                <>
                  <div className="border-2 border-[#5C3E2A] bg-[#1D1410] p-3 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-pixel text-xs font-bold text-[#FFD15C]">
                        {hud.storyMission.chapter}
                      </span>
                      <span className="border border-[#7EB863]/50 bg-[#2F5F42]/50 px-2 py-0.5 text-[10px] font-bold text-[#9EE4A8]">
                        {hud.storyMission.allCompleted
                          ? 'Đã hoàn thành'
                          : hud.storyMission.completed
                            ? 'Chờ nhận thưởng'
                            : 'Đang thực hiện'}
                      </span>
                    </div>
                    <p className="font-pixel text-base font-bold text-white">{hud.storyMission.title}</p>
                    <p className="leading-relaxed text-[#E8CFA0]">{hud.storyMission.description}</p>
                    <div className="border border-[#4A3022] bg-[#261B15] p-2">
                      <p className="font-bold text-[#FFD15C]">{hud.storyMission.npcName}</p>
                      <p className="mt-1 italic text-[#FFF2D1]">{hud.storyMission.storyText}</p>
                    </div>
                    <div className="flex items-center justify-between text-[11px] tabular-nums">
                      <span>
                        Tiến độ: {hud.storyMission.progress.toLocaleString('vi-VN')} /{' '}
                        {hud.storyMission.target.toLocaleString('vi-VN')}
                      </span>
                      <span className="font-bold text-[#9EE4A8]">
                        Thưởng: {hud.storyMission.reward.toLocaleString('vi-VN')}đ
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden bg-[#140E0A]">
                      <div
                        className="h-full bg-[#7EB863] transition-all"
                        style={{ width: `${missionPct}%` }}
                      />
                    </div>
                    {hud.storyMission.completed && !hud.storyMission.allCompleted && (
                      <button
                        type="button"
                        onClick={onClaimStoryMission}
                        className="min-h-[44px] w-full border-2 border-[#1E4631] bg-[#7EB863] px-3 py-2 font-pixel text-xs font-bold text-[#14251A] shadow-[2px_2px_0_#0D0806] active:translate-y-0.5 hover:bg-[#9EE4A8]"
                      >
                        Nhận thưởng · {hud.storyMission.reward.toLocaleString('vi-VN')}đ
                      </button>
                    )}
                  </div>

                  <div className="border-2 border-[#5C3E2A] bg-[#1D1410] p-3 space-y-2">
                    <p className="font-pixel text-xs font-bold text-[#FFD15C]">
                      Nhiệm vụ phụ trong hẻm
                    </p>
                    <div className="border border-[#4A3022] bg-[#261B15] p-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-white">{NEIGHBORHOOD_HELP_QUEST.title}</span>
                        <span className="text-[10px] font-bold text-[#FFD15C]">
                          {helpQuestStatus === 'COMPLETED'
                            ? 'Đã xong'
                            : helpQuestStatus === 'ACCEPTED'
                              ? 'Đang làm'
                              : 'Chưa nhận'}
                        </span>
                      </div>
                      <p className="mt-1 text-[11px] text-[#E8CFA0]">
                        {helpQuestStatus === 'COMPLETED'
                          ? 'Bạn đã chuyển lời nhắn của Chú Bảy đến Cô Sáu.'
                          : helpQuestStatus === 'ACCEPTED'
                            ? NEIGHBORHOOD_HELP_QUEST.objective
                            : 'Gặp Chú Bảy sửa xe để nghe lời nhờ.'}
                      </p>
                    </div>
                    <div className="border border-[#4A3022] bg-[#261B15] p-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-white">{NEIGHBORHOOD_PARCEL_QUEST.title}</span>
                        <span className="text-[10px] font-bold text-[#FFD15C]">
                          {parcelQuestStatus === 'COMPLETED'
                            ? 'Đã xong'
                            : parcelQuestStatus === 'ACCEPTED'
                              ? 'Đang làm'
                              : 'Chưa nhận'}
                        </span>
                      </div>
                      <p className="mt-1 text-[11px] text-[#E8CFA0]">
                        {parcelQuestStatus === 'COMPLETED'
                          ? 'Bạn đã báo tin cho Bà Tư về gói hàng của Tí.'
                          : parcelQuestStatus === 'ACCEPTED'
                            ? NEIGHBORHOOD_PARCEL_QUEST.objective
                            : 'Gặp Tí giao hàng để nghe lời nhờ.'}
                      </p>
                    </div>
                  </div>
                </>
              )}

              {worldPanel === 'PHONE' && (
                <>
                  <div className="border-2 border-[#5C3E2A] bg-[#1D1410] p-3">
                    <p className="font-pixel text-xs font-bold text-[#FFD15C]">
                      Khu vực đang bán: {vendorLocation.name}
                    </p>
                    <p className="mt-1 text-[11px] text-[#E8CFA0]">
                      {vendorLocation.description} Tiền chỗ: {vendorLocation.rentPerDay.toLocaleString('vi-VN')}đ/ngày.
                    </p>
                  </div>

                  <div className="border-2 border-[#5C3E2A] bg-[#1D1410] p-3">
                    <p className="font-pixel text-xs font-bold text-[#FFD15C]">
                      Tin chợ đầu mối hôm nay
                    </p>
                    <p className="mt-1 font-bold text-white">{hud.newspaper.headline}</p>
                    {hud.newspaper.subtext && (
                      <p className="mt-0.5 text-[11px] text-[#E8CFA0]">{hud.newspaper.subtext}</p>
                    )}
                  </div>

                  <div className="border-2 border-[#5C3E2A] bg-[#1D1410] p-3">
                    <p className="font-pixel text-xs font-bold text-[#FFD15C]">
                      Danh bạ hàng xóm Sài Gòn
                    </p>
                    <div className="mt-2 space-y-1.5">
                      {(['co_sau', 'co_nam', 'shipper_ti', 'chu_bay', 'ba_tu'] as const).map((id) => {
                        const meta = NPC_VISUAL_META[id];
                        return (
                          <div
                            key={id}
                            className="flex items-center gap-2.5 border border-[#4A3022] bg-[#261B15] p-2"
                          >
                            <div className="grid h-9 w-9 shrink-0 place-items-center border border-[#A77E4C] bg-[#E8CFA0]">
                              <VisualNovelPortrait npcId={id} />
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-[#FFF2D1]">{meta.shortName}</p>
                              <p className="truncate text-[10px] text-[#E6BA7A]">{meta.role}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
          </section>
        </div>
      )}

      {/* MODAL NHẬN NHIỆM VỤ PHỤ: CHUYẾN HÀNG CUỐI NGÕ (TÍ) */}
      {parcelQuestOfferOpen && (
        <div
          className="fixed inset-0 z-[95] flex items-center justify-center bg-black/65 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="parcel-quest-title"
        >
          <div className="allow-touch-scroll max-h-[85dvh] w-full max-w-md overflow-y-auto border-[3px] border-[#35291f] bg-[#f4e2b8] p-4 text-[#392819] shadow-[6px_6px_0_#111]">
            <div className="mb-2 flex items-center justify-between gap-3">
              <h2 id="parcel-quest-title" className="font-pixel text-base font-bold">
                📦 {NEIGHBORHOOD_PARCEL_QUEST.title}
              </h2>
              <button
                type="button"
                onClick={onCloseParcelQuestOffer}
                aria-label="Đóng lời mời"
                className="flex h-10 w-10 items-center justify-center border-2 border-[#543a25] bg-[#e7c77e] font-bold"
              >
                ×
              </button>
            </div>
            <p className="text-xs leading-relaxed">{NEIGHBORHOOD_PARCEL_QUEST.offerDialogue}</p>
            <p className="mt-3 border-y-2 border-[#b99a69] py-2 text-xs font-bold">
              Nhiệm vụ: {NEIGHBORHOOD_PARCEL_QUEST.objective}
            </p>
            <div className="mt-3 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={onDeferParcelQuest}
                className="min-h-[44px] border-[3px] border-[#765c3c] bg-[#e7c77e] px-3.5 py-2 font-pixel text-xs font-bold hover:bg-[#f1d89d]"
              >
                Để lúc khác
              </button>
              <button
                type="button"
                onClick={onAcceptParcelQuest}
                className="min-h-[44px] border-[3px] border-[#31533e] bg-[#8fbd8c] px-4 py-2 font-pixel text-xs font-bold hover:bg-[#a7d3a2]"
              >
                Nhận lời
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL NHẬN NHIỆM VỤ PHỤ: LỜI NHỜ CỦA CHÚ BẢY */}
      {helpQuestOfferOpen && (
        <div
          className="fixed inset-0 z-[95] flex items-center justify-center bg-black/65 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="neighbor-quest-title"
        >
          <div className="allow-touch-scroll max-h-[85dvh] w-full max-w-md overflow-y-auto border-[3px] border-[#35291f] bg-[#f4e2b8] p-4 text-[#392819] shadow-[6px_6px_0_#111]">
            <div className="mb-2 flex items-center justify-between gap-3">
              <h2 id="neighbor-quest-title" className="font-pixel text-base font-bold">
                📜 {NEIGHBORHOOD_HELP_QUEST.title}
              </h2>
              <button
                type="button"
                onClick={onCloseHelpQuestOffer}
                aria-label="Đóng lời mời"
                className="flex h-10 w-10 items-center justify-center border-2 border-[#543a25] bg-[#e7c77e] font-bold"
              >
                ×
              </button>
            </div>
            <p className="text-xs leading-relaxed">{NEIGHBORHOOD_HELP_QUEST.offerDialogue}</p>
            <p className="mt-3 border-y-2 border-[#b99a69] py-2 text-xs font-bold">
              Nhiệm vụ: {NEIGHBORHOOD_HELP_QUEST.objective}
            </p>
            <div className="mt-3 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={onDeferHelpQuest}
                className="min-h-[44px] border-[3px] border-[#765c3c] bg-[#e7c77e] px-3.5 py-2 font-pixel text-xs font-bold hover:bg-[#f1d89d]"
              >
                Để lúc khác
              </button>
              <button
                type="button"
                onClick={onAcceptHelpQuest}
                className="min-h-[44px] border-[3px] border-[#31533e] bg-[#8fbd8c] px-4 py-2 font-pixel text-xs font-bold hover:bg-[#a7d3a2]"
              >
                Nhận lời
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
