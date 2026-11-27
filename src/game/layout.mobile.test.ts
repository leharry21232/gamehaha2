import test from 'node:test';
import assert from 'node:assert/strict';
import { buildCutGuides, findSnapCutGuide } from './cutGuides';
import { computePrepLayout, getToppingUndoRect, type Rect } from './layout';

const TARGET_PHONE_PORTRAITS: Array<[number, number]> = [
  [360, 640],
  [375, 667],
  [390, 844],
  [430, 932],
];

function rectsOverlap(a: Rect, b: Rect): boolean {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
}

function assertInsideViewport(r: Rect, width: number, height: number, label: string): void {
  assert.ok(r.x >= 0, `${label} x >= 0 (got ${r.x})`);
  assert.ok(r.y >= 0, `${label} y >= 0 (got ${r.y})`);
  assert.ok(r.x + r.w <= width, `${label} right <= ${width} (got ${r.x + r.w})`);
  assert.ok(r.y + r.h <= height, `${label} bottom <= ${height} (got ${r.y + r.h})`);
}

test('phone portrait CUON layout guarantees >=48/56px tap targets and zero overlaps', () => {
  for (const [width, height] of TARGET_PHONE_PORTRAITS) {
    const layout = computePrepLayout(width, height);
    assert.equal(layout.isCompact, true, `${width}x${height} isCompact`);
    assert.ok(layout.stepBarRect, `${width}x${height} defines stepBarRect`);
    assert.ok(layout.waitingZoneRect, `${width}x${height} defines waitingZoneRect`);

    const stepBar = layout.stepBarRect!;
    const waitZone = layout.waitingZoneRect!;

    // Tap target minimums
    assert.ok(layout.primaryBtn.h >= 56, `primaryBtn.h >= 56 at ${width}x${height}`);
    assert.ok(layout.primaryBtn.w >= 48, `primaryBtn.w >= 48 at ${width}x${height}`);
    assert.ok(layout.secondaryBtn.w >= 48 && layout.secondaryBtn.h >= 48, `secondaryBtn >= 48x48 at ${width}x${height}`);
    assert.equal(layout.rollBtn.w, width - 24, `rollBtn full width at ${width}x${height}`);
    assert.equal(layout.rollBtn.h, 56, `rollBtn.h === 56 at ${width}x${height}`);
    assert.ok(layout.limeHoldRect.h >= 56, `limeHoldRect.h >= 56 at ${width}x${height}`);
    assert.ok(layout.chiliHoldRect.h >= 56, `chiliHoldRect.h >= 56 at ${width}x${height}`);
    assert.ok(layout.limeBarRect.h >= 22, `limeBarRect.h >= 22 at ${width}x${height}`);
    assert.ok(layout.chiliBarRect.h >= 22, `chiliBarRect.h >= 22 at ${width}x${height}`);

    for (const [id, tray] of Object.entries(layout.trayRects)) {
      assert.ok(tray.w >= 48 && tray.h >= 48, `tray ${id} >= 48x48 at ${width}x${height}`);
      assertInsideViewport(tray, width, height, `tray ${id} at ${width}x${height}`);
      assert.equal(rectsOverlap(tray, layout.primaryBtn), false, `tray ${id} vs primaryBtn at ${width}x${height}`);
      assert.equal(rectsOverlap(tray, layout.secondaryBtn), false, `tray ${id} vs secondaryBtn at ${width}x${height}`);
      assert.equal(rectsOverlap(tray, layout.cuonCutBoardRect), false, `tray ${id} vs cuonCutBoardRect at ${width}x${height}`);
      assert.equal(rectsOverlap(tray, layout.matRect), false, `tray ${id} vs matRect at ${width}x${height}`);
      assert.equal(rectsOverlap(tray, stepBar), false, `tray ${id} vs stepBarRect at ${width}x${height}`);
    }

    // Bounds checks
    assertInsideViewport(layout.primaryBtn, width, height, `primaryBtn at ${width}x${height}`);
    assertInsideViewport(layout.secondaryBtn, width, height, `secondaryBtn at ${width}x${height}`);
    assertInsideViewport(stepBar, width, height, `stepBarRect at ${width}x${height}`);
    assertInsideViewport(waitZone, width, height, `waitingZoneRect at ${width}x${height}`);
    assertInsideViewport(layout.bubbleRect, width, height, `bubbleRect at ${width}x${height}`);
    assertInsideViewport(layout.cuonCutBoardRect, width, height, `cuonCutBoardRect at ${width}x${height}`);
    assertInsideViewport(layout.matRect, width, height, `matRect at ${width}x${height}`);
    assertInsideViewport(layout.rollRect, width, height, `rollRect at ${width}x${height}`);
    assertInsideViewport(layout.rollBtn, width, height, `rollBtn at ${width}x${height}`);

    // No overlaps across portrait zones
    assert.equal(rectsOverlap(stepBar, layout.bubbleRect), false, `stepBar vs bubbleRect at ${width}x${height}`);
    assert.equal(rectsOverlap(stepBar, layout.cuonCutBoardRect), false, `stepBar vs cuonCutBoardRect at ${width}x${height}`);
    assert.equal(rectsOverlap(stepBar, layout.matRect), false, `stepBar vs matRect at ${width}x${height}`);
    assert.equal(rectsOverlap(stepBar, layout.limeHoldRect), false, `stepBar vs limeHoldRect at ${width}x${height}`);
    assert.equal(rectsOverlap(waitZone, layout.bubbleRect), false, `waitingZone vs bubbleRect at ${width}x${height}`);
    assert.equal(rectsOverlap(layout.primaryBtn, layout.secondaryBtn), false, `primary vs secondary at ${width}x${height}`);
    assert.equal(rectsOverlap(getToppingUndoRect(layout), layout.primaryBtn), false, `undo vs primary at ${width}x${height}`);

    // Seasoning rects non-overlapping and above primaryBtn
    const seasonRects = [layout.limeHoldRect, layout.limeBarRect, layout.chiliHoldRect, layout.chiliBarRect, layout.primaryBtn];
    for (let i = 0; i < seasonRects.length; i++) {
      assertInsideViewport(seasonRects[i], width, height, `season[${i}] at ${width}x${height}`);
      for (let j = i + 1; j < seasonRects.length; j++) {
        assert.equal(rectsOverlap(seasonRects[i], seasonRects[j]), false, `season[${i}] vs [${j}] at ${width}x${height}`);
      }
    }
  }
});

test('desktop and short landscape layouts preserve exact pre-mobile behavior', () => {
  const desktop = computePrepLayout(1280, 800);
  assert.equal(desktop.isCompact, false);
  assert.equal(desktop.stepBarRect, undefined);
  assert.equal(desktop.waitingZoneRect, undefined);
  assert.ok(desktop.primaryBtn.w <= 256);

  const landscape = computePrepLayout(800, 400);
  assert.equal(landscape.isCompact, true);
  assert.equal(landscape.stepBarRect, undefined);
  assert.equal(landscape.waitingZoneRect, undefined);
  assert.ok(landscape.bowlCenterX < Math.min(...Object.values(landscape.trayRects).map((r) => r.x)));
});

test('scaled landscape canvas keeps the order card below the top hub', () => {
  for (const [width, height] of [[861, 327], [1722, 654]] as Array<[number, number]>) {
    const layout = computePrepLayout(width, height);
    assert.equal(layout.isHubLandscape, true, `${width}x${height} detects the wide hub layout`);
    assert.ok(layout.bubbleRect.y >= height * 0.34, `order card starts below the hub at ${width}x${height}`);
    assert.ok(layout.bubbleRect.h <= height * 0.46 + 1, `order card height fits the available landscape area at ${width}x${height}`);
    assert.ok(layout.bubbleRect.y + layout.bubbleRect.h < height, `order card stays inside viewport at ${width}x${height}`);
  }
});

test('medium landscape hub reserves its overlay area and keeps the order card compact', () => {
  for (const [width, height] of [[957, 615], [1024, 768]] as Array<[number, number]>) {
    const layout = computePrepLayout(width, height);
    assert.equal(layout.isHubLandscape, true, `${width}x${height} uses hub-landscape layout`);
    assert.ok(layout.bubbleRect.y >= 116, `order card starts below top hub at ${width}x${height}`);
    assert.ok(layout.bubbleRect.h <= 190, `order card height is capped at 190px at ${width}x${height}`);
    assertInsideViewport(layout.bubbleRect, width, height, `order card at ${width}x${height}`);
  }

  const desktop = computePrepLayout(1280, 800);
  assert.equal(desktop.isHubLandscape, false, 'wide desktop layout remains unchanged');
});

test('buildCutGuides generates N-1 evenly spaced guides perpendicular to long edge', () => {
  const roll: Rect = { x: 45, y: 400, w: 300, h: 64 };
  assert.deepEqual(buildCutGuides(roll, 1), []);
  assert.deepEqual(buildCutGuides(roll, 0), []);

  const guides4 = buildCutGuides(roll, 4);
  assert.equal(guides4.length, 3);
  assert.deepEqual(
    guides4.map((g) => g.mid.x),
    [120, 195, 270]
  );
  for (const g of guides4) {
    assert.ok(g.cutA.y < roll.y && g.cutB.y > roll.y + roll.h, 'cut line crosses roll top and bottom');
  }
});

test('findSnapCutGuide snaps nearest uncut guide within radius and skips completed or distant inputs', () => {
  const roll: Rect = { x: 45, y: 400, w: 300, h: 64 };
  const guides = buildCutGuides(roll, 4); // x at 120, 195, 270
  const mask = [false, false, false];

  // Tap within 36px of guide 0 (x=120)
  const hit0 = findSnapCutGuide({ x: 142, y: 432 }, null, guides, mask, 36);
  assert.equal(hit0?.index, 0);

  // Already cut guide 0 is skipped
  mask[0] = true;
  const skip0 = findSnapCutGuide({ x: 142, y: 432 }, null, guides, mask, 36);
  assert.equal(skip0, null);

  // Swipe midpoint crosses near guide 1 (x=195)
  const hit1 = findSnapCutGuide({ x: 170, y: 390 }, { x: 215, y: 465 }, guides, mask, 36);
  assert.equal(hit1?.index, 1);

  // Far away from any uncut guide (> 36px)
  const far = findSnapCutGuide({ x: 46, y: 432 }, null, guides, mask, 36);
  assert.equal(far, null);
});
