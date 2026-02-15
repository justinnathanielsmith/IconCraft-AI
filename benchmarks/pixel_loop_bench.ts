
// Mocking the getTightBounds logic for benchmarking
// Simulates a 1024x1024 image

const WIDTH = 1024;
const HEIGHT = 1024;
const SIZE = WIDTH * HEIGHT * 4;

const buffer = new ArrayBuffer(SIZE);
const data = new Uint8ClampedArray(buffer);
const data32 = new Uint32Array(buffer);

// Fill with background (white: 255, 255, 255, 255)
// In Little Endian Uint32: A(255) B(255) G(255) R(255) -> 0xFFFFFFFF
const WHITE_PIXEL = 0xFFFFFFFF;
data32.fill(WHITE_PIXEL);

// Draw a "red square" in the center (255, 0, 0, 255)
// In Little Endian Uint32: A(255) B(0) G(0) R(255) -> 0xFF0000FF
const RED_PIXEL = 0xFF0000FF;

const rectX = 262;
const rectY = 262;
const rectW = 500;
const rectH = 500;

for (let y = rectY; y < rectY + rectH; y++) {
  for (let x = rectX; x < rectX + rectW; x++) {
    const i = y * WIDTH + x;
    data32[i] = RED_PIXEL;
  }
}

// Original
function originalGetTightBounds(data: Uint8ClampedArray, width: number, height: number) {
  let minX = width, minY = height, maxX = 0, maxY = 0;
  let found = false;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = (y * width + x) * 4;
      const r = data[index];
      const g = data[index + 1];
      const b = data[index + 2];
      const alpha = data[index + 3];

      // isBackground: r > 250 && g > 250 && b > 250 && alpha > 250
      // This is effectively checking if it is VERY close to white.
      // For exact white (255,255,255,255), this is true.

      const isBackground = r > 250 && g > 250 && b > 250 && alpha > 250;
      if (alpha > 10 && !isBackground) {
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
        found = true;
      }
    }
  }
  return found ? { minX, minY, maxX, maxY } : null;
}

// Optimized with Split Loops (as before)
function splitLoopsGetTightBounds(data: Uint8ClampedArray, width: number, height: number) {
  let minX = width, minY = height, maxX = 0, maxY = 0;
  let found = false;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = (y * width + x) * 4;
      const r = data[index];
      const g = data[index + 1];
      const b = data[index + 2];
      const alpha = data[index + 3];

      const isBackground = r > 250 && g > 250 && b > 250 && alpha > 250;
      if (alpha > 10 && !isBackground) {
        minY = y;
        found = true;
        break;
      }
    }
    if (found) break;
  }

  if (!found) return null;

  for (let y = height - 1; y >= minY; y--) {
    let rowHasContent = false;
    for (let x = 0; x < width; x++) {
      const index = (y * width + x) * 4;
      const r = data[index];
      const g = data[index + 1];
      const b = data[index + 2];
      const alpha = data[index + 3];

      const isBackground = r > 250 && g > 250 && b > 250 && alpha > 250;
      if (alpha > 10 && !isBackground) {
        maxY = y;
        rowHasContent = true;
        break;
      }
    }
    if (rowHasContent) break;
  }

  found = false;
  for (let x = 0; x < width; x++) {
    for (let y = minY; y <= maxY; y++) {
      const index = (y * width + x) * 4;
      const r = data[index];
      const g = data[index + 1];
      const b = data[index + 2];
      const alpha = data[index + 3];

      const isBackground = r > 250 && g > 250 && b > 250 && alpha > 250;
      if (alpha > 10 && !isBackground) {
        minX = x;
        found = true;
        break;
      }
    }
    if (found) break;
  }

  found = false;
  for (let x = width - 1; x >= minX; x--) {
    for (let y = minY; y <= maxY; y++) {
      const index = (y * width + x) * 4;
      const r = data[index];
      const g = data[index + 1];
      const b = data[index + 2];
      const alpha = data[index + 3];

      const isBackground = r > 250 && g > 250 && b > 250 && alpha > 250;
      if (alpha > 10 && !isBackground) {
        maxX = x;
        found = true;
        break;
      }
    }
    if (found) break;
  }

  return { minX, minY, maxX, maxY };
}


// Optimized with Uint32 View + Split Loops
function uint32GetTightBounds(data32: Uint32Array, width: number, height: number) {
  let minX = width, minY = height, maxX = 0, maxY = 0;
  let found = false;

  // We need to handle "isBackground" carefully.
  // r > 250 && g > 250 && b > 250 && alpha > 250
  // This means the pixel is >= (251, 251, 251, 251)
  // In 32-bit integer (little endian): A B G R
  // If we assume Little Endian, 0xAABBGGRR
  // We can't do a simple integer comparison because of channel independence.
  // BUT we can check if it's EQUAL to WHITE (0xFFFFFFFF) as a fast path.
  // Or check if it's NOT white.

  // Actually, extracting bytes from Uint32 is fast with bitwise ops.

  function isContent(pixel: number) {
    // pixel is ABGR in little endian
    const a = (pixel >>> 24) & 0xFF;
    if (a <= 10) return false;

    // Check if background (White-ish)
    // r,g,b,a > 250
    // If a <= 250, not background. (Already checked a > 10).
    // If r <= 250 or g <= 250 or b <= 250, then not background -> return true.

    // r is lowest byte
    const r = pixel & 0xFF;
    const g = (pixel >>> 8) & 0xFF;
    const b = (pixel >>> 16) & 0xFF;

    const isBackground = r > 250 && g > 250 && b > 250 && a > 250;
    return !isBackground;
  }

  // 1. Scan from top
  for (let y = 0; y < height; y++) {
    const rowOffset = y * width;
    for (let x = 0; x < width; x++) {
      if (isContent(data32[rowOffset + x])) {
        minY = y;
        found = true;
        break;
      }
    }
    if (found) break;
  }

  if (!found) return null;

  // 2. Scan from bottom
  for (let y = height - 1; y >= minY; y--) {
    let rowHasContent = false;
    const rowOffset = y * width;
    for (let x = 0; x < width; x++) {
      if (isContent(data32[rowOffset + x])) {
        maxY = y;
        rowHasContent = true;
        break;
      }
    }
    if (rowHasContent) break;
  }

  // 3. Scan from left
  found = false;
  for (let x = 0; x < width; x++) {
    for (let y = minY; y <= maxY; y++) {
      if (isContent(data32[y * width + x])) {
        minX = x;
        found = true;
        break;
      }
    }
    if (found) break;
  }

  // 4. Scan from right
  found = false;
  for (let x = width - 1; x >= minX; x--) {
    for (let y = minY; y <= maxY; y++) {
       if (isContent(data32[y * width + x])) {
        maxX = x;
        found = true;
        break;
      }
    }
    if (found) break;
  }

  return { minX, minY, maxX, maxY };
}

// Warmup
console.log("Warming up...");
originalGetTightBounds(data, WIDTH, HEIGHT);
splitLoopsGetTightBounds(data, WIDTH, HEIGHT);
uint32GetTightBounds(data32, WIDTH, HEIGHT);

const ITERATIONS = 100;

console.time("Original");
for (let i = 0; i < ITERATIONS; i++) {
  originalGetTightBounds(data, WIDTH, HEIGHT);
}
console.timeEnd("Original");

console.time("Split Loops");
for (let i = 0; i < ITERATIONS; i++) {
  splitLoopsGetTightBounds(data, WIDTH, HEIGHT);
}
console.timeEnd("Split Loops");

console.time("Uint32");
for (let i = 0; i < ITERATIONS; i++) {
  uint32GetTightBounds(data32, WIDTH, HEIGHT);
}
console.timeEnd("Uint32");

// Verify
const res1 = originalGetTightBounds(data, WIDTH, HEIGHT);
const res3 = uint32GetTightBounds(data32, WIDTH, HEIGHT);
console.log(res1);
console.log(res3);
