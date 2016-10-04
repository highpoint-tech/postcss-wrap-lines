const lastLineLength = require('./lastLineLength');
const wrapLine = require('./wrapLine');

function getNodeLength(node) {
    let nodeLength = node.toString().length;

    let nextNode = node.next();
    if (node.parent.type === 'atrule' &&
        (!nextNode || nextNode.parent !== node.parent)
    ) {
        nodeLength += '}'.length;
    }

    return nodeLength;
}

function getSelectorLength(node) {
    let lineLength = node.selector.length +
        node.raws.between.length +
        '{'.length;

    let nextNode = node.next();
    if (node.parent.type === 'atrule' &&
        (!nextNode || nextNode.parent !== node.parent)
    ) {
        lineLength += '}'.length;
    }

    return lineLength;
}

function getUpdatedSelectorLength(node) {
    let lineLength = lastLineLength(node.selector) +
        node.raws.between.length +
        '{'.length;

    let nextNode = node.next();
    if (node.parent.type === 'atrule' &&
        nextNode &&
        nextNode.parent !== node.parent
    ) {
        lineLength += '}'.length;
    }

    return lineLength;
}

function processRule(node, opts, currentWidth) {
    let nodeLength = getNodeLength(node);

    if (currentWidth + nodeLength < opts.maxWidth) {
        return {
            currentWidth: currentWidth + nodeLength,
            parentRule: node,
            widthType: 'node-fits'
        };
    }

    let selectorLength = getSelectorLength(node);

    if (currentWidth + selectorLength <= opts.maxWidth) {
        return {
            currentWidth: currentWidth + selectorLength,
            widthType: 'selector-fits'
        };
    }

    let delimiterFound = node.selector
        .substring(0, opts.maxWidth - currentWidth)
        .match(/(,| )/) !== null;

    if (delimiterFound) {
        let padding = new Array(
            currentWidth +
            node.raws.between.length +
            '{'.length +
            1
        ).join('~');

        node.selector = wrapLine(padding + node.selector, {
            delimiters: [','],
            maxWidth: opts.maxWidth
        }).replace(/~/g, '');

        currentWidth = getUpdatedSelectorLength(node);

        return {
            currentWidth: currentWidth,
            widthType: 'multi-line-selector'
        };
    }

    node.raws.before = `\n`;

    if (nodeLength <= opts.maxWidth) {
        return {
            currentWidth: nodeLength,
            parentRule: node,
            widthType: 'node-fits-new-line'
        };
    }

    if (selectorLength <= opts.maxWidth) {
        return {
            currentWidth: selectorLength,
            widthType: 'selector-fits-new-line'
        };
    }

    let padding = new Array(
        currentWidth +
        node.raws.between.length +
        '{'.length +
        1
    ).join('~');

    node.selector = wrapLine(padding + node.selector, {
        delimiters: [','],
        maxWidth: opts.maxWidth
    }).replace(/~/g, '');

    currentWidth = getUpdatedSelectorLength(node);

    return {
        currentWidth: currentWidth,
        widthType: 'multi-line'
    };
}

module.exports = processRule;
