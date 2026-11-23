import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { INITIAL_PLAYER_PROGRESS } from './progression';
import { claimStoryMissionReward, getStoryMissionSnapshot, loadCompletedMissionIds, saveCompletedMissionIds } from './missions';

test('first story mission tracks completed orders and pays only after target', () => {
  const before = getStoryMissionSnapshot(INITIAL_PLAYER_PROGRESS, []);
  assert.equal(before.id, 'story_first_customers');
  assert.equal(before.chapter, 'Chương 1 · Xe đẩy đầu ngõ');
  assert.equal(before.completed, false);
  const progress = { ...INITIAL_PLAYER_PROGRESS, completedOrders: 3 };
  const ready = getStoryMissionSnapshot(progress, []);
  assert.equal(ready.completed, true);
  assert.equal(claimStoryMissionReward(progress, [])?.reward, 15000);
  assert.equal(claimStoryMissionReward(INITIAL_PLAYER_PROGRESS, []), null);
});

test('chapter one missions unlock in order and finish at level five', () => {
  const afterFirst = ['story_first_customers'];
  const second = getStoryMissionSnapshot({ ...INITIAL_PLAYER_PROGRESS, lifetimeEarnings: 100000 }, afterFirst);
  assert.equal(second.id, 'story_build_reputation');
  assert.equal(second.chapter, 'Chương 1 · Xe đẩy đầu ngõ');
  assert.equal(second.completed, true);

  const afterSecond = [...afterFirst, 'story_build_reputation'];
  const third = getStoryMissionSnapshot({ ...INITIAL_PLAYER_PROGRESS, level: 3 }, afterSecond);
  assert.equal(third.id, 'story_level_three');
  assert.equal(third.completed, true);

  const afterThird = [...afterSecond, 'story_level_three'];
  const finalMission = getStoryMissionSnapshot({ ...INITIAL_PLAYER_PROGRESS, level: 5 }, afterThird);
  assert.equal(finalMission.id, 'story_chapter_one_mastery');
  assert.equal(finalMission.completed, true);
  assert.equal(claimStoryMissionReward({ ...INITIAL_PLAYER_PROGRESS, level: 5 }, afterThird)?.reward, 60000);

  const finished = getStoryMissionSnapshot(INITIAL_PLAYER_PROGRESS, [...afterThird, 'story_chapter_one_mastery']);
  assert.equal(finished.allCompleted, true);
  assert.equal(finished.chapter, 'Chương 1 · Hoàn thành');
  assert.equal(claimStoryMissionReward(INITIAL_PLAYER_PROGRESS, [...afterThird, 'story_chapter_one_mastery']), null);
});

test('mission completion storage safely round-trips and ignores unknown IDs', () => {
  const values = new Map<string, string>();
  const storage = {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
  };
  saveCompletedMissionIds(['story_first_customers', 'not-a-mission'], storage);
  assert.deepEqual(loadCompletedMissionIds(storage), ['story_first_customers']);
});

test('existing mission IDs remain valid for saves created before chapter one expansion', () => {
  const values = new Map<string, string>([
    ['banh_trang_tron_story_missions_v1', JSON.stringify(['story_first_customers', 'story_build_reputation', 'story_level_three'])],
  ]);
  assert.deepEqual(loadCompletedMissionIds({ getItem: (key) => values.get(key) ?? null }), [
    'story_first_customers',
    'story_build_reputation',
    'story_level_three',
  ]);
});
