const expect = require('expect');

const { isRealString } = require('./validation');

describe('isRealString', () => {
  it('should return false for non string values', () => {
    expect(isRealString(123)).toBe(false);
  });

  it('should return false for only blank spaces', () => {
    expect(isRealString('   ')).toBe(false);
  });

  it('should return true for string values', () => {
    expect(isRealString('Aseem')).toBe(true);
  });
});
