import { getCurrentCalories, getCurrentProtein } from '../macros';

const entries = [
  {
    id: 'JGjZ5Bwgy',
    name: 'Oyster Kilpatrick',
    calories: 253,
    timestamp: Date.now().toString(),
    protein: 28,
  },
  { id: 'TMQF9dJny7', name: 'Fruit salad', calories: 375, timestamp: Date.now().toString(), protein: 9 },
  { id: 'IKYZp3rw1J', name: 'Sandwich', calories: 431, timestamp: Date.now().toString(), protein: 30 },
  { id: 'KkSxpMp-gD', name: 'Parmi', calories: 219, timestamp: Date.now().toString(), protein: 15 },
  { id: 'VBpzi4DT0h', name: 'Tuna', calories: 290, timestamp: Date.now().toString(), protein: 10 },
];

describe('getCurrentCalories', () => {
  it('Should return the total calories for the received entries', () => {
    const expectedTotal = entries.reduce((acc, curr) => acc + curr.calories, 0);
    const total = getCurrentCalories(entries);

    expect(total).toEqual(expectedTotal);
  });

  it('Should return 0 if entries is empty', () => {
    const total = getCurrentCalories();

    expect(total).toEqual(0);
  });
});

describe('getCurrentProtein', () => {
  it('Should return the total protein for the received entries', () => {
    const expectedTotal = entries.reduce((acc, curr) => acc + curr.protein, 0);
    const total = getCurrentProtein(entries);

    expect(total).toEqual(expectedTotal);
  });

  it('Should return 0 if entries is empty', () => {
    const total = getCurrentProtein();

    expect(total).toEqual(0);
  });
});
