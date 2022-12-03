export const calculateRemaining = (max: number, current: number) => max - current;

/**
 * Calculate the size of an element as a percentage
 * @param max the maximum size
 * @param current current amount
 * @returns {number} size as a percentage
 */
export const calculateSizeAsPercentage = (max: number, current: number): number => (current > max ? 100 : (current / max) * 100);

/**
 * Calculates basal metabolic rate
 * @param weight {number}
 * @param height {number}
 * @param age {number}
 * @param genderVariable {number}
 * @returns {number} BMR
 */
export const calculateBMR = (weight: number, height: number, age: number, genderVariable: number): number => {
  const BMR = 10 * Number(weight) + 6.25 * Number(height) - 5 * Number(age) + genderVariable;

  return BMR;
};
