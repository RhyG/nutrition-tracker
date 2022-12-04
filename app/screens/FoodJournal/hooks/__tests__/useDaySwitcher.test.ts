import { act, renderHook } from '@testing-library/react-hooks';

import useDaySwitcher, { Directions } from '../useDaySwitcher';

jest.mock('date-fns', () => ({
  format: jest.fn(() => 'Wednesday'),
}));

describe('useDaySwitcher', () => {
  it('Should return today as the current day when initialised', () => {
    const { result } = renderHook(() => useDaySwitcher());

    expect(result.current.currentDay).toBe('Wednesday');
  });

  it('Should allow switching the day left', () => {
    const { result } = renderHook(() => useDaySwitcher());

    act(() => {
      result.current.handleDayChange(Directions.LEFT);
    });

    expect(result.current.currentDay).toBe('Tuesday');
  });

  it('Should allow switching the day right', () => {
    const { result } = renderHook(() => useDaySwitcher());

    act(() => {
      result.current.handleDayChange(Directions.RIGHT);
    });

    expect(result.current.currentDay).toBe('Thursday');
  });

  it('Should allow switching the day to the start of the week', () => {
    const { result } = renderHook(() => useDaySwitcher());

    // Spam the move day left
    act(() => {
      result.current.handleDayChange(Directions.LEFT);
    });

    act(() => {
      result.current.handleDayChange(Directions.LEFT);
    });

    act(() => {
      result.current.handleDayChange(Directions.LEFT);
    });

    act(() => {
      result.current.handleDayChange(Directions.LEFT);
    });

    expect(result.current.currentDay).toBe('Monday');
  });

  it('Should allow switching the day to the end of the week', () => {
    const { result } = renderHook(() => useDaySwitcher());

    // Spam the move day right
    act(() => {
      result.current.handleDayChange(Directions.RIGHT);
    });

    act(() => {
      result.current.handleDayChange(Directions.RIGHT);
    });

    act(() => {
      result.current.handleDayChange(Directions.RIGHT);
    });

    act(() => {
      result.current.handleDayChange(Directions.RIGHT);
    });
    act(() => {
      result.current.handleDayChange(Directions.RIGHT);
    });

    act(() => {
      result.current.handleDayChange(Directions.RIGHT);
    });

    act(() => {
      result.current.handleDayChange(Directions.RIGHT);
    });

    expect(result.current.currentDay).toBe('Sunday');
  });
});
