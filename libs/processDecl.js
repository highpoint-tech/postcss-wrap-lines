const lastLineLength = require('./lastLineLength');
const wrapLine = require('./wrapLine');

function getTrailingChars(node) {
  let trailingChars = 0;

  if (!node.next()) {
    if (node.parent.raws.semicolon) {
      trailingChars += ';'.length;
    }

    trailingChars += '}'.length;

    if (node.parent.parent.type === 'atrule') {
      trailingChars += '}'.length;
    }
  } else {
    trailingChars += ';'.length;
  }

  return trailingChars;
}

function getNodeLength(node) {
  return node.toString().length + getTrailingChars(node);
}

function getUpdatedNodeLength(node) {
  return lastLineLength(node.value) + getTrailingChars(node);
}

function processDecl(node, opts, currentWidth) {
  // Node fits on the current line
  const nodeLength = getNodeLength(node);

  if (currentWidth + nodeLength <= opts.maxWidth) {
    return {
      currentWidth: currentWidth + nodeLength,
      widthType: 'node-fits'
    };
  }

  // Node fits on a new line
  if (nodeLength <= opts.maxWidth) {
    node.raws.before = `\n`;
    return {
      currentWidth: nodeLength,
      widthType: 'node-fits-new-line'
    };
  }

  // Node needs to be broken down into smaller
  // chunks, spread across multiple lines
  const padding = new Array(
    currentWidth + node.prop.length + node.raws.between.length + 1
  ).join('~');

  node.value = wrapLine(padding + node.value, {
    delimiters: [],
    lineDelimeter: '\\',
    maxWidth: opts.maxWidth
  }).replace(/~/g, '');

  return {
    currentWidth: getUpdatedNodeLength(node),
    widthType: 'multi-line'
  };
}

module.exports = processDecl;
