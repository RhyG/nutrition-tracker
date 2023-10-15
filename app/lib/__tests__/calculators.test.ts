import { FEMALE_TDEE_VARIABLE, MALE_TDEE_VARIABLE } from '../../config/constants';
import { calculateBMR, calculateRemaining, calculateSizeAsPercentage } from '../calculators';

describe('calculateRemaining', () => {
  const cases = [
    [20, 10, 10],
    [50, 25, 25],
    [1000, 250, 750],
    [5000, 1267, 3733],
  ];
  it.each(cases)('Should take %p and %p and return %p', (max, current, expected) => {
    const result = calculateRemaining(max, current);
    expect(result).toEqual(expected);
  });
});

describe('calculateSizeAsPercentage', () => {
  const cases = [
    [3000, 500, 16.666666666666664],
    [3000, 2999, 99.96666666666667],
    [5000, 1, 0.02],
    [3000, 1500, 50],
  ];
  it.each(cases)('Should return %p as a percentage of %p', (max, current, expected) => {
    const result = calculateSizeAsPercentage(max, current);
    expect(result).toEqual(expected);
  });

  it('Should return 100 if the current is more than the max', () => {
    const result = calculateSizeAsPercentage(100, 1000000000);
    expect(result).toEqual(100);
  });
});

describe('calculateBMR', () => {
  const cases = [
    [40, 150, 22, FEMALE_TDEE_VARIABLE, 1066.5],
    [92, 188, 36, MALE_TDEE_VARIABLE, 1920],
    [57, 167, 48, FEMALE_TDEE_VARIABLE, 1212.75],
    [71, 173, 27, MALE_TDEE_VARIABLE, 1661.25],
  ];
  it.each(cases)(
    'A %pkg, %pcm tall, %p year old with a gender variable of %p should have a BMR of %p',
    (weight, height, age, genderVariable, expectedResult) => {
      const result = calculateBMR(weight, height, age, genderVariable);
      expect(result).toEqual(expectedResult);
    },
  );
});
