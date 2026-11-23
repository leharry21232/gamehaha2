# Tasks

## Economy rebalance – gameplay polish
- [x] Centralize high-impact reward tuning in `src/game/economy.ts`.
- [x] Reduce extreme one-off payouts and stacked reward multipliers without changing recipe steps or ingredient costs.
- [x] Update reward callouts/dialogue and add regression tests for economy tuning.
- [x] Manually compare a normal two-order shift with a boss/bonus shift on the deployed build (player confirmed complete).
- [x] Begin the planned full Map 1 walkthrough with a code audit; removed the anywhere-exit shortcut so the cart is the sole in-world exit.
- [ ] Complete the final manual walkthrough on desktop and mobile, including route, NPC dialogue, quests, dayparts, collision sliding, and cart return.


## Current milestone: Neighborhood exploration foundation (M4.x, approved extension before official M5)
- [x] Preserve existing story mission IDs so browser saves from earlier builds remain valid.
- [x] Group the existing first-customer, lifetime-earnings, and level-three missions into Chapter 1.
- [x] Add the Chapter 1 level-five finale and reward.
- [x] Add Tester Panel controls for lifetime completed orders and lifetime earnings.
- [x] Persist mission reward money to both progression and active session saves.
- [x] Add regression tests for sequential unlocks, completion, legacy IDs, and reward claiming.
- [ ] Verify the Chapter 1 mission chain in the browser from a fresh profile and an existing save.
- [ ] Verify claiming each reward survives a page reload and Continue.

- [x] Audit and reuse the existing neighborhood SVG scene rather than creating a parallel map renderer.
- [x] Add bounded sidewalk movement with collision and axis sliding.
- [x] Add six reachable interaction points: bánh tráng cart, grocery, snack stall, drink stall, market gate, and neighbor NPC.
- [x] Route keyboard and touch movement through the same collision rules.
- [x] Add Tester Panel map diagnostics and teleport controls.
- [x] Add regression tests for bounds, collision, sliding, interaction range, and walkable interaction points.
- [ ] Verify keyboard movement, touch controls, all six interactions, and cart return in a real browser.
- [ ] Verify map overlay does not interfere with morning preparation, pause, or cooking flow.

**Roadmap note:** This M4.x neighborhood slice is an approved extension. Official Spec Kit M5 remains decoration, skins, difficulty, and audio.
 
## Previous completed work
- [x] Per-ingredient topping removal and global undo.
- [x] Tester Panel foundation, safe gameplay controls, inventory inspector, and read-only save export.
- [x] Per-browser localStorage save ownership; no cloud sync or account dependency.
- [x] Automated regression coverage for independent browser storage areas.

## Explicitly out of scope
- Cloud save synchronization, account-based saves, and cross-device transfer.
- Save import/reset tools and sample-save management. Keep the Tester Panel's save view read-only.
- Changing the existing bánh tráng preparation mechanics, timing, or scoring as part of the story milestone.


## M6 – Mở rộng khu phố và tiến trình người chơi (đang triển khai)
- [x] Thêm bốn nguyên liệu topping mới vào chợ nhập hàng với giá và cấp mở khóa riêng.
- [x] Khóa thao tác mua và sử dụng topping mới khi chưa đạt cấp; kiểm tra tại GameEngine, không chỉ khóa giao diện.
- [x] Giữ save cũ tương thích: các nguyên liệu mới được khởi tạo tồn kho bằng 0 khi tiếp tục save phiên bản trước.
- [x] Hiển thị cấp độ, thanh XP, nhiệm vụ, tiền và thời gian trên HUD đầu màn hình.
- [ ] Kiểm tra thủ công cấp 1–6, mua hàng, tồn kho và sử dụng từng topping mới.
- [ ] Kiểm tra save cũ sau nâng cấp và xác nhận số lượng nguyên liệu cũ không đổi.
- [ ] Hoàn tất CI, TypeScript và production build.

## M6 – Kết nối bản đồ với Chương 1 (đang triển khai)
- [x] Hiển thị nhiệm vụ Chương 1 trực tiếp trong tab Nhật ký trên bản đồ.
- [x] Hiển thị tiến độ, trạng thái, phần thưởng và nút nhận thưởng khi đủ điều kiện.
- [x] Kết nối lời thoại Cô Năm với nhiệm vụ hiện tại và tiến độ của người chơi.
- [ ] Kiểm tra hội thoại bằng phím E và nút tương tác trên thiết bị cảm ứng.
- [ ] Kiểm tra nhận thưởng từ Nhật ký và xác nhận số dư được lưu sau khi tải lại.
- [ ] Hoàn tất kiểm thử regression, TypeScript và production build.


### M6 – Phần 2: NPC khu phố
- [x] Thêm Cô Sáu bán hoa, Tí giao hàng, chú Bảy sửa xe và bà Tư hàng xóm vào dữ liệu tương tác.
- [x] Hiển thị bốn NPC bằng sprite pixel-art riêng, có tên trên bản đồ.
- [x] Cho phép trò chuyện với NPC bằng E hoặc nút tương tác cảm ứng, dùng chung hệ thống tương tác hiện có.
- [x] Bổ sung kiểm thử hội thoại, vị trí đi bộ được và vùng tương tác cho cả năm NPC.
- [ ] Kiểm tra trực tiếp vị trí sprite trên màn hình desktop/mobile và xác nhận không che lối đi.
- [ ] Kiểm tra thủ công lời thoại từng NPC và tương tác với các địa điểm cũ.
- [ ] Hoàn tất CI, TypeScript và production build.


### M6 – Phần 3: Nhịp sống và sự kiện khu phố
- [x] Xác định buổi sáng/trưa/chiều theo tiến độ thời gian trong ngày của game.
- [x] Thêm sự kiện không gây gián đoạn, luân phiên theo ngày và thời điểm trong ngày.
- [x] Hiển thị thẻ nhịp sống khu phố gọn trên bản đồ, không chặn điều khiển di chuyển.
- [x] Bổ sung kiểm thử cho mốc thời gian, luân phiên sự kiện và dữ liệu thời gian không hợp lệ.
- [ ] Kiểm tra thủ công thẻ sự kiện ở các giai đoạn sáng/trưa/chiều trên bản đồ.
- [ ] Xác nhận sự kiện không che NPC, không chặn thao tác di chuyển/tương tác và không thay đổi kinh tế/save.
- [ ] Hoàn tất CI, TypeScript và production build.


### M6 – Phần 4: Tương tác sự kiện khu phố (lát cắt đầu tiên)
- [x] Thêm lời mời trò chuyện tùy chọn với một vị khách tò mò khi người chơi đứng gần xe bánh tráng.
- [x] Giữ tương tác E hiện tại: nhấn E tại xe vẫn quay về khu chuẩn bị ngay như trước.
- [x] Sự kiện chỉ hiển thị hội thoại, chỉ xuất hiện một lần trong phiên chạy ứng dụng và không ghi vào save.
- [x] Bổ sung regression test xác nhận dữ liệu sự kiện chỉ chứa nội dung hội thoại.
- [ ] Kiểm tra thủ công nút khách tò mò trên desktop/mobile và xác nhận có thể bỏ qua.
- [ ] Xác nhận sau hội thoại, nhấn E tại xe vẫn mở khu chuẩn bị; tiền, kho, nhiệm vụ và save không đổi.


### M6 – Phần 5: Nhiệm vụ phụ hàng xóm
- [x] Thêm lời nhờ tùy chọn từ Chú Bảy, có lựa chọn nhận lời hoặc để lúc khác.
- [x] Khi nhận lời, theo dõi mục tiêu gặp Cô Sáu và hoàn thành khi tương tác đúng NPC.
- [x] Hiển thị tiến độ nhiệm vụ phụ trên bảng điều khiển khu phố.
- [x] Giữ nhiệm vụ phụ tách biệt khỏi nhiệm vụ Chương 1, tiền, kho, XP, thời gian và vòng lặp bán bánh.
- [x] Không thêm dữ liệu vào save; trạng thái nhiệm vụ chỉ tồn tại trong phiên ứng dụng hiện tại.
- [ ] Kiểm tra thủ công luồng nhận lời, trì hoãn, nhắc lại và hoàn thành trên desktop/mobile.
- [ ] Xác nhận tương tác NPC không liên quan không hoàn thành nhầm nhiệm vụ; nhiệm vụ Chương 1 và gameplay bán hàng không đổi.
- [ ] Hoàn tất CI, TypeScript và production build.


### M6 – Phần 6: Nhiệm vụ phụ Chuyến hàng cuối ngõ
- [x] Thêm lời nhờ tùy chọn từ Tí giao hàng, có lựa chọn nhận lời hoặc để lúc khác.
- [x] Khi nhận lời, theo dõi mục tiêu gặp Bà Tư; chỉ tương tác đúng NPC mới hoàn thành.
- [x] Hiển thị mục tiêu và trạng thái hoàn thành độc lập với nhiệm vụ Chú Bảy.
- [x] Bổ sung kiểm thử cho lời mời, trì hoãn, nhắc lại, giao lời và NPC không liên quan.
- [x] Giữ nhiệm vụ thuần kể chuyện, chỉ tồn tại trong phiên; không thay đổi save, tiền, kho, XP, thời gian hoặc nhiệm vụ Chương 1.
- [ ] Kiểm tra thủ công cả hai nhiệm vụ phụ cùng tồn tại trên desktop/mobile.
- [ ] Xác nhận nhận/hoàn thành nhiệm vụ này không làm thay đổi trạng thái nhiệm vụ Chú Bảy và ngược lại.
- [ ] Hoàn tất CI, TypeScript và production build.


### M6 – Phần 7: Nhật ký nhiệm vụ khu phố
- [x] Thêm danh sách hai nhiệm vụ phụ trong tab Nhiệm vụ của bản đồ.
- [x] Hiển thị trạng thái Chưa nhận / Đang thực hiện / Đã hoàn thành và hướng dẫn NPC cần gặp.
- [x] Nội dung nhật ký đọc trực tiếp trạng thái React hiện tại; không tạo save mới hoặc thay đổi tiến trình nhiệm vụ.
- [ ] Kiểm tra trạng thái nhật ký cập nhật sau khi nhận, trì hoãn và hoàn thành từng nhiệm vụ.
- [ ] Kiểm tra bố cục nhật ký trên desktop/mobile và khi Chương 1 đã hoàn thành.
- [ ] Hoàn tất CI, TypeScript và production build.


### M6 – Phần 8: Hoàn thiện bố cục bảng nhiệm vụ trên màn hình nhỏ
- [x] Đặt bảng thông tin/Nhật ký trong vùng an toàn phía trên cụm điều khiển dưới màn hình.
- [x] Cho phép cuộn nội dung Nhật ký theo chiều dọc trên màn hình cảm ứng, không cuộn nhầm bản đồ.
- [x] Giới hạn chiều cao hộp thoại nhận nhiệm vụ để các nút lựa chọn luôn có thể truy cập trên màn hình thấp.
- [ ] Kiểm tra Nhật ký khi có đủ nhiệm vụ Chương 1 và hai nhiệm vụ phụ ở màn hình điện thoại dọc/ngang.
- [ ] Kiểm tra hai hộp thoại nhận nhiệm vụ trên màn hình thấp và xác nhận nút NHẬN LỜI / ĐỂ LÚC KHÁC luôn nhìn thấy, cuộn được khi cần.
- [ ] Xác nhận các nút di chuyển, tương tác và đóng bản đồ không bị bảng thông tin che khuất.


### M6 – Phần 9: Khóa tương tác nền khi mở giao diện
- [x] Chặn WASD/phím mũi tên/E khi hộp thoại nhận nhiệm vụ đang mở để không điều khiển nhân vật hoặc tương tác phía sau.
- [x] Hỗ trợ Escape để đóng lời mời mà không nhận/từ chối nhiệm vụ.
- [x] Khi bảng Bản đồ/Nhật ký đang mở, phím E chỉ đóng bảng thay vì tương tác với NPC bị che.
- [x] Hỗ trợ Escape đóng bảng đang mở; giữ nguyên WASD/phím mũi tên để đóng bảng và di chuyển như luồng hiện tại.
- [ ] Kiểm tra thủ công các trường hợp phím khi hộp thoại và bảng đang mở.


### M6 – Phần 10: Hội thoại ghi nhận nhiệm vụ đã hoàn thành
- [x] Chú Bảy và Cô Sáu có lời thoại tiếp nối sau khi hoàn thành nhiệm vụ chuyển tin xe đạp.
- [x] Tí và Bà Tư có lời thoại tiếp nối sau khi hoàn thành nhiệm vụ chuyến hàng.
- [x] Chỉ hiển thị lời thoại tiếp nối sau khi nhiệm vụ tương ứng hoàn thành; NPC không liên quan giữ hội thoại cũ.
- [x] Bổ sung regression tests cho bốn NPC và trạng thái chưa hoàn thành.
- [ ] Kiểm tra thủ công lời thoại lần đầu hoàn thành và các lần trò chuyện tiếp theo.


### M6 – Kiểm tra khả năng đi đến mọi điểm trên Map 1
- [x] Bổ sung kiểm thử tìm đường từ vị trí xuất hiện mặc định bằng đúng bước di chuyển bàn phím (2.5% ngang, 1.5% dọc).
- [ ] Kiểm tra thủ công đi bộ từ điểm xuất hiện đến đủ 10 địa điểm/NPC, đặc biệt các góc sát ranh bản đồ.
- [ ] Nếu phát hiện điểm bị chắn hoặc vùng tương tác chồng lấn gây khó thao tác, điều chỉnh tọa độ/collision rồi kiểm tra lại toàn bộ tuyến.


### M6 – Rà soát va chạm và vùng tương tác
- [x] Bổ sung regression test xác nhận bốn vật cản chính (cây trái, xe bánh tráng, quán nước, cây phải) đều chặn nhân vật đi xuyên qua.
- [x] Bổ sung test vùng tương tác chồng lấn: chọn mục tiêu gần nhất, xử lý khoảng cách bằng nhau ổn định và không chọn mục tiêu ngoài bán kính.
- [ ] Kiểm tra thủ công đi sát bốn vật cản từ nhiều hướng và xác nhận nhân vật trượt dọc cạnh thay vì bị khựng cả hai trục.
- [ ] Đi vào vùng giao nhau giữa hai vòng tương tác; xác nhận nhãn E chuyển sang đối tượng gần hơn một cách dễ hiểu.


### M6 – Hoàn thiện hướng dẫn khám phá Map 1
- [x] Chuyển bảng Hướng dẫn thành chỉ dẫn có cấu trúc: điều khiển bàn phím, cảm ứng, tương tác E và cách quay về xe bánh tráng.
- [x] Liệt kê 10 điểm khám phá và giải thích cách chọn mục tiêu gần nhất.
- [x] Ưu tiên hiển thị nội dung hướng dẫn khi người chơi mở bảng, không để lời thoại NPC che mất hướng dẫn.
- [ ] Kiểm tra thủ công bảng hướng dẫn trên desktop/mobile và xác nhận không ảnh hưởng gameplay.


### M6 – Rà soát HUD responsive trên Map 1
- [x] Thu gọn và giới hạn chiều rộng hai thẻ thông tin phía trên để không chồng lấn trên điện thoại hẹp.
- [x] Cho bốn tab điều hướng và hàng nút hành động tự xuống dòng khi không đủ chiều ngang.
- [x] Giữ nguyên hành vi di chuyển, tương tác, nhiệm vụ và vòng lặp bán hàng.
- [x] Người chơi xác nhận đã kiểm tra viewport điện thoại và các nút/tab không bị cắt hoặc che.


### M6 – Không khí theo thời điểm trong ngày
- [x] Đồng bộ một lớp ánh sáng môi trường nhẹ với ba khung thời gian sáng/trưa/chiều đã có.
- [x] Giữ lớp ánh sáng không nhận pointer event và không che nhân vật/NPC/điều khiển.
- [ ] Kiểm tra thủ công ba khung thời gian để bảo đảm chữ, vật thể và nhân vật vẫn rõ.

## M6 – Chất lượng hội thoại Map 1
- [x] Tách hội thoại lần đầu và hội thoại khi quay lại cho chín điểm không bao gồm xe bánh tráng.
- [x] Bổ sung lời thoại theo sáng/trưa/chiều dựa trên thời điểm trong game hiện có.
- [x] Làm rõ Tạp hóa đầu ngõ là tiệm riêng, không phải một vị trí thứ hai của Cô Năm.
- [ ] Người chơi kiểm tra lời thoại lần đầu, quay lại và cả ba thời điểm trong ngày tại đủ chín điểm.
- [ ] Xác nhận hội thoại nhiệm vụ của Chú Bảy/Tí và lời thoại tiến trình Chương 1 của Cô Năm vẫn được ưu tiên đúng lúc.
- [ ] Xác nhận số lần ghé chỉ tồn tại trong phiên bản đồ hiện tại, không được ghi vào save hoặc thay đổi gameplay.

## M7 – Mobile usability and movement feel
- [x] Show the full Map 1 scene on narrow portrait and landscape viewports without cropping the neighborhood edges.
- [x] Reflow Map 1 HUD, journal/map panels, touch controls, and safe-area spacing for phones.
- [x] Remove forced portrait locking and allow the viewport to follow device orientation.
- [x] Replace keyboard repeat/tap-step movement with frame-rate-independent movement and press-and-hold touch controls.
- [x] Add automated tests for movement speed, diagonal normalization, and long-frame teleport prevention.
- [ ] Manually verify the map on a narrow phone in portrait and landscape, including panel scrolling and holding each direction button.
- [ ] Confirm movement remains smooth when moving diagonally and sliding against obstacles on a real mobile device.

- [x] Map 1 cooking screen: portrait order card typography, compact four-step progress labels, touch-specific cutting instruction, and mobile HUD action wrapping.
