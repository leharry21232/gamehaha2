import test from 'node:test';
import assert from 'node:assert/strict';
import { computePrepLayout, getMobileHubBaseHeight, getToppingUndoRect } from './layout';

const phoneViewports = [
  [280, 480], [320, 568], [320, 640], [360, 740], [375, 667],
  [375, 812], [390, 844], [414, 896], [430, 932], [480, 960],
  [568, 320], [667, 375], [740, 360], [844, 390], [932, 430],
];

test('cooking action buttons and cutting board stay within common phone viewports', () => {
  for (const [width, height] of phoneViewports) {
    const layout = computePrepLayout(width, height);
    const boardWidth = layout.boardRadius * 2.6;
    const boardHeight = layout.boardRadius * 2.08;
    const boardLeft = layout.boardCenterX - boardWidth / 2;
    const boardRight = layout.boardCenterX + boardWidth / 2;
    const boardTop = layout.boardCenterY - boardHeight / 2;
    const boardBottom = layout.boardCenterY + boardHeight / 2;

    assert.ok(boardLeft >= -1, `board left at ${width}x${height}: ${boardLeft}`);
    assert.ok(boardRight <= width + 1, `board right at ${width}x${height}: ${boardRight}`);
    assert.ok(boardTop >= layout.counterY, `board overlaps step/header area at ${width}x${height}`);
    assert.ok(boardBottom < layout.primaryBtn.y, `board/action overlap at ${width}x${height}`);

    for (const button of [layout.primaryBtn, layout.secondaryBtn]) {
      assert.ok(button.x >= -1, `button left at ${width}x${height}: ${button.x}`);
      assert.ok(button.x + button.w <= width + 1, `button right at ${width}x${height}`);
      assert.ok(button.y >= 0, `button top at ${width}x${height}`);
      assert.ok(button.y + button.h <= height + 1, `button bottom at ${width}x${height}`);
    }
  }
});

test('narrow phones retain usable action targets without forcing a 320px canvas width', () => {
  for (const width of [280, 300, 320]) {
    const layout = computePrepLayout(width, 640);
    assert.ok(layout.primaryBtn.w > 0);
    assert.ok(layout.secondaryBtn.w > 0);
    assert.ok(layout.primaryBtn.x + layout.primaryBtn.w <= width);
    assert.ok(layout.secondaryBtn.x >= 0);
  }
});

test('landscape cooking layout retains wider workstation controls', () => {
  for (const [width, height] of [[844, 390], [932, 430], [1024, 600]]) {
    const layout = computePrepLayout(width, height);
    assert.ok(layout.primaryBtn.x > layout.secondaryBtn.x);
    assert.ok(layout.primaryBtn.y + layout.primaryBtn.h <= height);
    assert.ok(layout.boardCenterX - layout.boardRadius * 1.3 >= 0);
    assert.ok(layout.boardCenterX + layout.boardRadius * 1.3 <= width);
  }
});


test('mobile order card sits below the reserved HUD and keeps a readable card height', () => {
  for (const [width, height] of [[280, 480], [320, 568], [360, 740], [375, 812], [390, 844], [414, 896]]) {
    const layout = computePrepLayout(width, height);
    assert.ok(layout.bubbleRect.y >= 148, `order card starts below mobile HUD at ${width}x${height}`);
    assert.ok(layout.bubbleRect.h >= 120, `order card retains readable height at ${width}x${height}`);
    assert.ok(layout.bubbleRect.x >= 0);
    assert.ok(layout.bubbleRect.x + layout.bubbleRect.w <= width);
    assert.ok(layout.bubbleRect.y + layout.bubbleRect.h < layout.counterY);
  }
});


test('mobile topping undo and continue buttons occupy separate thumb-friendly slots', () => {
  for (const width of [280, 300, 320, 360, 375, 390, 414]) {
    const layout = computePrepLayout(width, 844);
    const undo = getToppingUndoRect(layout);
    const next = layout.primaryBtn;
    assert.ok(undo.x >= 0 && undo.x + undo.w <= width, `undo stays inside ${width}px`);
    assert.ok(next.x >= 0 && next.x + next.w <= width, `next stays inside ${width}px`);
    assert.ok(undo.x + undo.w <= next.x + 1, `undo and next do not overlap at ${width}px`);
    assert.ok(undo.h >= 42 && next.h >= 42, `touch targets remain usable at ${width}px`);
  }
});

test('Bánh cuốn cutting board including shadow fits narrow phone widths', () => {
  for (const [width, height] of phoneViewports.filter(([w]) => w < 680)) {
    const layout = computePrepLayout(width, height);
    const board = layout.cuonCutBoardRect;
    assert.ok(board.x >= 12, `board left edge including shadow at ${width}x${height}`);
    assert.ok(board.x + board.w + 6 <= width - 6, `board right edge including shadow at ${width}x${height}`);
    assert.ok(board.y >= layout.counterY, `board starts below counter at ${width}x${height}`);
    assert.ok(board.y + board.h + 6 < layout.primaryBtn.y, `board does not overlap action buttons at ${width}x${height}`);
  }
});


test('short landscape phones use compact layout and keep topping trays above actions', () => {
  for (const [width, height] of [[568, 320], [667, 375], [740, 360], [844, 390], [932, 430]]) {
    const layout = computePrepLayout(width, height);
    assert.equal(layout.isCompact, true, `${width}x${height} is compact`);
    assert.ok(layout.counterY < height * 0.65, `counter leaves room for cooking at ${width}x${height}`);
    for (const tray of Object.values(layout.trayRects)) {
      assert.ok(tray.x >= 0 && tray.x + tray.w <= width, `tray stays inside ${width}x${height}`);
      assert.ok(tray.y + tray.h <= layout.primaryBtn.y, `tray does not overlap action row at ${width}x${height}`);
    }
    assert.ok(layout.primaryBtn.y + layout.primaryBtn.h <= height);
  }
});

test('very short portrait phones keep two topping rows above the action buttons', () => {
  const layout = computePrepLayout(280, 480);
  for (const tray of Object.values(layout.trayRects)) {
    assert.ok(tray.y + tray.h <= layout.primaryBtn.y, 'tiny-phone tray does not overlap action row');
    assert.ok(tray.h >= 16, 'tiny-phone tray remains tappable');
  }
});


test('mobile canvas starts below the Mobile Hub reservation on portrait and landscape', () => {
  const cases = [
    [280, 480, 136], [320, 480, 136], [320, 568, 170], [360, 740, 170],
    [375, 667, 202], [390, 844, 202], [568, 320, 78], [667, 375, 78],
    [844, 390, 78], [932, 430, 78],
  ];
  for (const [width, height, expectedHubBase] of cases) {
    assert.equal(getMobileHubBaseHeight(width, height), expectedHubBase);
    const layout = computePrepLayout(width, height);
    assert.equal(layout.mobileHubBottom, expectedHubBase + 12);
    assert.ok(layout.bubbleRect.y >= layout.mobileHubBottom + 4, `order card clears Mobile Hub at ${width}x${height}`);
  }
});

test('landscape phones place the bowl and all ingredient targets side by side', () => {
  for (const [width, height] of [[568, 320], [667, 375], [740, 360], [844, 390], [932, 430]]) {
    const layout = computePrepLayout(width, height);
    assert.ok(layout.bowlCenterX + layout.bowlRadius < Math.min(...Object.values(layout.trayRects).map((r) => r.x)));
    for (const tray of Object.values(layout.trayRects)) {
      assert.ok(tray.x >= 0 && tray.x + tray.w <= width);
      assert.ok(tray.y >= layout.counterY);
      assert.ok(tray.y + tray.h <= layout.primaryBtn.y - 8);
      assert.ok(tray.h >= 24, `landscape ingredient target remains touchable at ${width}x${height}`);
      assert.ok(tray.w >= 40, `landscape ingredient target remains wide enough at ${width}x${height}`);
    }
  }
});

test('compact portrait seasoning controls and topping trays clear the action row', () => {
  for (const [width, height] of [[280, 480], [320, 568], [360, 740], [375, 667], [390, 844], [414, 896]]) {
    const layout = computePrepLayout(width, height);
    for (const rect of [layout.limeHoldRect, layout.chiliHoldRect, layout.limeBarRect, layout.chiliBarRect]) {
      assert.ok(rect.x >= 0 && rect.x + rect.w <= width, `seasoning control stays within ${width}px`);
    }
    assert.ok(layout.chiliHoldRect.y + layout.chiliHoldRect.h <= layout.primaryBtn.y, `second seasoning hold target clears continue button at ${width}x${height}`);
    for (const tray of Object.values(layout.trayRects)) {
      assert.ok(tray.y + tray.h <= layout.primaryBtn.y, `portrait topping tray clears continue button at ${width}x${height}: tray=${tray.y}+${tray.h}, button=${layout.primaryBtn.y}`);
      assert.ok(tray.h >= 28, `portrait topping target remains touchable at ${width}x${height}`);
    }
  }
});

test('short landscape seasoning controls do not cover the action row', () => {
  for (const [width, height] of [[568, 320], [667, 375], [740, 360], [844, 390]]) {
    const layout = computePrepLayout(width, height);
    assert.ok(layout.chiliHoldRect.y + layout.chiliHoldRect.h <= layout.primaryBtn.y);
    assert.ok(layout.limeBarRect.x + layout.limeBarRect.w <= width);
    assert.ok(layout.chiliBarRect.x + layout.chiliBarRect.w <= width);
  }
});
