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

## 2026-06-21 - Pixel Loop Optimization
**Learning:** In pixel manipulation loops (e.g., `getTightBounds`), using `(y * width + x) * 4` multiplication inside nested loops is measurably slower than maintaining a running linear index. Additionally, hoisting alpha checks to skip processing transparent pixels yields significant gains (~20%) for sparse images like icons.
**Action:** Replace multiplication-based indexing with linear counters and add early-exit checks for transparency in all pixel processing loops.
