import { caloriesToKj, kjToCalories } from '../energy';

describe('calToKj', () => {
  const cases = [
    [500, 2092],
    [3456, 14460],
    [12, 50],
    [9834, 41145],
  ];
  it.each(cases)('Should receive %p calories and return %p kilojoules', (calories, expected) => {
    const result = caloriesToKj(calories);
    expect(result).toEqual(expected);
  });
});

describe('kjToCal', () => {
  const cases = [
    [500, 120],
    [3456, 826],
    [12, 3],
    [9834, 2350],
  ];
  it.each(cases)('Should receive %p kilojoules and return %p calories', (calories, expected) => {
    const result = kjToCalories(calories);
    expect(result).toEqual(expected);
  });
});
