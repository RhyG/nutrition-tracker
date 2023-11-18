import { act, renderHook } from '@testing-library/react-hooks';

import AsyncStorage from '@app/modules/storage';

import { useGoalsStore } from '../goals';

jest.mock('@react-native-async-storage/async-storage', () => {
  return {
    getItem: async (...args: unknown[]) => args,
    setItem: async (...args: unknown[]) => args,
    removeItem: async (...args: unknown[]) => args,
  };
});

xdescribe('useGoals', () => {
  it('Fetches the current goals', () => {
    const { result } = renderHook(() => useGoalsStore());

    expect(result.current.calories).toEqual(2500);
    expect(result.current.protein).toEqual(150);
  });

  it('Should allow updating goals', async () => {
    const storageSpy = jest.spyOn(AsyncStorage, 'setItem');

    const { result } = renderHook(() => useGoalsStore());

    const updatedGoals = { calories: 5000, protein: 200, carbohydrates: 300, fat: 100 };

    await act(async () => {
      result.current.updateGoals(updatedGoals);
    });

    const updatedCalories = result.current.calories;
    const updatedProtein = result.current.protein;

    expect(updatedCalories).toEqual(5000);
    expect(updatedProtein).toEqual(200);

    // Updating goals should set them in storage
    expect(storageSpy).toHaveBeenCalledWith('macro-goals', '{"state":{"calories":5000,"protein":200,"carbohydrates":300,"fat":100},"version":0}');
  });
});
