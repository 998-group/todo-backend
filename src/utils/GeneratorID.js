const GeneratorID = () => {
  const timestamp = new Date().getTime();
  return `${timestamp}`;
};

module.exports = GeneratorID;
