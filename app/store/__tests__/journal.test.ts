import { act, renderHook } from '@testing-library/react-hooks';

import { generateEntries } from '@app/lib/populate-journal';
import AsyncStorage from '@app/modules/storage';
import { FoodLogEntry } from '@app/types';

import { useFoodLogStore } from '../journal';

jest.mock('@react-native-async-storage/async-storage');
jest.mock('@app/modules/storage');

const mockData = {
  Monday: generateEntries(3),
  Tuesday: generateEntries(3),
  Wednesday: generateEntries(3),
  Thursday: generateEntries(3),
  Friday: generateEntries(3),
  Saturday: generateEntries(3),
  Sunday: generateEntries(3),
};

const mockEmptyData = {
  Monday: [],
  Tuesday: [],
  Wednesday: [],
  Thursday: [],
  Friday: [],
  Saturday: [],
  Sunday: [],
};

const entry: FoodLogEntry = {
  id: '123abc',
  name: 'Burger',
  calories: 500,
  protein: 35,
  carbohydrates: 40,
  fat: 5,
  timestamp: Date.now(),
};

xdescribe('useJournal', () => {
  it('Should return default journal data', () => {
    const { result } = renderHook(() => useFoodLogStore());

    expect(result.current.foodLogData).toEqual(expect.objectContaining([]));
  });

  it('Should update the journal and save it to storage', async () => {
    const storageSpy = jest.spyOn(AsyncStorage, 'setItem');

    const { result } = renderHook(() => useFoodLogStore());

    await act(async () => {
      result.current.updateFoodLog(mockData);
    });

    expect(result.current.foodLogData).toEqual(mockData);

    expect(storageSpy).toHaveBeenCalledWith('foodLogData', mockData);
  });

  it('Should allow the journal and storage to be cleared', async () => {
    const storageSpy = jest.spyOn(AsyncStorage, 'setItem');

    const { result } = renderHook(() => useFoodLogStore());

    await act(async () => {
      result.current.clearFoodLog();
    });

    expect(result.current.foodLogData).toEqual(mockEmptyData);

    expect(storageSpy).toHaveBeenCalledWith('foodLogData', mockEmptyData);
  });

  it('Should allow the day to be cleared', async () => {
    const { result } = renderHook(() => useFoodLogStore());

    // Populate the entries
    await act(async () => {
      result.current.updateFoodLog(mockData);
    });

    await act(async () => {
      result.current.clearDay('Monday');
    });

    expect(result.current.foodLogData.Monday).toEqual([]);
  });

  it('Should allow copying the previous day to the current day', async () => {
    const { result } = renderHook(() => useFoodLogStore());

    // Populate the entries
    await act(async () => {
      result.current.updateFoodLog(mockData);
    });

    // Clear Wednesday
    await act(async () => {
      result.current.clearDay('Wednesday');
    });

    // Wednesday should now be empty
    expect(result.current.foodLogData.Wednesday).toEqual([]);

    // Copy the previous day
    await act(async () => {
      result.current.copyPreviousDay('Wednesday');
    });

    // Wednesday should be the same as Tuesday
    expect(result.current.foodLogData.Wednesday).toEqual(result.current.foodLogData.Tuesday);
  });

  it('Should copy entries from Sunday if current day is Monday', async () => {
    const { result } = renderHook(() => useFoodLogStore());

    // Populate the entries
    await act(async () => {
      result.current.updateFoodLog(mockData);
    });

    // Clear Monday
    await act(async () => {
      result.current.clearDay('Monday');
    });

    // Monday should now be empty
    expect(result.current.foodLogData.Monday).toEqual([]);

    // Copy the previous day
    await act(async () => {
      result.current.copyPreviousDay('Monday');
    });

    // Monday should be the same as Sunday
    expect(result.current.foodLogData.Monday).toEqual(result.current.foodLogData.Sunday);
  });

  it('Should allow an entry to be saved', async () => {
    const expected = { ...mockEmptyData, Wednesday: [entry] };

    const storageSpy = jest.spyOn(AsyncStorage, 'setItem');

    const { result } = renderHook(() => useFoodLogStore());

    // Save the item to Wednesday
    await act(async () => {
      result.current.saveItem(entry, 'Wednesday');
    });

    expect(result.current.foodLogData.Wednesday).toContain(entry);

    // Should have updated storage
    expect(storageSpy).toHaveBeenCalledWith('foodLogData', expect.objectContaining(expected));
  });

  it('Should allow an entry to be removed', async () => {
    const idToRemove = entry.id;

    const storageSpy = jest.spyOn(AsyncStorage, 'setItem');

    const { result } = renderHook(() => useFoodLogStore());

    // Remove the item from Wednesday
    await act(async () => {
      result.current.removeItem(idToRemove, 'Wednesday');
    });

    expect(result.current.foodLogData.Wednesday).not.toContain(entry);

    // Should have updated storage
    expect(storageSpy).toHaveBeenCalledWith('foodLogData', expect.not.objectContaining(entry));
  });

  it('Should allow an entry to be updated', async () => {
    const updatedEntry = { ...entry, calories: 1000 };

    const expected = { ...mockEmptyData, Wednesday: [updatedEntry] };

    const storageSpy = jest.spyOn(AsyncStorage, 'setItem');

    const { result } = renderHook(() => useFoodLogStore());

    // Save the updated item to Wednesday
    await act(async () => {
      result.current.updateItem(updatedEntry, 'Wednesday');
    });

    expect(result.current.foodLogData.Wednesday).toContain(updatedEntry);

    // Should have updated storage
    expect(storageSpy).toHaveBeenCalledWith('foodLogData', expect.objectContaining(expected));
  });

  it('Should allow a day to be filled in testing', async () => {
    const { result } = renderHook(() => useFoodLogStore());

    const entries = generateEntries(3);
    const expected = { ...mockEmptyData, Wednesday: entries };

    await act(async () => {
      result.current.fillDay(entries, 'Wednesday');
    });

    expect(result.current.foodLogData).toEqual(expected);
  });
});
