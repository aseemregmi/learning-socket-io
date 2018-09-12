const expect = require('expect');
const { generateMessage } = require('./message');

describe('GenerateMessage', () => {
  it('should generate the correct message object', () => {
    const messageObj = generateMessage('aseemregmi', 'Hi How Are You ?');

    expect(messageObj.from).toBe('aseemregmi');
    expect(messageObj.text).toBe('Hi How Are You ?');
    expect(typeof messageObj.createdAt).toBe('number');
  });
});
