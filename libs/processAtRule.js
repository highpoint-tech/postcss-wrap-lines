function getLineLength(node) {
    let lineLength = '@'.length +
        node.name.length +
        node.raws.afterName.length +
        node.raws.between.length +
        node.params.length +
        '{'.length;

    return lineLength;
}

module.exports = function processAtRule(node, opts, currentWidth) {
    let nodeLength = node.toString().length;

    if (currentWidth + nodeLength < opts.maxWidth) {
        return {
            currentWidth: currentWidth + nodeLength,
            parentAtRule: node,
            widthType: 'node-fits'
        };
    }

    let lineLength = getLineLength(node);

    if (lineLength + currentWidth <= opts.maxWidth) {
        return {
            currentWidth: currentWidth + lineLength,
            widthType: 'definition-fits'
        };
    }

    node.raws.before = `\n`;

    if (lineLength <= opts.maxWidth) {
        return {
            currentWidth: lineLength,
            widthType: 'fits-new-line'
        };
    }

    return {
        currentWidth,
        widthType: 'other'
    };
};
