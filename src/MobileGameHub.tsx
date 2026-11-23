import {
  Pause,
  Play,
  Scissors,
  Sparkles,
  Store,
  Volume2,
  VolumeX,
  Zap,
} from 'lucide-react';
import type { GameHudSnapshot } from './game/types';

interface MobileGameHubProps {
  hud: GameHudSnapshot;
  onFortune: () => void;
  onFlow: () => void;
  onLoan: () => void;
  onShop: () => void;
  onMute: () => void;
  onPause: () => void;
  onCloseShift: () => void;
  onAppease: () => void;
}

function formatMobileClock(seconds: number): string {
  const safe = Math.max(0, Math.floor(seconds));
  return `${Math.floor(safe / 60)}:${String(safe % 60).padStart(2, '0')}`;
}

function MobileActionButton({
  icon,
  label,
  tone,
  onClick,
  disabled = false,
}: {
  icon: React.ReactNode;
  label: string;
  tone: 'violet' | 'purple' | 'yellow' | 'green' | 'rose';
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`mobile-hub-action mobile-hub-action--${tone}`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

/**
 * Phone-first HUD. Kept separate from the desktop HUD so phone controls can
 * have their own information hierarchy and touch target sizing.
 */
export function MobileGameHub({
  hud,
  onFortune,
  onFlow,
  onLoan,
  onShop,
  onMute,
  onPause,
  onCloseShift,
  onAppease,
}: MobileGameHubProps) {
  const xpPercent = Math.min(100, Math.max(0, (hud.playerXp / Math.max(1, hud.playerXpToNext)) * 100));
  const isPlaying = hud.screen === 'PLAYING';
  const isCooking = isPlaying && hud.phase === 'COOKING' && !hud.checkout.active;
  const showHeat = isPlaying && hud.phase === 'COOKING';

  return (
    <div className="mobile-game-hub absolute left-0 right-0 top-0 z-20 px-2 pt-1 pointer-events-none">
      <section className="mobile-game-hub__card safe-top-bar pointer-events-auto">
        <div className="mobile-game-hub__topline">
          <div className="mobile-game-hub__level">
            <span className="mobile-game-hub__level-label">⭐ CẤP {hud.playerLevel}</span>
            <div className="mobile-game-hub__xp-track">
              <div className="mobile-game-hub__xp-fill" style={{ width: `${xpPercent}%` }} />
            </div>
            <span className="mobile-game-hub__xp-text">{hud.playerXp}/{hud.playerXpToNext} XP</span>
          </div>
          <div className="mobile-game-hub__utility">
            <span className="mobile-game-hub__day">NGÀY {hud.day}</span>
            <span className={`mobile-game-hub__clock ${hud.dayDuration > 0 && hud.dayTimeLeft <= 20 ? 'is-urgent' : ''}`}>
              {hud.dayDuration === 0 ? '∞' : formatMobileClock(hud.dayTimeLeft)}
            </span>
            <button type="button" className="mobile-hub-icon-button" onClick={onMute} aria-label={hud.muted ? 'Bật âm thanh' : 'Tắt âm thanh'}>
              {hud.muted ? <VolumeX /> : <Volume2 />}
            </button>
            {(isPlaying || hud.screen === 'PAUSED') && (
              <button type="button" className="mobile-hub-icon-button mobile-hub-icon-button--pause" onClick={onPause} aria-label={hud.screen === 'PAUSED' ? 'Tiếp tục' : 'Tạm dừng'}>
                {hud.screen === 'PAUSED' ? <Play /> : <Pause />}
              </button>
            )}
          </div>
        </div>

        <div className="mobile-game-hub__stats">
          <span className="mobile-hub-stat mobile-hub-stat--money"><b>{hud.money.toLocaleString('vi-VN')}đ</b><small>TIỀN</small></span>
          <span className="mobile-hub-stat mobile-hub-stat--xu"><b>{hud.xu.toLocaleString('vi-VN')}</b><small>XU</small></span>
          <span className="mobile-hub-stat"><b>{hud.ordersServed}</b><small>ĐƠN</small></span>
          <span className="mobile-hub-stat"><b>{hud.combo > 1 ? `x${hud.combo}` : '—'}</b><small>COMBO</small></span>
        </div>

        <div className="mobile-game-hub__mission" title={hud.storyMission.title}>
          <span>📖</span>
          <span className="mobile-game-hub__mission-title">{hud.storyMission.title}</span>
          <b>{hud.storyMission.progress}/{hud.storyMission.target}</b>
        </div>

        {showHeat && (
          <div className="mobile-game-hub__condition">
            <div className="mobile-game-hub__heat">
              <span>🚨 HEAT {Math.round(hud.policeHeat)}%</span>
              <div className="mobile-hub-heat-track">
                <div style={{ width: `${Math.min(100, Math.max(0, hud.policeHeat))}%` }} />
              </div>
            </div>
            <div className="mobile-game-hub__chairs">
              <span>🪑 {hud.redChairs}/{hud.maxRedChairs}</span>
              <span className="mobile-game-hub__chairs-icons">
                {Array.from({ length: hud.maxRedChairs }).map((_, index) => (
                  <i key={index} className={index < hud.redChairs ? 'is-active' : ''} />
                ))}
              </span>
            </div>
          </div>
        )}

        {isCooking && (
          <div className="mobile-game-hub__actions">
            {hud.hasAngryCustomer && (
              <MobileActionButton
                icon={<span aria-hidden="true">🥚</span>}
                label="Dỗ khách"
                tone="rose"
                onClick={onAppease}
                disabled={hud.money < 2000}
              />
            )}
            {!hud.flowRhythmActive && (
              <>
                <MobileActionButton icon={<Sparkles />} label="Bói" tone="violet" onClick={onFortune} />
                <MobileActionButton icon={<Scissors />} label="Nhịp Kéo" tone="purple" onClick={onFlow} />
              </>
            )}
            <MobileActionButton icon={<Zap />} label="Cột Điện" tone="yellow" onClick={onLoan} />
            <MobileActionButton icon={<Store />} label="Cửa Hàng" tone="green" onClick={onShop} />
            {hud.dayDuration === 0 && !hud.flowRhythmActive && (
              <MobileActionButton icon={<span aria-hidden="true">⏹</span>} label="Đóng Ca" tone="rose" onClick={onCloseShift} />
            )}
          </div>
        )}

        {hud.phase === 'RAID_CHASE' && (
          <div className="mobile-game-hub__raid">
            🚨 ĐANG TRỐN TRẬT TỰ · {hud.raidTimeLeft.toFixed(1)}s
            {hud.freeDodgesLeft > 0 && <span> · Né x{hud.freeDodgesLeft}</span>}
          </div>
        )}
      </section>
    </div>
  );
}
