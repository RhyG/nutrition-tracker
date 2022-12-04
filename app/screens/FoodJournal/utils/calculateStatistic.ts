import { calculateRemaining, calculateSizeAsPercentage } from '@app/lib/calculators';

export const calculateStatistic = (max: number, currentAmount: number) => {
  const remaining = calculateRemaining(max, currentAmount);
  const progress = calculateSizeAsPercentage(max, currentAmount);

  return { remaining, progress };
};
