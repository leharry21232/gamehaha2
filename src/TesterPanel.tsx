import { useMemo, useState } from 'react';
import type { CustomerType, GameHudSnapshot } from './game/types';
import { WORLD_INTERACTABLES, type WorldPosition } from './game/world';

type TesterTab = 'OVERVIEW' | 'CONTROL' | 'MAP' | 'GAMEPLAY' | 'INVENTORY' | 'SAVE';

interface TesterPanelProps {
  hud: GameHudSnapshot;
  onClose: () => void;
  onSetMoney: (value: number) => void;
  onSetProgress: (level: number, xp: number) => void;
  onSetStoryStats: (completedOrders: number, lifetimeEarnings: number) => void;
  onSetDayTime: (seconds: number) => void;
  onQueueCustomer: (type: CustomerType) => boolean;
  onTriggerRain: () => boolean;
  worldPosition: WorldPosition;
  onOpenWorld: () => void;
  onTeleportWorld: (x: number, y: number) => void;
}

const SESSION_SAVE_KEY = 'banh_trang_session_save_v1';
const PROGRESS_SAVE_KEY = 'banh_trang_player_progress_v1';

function formatMoney(value: number): string {
  return `${Math.floor(value).toLocaleString('vi-VN')}đ`;
}

function readSaveBundle(): Record<string, string | null> {
  try {
    return {
      session: window.localStorage.getItem(SESSION_SAVE_KEY),
      progression: window.localStorage.getItem(PROGRESS_SAVE_KEY),
      vendorSpot: window.localStorage.getItem('banhtrang_vendor_spot_v1'),
      tutorial: window.localStorage.getItem('banhtrang_tutorial_v1'),
    };
  } catch {
    return { session: null, progression: null, vendorSpot: null, tutorial: null };
  }
}

export function TesterPanel({ hud, onClose, onSetMoney, onSetProgress, onSetStoryStats, onSetDayTime, onQueueCustomer, onTriggerRain, worldPosition, onOpenWorld, onTeleportWorld }: TesterPanelProps) {
  const [tab, setTab] = useState<TesterTab>('OVERVIEW');
  const [moneyInput, setMoneyInput] = useState(String(hud.money));
  const [levelInput, setLevelInput] = useState(String(hud.playerLevel));
  const [xpInput, setXpInput] = useState(String(hud.playerXp));
  const [completedOrdersInput, setCompletedOrdersInput] = useState('0');
  const [lifetimeEarningsInput, setLifetimeEarningsInput] = useState('0');
  const [timeInput, setTimeInput] = useState(String(Math.floor(hud.dayTimeLeft)));
  const [customerType, setCustomerType] = useState<CustomerType>('STUDENT');
  const [actionMessage, setActionMessage] = useState('');
  const saveBundle = useMemo(() => readSaveBundle(), [hud.screen, hud.day, hud.money, hud.ordersServed]);
  const saveText = JSON.stringify(saveBundle, null, 2);
  const hasSessionSave = Boolean(saveBundle.session);

  const exportSave = () => {
    const blob = new Blob([saveText], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'banh-trang-tester-save.json';
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const copySave = async () => {
    try {
      await navigator.clipboard.writeText(saveText);
    } catch {
      // Clipboard access can be unavailable in insecure contexts.
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-start justify-end bg-black/45 p-2 sm:p-5" role="dialog" aria-modal="true" aria-label="Tester Panel">
      <section className="flex max-h-[calc(100dvh-1rem)] w-full max-w-xl flex-col overflow-hidden border-[3px] border-[#111318] bg-[#fff8df] text-[#1c1a16] shadow-[7px_7px_0_#111318] sm:max-h-[calc(100dvh-2.5rem)]">
        <header className="flex items-center justify-between border-b-[3px] border-[#111318] bg-[#f5b942] px-4 py-3">
          <div>
            <p className="font-mono text-[10px] font-black tracking-[0.2em]">DEVELOPER TOOLS · BUILD TEST</p>
            <h2 className="font-display text-xl font-black">TESTER PANEL</h2>
          </div>
          <button type="button" onClick={onClose} className="border-2 border-[#111318] bg-white px-3 py-2 text-sm font-black shadow-[2px_2px_0_#111318] hover:bg-amber-100">ĐÓNG · F2</button>
        </header>

        <nav className="flex flex-wrap gap-2 border-b-2 border-[#111318] bg-[#f0e5c7] p-3">
          <button type="button" onClick={() => setTab('OVERVIEW')} className={`border-2 border-[#111318] px-3 py-2 text-xs font-black ${tab === 'OVERVIEW' ? 'bg-[#243b35] text-white' : 'bg-white'}`}>TỔNG QUAN</button>
          <button type="button" onClick={() => setTab('CONTROL')} className={`border-2 border-[#111318] px-3 py-2 text-xs font-black ${tab === 'CONTROL' ? 'bg-[#243b35] text-white' : 'bg-white'}`}>ĐIỀU KHIỂN</button>
          <button type="button" onClick={() => setTab('MAP')} className={`border-2 border-[#111318] px-3 py-2 text-xs font-black ${tab === 'MAP' ? 'bg-[#243b35] text-white' : 'bg-white'}`}>BẢN ĐỒ</button>
          <button type="button" onClick={() => setTab('GAMEPLAY')} className={`border-2 border-[#111318] px-3 py-2 text-xs font-black ${tab === 'GAMEPLAY' ? 'bg-[#243b35] text-white' : 'bg-white'}`}>GAMEPLAY</button>
          <button type="button" onClick={() => setTab('INVENTORY')} className={`border-2 border-[#111318] px-3 py-2 text-xs font-black ${tab === 'INVENTORY' ? 'bg-[#243b35] text-white' : 'bg-white'}`}>KHO HÀNG</button>
          <button type="button" onClick={() => setTab('SAVE')} className={`border-2 border-[#111318] px-3 py-2 text-xs font-black ${tab === 'SAVE' ? 'bg-[#243b35] text-white' : 'bg-white'}`}>SAVE & DỮ LIỆU</button>
        </nav>

        <div className="allow-touch-scroll overflow-y-auto p-4">
          {tab === 'OVERVIEW' ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {[
                  ['MÀN HÌNH', hud.screen],
                  ['GIAI ĐOẠN', hud.phase],
                  ['NGÀY', String(hud.day)],
                  ['THỜI GIAN CÒN', `${Math.ceil(hud.dayTimeLeft)} / ${hud.dayDuration}s`],
                  ['TIỀN', formatMoney(hud.money)],
                  ['XU', String(hud.xu)],
                  ['LEVEL', String(hud.playerLevel)],
                  ['XP', `${hud.playerXp} / ${hud.playerXpToNext}`],
                  ['ĐƠN ĐÃ PHỤC VỤ', String(hud.ordersServed)],
                  ['ĐƠN HOÀN HẢO', String(hud.perfectOrders)],
                  ['XE', `Cấp ${hud.vehicleLevel}`],
                  ['ĐỘ KHÓ', hud.difficulty],
                ].map(([label, value]) => (
                  <div key={label} className="border-2 border-[#26231d] bg-white p-3">
                    <p className="text-[10px] font-black tracking-wide text-[#756b58]">{label}</p>
                    <p className="mt-1 break-words font-mono text-sm font-black">{value}</p>
                  </div>
                ))}
              </div>

              <div className="border-2 border-[#26231d] bg-[#e9dfc5] p-3">
                <h3 className="mb-2 text-xs font-black tracking-wide">TRẠNG THÁI HỆ THỐNG</h3>
                <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                  <p>Khách tức giận: {hud.hasAngryCustomer ? 'CÓ' : 'KHÔNG'}</p>
                  <p>Đang mưa: {hud.rainActive ? 'CÓ' : 'KHÔNG'}</p>
                  <p>QTE: {hud.qteActive ? 'ĐANG CHẠY' : 'TẮT'}</p>
                  <p>Boss: {hud.bossFightActive ? 'ĐANG CHẠY' : 'TẮT'}</p>
                  <p>Mini game nhịp: {hud.flowRhythmActive ? 'ĐANG CHẠY' : 'TẮT'}</p>
                  <p>Shop: {hud.shopOpen ? 'MỞ' : 'ĐÓNG'}</p>
                </div>
              </div>

              <p className="text-[11px] leading-relaxed text-[#625a4b]">Bảng tổng quan phản ánh HUD trực tiếp từ GameEngine. Các thao tác can thiệp được giới hạn bằng API debug riêng.</p>
            </div>
          ) : tab === 'CONTROL' ? (
            <div className="space-y-4">
              <div className="border-2 border-[#26231d] bg-amber-100 p-3 text-xs leading-relaxed">
                <strong>CHẾ ĐỘ CAN THIỆP TEST</strong>
                <p className="mt-1">Các thay đổi được lưu vào save hiện tại. Hãy dùng trong môi trường test; không ảnh hưởng công thức hay thao tác chế biến.</p>
              </div>
              <section className="space-y-2 border-2 border-[#26231d] bg-white p-3">
                <h3 className="text-xs font-black">KINH TẾ · TIỀN MẶT</h3>
                <input aria-label="Số tiền cần đặt" type="number" min="0" max="999999999" value={moneyInput} onChange={(event) => setMoneyInput(event.target.value)} className="w-full border-2 border-[#26231d] px-3 py-2 font-mono text-sm" />
                <button type="button" onClick={() => onSetMoney(Number(moneyInput))} className="border-2 border-[#111318] bg-[#f5b942] px-3 py-2 text-xs font-black shadow-[2px_2px_0_#111318]">ÁP DỤNG TIỀN</button>
              </section>
              <section className="space-y-2 border-2 border-[#26231d] bg-white p-3">
                <h3 className="text-xs font-black">TIẾN TRÌNH · LEVEL & XP</h3>
                <div className="grid grid-cols-2 gap-2">
                  <label className="text-xs font-bold">Level (1–100)<input aria-label="Level" type="number" min="1" max="100" value={levelInput} onChange={(event) => setLevelInput(event.target.value)} className="mt-1 w-full border-2 border-[#26231d] px-2 py-2 font-mono" /></label>
                  <label className="text-xs font-bold">XP hiện tại<input aria-label="XP" type="number" min="0" value={xpInput} onChange={(event) => setXpInput(event.target.value)} className="mt-1 w-full border-2 border-[#26231d] px-2 py-2 font-mono" /></label>
                </div>
                <p className="text-[10px] text-[#756b58]">XP sẽ tự giới hạn dưới ngưỡng lên cấp tiếp theo.</p>
                <button type="button" onClick={() => onSetProgress(Number(levelInput), Number(xpInput))} className="border-2 border-[#111318] bg-[#f5b942] px-3 py-2 text-xs font-black shadow-[2px_2px_0_#111318]">ÁP DỤNG LEVEL / XP</button>
              </section>
              <section className="space-y-2 border-2 border-[#26231d] bg-white p-3">
                <h3 className="text-xs font-black">CỐT TRUYỆN · TIẾN ĐỘ NHIỆM VỤ</h3>
                <p className="text-[10px] text-[#756b58]">Chỉ dùng để kiểm thử các mốc nhiệm vụ; số liệu này sẽ được lưu vào tiến trình hiện tại.</p>
                <div className="grid grid-cols-2 gap-2">
                  <label className="text-xs font-bold">Đơn hoàn thành<input aria-label="Tổng đơn hoàn thành" type="number" min="0" max="999999999" value={completedOrdersInput} onChange={(event) => setCompletedOrdersInput(event.target.value)} className="mt-1 w-full border-2 border-[#26231d] px-2 py-2 font-mono" /></label>
                  <label className="text-xs font-bold">Doanh thu trọn đời<input aria-label="Doanh thu trọn đời" type="number" min="0" max="999999999999" value={lifetimeEarningsInput} onChange={(event) => setLifetimeEarningsInput(event.target.value)} className="mt-1 w-full border-2 border-[#26231d] px-2 py-2 font-mono" /></label>
                </div>
                <button type="button" onClick={() => onSetStoryStats(Number(completedOrdersInput), Number(lifetimeEarningsInput))} className="border-2 border-[#111318] bg-[#f5b942] px-3 py-2 text-xs font-black shadow-[2px_2px_0_#111318]">ÁP DỤNG TIẾN ĐỘ NHIỆM VỤ</button>
              </section>
              <section className="space-y-2 border-2 border-[#26231d] bg-white p-3">
                <h3 className="text-xs font-black">THỜI GIAN TRONG NGÀY</h3>
                <label className="block text-xs font-bold">Giây còn lại (0–{hud.dayDuration})<input aria-label="Thời gian còn lại" type="number" min="0" max={hud.dayDuration} value={timeInput} onChange={(event) => setTimeInput(event.target.value)} className="mt-1 w-full border-2 border-[#26231d] px-3 py-2 font-mono" /></label>
                <button type="button" onClick={() => onSetDayTime(Number(timeInput))} className="border-2 border-[#111318] bg-[#f5b942] px-3 py-2 text-xs font-black shadow-[2px_2px_0_#111318]">ĐẶT THỜI GIAN</button>
              </section>
            </div>
          ) : tab === 'MAP' ? (
            <div className="space-y-4">
              <section className="border-2 border-[#26231d] bg-amber-100 p-3 text-xs leading-relaxed">
                <strong>KIỂM THỬ BẢN ĐỒ KHU PHỐ</strong>
                <p className="mt-1">Dùng các nút bên dưới để mở bản đồ và dịch chuyển nhân vật tới đúng điểm tương tác. Công cụ này không thay đổi tiền, kho hàng hay tiến trình.</p>
                <p className="mt-2 font-mono font-black">Vị trí hiện tại: X {worldPosition.x.toFixed(1)}% · Y {worldPosition.y.toFixed(1)}%</p>
                <button type="button" onClick={onOpenWorld} className="mt-3 border-2 border-[#111318] bg-[#f5b942] px-3 py-2 text-xs font-black shadow-[2px_2px_0_#111318]">MỞ BẢN ĐỒ TẠI VỊ TRÍ HIỆN TẠI</button>
              </section>
              <section className="space-y-2 border-2 border-[#26231d] bg-white p-3">
                <h3 className="text-xs font-black">DỊCH CHUYỂN ĐẾN ĐỊA ĐIỂM</h3>
                {WORLD_INTERACTABLES.map((location) => (
                  <button key={location.id} type="button" onClick={() => { onTeleportWorld(location.x, location.y); onOpenWorld(); setActionMessage('Đã đưa nhân vật đến ' + location.name + '. Nhấn E hoặc nút tương tác để kiểm tra.'); }} className="flex w-full items-center justify-between gap-3 border-2 border-[#26231d] bg-[#fff8df] px-3 py-2 text-left text-xs font-black hover:bg-amber-100">
                    <span>{location.name}</span>
                    <span className="font-mono text-[#756b58]">X{location.x} · Y{location.y}</span>
                  </button>
                ))}
              </section>
              {actionMessage && <p role="status" className="border-2 border-[#26231d] bg-white p-3 text-xs font-bold">{actionMessage}</p>}
            </div>
          ) : tab === 'GAMEPLAY' ? (
            <div className="space-y-4">
              <div className="border-2 border-[#26231d] bg-amber-100 p-3 text-xs leading-relaxed">
                <strong>CÔNG CỤ KIỂM THỬ GAMEPLAY</strong>
                <p className="mt-1">Chỉ hoạt động trong ca bán hàng khi game đang ở trạng thái nấu bình thường. Công cụ không bỏ qua giới hạn hàng chờ và không chen ngang mini-game hoặc sự kiện đang chạy.</p>
              </div>
              <section className="space-y-2 border-2 border-[#26231d] bg-white p-3">
                <h3 className="text-xs font-black">THÊM KHÁCH VÀO HÀNG CHỜ</h3>
                <select aria-label="Loại khách kiểm thử" value={customerType} onChange={(event) => setCustomerType(event.target.value as CustomerType)} className="w-full border-2 border-[#26231d] bg-white px-3 py-2 text-sm font-bold">
                  <option value="STUDENT">Sinh viên</option>
                  <option value="NINJA_LEAD">Ninja Lead</option>
                  <option value="OFFICE">Dân văn phòng</option>
                  <option value="APP_SHIPPER">Shipper</option>
                  {(hud.upgrades.ledRgb || hud.upgrades.cursedMenu) && <option value="GEN_Z">Khách Gen Z (đã mở khóa)</option>}
                </select>
                <button type="button" onClick={() => setActionMessage(onQueueCustomer(customerType) ? 'Đã thay khách cuối hàng chờ bằng khách kiểm thử.' : 'Không thể thêm khách lúc này. Hãy vào ca bán hàng và kết thúc sự kiện đang chạy.')} className="border-2 border-[#111318] bg-[#f5b942] px-3 py-2 text-xs font-black shadow-[2px_2px_0_#111318]">ĐƯA KHÁCH VÀO HÀNG CHỜ</button>
              </section>
              <section className="space-y-2 border-2 border-[#26231d] bg-white p-3">
                <h3 className="text-xs font-black">SỰ KIỆN THỜI TIẾT</h3>
                <p className="text-xs text-[#625a4b]">Kích hoạt sự kiện Mưa Sài Gòn 3 giây bằng đúng cơ chế gốc để kiểm tra thao tác mặc áo mưa cho khách.</p>
                <button type="button" onClick={() => setActionMessage(onTriggerRain() ? 'Đã kích hoạt Mưa Sài Gòn.' : 'Không thể kích hoạt mưa khi đang ở ngoài ca hoặc có sự kiện/mini-game khác.')} className="border-2 border-[#111318] bg-sky-200 px-3 py-2 text-xs font-black shadow-[2px_2px_0_#111318]">KÍCH HOẠT MƯA SÀI GÒN</button>
              </section>
              {actionMessage && <p role="status" className="border-2 border-[#26231d] bg-white p-3 text-xs font-bold">{actionMessage}</p>}
            </div>
          ) : tab === 'INVENTORY' ? (
            <div className="space-y-3">
              <div className="border-2 border-[#26231d] bg-white p-3">
                <h3 className="text-xs font-black">TỒN KHO HIỆN TẠI</h3>
                <p className="mt-1 text-[10px] text-[#756b58]">Chỉ xem dữ liệu thực tế từ GameEngine, không chỉnh sửa số lượng.</p>
                <div className="mt-3 space-y-2">
                  {([
                    ['banh_trang', 'Bánh tráng'],
                    ['kho_bo', 'Khô bò'],
                    ['trung_cut', 'Trứng cút'],
                    ['xoai', 'Xoài'],
                    ['rau_ram', 'Rau răm'],
                    ['tac', 'Tắc'],
                    ['pho_mai', 'Phô mai'],
                    ['tran_chau', 'Trân châu'],
                    ['sau_rieng', 'Sầu riêng'],
                    ['nuoc_cot_dua', 'Nước cốt dừa'],
                  ] as const).map(([key, label]) => {
                    const amount = hud.inventory[key];
                    const percent = hud.maxStockPerItem > 0 ? Math.min(100, (amount / hud.maxStockPerItem) * 100) : 0;
                    return <div key={key} className="border-2 border-[#26231d] bg-[#fffdf5] p-2">
                      <div className="flex items-center justify-between gap-2 text-xs font-bold"><span>{label}</span><span className="font-mono">{amount} / {hud.maxStockPerItem}</span></div>
                      <div className="mt-1 h-2 border border-[#26231d] bg-[#eee5d2]"><div className={`h-full ${amount <= 2 ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: `${percent}%` }} /></div>
                    </div>;
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="border-2 border-[#26231d] bg-white p-3">
                <p className="text-xs font-black">BẢN LƯU TRÊN TRÌNH DUYỆT NÀY</p>
                <p className="mt-1 text-sm">{hasSessionSave ? 'Đã tìm thấy dữ liệu save cục bộ.' : 'Chưa tìm thấy dữ liệu save trên trình duyệt này.'}</p>
                <p className="mt-2 text-[11px] leading-relaxed text-[#625a4b]">Game tự lưu trong bộ nhớ của trình duyệt hiện tại. Máy hoặc trình duyệt khác sẽ có tiến trình riêng; không cần đăng nhập và không đồng bộ qua GitHub.</p>
                <p className="mt-1 break-all font-mono text-[10px] text-[#756b58]">{SESSION_SAVE_KEY}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={exportSave} className="border-2 border-[#111318] bg-[#f5b942] px-3 py-2 text-xs font-black shadow-[2px_2px_0_#111318]">XUẤT SAVE JSON</button>
                <button type="button" onClick={() => void copySave()} className="border-2 border-[#111318] bg-white px-3 py-2 text-xs font-black shadow-[2px_2px_0_#111318]">COPY JSON</button>
              </div>
              <pre className="max-h-72 overflow-auto border-2 border-[#26231d] bg-[#1f2933] p-3 text-[10px] leading-relaxed text-emerald-100">{saveText}</pre>
              <p className="text-[11px] leading-relaxed text-[#625a4b]">Xuất/copy chỉ đọc dữ liệu cục bộ trên trình duyệt này. Game không tải save lên máy chủ; xóa dữ liệu trang web hoặc đổi trình duyệt có thể khiến save không còn truy cập được.</p>
            </div>
          )}
        </div>

        <footer className="border-t-2 border-[#111318] bg-[#f0e5c7] px-4 py-2 text-[10px] font-bold text-[#625a4b]">F2 MỞ / ĐÓNG · CÔNG CỤ TEST CÓ GHI SAVE</footer>
      </section>
    </div>
  );
}
