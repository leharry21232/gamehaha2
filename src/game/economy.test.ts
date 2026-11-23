import test from 'node:test';
import assert from 'node:assert/strict';
import { ECONOMY_TUNING } from './economy';

test('rare boss reward is a premium payout, not a half-million windfall', () => {
  assert.equal(ECONOMY_TUNING.bossReward, 120_000);
  assert.ok(ECONOMY_TUNING.bossReward < 150_000);
});

test('skillful cooking bonuses reward mastery without multiplying an order fivefold', () => {
  assert.equal(ECONOMY_TUNING.flowMasterpieceMultiplier, 2);
  assert.equal(ECONOMY_TUNING.tarotComboMultiplier, 1.5);
  assert.equal(ECONOMY_TUNING.viralMultiplier, 1.5);
  assert.ok(ECONOMY_TUNING.flowMasterpieceMultiplier <= 2);
  assert.ok(ECONOMY_TUNING.viralMultiplier <= ECONOMY_TUNING.flowMasterpieceMultiplier);
});

test('special tips and incidental rewards stay below a normal boss payout', () => {
  assert.equal(ECONOMY_TUNING.realEstateTip, 30_000);
  assert.equal(ECONOMY_TUNING.baziPerfectTip, 50_000);
  assert.equal(ECONOMY_TUNING.cashPickupReward, 5_000);
  assert.equal(ECONOMY_TUNING.raidSurvivalReward, 15_000);
  assert.ok(ECONOMY_TUNING.baziPerfectTip < ECONOMY_TUNING.bossReward);
});

test('lottery jackpot is reduced while retaining its rare-event excitement', () => {
  assert.equal(ECONOMY_TUNING.lotteryWinChance, 0.02);
  assert.equal(ECONOMY_TUNING.lotteryPayout, 100_000);
  assert.ok(ECONOMY_TUNING.lotteryPayout < ECONOMY_TUNING.bossReward);
});
