import { isInputNumber } from '../validation';

describe('isInputNumber', () => {
  it('Should return true if the input is a number.', () => {
    const result = isInputNumber('500');
    expect(result).toBeTruthy();
  });

  it('Should return false if the input is not a number.', () => {
    const result = isInputNumber('Sssshhh I am a number');
    expect(result).toBeFalsy();
  });
});
