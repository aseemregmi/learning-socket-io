const expect = require('expect');
const { generateMessage, generateLocationMessage } = require('./message');
W;
describe('GenerateMessage', () => {
  it('should generate the correct message object', () => {
    const messageObj = generateMessage('aseemregmi', 'Hi How Are You ?');

    expect(messageObj.from).toBe('aseemregmi');
    expect(messageObj.text).toBe('Hi How Are You ?');
    expect(typeof messageObj.createdAt).toBe('number');
  });
});

describe('generateLocationMessage', () => {
  it('should generate correct location object', () => {
    const locationObj = generateLocationMessage('aseemregmi', 10, 20);

    expect(locationObj.from).toBe('aseemregmi');
    expect(locationObj.url).toBe('https://www.google.com/maps?q=10,20');
    expect(typeof locationObj.createdAt).toBe('number');
  });
});
