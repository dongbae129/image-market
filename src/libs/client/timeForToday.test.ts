import { timeForToday } from '@libs/client/timeForToday';

describe('timeForToday', () => {
  test('should return "방금전" for less than 1 minute', () => {
    const now = new Date(2024, 7, 11, 8, 30, 0);
    const timeValue = new Date(2024, 7, 11, 8, 29, 30);

    expect(timeForToday(timeValue, now)).toBe('방금전');
  });

  test('should return minutes for less than 1 hour', () => {
    const now = new Date(2024, 7, 11, 8, 30, 0);
    const timeValue = new Date(2024, 7, 11, 8, 0, 0);

    expect(timeForToday(timeValue, now)).toBe('30분전');
  });

  test('should return hours for less than 1 day', () => {
    const now = new Date(2024, 7, 11, 8, 30, 0);
    const timeValue = new Date(2024, 7, 11, 6, 0, 0);

    expect(timeForToday(timeValue, now)).toBe('2시간전');
  });

  test('should return days for less than 1 year', () => {
    const now = new Date(2024, 7, 11, 8, 30, 0);
    const timeValue = new Date(2024, 7, 9, 8, 0, 0);

    expect(timeForToday(timeValue, now)).toBe('2일전');
  });

  test('should return years for more than 1 year', () => {
    const now = new Date(2024, 7, 11, 8, 30, 0);
    const timeValue = new Date(2023, 7, 11, 8, 30, 0);

    expect(timeForToday(timeValue, now)).toBe('1년전');
  });
});
