
const runBenchmark = () => {
    // Simulate a 1024x1024 RGBA image
    const width = 1024;
    const height = 1024;
    const size = width * height * 4;
    // Using Int8Array to minimize allocation overhead and simulate ImageData.data
    // Note: ImageData.data is Uint8ClampedArray, but for indexing bench Uint8Array is fine.
    const data = new Uint8Array(size);

    // Fill with some dummy data to avoid optimization away?
    // Actually access is what matters.

    const iterations = 100; // Run the full image scan 100 times
    console.log(`Running benchmark on ${width}x${height} image for ${iterations} iterations...`);

    // 1. Current Implementation (Multiplication)
    const startMultiplication = performance.now();
    let sum1 = 0;
    for (let i = 0; i < iterations; i++) {
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const index = (y * width + x) * 4;
                // Access data to ensure loop isn't optimized away
                sum1 += data[index];
                sum1 += data[index + 1];
                sum1 += data[index + 2];
                sum1 += data[index + 3];
            }
        }
    }
    const endMultiplication = performance.now();
    const timeMultiplication = endMultiplication - startMultiplication;
    console.log(`Multiplication-based indexing: ${timeMultiplication.toFixed(2)}ms (Check: ${sum1})`);

    // 2. Optimized Implementation (Increment)
    const startIncrement = performance.now();
    let sum2 = 0;
    for (let i = 0; i < iterations; i++) {
        let index = 0;
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                // Access data
                sum2 += data[index];
                sum2 += data[index + 1];
                sum2 += data[index + 2];
                sum2 += data[index + 3];

                index += 4;
            }
        }
    }
    const endIncrement = performance.now();
    const timeIncrement = endIncrement - startIncrement;
    console.log(`Increment-based indexing: ${timeIncrement.toFixed(2)}ms (Check: ${sum2})`);

    const improvement = ((timeMultiplication - timeIncrement) / timeMultiplication) * 100;
    console.log(`Improvement: ${improvement.toFixed(2)}%`);
  };

  runBenchmark();
