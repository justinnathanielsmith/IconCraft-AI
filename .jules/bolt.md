## 2024-05-22 - Enum Reverse Lookup Performance
**Learning:** Iterating `Object.values(Enum)` and then doing a reverse lookup to find the Key (for display purposes) creates an O(N^2) render bottleneck.
**Action:** Pre-calculate a `Value -> DisplayName` map outside the component, or iterate `Object.keys(Enum)` directly if the display name is derived from the key.
