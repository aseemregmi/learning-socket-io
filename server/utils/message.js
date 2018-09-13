const generateMessage = (from, text) => {
  return {
    from,
    text,
    createdAt: new Date().getTime()
  };
};

const generateLocationMessage = (from, lattitude, longitude) => {
  return {
    from,
    url: `https://www.google.com/maps?q=${lattitude},${longitude}`,
    createdAt: new Date().getTime()
  };
};

module.exports = {
  generateMessage,
  generateLocationMessage
};
