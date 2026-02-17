## 2024-05-22 - Enum Reverse Lookup Performance
**Learning:** Iterating `Object.values(Enum)` and then doing a reverse lookup to find the Key (for display purposes) creates an O(N^2) render bottleneck.
**Action:** Pre-calculate a `Value -> DisplayName` map outside the component, or iterate `Object.keys(Enum)` directly if the display name is derived from the key.

## 2026-02-07 - Slider Performance Bottleneck
**Learning:** Rapid input changes (like `input type="range"`) can trigger expensive state updates (array slicing/spreading) on every pixel of movement, causing memory spikes and UI lag.
**Action:** Decouple visual state updates (`onChange`) from expensive data commits (`onMouseUp`/`onTouchEnd`), creating a manual "debounce" effect.

## 2026-06-03 - Static Options Allocation Bottleneck
**Learning:** Recreating constant options arrays (e.g., via `Object.keys(Enum).map(...)`) inside the render loop causes unnecessary O(N) allocations on every re-render (e.g., keystrokes).
**Action:** Move static data generation outside the component scope or memoize it to ensure O(1) access during render.

## 2026-02-10 - Heavy Dependency Lazy Loading
**Learning:** Importing heavy utility libraries (like `jszip`, ~100KB) at the top level increases the initial bundle size significantly, even if the feature ("Download All") is rarely used.
**Action:** Use `import()` inside the event handler to lazy load the dependency only when the user explicitly requests the action.

## 2026-07-15 - Pixel Iteration Performance
**Learning:** In nested loops iterating over pixel data (e.g., `(y * width + x) * 4`), the multiplication overhead accumulates significantly (1M+ ops for 1024x1024 image).
**Action:** Replace multiplication-based indexing with an incremental counter (`index += 4`) inside the inner loop and cache `canvas.width`/`height` to reduce CPU cycles and property access overhead (~11% speedup).
