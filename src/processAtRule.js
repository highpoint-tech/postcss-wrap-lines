const getLineLength = node =>
  '@'.length +
  node.name.length +
  node.raws.afterName.length +
  node.raws.between.length +
  node.params.length +
  '{'.length;

const processAtRule = (node, opts, currentWidth) => {
  // Node fits on the current line
  const nodeLength = node.toString().length;

  if (currentWidth + nodeLength < opts.maxWidth) {
    return {
      currentWidth: currentWidth + nodeLength,
      parentAtRule: node, // Skip this at-rule's rules & declarations
      widthType: 'node-fits'
    };
  }

  // Definition fits on the current line
  const lineLength = getLineLength(node);

  if (lineLength + currentWidth <= opts.maxWidth) {
    return {
      currentWidth: currentWidth + lineLength,
      widthType: 'definition-fits'
    };
  }

  // Definition fits on a new line
  node.raws.before = `\n`;

  if (lineLength <= opts.maxWidth) {
    return {
      currentWidth: lineLength,
      widthType: 'fits-new-line'
    };
  }

  // Uh oh
  return {
    currentWidth,
    widthType: 'other'
  };
};

module.exports = processAtRule;
