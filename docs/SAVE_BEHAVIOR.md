# Local Save Behavior

## Decision

Game progress is stored locally in the browser's `localStorage`. There is no account-based save, cloud synchronization, or GitHub save storage.

## Expected behavior

- Each browser profile keeps its own save for this game's origin.
- Different devices have independent saves.
- Different browsers on the same device have independent saves.
- Reloading or reopening the game in the same browser profile resumes its local progress.
- Clearing this site's browser data, using private/incognito mode, or changing browser profiles may make that local save unavailable.
- Publishing a new game build at the same origin does not intentionally reset existing save keys.

## Existing local data

- Session: `banh_trang_session_save_v1`
- Long-term progression: `banh_trang_player_progress_v1`
- Best record: `banh_trang_tron_sinh_ton_record_v1`
- Vendor location: `banhtrang_vendor_spot_v1`
- Tutorial completion: `banhtrang_tutorial_v1`
- Completed missions use the local-storage key defined in `src/game/missions.ts`.

## Manual QA

1. Start a game in Browser A and make progress until the game saves.
2. Reload Browser A and verify Continue restores the same run/progression.
3. Open the same deployed URL in Browser B or a separate browser profile; verify it starts with its own local data.
4. Return to Browser A; verify its original save remains unchanged.
5. Repeat on another device if available.
6. Do not clear site data during this test; doing so intentionally removes that browser's local save.

The Tester Panel's save view is diagnostic/export-only. It does not import, reset, or synchronize saves.
