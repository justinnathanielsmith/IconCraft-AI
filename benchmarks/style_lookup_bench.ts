import { IconStyle } from '../types';

// O(N) lookup (from prompt)
const inefficientLookup = (style: IconStyle) => {
  const keys = Object.keys(IconStyle) as Array<keyof typeof IconStyle>;
  const key = keys.find(k => IconStyle[k] === style);
  return key ? key.charAt(0) + key.slice(1).toLowerCase().replace('_', ' ') : 'Custom';
};

// O(1) lookup (from codebase)
const STYLE_DISPLAY_NAMES: Record<string, string> = Object.keys(IconStyle).reduce((acc, key) => {
  const styleValue = IconStyle[key as keyof typeof IconStyle];
  acc[styleValue] = key.charAt(0) + key.slice(1).toLowerCase().replace('_', ' ');
  return acc;
}, {} as Record<string, string>);

const efficientLookup = (style: IconStyle) => STYLE_DISPLAY_NAMES[style] || 'Custom';

// Additional Optimization: Hoist Object.keys
const ICON_STYLE_KEYS = Object.keys(IconStyle) as Array<keyof typeof IconStyle>;

const hoistedKeysLookup = (style: IconStyle) => {
  // Simulating iteration with hoisted keys
  const key = ICON_STYLE_KEYS.find(k => IconStyle[k] === style);
  return key ? key.charAt(0) + key.slice(1).toLowerCase().replace('_', ' ') : 'Custom';
};


const runBenchmark = () => {
  const iterations = 1000000;
  const testStyle = IconStyle.MINIMALIST;

  console.log(`Running benchmark for ${iterations} iterations...`);

  const startInefficient = performance.now();
  for (let i = 0; i < iterations; i++) {
    inefficientLookup(testStyle);
  }
  const endInefficient = performance.now();
  console.log(`Inefficient lookup: ${(endInefficient - startInefficient).toFixed(2)}ms`);

  const startEfficient = performance.now();
  for (let i = 0; i < iterations; i++) {
    efficientLookup(testStyle);
  }
  const endEfficient = performance.now();
  console.log(`Efficient lookup: ${(endEfficient - startEfficient).toFixed(2)}ms`);

  const startHoistedKeys = performance.now();
  for (let i = 0; i < iterations; i++) {
      hoistedKeysLookup(testStyle);
  }
  const endHoistedKeys = performance.now();
  console.log(`Hoisted Keys lookup (still O(N)): ${(endHoistedKeys - startHoistedKeys).toFixed(2)}ms`);

  // Also verify Object.keys overhead vs hoisted keys
  const startKeysEveryTime = performance.now();
  for (let i = 0; i < iterations; i++) {
      const keys = Object.keys(IconStyle); // Create array every time
  }
  const endKeysEveryTime = performance.now();
  console.log(`Object.keys() creation overhead: ${(endKeysEveryTime - startKeysEveryTime).toFixed(2)}ms`);

  const startCachedKeys = performance.now();
  for (let i = 0; i < iterations; i++) {
      const keys = ICON_STYLE_KEYS; // Use cached array
  }
  const endCachedKeys = performance.now();
  console.log(`Cached keys access overhead: ${(endCachedKeys - startCachedKeys).toFixed(2)}ms`);

};

runBenchmark();
