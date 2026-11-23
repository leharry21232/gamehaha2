# Tester Panel QA Checklist

Run this checklist on a disposable test save or a fresh test session. Do not use the only save you care about.

## Entry points
- [ ] Open the Tester Panel with F2.
- [ ] Open the game with `?debug=1`.
- [ ] Close the panel with its close button and reopen with F2.

## Existing controls
- [ ] Set money to a normal value and confirm the HUD updates.
- [ ] Try negative and very large money values; confirm values are clamped.
- [ ] Set level and XP; confirm XP stays below the next-level threshold.
- [ ] Set remaining day time to 0 and to the full shift duration; confirm the HUD updates.

## Gameplay tools
- [ ] While a normal order is active, queue a Student, Ninja Lead, Office, or Shipper customer.
- [ ] Finish the current order and confirm the selected customer appears through the normal queue flow.
- [ ] Confirm the queue does not grow beyond its normal capacity.
- [ ] If Gen Z is locked, confirm it is not offered; after unlocking it, confirm it can be selected.
- [ ] Trigger Saigon rain during a normal order; confirm the original rain event and its 3-second interaction window run.
- [ ] Try triggering rain outside a shift, during checkout, and during another interruption; confirm the action is rejected without interrupting gameplay.

## Inventory inspector
- [ ] Confirm all six stock values match the in-game inventory.
- [ ] Use ingredients in an order and confirm the displayed values refresh.
- [ ] Confirm the inspector has no controls that can mutate inventory.

## Save and gameplay regression
- [ ] Export and copy the save JSON.
- [ ] Confirm Tester Panel actions do not alter recipe requirements or cooking steps.
- [ ] Complete a full order: toppings, seasoning, rolling/cutting, and checkout.
- [ ] Refresh/reopen the game and verify the existing Continue/save flow remains intact.
- [ ] Confirm the game works normally after closing Tester Panel.


## Neighborhood map (M5)
- [ ] Start a fresh game and confirm the neighborhood opens without covering or breaking the onboarding flow.
- [ ] Walk with WASD and arrow keys; confirm the player stays on the sidewalk and cannot pass through the cart, drink stall, or trees.
- [ ] Walk around the lower edge of the cart to reach the grocery shop; confirm the route is not blocked.
- [ ] Visit the grocery shop, snack stall, drink stall, market entrance, neighbor NPC, and bánh tráng cart.
- [ ] At each point, press E and the on-screen interaction button; confirm the correct contextual text appears.
- [ ] Interact with the bánh tráng cart and confirm the existing morning-preparation screen opens.
- [ ] Use the Tester Panel > BẢN ĐỒ tab to open the map and teleport to each interaction point.
- [ ] Confirm informational interactions do not change cash, inventory, missions, vendor location, or save data.
- [ ] On a touch device or responsive emulator, verify the directional buttons and interaction button are usable and do not overlap important content.
- [ ] Close the map from both new-game onboarding and morning preparation; complete a normal cooking order to confirm the original gameplay loop is unchanged.

## M6 – Nguyên liệu mở khóa theo cấp và HUD
- [ ] Ở cấp 1, chỉ sáu nguyên liệu cơ bản được mua; Phô Mai, Trân Châu, Sầu Riêng và Nước Cốt Dừa hiển thị cấp mở khóa và không thể mua.
- [ ] Ở cấp 2, mua Phô Mai được; các mặt hàng cấp 3/5/6 vẫn khóa.
- [ ] Ở cấp 3, mua Trân Châu được; Sầu Riêng và Nước Cốt Dừa vẫn khóa.
- [ ] Ở cấp 5, mua Sầu Riêng được; Nước Cốt Dừa vẫn khóa đến cấp 6.
- [ ] Ở cấp 6, mua Nước Cốt Dừa được; tiền, tồn kho và giới hạn sức chứa cập nhật chính xác.
- [ ] Thử gọi GameEngine.buyIngredient trực tiếp ở cấp thấp; xác nhận bị từ chối dù bỏ qua giao diện.
- [ ] Dùng từng topping sau khi mở khóa; xác nhận tồn kho giảm, bỏ topping/undo hoàn lại kho.
- [ ] Mở save phiên bản cũ không có bốn trường tồn kho mới; xác nhận game tiếp tục bình thường và sáu nguyên liệu cũ giữ nguyên.
- [ ] HUD trên desktop/mobile hiển thị cấp, thanh XP, nhiệm vụ, tiền và thời gian mà không che thao tác.

## Economy balance regression
- [ ] Complete two ordinary orders without a special event; confirm earnings stay close to the displayed order prices, not hundreds of thousands.
- [ ] Win the end-of-day Mukbang boss; confirm the reward is 120,000đ and the result text matches.
- [ ] Trigger Flow State masterpiece; confirm the order payout uses x2 and the HUD/callout no longer says x5.
- [ ] Trigger Tarot Combo and Viral orders; confirm both use x1.5 consistently for money and Xu.
- [ ] Check Real Estate/Bát Tự tips, lottery, cash pickup and raid-survival rewards against their reduced displayed amounts.
- [ ] Confirm ingredient purchase prices, inventory consumption/refunds, XP, mission rewards and saved data are unchanged.

## Release gate
- [ ] GitHub Actions: progression tests pass.
- [ ] GitHub Actions: TypeScript check passes.
- [ ] GitHub Actions: production build passes.
- [ ] Manual browser checklist completed on the latest deployed commit.


## Neighborhood ambience (M6)
- [ ] Open the neighborhood map with an in-game morning state; confirm the morning event card appears.
- [ ] Use Tester Panel to adjust day time (or test a day with midday/afternoon state) and confirm the card changes to the matching day part.
- [ ] Confirm events rotate on a later in-game day.
- [ ] Confirm the event card does not block walking, NPC interaction, map controls, or the hide-controls button.
- [ ] Confirm event display does not change cash, inventory, mission progress, save data, or cooking behavior.


## M6 – Sự kiện khách tò mò ghé xe
- [ ] Đi bộ đến gần xe bánh tráng; xác nhận nút “KHÁCH TÒ MÒ” xuất hiện.
- [ ] Bấm nút và đọc hội thoại; xác nhận bản đồ vẫn mở và không có popup ép buộc.
- [ ] Xác nhận nút sự kiện không xuất hiện lại trong cùng phiên ứng dụng.
- [ ] Bỏ qua sự kiện và nhấn E; xác nhận quay về khu chuẩn bị như trước.
- [ ] So sánh tiền, kho, tiến độ nhiệm vụ và save trước/sau; tất cả phải giữ nguyên.
- [ ] Kiểm tra responsive desktop/mobile, bảo đảm nút không làm tràn bảng điều khiển.

## M6 – Nhiệm vụ phụ hàng xóm
- [ ] Đến gần Chú Bảy và nhấn E hoặc nút tương tác; xác nhận lời mời nhiệm vụ phụ xuất hiện.
- [ ] Chọn “ĐỂ LÚC KHÁC”; xác nhận nhiệm vụ chưa được nhận và có thể hỏi lại Chú Bảy.
- [ ] Nhận lời; xác nhận mục tiêu “Gặp Cô Sáu” hiển thị ở bảng điều khiển.
- [ ] Tương tác Tí, Bà Tư hoặc NPC khác; xác nhận nhiệm vụ vẫn chưa hoàn thành.
- [ ] Đến Cô Sáu và tương tác; xác nhận nhiệm vụ phụ chuyển sang hoàn thành đúng một lần.
- [ ] Tương tác lại Chú Bảy/Cô Sáu; xác nhận không có phần thưởng hoặc tiến độ lặp.
- [ ] So sánh tiền, kho, XP, thời gian và nhiệm vụ Chương 1 trước/sau; tất cả phải giữ nguyên.
- [ ] Tải lại ứng dụng; xác nhận nhiệm vụ phụ không làm thay đổi save cũ (trạng thái phiên được reset).
- [ ] Kiểm tra modal và tracker trên desktop/mobile, không che điều khiển di chuyển.

## M6 – Nhiệm vụ phụ Chuyến hàng cuối ngõ
- [ ] Đến gần Tí giao hàng; nhấn E hoặc nút tương tác và xác nhận lời mời xuất hiện.
- [ ] Chọn “ĐỂ LÚC KHÁC”; xác nhận có thể hỏi lại Tí và nhiệm vụ chưa được nhận.
- [ ] Nhận lời; xác nhận mục tiêu gặp Bà Tư xuất hiện trên bảng điều khiển.
- [ ] Tương tác Cô Sáu, Chú Bảy hoặc NPC khác; xác nhận không hoàn thành nhầm nhiệm vụ.
- [ ] Đến Bà Tư và tương tác; xác nhận nhiệm vụ chuyển sang hoàn thành.
- [ ] Hoàn thành nhiệm vụ Tí trước/sau nhiệm vụ Chú Bảy; xác nhận hai trạng thái độc lập.
- [ ] So sánh tiền, kho, XP, thời gian và nhiệm vụ Chương 1 trước/sau; tất cả phải giữ nguyên.
- [ ] Tải lại ứng dụng; xác nhận trạng thái hai nhiệm vụ phụ reset theo phiên và không thay đổi save.
- [ ] Kiểm tra hai tracker và modal trên desktop/mobile, không che điều khiển di chuyển.

## M6 – Nhật ký nhiệm vụ khu phố
- [ ] Mở bản đồ > Nhiệm vụ; xác nhận có cả nhiệm vụ Chú Bảy và nhiệm vụ Tí.
- [ ] Khi chưa nhận, cả hai hiển thị “Chưa nhận” cùng NPC cần tìm.
- [ ] Nhận một nhiệm vụ; xác nhận chỉ nhiệm vụ đó chuyển sang “Đang thực hiện” và hiện đúng mục tiêu.
- [ ] Trì hoãn lời mời; xác nhận trạng thái vẫn là “Chưa nhận”.
- [ ] Hoàn thành một nhiệm vụ; xác nhận nhật ký chuyển đúng nhiệm vụ sang “Đã hoàn thành”.
- [ ] Làm tương tự với nhiệm vụ còn lại; xác nhận trạng thái độc lập, không bị ghi đè.
- [ ] Kiểm tra tab Nhật ký trên desktop/mobile và sau khi hoàn thành Chương 1.


## M6 – Bố cục bản đồ trên màn hình nhỏ
- [ ] Mở bản đồ ở màn hình điện thoại dọc (chiều cao khoảng 640px hoặc thấp hơn), mở tab Nhiệm vụ và cuộn từ nhiệm vụ Chương 1 xuống hết hai nhiệm vụ phụ.
- [ ] Xác nhận bảng Nhiệm vụ nằm phía trên cụm điều khiển dưới màn hình, không che các nút di chuyển và tương tác.
- [ ] Xoay ngang điện thoại hoặc dùng viewport thấp; xác nhận nội dung vẫn cuộn được và nút đóng bảng luôn truy cập được.
- [ ] Mở lời mời của Chú Bảy và Tí; xác nhận cả hai lựa chọn “NHẬN LỜI” và “ĐỂ LÚC KHÁC” nhìn thấy hoặc truy cập được bằng cuộn.
- [ ] Cuộn trong bảng/hộp thoại không làm nhân vật di chuyển hoặc cuộn trang nền.

## M6 – Khóa điều khiển nền khi mở hộp thoại/bảng bản đồ
- [ ] Mở lời mời nhiệm vụ rồi nhấn WASD/phím mũi tên/E; xác nhận nhân vật và NPC phía sau hộp thoại không bị điều khiển/tương tác.
- [ ] Nhấn Escape khi lời mời đang mở; xác nhận hộp thoại đóng nhưng nhiệm vụ vẫn ở trạng thái Chưa nhận và có thể hỏi lại NPC.
- [ ] Mở tab Nhật ký/Bản đồ rồi nhấn E; xác nhận chỉ đóng bảng, không tương tác với NPC đang bị che phía sau.
- [ ] Nhấn Escape khi bảng Nhật ký/Bản đồ đang mở; xác nhận bảng đóng mà không di chuyển nhân vật.


## M6 – Hội thoại sau khi hoàn thành nhiệm vụ khu phố
- [ ] Hoàn thành “Lời nhắn của Chú Bảy”; xác nhận lần đầu Cô Sáu hiện lời thoại hoàn thành, lần sau Cô Sáu và Chú Bảy đều ghi nhận việc đã chuyển tin.
- [ ] Hoàn thành “Chuyến hàng cuối ngõ”; xác nhận lần đầu Bà Tư hiện lời thoại hoàn thành, lần sau Bà Tư và Tí đều ghi nhận việc đã báo tin.
- [ ] Xác nhận NPC không liên quan và nhiệm vụ chưa hoàn thành vẫn dùng hội thoại bình thường.
- [ ] Xác nhận hai nhiệm vụ hoàn thành độc lập, không làm thay đổi tiền, kho, XP, thời gian hoặc nhiệm vụ Chương 1.


## M6 – Kiểm tra đường đi toàn bộ Map 1
- [ ] Bắt đầu từ vị trí xuất hiện mặc định và đi bằng WASD/phím mũi tên đến đủ 10 điểm: xe bánh tráng, tạp hóa, sạp ăn vặt, quán nước, cổng chợ, Cô Năm, Cô Sáu, Tí, Chú Bảy và Bà Tư.
- [ ] Ưu tiên kiểm tra đường vòng quanh xe bánh tráng, quán nước và hai mép bản đồ; xác nhận không cần dịch chuyển bằng Tester Panel.
- [ ] Tại từng điểm, xác nhận chỉ NPC/địa điểm gần nhất được chọn và nhấn E/nút tương tác mở đúng nội dung.
- [ ] Đi sát các vật cản từ nhiều hướng; xác nhận nhân vật không xuyên vật thể và vẫn trượt dọc mép vật cản.


## M6 – Va chạm và vùng tương tác
- [ ] Thử đi xuyên qua cây bên trái, xe bánh tráng, quán nước và cây bên phải từ cả hai hướng; nhân vật không được xuyên vật thể.
- [ ] Đi chéo sát cạnh từng vật cản; xác nhận vẫn trượt được theo trục còn lại, không bị kẹt.
- [ ] Di chuyển qua vùng giao nhau giữa hai vùng tương tác; nhãn E phải ưu tiên địa điểm/NPC gần nhân vật nhất và đổi mục tiêu hợp lý khi tiếp tục di chuyển.
- [ ] Đứng ngoài bán kính tương tác; không được hiện nhầm tên địa điểm/NPC.


## Map 1 – Hướng dẫn người chơi mới và khám phá khu phố
- [ ] Bấm nút “Hướng dẫn”; xác nhận bảng chỉ dẫn mở đúng kể cả khi đang đứng gần NPC/địa điểm.
- [ ] Xác nhận hướng dẫn nêu rõ WASD/phím mũi tên, cụm nút cảm ứng, phím E và cách bắt đầu ca bán tại xe bánh tráng.
- [ ] Kiểm tra danh sách 10 điểm khám phá; tên và mô tả không bị cắt trên desktop và màn hình điện thoại.
- [ ] Đứng gần một NPC rồi mở Hướng dẫn; xác nhận nội dung chỉ dẫn vẫn hiện và thông tin điểm gần nhất cũng dễ nhận biết.
- [ ] Đóng bảng bằng nút × hoặc Escape; xác nhận nhân vật không tự di chuyển và có thể tiếp tục khám phá.
- [ ] Xác nhận hướng dẫn không thay đổi tiền, kho, XP, nhiệm vụ, thời gian hoặc save.


## Map 1 – HUD responsive và không tràn màn hình
- [x] Người chơi xác nhận thẻ ngày/tiền và thẻ nhịp sống không chồng lấn trên màn hình nhỏ.
- [x] Người chơi xác nhận cả bốn tab Bản đồ/Túi đồ/Nhiệm vụ/Điện thoại bấm được và không tràn ngang.
- [x] Người chơi xác nhận hàng nút hành động tự xuống dòng và không cắt nút E/Hướng dẫn.
- [x] Người chơi xác nhận bố cục ổn trên các kích thước điện thoại và khi xoay ngang.
- [x] Người chơi xác nhận thay đổi trình bày không làm thay đổi gameplay.


## Map 1 – Ánh sáng môi trường theo thời điểm
- [ ] Đợi hoặc dùng Tester Panel đổi thời gian trong ngày; xác nhận ánh sáng chuyển đúng ba trạng thái sáng, trưa và chiều.
- [ ] Kiểm tra nhãn NPC, nhân vật, điểm tương tác và chữ trên bản đồ vẫn dễ đọc ở cả ba trạng thái.
- [ ] Xác nhận lớp ánh sáng không chặn thao tác chạm/click, không ảnh hưởng di chuyển, va chạm hoặc tương tác.

## Map 1 – Chất lượng hội thoại và cá tính địa điểm
- [ ] Ghé từng điểm trong chín điểm không bao gồm xe bánh tráng; xác nhận lời thoại lần đầu đúng nhân vật và đúng địa điểm.
- [ ] Rời đi rồi quay lại cùng điểm; xác nhận nhân vật nhận ra người chơi và không lặp nguyên câu mở đầu lần đầu.
- [ ] Kiểm tra hội thoại ở buổi sáng, buổi trưa và buổi chiều bằng thời gian game/Tester Panel; nội dung bối cảnh phải thay đổi phù hợp.
- [ ] Xác nhận Tạp hóa đầu ngõ là cô chủ tiệm riêng, không bị nhầm là Cô Năm; Cô Năm chỉ là NPC tại vị trí riêng.
- [ ] Kiểm tra Cô Năm vẫn nhắc đúng nhiệm vụ Chương 1 và tiến độ hiện tại.
- [ ] Nhận nhiệm vụ Chú Bảy/Tí; xác nhận lời mời, nhắc lại, hoàn thành và hội thoại sau hoàn thành vẫn ưu tiên hơn hội thoại thường.
- [ ] Mở lại bản đồ/phiên chơi mới; xác nhận số lần ghé không được lưu vào save.
- [ ] So sánh tiền, tồn kho, XP, thời gian, nhiệm vụ chính và trạng thái bán hàng trước/sau khi trò chuyện; không giá trị nào bị thay đổi.

## Map 1 – Final full walkthrough (after economy rebalance)
- [ ] Start a fresh game and confirm the player spawns at the intended sidewalk position.
- [ ] Walk from spawn to all 10 locations without Tester Panel teleport: bánh tráng cart, Tạp hóa đầu ngõ, Sạp ăn vặt, Quán nước chú Ba, Cổng chợ, Cô Năm, Cô Sáu, Tí, Chú Bảy, and Bà Tư.
- [ ] At each stop, verify the visible E target and the resulting dialogue belong to the nearest correct location.
- [ ] Walk around the cart, drink stall, and both trees from multiple directions; confirm collision blocks entry while allowing sliding along the edge.
- [ ] Test overlapping interaction ranges near the cart/Cô Năm and drink stall/Chú Bảy; confirm the nearer target is selected and changes naturally as the player moves.
- [ ] Visit all nine non-cart stops twice; verify first-visit and return dialogue differ, and morning/noon/afternoon context is appropriate.
- [ ] Accept, defer, resume, and complete both side quests; verify only Cô Sáu completes Chú Bảy's message and only Bà Tư completes Tí's delivery.
- [ ] Check the Chapter 1 journal and Cô Năm's dialogue before and after claiming a mission reward.
- [ ] Check morning/noon/afternoon lighting and neighborhood event card readability.
- [ ] Open Map/Bag/Journal/Phone panels, close with × or Escape, and verify movement and E do not affect hidden targets while a panel/dialog is open.
- [ ] Confirm there is no shortcut to leave the neighborhood: only interact with the bánh tráng cart to return to preparation.
- [ ] On mobile portrait and landscape, verify the player/NPCs remain aligned with the background, all touch controls are reachable, and panels/quest dialogs scroll without covering essential controls.
- [ ] Compare money, stock, XP, story progress, day time, and save before/after optional neighborhood conversations; none should change except the explicitly claimed Chapter 1 reward.
- [ ] After returning to preparation from the cart, complete one ordinary order and verify the existing cooking loop still works.


## Mobile layout and movement regression
- [ ] On a narrow phone in portrait, confirm the full neighborhood is visible (including both side edges), top cards do not overlap, and the bottom controls fit within the safe area.
- [ ] Rotate to landscape; confirm no forced portrait rotation, no clipped HUD, and the control panel remains reachable.
- [ ] Open Map, Bag, Journal, and Phone panels; scroll long content and close each panel without the page itself scrolling.
- [ ] Press and hold each on-screen direction button; the player should move continuously at a steady pace and stop immediately on release/cancel.
- [ ] Hold two directions together; diagonal speed should not be faster than straight movement.
- [ ] Hold a keyboard direction; movement should be smooth and independent of browser key-repeat rate.
- [ ] Move into each obstacle at an angle; collision should block entry and preserve sliding along the edge.
- [ ] Background the browser while holding a direction, return, and confirm there is no large position jump.
- [ ] Interact immediately after releasing movement; the nearest-location prompt and E interaction must use the player's latest position.


## Mobile cooking screen regression checks (portrait + landscape)
- [ ] Portrait (320×640, 375×812, 390×844): top action buttons wrap and remain tappable; none are clipped horizontally.
- [ ] Portrait: order dialogue, ingredient requirements, and patience bar remain readable without overlapping the customer or cutting station.
- [ ] Portrait: four compact step labels do not collide; cutting instruction wraps inside the screen.
- [ ] Portrait: rice-paper board and both action buttons remain fully visible; swipe cutting still registers across the board.
- [ ] Landscape (844×390 or similar): desktop-style wider layout remains intact and controls do not overlap.
- [ ] Verify topping, seasoning, rolling/shaking, and checkout stages after completing cutting.
