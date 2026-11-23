import test from 'node:test';
import assert from 'node:assert/strict';
import { getPortraitWorldTop } from './neighborhoodLayout';

test('portrait map projects the logical sidewalk range to the visible walkway', () => {
  assert.equal(getPortraitWorldTop(33), 43);
  assert.equal(getPortraitWorldTop(56), 62);
  assert.equal(getPortraitWorldTop(44.5), 52.5);
});

test('portrait map safely clamps positions outside the logical sidewalk', () => {
  assert.equal(getPortraitWorldTop(-100), 43);
  assert.equal(getPortraitWorldTop(100), 62);
  assert.equal(getPortraitWorldTop(Number.NaN), 43);
});
