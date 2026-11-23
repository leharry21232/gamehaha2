import test from 'node:test';
import assert from 'node:assert/strict';
import { getLightingForDayPart } from './config';

test('neighborhood lighting follows the same three game-time phases as ambience', () => {
  assert.equal(getLightingForDayPart('MORNING'), 'morning');
  assert.equal(getLightingForDayPart('NOON'), 'noon');
  assert.equal(getLightingForDayPart('AFTERNOON'), 'afternoon');
});
