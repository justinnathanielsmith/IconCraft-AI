
const runBenchmark = () => {
  const width = 1024;
  const height = 1024;
  const size = width * height * 4;
  const data = new Uint8ClampedArray(size);

  // Fill with random data
  for (let i = 0; i < size; i++) {
    data[i] = Math.floor(Math.random() * 256);
  }

  const canvas = { width, height }; // Mock canvas

  const iterations = 100;
  console.log(`Running pixel loop benchmark for ${iterations} iterations on ${width}x${height} image...`);

  // 1. Original Implementation
  const startOriginal = performance.now();
  for (let i = 0; i < iterations; i++) {
    let minX = width, minY = height, maxX = 0, maxY = 0;
    let found = false;
    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const index = (y * canvas.width + x) * 4;
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
  }
  const endOriginal = performance.now();
  console.log(`Original: ${(endOriginal - startOriginal).toFixed(2)}ms`);

  // 2. Optimized Implementation (Incremental Index)
  const startOptimized = performance.now();
  for (let i = 0; i < iterations; i++) {
    let minX = width, minY = height, maxX = 0, maxY = 0;
    let found = false;
    let index = 0;
    const w = canvas.width; // Cache width
    const h = canvas.height; // Cache height

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        // const index = (y * w + x) * 4; // Removed multiplication
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
        index += 4;
      }
    }
  }
  const endOptimized = performance.now();
  console.log(`Optimized (Incremental Index): ${(endOptimized - startOptimized).toFixed(2)}ms`);

  console.log(`Improvement: ${((1 - (endOptimized - startOptimized) / (endOriginal - startOriginal)) * 100).toFixed(2)}%`);
};

runBenchmark();
