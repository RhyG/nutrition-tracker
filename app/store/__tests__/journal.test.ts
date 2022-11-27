import { act, renderHook } from '@testing-library/react-hooks';

import AsyncStorage from '@app/modules/AsyncStorage';
import { JournalEntry } from '@app/types';
import { generateEntries } from '@app/utils/generateEntries';

import { useJournal } from '../journal';

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

const entry: JournalEntry = {
  id: '123abc',
  name: 'Burger',
  calories: 500,
  protein: 35,
};

describe('useJournal', () => {
  it('Should return default journal data', () => {
    const { result } = renderHook(() => useJournal());

    expect(result.current.journalData).toEqual(expect.objectContaining([]));
  });

  it('Should update the journal and save it to storage', async () => {
    const storageSpy = jest.spyOn(AsyncStorage, 'setItem');

    const { result } = renderHook(() => useJournal());

    await act(async () => {
      result.current.updateJournal(mockData);
    });

    expect(result.current.journalData).toEqual(mockData);

    expect(storageSpy).toHaveBeenCalledWith('journalData', mockData);
  });

  it('Should allow the journal and storage to be cleared', async () => {
    const storageSpy = jest.spyOn(AsyncStorage, 'setItem');

    const { result } = renderHook(() => useJournal());

    await act(async () => {
      result.current.clearJournal();
    });

    expect(result.current.journalData).toEqual(mockEmptyData);

    expect(storageSpy).toHaveBeenCalledWith('journalData', mockEmptyData);
  });

  it('Should allow the day to be cleared', async () => {
    const { result } = renderHook(() => useJournal());

    // Populate the entries
    await act(async () => {
      result.current.updateJournal(mockData);
    });

    await act(async () => {
      result.current.clearDay('Monday');
    });

    expect(result.current.journalData.Monday).toEqual([]);
  });

  it('Should allow copying the previous day to the current day', async () => {
    const { result } = renderHook(() => useJournal());

    // Populate the entries
    await act(async () => {
      result.current.updateJournal(mockData);
    });

    // Clear Wednesday
    await act(async () => {
      result.current.clearDay('Wednesday');
    });

    // Wednesday should now be empty
    expect(result.current.journalData.Wednesday).toEqual([]);

    // Copy the previous day
    await act(async () => {
      result.current.copyPreviousDay('Wednesday');
    });

    // Wednesday should be the same as Tuesday
    expect(result.current.journalData.Wednesday).toEqual(
      result.current.journalData.Tuesday,
    );
  });

  it('Should copy entries from Sunday if current day is Monday', async () => {
    const { result } = renderHook(() => useJournal());

    // Populate the entries
    await act(async () => {
      result.current.updateJournal(mockData);
    });

    // Clear Monday
    await act(async () => {
      result.current.clearDay('Monday');
    });

    // Monday should now be empty
    expect(result.current.journalData.Monday).toEqual([]);

    // Copy the previous day
    await act(async () => {
      result.current.copyPreviousDay('Monday');
    });

    // Monday should be the same as Sunday
    expect(result.current.journalData.Monday).toEqual(
      result.current.journalData.Sunday,
    );
  });

  it('Should allow an entry to be saved', async () => {
    const expected = { ...mockEmptyData, Wednesday: [entry] };

    const storageSpy = jest.spyOn(AsyncStorage, 'setItem');

    const { result } = renderHook(() => useJournal());

    // Save the item to Wednesday
    await act(async () => {
      result.current.saveItem(entry, 'Wednesday');
    });

    expect(result.current.journalData.Wednesday).toContain(entry);

    // Should have updated storage
    expect(storageSpy).toHaveBeenCalledWith(
      'journalData',
      expect.objectContaining(expected),
    );
  });

  it('Should allow an entry to be removed', async () => {
    const idToRemove = entry.id;

    const storageSpy = jest.spyOn(AsyncStorage, 'setItem');

    const { result } = renderHook(() => useJournal());

    // Remove the item from Wednesday
    await act(async () => {
      result.current.removeItem(idToRemove, 'Wednesday');
    });

    expect(result.current.journalData.Wednesday).not.toContain(entry);

    // Should have updated storage
    expect(storageSpy).toHaveBeenCalledWith(
      'journalData',
      expect.not.objectContaining(entry),
    );
  });

  it('Should allow an entry to be updated', async () => {
    const updatedEntry = { ...entry, calories: 1000 };

    const expected = { ...mockEmptyData, Wednesday: [updatedEntry] };

    const storageSpy = jest.spyOn(AsyncStorage, 'setItem');

    const { result } = renderHook(() => useJournal());

    // Save the updated item to Wednesday
    await act(async () => {
      result.current.updateItem(updatedEntry, 'Wednesday');
    });

    expect(result.current.journalData.Wednesday).toContain(updatedEntry);

    // Should have updated storage
    expect(storageSpy).toHaveBeenCalledWith(
      'journalData',
      expect.objectContaining(expected),
    );
  });

  it('Should allow a day to be filled in testing', async () => {
    const { result } = renderHook(() => useJournal());

    const entries = generateEntries(3);
    const expected = { ...mockEmptyData, Wednesday: entries };

    await act(async () => {
      result.current.fillDay(entries, 'Wednesday');
    });

    expect(result.current.journalData).toEqual(expected);
  });
});
