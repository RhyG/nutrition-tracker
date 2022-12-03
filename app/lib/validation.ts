/**
 * Check if a value is a number
 * @param value value to check for numberiness
 * @returns boolean
 */
export const isInputNumber = (value: string) => value === '' || /^[0-9\b]+$/.test(value);
