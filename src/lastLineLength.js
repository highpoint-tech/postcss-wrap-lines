const lastLineLength = str => {
  const lines = str.split(`\n`);
  return lines[lines.length - 1].length;
};

module.exports = lastLineLength;
