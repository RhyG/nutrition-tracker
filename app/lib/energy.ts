/**
 * Converts calories to kilojoules
 * @param cal kilojoule value to convert to kilojoules
 * @returns {number} value converted to kilojoules
 */
export const caloriesToKj = (cal: number): number => Math.round(cal * 4.184);

/**
 * Converts kilojoules to calories
 * @param kj kilojoule value to convert to calories
 * @returns {number} value converted to calories
 */
export const kjToCalories = (kj: number): number => Math.round(kj * 0.239006);
