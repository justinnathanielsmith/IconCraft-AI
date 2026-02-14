
import { performance } from 'perf_hooks';

// Mock canvas dimensions
const WIDTH = 1024;
const HEIGHT = 1024;
const LENGTH = WIDTH * HEIGHT * 4;

// Create random image data
const data = new Uint8ClampedArray(LENGTH);

// Fill with some pattern:
// 1. Transparent border (alpha 0)
// 2. White background (255, 255, 255, 255)
// 3. Icon content in the middle (random colors, alpha 255)

for (let i = 0; i < LENGTH; i += 4) {
  const pixelIndex = i / 4;
  const x = pixelIndex % WIDTH;
  const y = Math.floor(pixelIndex / WIDTH);

  // Icon in center 500x500
  if (x > 262 && x < 762 && y > 262 && y < 762) {
    data[i] = Math.floor(Math.random() * 255); // R
    data[i+1] = Math.floor(Math.random() * 255); // G
    data[i+2] = Math.floor(Math.random() * 255); // B
    data[i+3] = 255; // Alpha
  }
  // White background outside
  else {
    data[i] = 255;
    data[i+1] = 255;
    data[i+2] = 255;
    data[i+3] = 255; // Alpha
  }
}

// Helper for original implementation
function getTightBoundsOriginal(data: Uint8ClampedArray, width: number, height: number) {
  let minX = width, minY = height, maxX = 0, maxY = 0;
  let found = false;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = (y * width + x) * 4;
      const alpha = data[index + 3];
      const r = data[index];
      const g = data[index + 1];
      const b = data[index + 2];

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

// Helper for optimized implementation
function getTightBoundsOptimized(data: Uint8ClampedArray, width: number, height: number) {
  let minX = width, maxX = 0;
  let minY = -1, maxY = -1;
  let found = false;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * width * 4;
    let rowHasContent = false;

    // Scan from left
    for (let x = 0; x < width; x++) {
       const index = rowOffset + (x * 4);
       const alpha = data[index + 3];

       if (alpha > 10) {
         let isContent = true;
         if (alpha > 250) {
             if (data[index] > 250 && data[index + 1] > 250 && data[index + 2] > 250) {
                isContent = false;
             }
         }

         if (isContent) {
            if (x < minX) minX = x;
            rowHasContent = true;
            if (minY === -1) minY = y;
            maxY = y;
            found = true;
            break; // Stop scanning this row from left
         }
       }
    }

    if (rowHasContent) {
       // Scan from right to find maxX for this row
       for (let x = width - 1; x >= 0; x--) {
          const index = rowOffset + (x * 4);
          const alpha = data[index + 3];

          if (alpha > 10) {
             let isContent = true;
             if (alpha > 250) {
                 if (data[index] > 250 && data[index + 1] > 250 && data[index + 2] > 250) {
                    isContent = false;
                 }
             }

             if (isContent) {
                if (x > maxX) maxX = x;
                break; // Stop scanning this row from right
             }
          }
       }
    }
  }

  if (!found) return null;
  return { minX, minY, maxX, maxY };
}

// Verify correctness
const res1 = getTightBoundsOriginal(data, WIDTH, HEIGHT);
const res2 = getTightBoundsOptimized(data, WIDTH, HEIGHT);

if (JSON.stringify(res1) !== JSON.stringify(res2)) {
  console.error("Results mismatch!");
  console.log("Original:", res1);
  console.log("Optimized:", res2);
  process.exit(1);
}

console.log("Correctness verification passed.");

// Benchmark
const ITERATIONS = 100;

const start1 = performance.now();
for (let i = 0; i < ITERATIONS; i++) {
  getTightBoundsOriginal(data, WIDTH, HEIGHT);
}
const end1 = performance.now();

const start2 = performance.now();
for (let i = 0; i < ITERATIONS; i++) {
  getTightBoundsOptimized(data, WIDTH, HEIGHT);
}
const end2 = performance.now();

console.log(`Original: ${(end1 - start1).toFixed(2)}ms`);
console.log(`Optimized: ${(end2 - start2).toFixed(2)}ms`);
console.log(`Improvement: ${((end1 - start1) / (end2 - start2)).toFixed(2)}x faster`);
