export function calculatePercentage(current: number, max: number): number {
  // The formula to calculate percentage is (current / max) * 100
  const percentage = (current / max) * 100;

  // Rounding to 2 decimal places for better readability
  return Math.round((percentage + Number.EPSILON) * 100) / 100;
}
