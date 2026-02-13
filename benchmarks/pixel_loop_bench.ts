const width = 2048;
const height = 2048;
const size = width * height * 4;
const data = new Uint8ClampedArray(size);

// Fill with 50% transparent data, 50% solid
for (let i = 0; i < size; i += 4) {
  if (Math.random() > 0.5) {
      // Transparent
      data[i] = 0;
      data[i + 1] = 0;
      data[i + 2] = 0;
      data[i + 3] = 0;
  } else {
      // Solid color
      data[i] = Math.floor(Math.random() * 256);
      data[i + 1] = Math.floor(Math.random() * 256);
      data[i + 2] = Math.floor(Math.random() * 256);
      data[i + 3] = 255;
  }
}

// Function with original logic
function original(width: number, height: number, data: Uint8ClampedArray) {
  let minX = width, minY = height, maxX = 0, maxY = 0;
  let found = false;

  const start = performance.now();
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
  const end = performance.now();
  return { time: end - start, found, minX, minY, maxX, maxY };
}

// Function with optimized logic
function optimized(width: number, height: number, data: Uint8ClampedArray) {
  let minX = width, minY = height, maxX = 0, maxY = 0;
  let found = false;

  const start = performance.now();
  let index = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const alpha = data[index + 3];

      if (alpha > 10) {
        const r = data[index];
        const g = data[index + 1];
        const b = data[index + 2];
        const isBackground = r > 250 && g > 250 && b > 250 && alpha > 250;

        if (!isBackground) {
            if (x < minX) minX = x;
            if (y < minY) minY = y;
            if (x > maxX) maxX = x;
            if (y > maxY) maxY = y;
            found = true;
        }
      }
      index += 4;
    }
  }
  const end = performance.now();
  return { time: end - start, found, minX, minY, maxX, maxY };
}

// Verification
console.log("Verifying correctness...");
const resOriginal = original(width, height, data);
const resOptimized = optimized(width, height, data);

if (
  resOriginal.found !== resOptimized.found ||
  resOriginal.minX !== resOptimized.minX ||
  resOriginal.minY !== resOptimized.minY ||
  resOriginal.maxX !== resOptimized.maxX ||
  resOriginal.maxY !== resOptimized.maxY
) {
  console.error("MISMATCH DETECTED!");
  console.log("Original:", resOriginal);
  console.log("Optimized:", resOptimized);
  process.exit(1);
} else {
  console.log("Correctness Verified ✅");
}

// Run benchmarks
console.log(`Running benchmark on ${width}x${height} image with 50% transparency...`);

// Warmup
original(width, height, data);
optimized(width, height, data);

// Measure
const runs = 20;
let totalOriginal = 0;
let totalOptimized = 0;

for (let i = 0; i < runs; i++) {
  totalOriginal += original(width, height, data).time;
  totalOptimized += optimized(width, height, data).time;
}

const avgOriginal = totalOriginal / runs;
const avgOptimized = totalOptimized / runs;

console.log(`Original Avg Time: ${avgOriginal.toFixed(2)}ms`);
console.log(`Optimized Avg Time: ${avgOptimized.toFixed(2)}ms`);
console.log(`Speedup: ${(avgOriginal / avgOptimized).toFixed(2)}x`);
