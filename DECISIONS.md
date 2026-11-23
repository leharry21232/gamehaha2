# Decisions

- New Game resets the active run wallet to the configured starter balance while retaining long-term progression fields (level, XP, lifetime earnings, completed orders, and decorations).
- Topping correction supports both global last-action undo and targeted removal by topping type; targeted removal must refund stock only for stock-backed ingredients.

## Tester Panel
- Tester Panel mutating actions must call explicit clamped `GameEngine.debug*` methods. Never expose direct writes to engine internals or raw localStorage editing.
- Customer test actions replace only the last waiting-line entry; they do not increase queue capacity or bypass the normal order-spawn flow.
- Forced rain reuses the existing Saigon-rain event implementation and is blocked during other interruptions, checkout, non-cooking phases, and outside an active order.
- Inventory inspection is read-only and uses the live HUD inventory snapshot.
- The Save tab remains read-only; do not add import, reset, or sample-save management tools.
- Story-mission test counters are changed only through clamped GameEngine debug APIs exposed in Tester Panel.

## Local save ownership
- Store game progress and the active session in the browser's `localStorage`, scoped to the current site origin and browser profile.
- Different browsers or browser profiles have independent saves. A second tab in the same browser profile on the same origin uses that profile's existing save.
- Different devices have independent saves by default. Do not add account login, cloud sync, or cross-device transfer unless explicitly requested.
- A deployment on a different origin (for example, localhost versus the production domain) has a separate save.
- Clearing site data, using a private session that is later closed, or changing browser profiles can make a local save unavailable.

## Story progression
- The first three existing mission IDs remain unchanged to preserve completion records in older browser saves.
- Chapter 1 is a sequential chain ending at level 5. New chapters are not added until their gameplay systems and unlocks are ready.
- Claiming a story reward updates both the active run balance and persisted progression wallet, then persists the active session.

## Neighborhood map exploration
- Build on the existing SVG neighborhood scene; do not introduce a parallel renderer or a new dependency.
- The first explorable map is only the current bánh tráng neighborhood. No city-wide expansion in this slice.
- Player movement uses normalized viewport percentages, fixed sidewalk bounds, and collision rectangles aligned with the scene. Keyboard and touch controls must share the same movement function.
- The first six interaction points are the bánh tráng cart, tạp hóa cô Năm, sạp ăn vặt, quán nước chú Ba, cổng chợ, and cô Năm hàng xóm.
- Interactions are narrative-only for now. They must not change cash, inventory, save schema, mission progress, or cooking behavior.
- The player may return to the existing morning-preparation screen only by interacting with the bánh tráng cart.
- This approved M4.x exploration slice does not replace official Spec Kit M5 (decorations, skins, difficulty, and audio).


## Neighborhood map exploration
- Reuse the current pixel-art SVG map and normalized viewport-percent coordinates; do not replace the scene or create a city-wide map in M5.
- Keep world movement and interaction lookup as pure functions in `src/game/world.ts` so collision and reachability can be regression-tested.
- Map interactions in M5 are informational only. They must not modify money, inventory, staff, missions, vendor location, or save data.
- The bánh tráng cart remains the only map interaction that closes the neighborhood overlay and returns to the existing morning-preparation flow.
- Keyboard and touch controls must share the same collision-aware movement function.

## M6 – Kết nối bản đồ và cốt truyện
- Tab Nhật ký trên bản đồ phải đọc trực tiếp `hud.storyMission`; không tạo bản sao trạng thái nhiệm vụ riêng.
- Nhận thưởng từ Nhật ký phải gọi API hiện có `GameEngine.claimCurrentStoryMission()` để giữ nguyên quy tắc lưu tiền và tiến độ.
- Lời thoại Cô Năm có thể phản ánh nhiệm vụ Chương 1 hiện tại, nhưng tương tác NPC vẫn không tự ý thay đổi tiền, kho đồ hoặc tiến độ nhiệm vụ.


## M6 – NPC khu phố
- NPC khu phố được khai báo cùng dữ liệu `WORLD_INTERACTABLES` để vị trí hiển thị và vùng tương tác luôn dùng chung một nguồn.
- NPC chỉ cung cấp lời thoại; không phát sinh tiền, vật phẩm, nhiệm vụ phụ hoặc thay đổi save trong lát cắt này.
- Giữ Cô Năm hiện có và thêm Cô Sáu, Tí giao hàng, chú Bảy và bà Tư; mỗi NPC có vị trí nằm trong vùng đi bộ và lời thoại riêng.


## M6 – Nhịp sống khu phố
- Sự kiện khu phố trong lát cắt đầu tiên là sự kiện không gây gián đoạn, chỉ hiển thị bối cảnh và không thay đổi tiền, kho, nhiệm vụ, save hoặc trạng thái bán hàng.
- Thời điểm sáng/trưa/chiều lấy từ `hud.dayTimeLeft` và `hud.dayDuration`, không dùng đồng hồ máy tính hoặc timer độc lập.
- Sự kiện được chọn xác định theo ngày trong game và khung thời gian để kết quả ổn định, dễ kiểm thử; chưa tạo sự kiện ngẫu nhiên có gameplay effect.


## M6 – Mở khóa nguyên liệu theo cấp
- Bốn topping mới là hàng hóa nhập kho, không được tự cấp miễn phí: Phô Mai mở ở cấp 2, Trân Châu cấp 3, Sầu Riêng cấp 5 và Nước Cốt Dừa cấp 6.
- Cấp độ là điều kiện bắt buộc ở cả giao diện chợ và GameEngine; đạt cấp chỉ mở quyền mua, không tự mua hoặc tự thêm hàng vào kho.
- Save phiên bản 1 cũ được migrate an toàn bằng cách gán tồn kho 0 cho các nguyên liệu mới còn thiếu; giữ nguyên sáu nguyên liệu cũ và các số dư hiện có.
- Nguyên Liệu Hắc Ám không còn là khóa topping; nâng cấp này vẫn giữ vai trò mở khách Gen Z theo logic hiện có.
- HUD đầu màn hình dùng trực tiếp snapshot cấp/XP, nhiệm vụ, tiền và thời gian từ GameEngine; không tạo state tiến trình thứ hai.

## M6 – Sự kiện khách tò mò ghé xe
- Sự kiện đầu tiên được mở bằng nút tùy chọn khi người chơi đứng gần xe bánh tráng; không tự bật popup và không chiếm phím E.
- Hội thoại là nội dung kể chuyện thuần túy, không tạo đơn hàng, không thay đổi tiền, kho, nhiệm vụ, thời gian, save hoặc trạng thái ca bán.
- Chỉ đánh dấu đã xem trong state của phiên ứng dụng hiện tại; không thêm trường vào save schema. Tương tác xe bánh tráng hiện hữu luôn giữ nguyên.

## M6 – Nhiệm vụ phụ hàng xóm
- Lời nhờ của Chú Bảy là tùy chọn; “Để lúc khác” chỉ đóng lời mời, không đánh dấu từ chối vĩnh viễn.
- Sau khi nhận lời, chỉ tương tác với Cô Sáu mới hoàn thành nhiệm vụ; NPC khác không tăng tiến độ.
- Nhiệm vụ phụ là narrative-only trong lát cắt này: không thưởng tiền/vật phẩm/XP, không tiêu thời gian và không tác động nhiệm vụ Chương 1, kinh tế, kho hoặc save.
- Trạng thái nhiệm vụ phụ dùng React state trong phiên hiện tại, chưa ghi vào save schema.

## M6 – Nhiệm vụ phụ Chuyến hàng cuối ngõ
- Tí giao hàng đưa ra một lời nhờ độc lập; người chơi có thể nhận hoặc trì hoãn, và có thể hỏi lại Tí sau đó.
- Chỉ tương tác với Bà Tư sau khi nhận lời mới hoàn thành nhiệm vụ; NPC khác không tác động tiến độ.
- Hai nhiệm vụ phụ có state và điều kiện hoàn thành độc lập, không được hoàn thành chéo lẫn nhau.
- Nhiệm vụ chỉ kể chuyện, tồn tại trong phiên hiện tại; không tạo vật phẩm thực, không thưởng tiền/XP, không tiêu thời gian và không thay đổi save, nhiệm vụ chính hoặc gameplay bán hàng.
- Tab Nhật ký hiển thị trạng thái hai nhiệm vụ phụ từ React state hiện tại; đây là giao diện đọc בלבד, không tạo bản sao trạng thái hay lưu tiến độ mới.


## M6 – Bố cục Nhật ký và hộp thoại trên màn hình nhỏ
- Bảng thông tin bản đồ phải nằm trong vùng an toàn phía trên cụm điều khiển dưới cùng; không được che D-pad, nút tương tác hoặc nút đóng bản đồ.
- Nhật ký có thể dài hơn chiều cao khả dụng nên phải cuộn độc lập theo chiều dọc trên thiết bị cảm ứng; không thay đổi vị trí nhân vật hoặc cuộn trang nền.
- Hộp thoại nhiệm vụ phải giới hạn chiều cao theo viewport và cho phép cuộn để hai lựa chọn nhận/trì hoãn luôn truy cập được.


## M6 – Khóa điều khiển nền của bản đồ
- Khi hộp thoại nhận nhiệm vụ mở, các phím di chuyển và E không được tác động lên nhân vật/NPC phía sau; Escape chỉ đóng hộp thoại và không thay đổi trạng thái nhiệm vụ.
- Khi bảng Bản đồ/Nhật ký đang mở, E đóng bảng thay vì kích hoạt NPC phía sau; Escape đóng bảng. Phím di chuyển tiếp tục đóng bảng và di chuyển như trước.


## M6 – Hội thoại tiếp nối sau nhiệm vụ khu phố
- Sau khi hoàn thành nhiệm vụ, cả người giao việc và người nhận lời nhắn có hội thoại ghi nhận kết quả ở những lần tương tác tiếp theo.
- Hội thoại tiếp nối chỉ phụ thuộc trạng thái COMPLETED của đúng nhiệm vụ; không mở khóa phần thưởng, không thay đổi kinh tế, thời gian, save hay nhiệm vụ khác.


## M6 – Kiểm chứng khả năng tiếp cận Map 1
- Mọi điểm tương tác của Map 1 phải có thể tiếp cận từ vị trí xuất hiện mặc định bằng các bước di chuyển bàn phím thực tế, không phụ thuộc chức năng teleport của Tester Panel.
- Kiểm thử reachability mô phỏng các bước ngang 2.5% và dọc 1.5% qua cùng hàm di chuyển/collision dùng trong game; thay đổi tọa độ hoặc vật cản phải tiếp tục giữ tất cả điểm tương tác có thể tiếp cận.


## M6 – Quy tắc va chạm và chọn mục tiêu tương tác
- Vật cản chính trên Map 1 phải chặn chuyển động theo trục va chạm nhưng vẫn cho phép trượt theo trục còn lại.
- Khi nhiều vùng tương tác chồng lấn, chỉ chọn một mục tiêu gần nhất; nếu khoảng cách bằng nhau, giữ thứ tự khai báo hiện tại để kết quả ổn định.
- Không mở rộng bán kính tương tác chỉ để bù cho lối đi khó tiếp cận; ưu tiên sửa bố cục hoặc đường đi nếu QA phát hiện vấn đề.


## M6 – Hướng dẫn khám phá Map 1
- Bảng Hướng dẫn phải luôn hiển thị cách di chuyển, tương tác, điều khiển cảm ứng, đường quay lại xe bánh tráng và danh sách các điểm có thể ghé.
- Khi mở Hướng dẫn, nội dung chỉ dẫn được ưu tiên; thông tin địa điểm gần nhất chỉ là phần bổ sung, không được thay thế hướng dẫn.
- Đây là lớp thông tin tĩnh, không cấp thưởng, không thay đổi trạng thái nhiệm vụ, kinh tế, thời gian hay save.


## M6 – Quy tắc responsive cho HUD Map 1
- Hai thẻ thông tin phía trên phải có giới hạn chiều rộng theo viewport trên điện thoại; thẻ trạng thái ngày/tiền và thẻ nhịp sống không được chiếm cùng vùng ngang.
- Các tab và nút hành động phía dưới phải được phép co giãn/xuống dòng; không được cắt nhãn tương tác dài hoặc đẩy nút ra ngoài viewport.
- Ưu tiên thay đổi trình bày responsive; không sửa logic điều khiển, tương tác, nhiệm vụ hoặc gameplay chỉ để xử lý tràn giao diện.


## M6 – Ánh sáng môi trường Map 1
- Ánh sáng nền chỉ là lớp trình bày nhẹ, đồng bộ với khung thời gian của sự kiện khu phố hiện có (sáng/trưa/chiều).
- Lớp phủ đặt phía trên nền tĩnh nhưng dưới NPC, nhân vật và HUD; luôn bỏ qua pointer events.
- Không thêm chu kỳ thời gian, hiệu ứng gameplay, thay đổi độ sáng màn hình thiết bị hoặc dữ liệu save mới.

## M6 – Hội thoại có ngữ cảnh cho Map 1
- Chín điểm không bao gồm xe bánh tráng có lời thoại lần đầu, lời thoại khi quay lại và câu bối cảnh theo ba khung giờ MORNING/NOON/AFTERNOON.
- Khung giờ lấy từ `getNeighborhoodEvent` hiện có; không tạo timer hoặc chu kỳ thời gian mới.
- Số lần ghé chỉ nằm trong React state của phiên bản đồ, không ghi vào localStorage/save và không có tác động gameplay.
- Hội thoại nhiệm vụ phụ và hội thoại tiến trình Chương 1 có độ ưu tiên cao hơn hội thoại thông thường.
- Tạp hóa đầu ngõ là một chủ tiệm riêng; NPC Cô Năm chỉ xuất hiện tại vị trí Cô Năm hàng xóm, tránh hiểu nhầm một nhân vật có hai vị trí tương tác.
- Tất cả nội dung chỉ mang tính kể chuyện; không thay đổi tiền, kho, XP, thời gian, nhiệm vụ, nhân viên hoặc vòng lặp làm bánh.