const lastLineLength = require('./lastLineLength');
const wrapLine = require('./wrapLine');

function getNodeLength(node) {
    let nodeLength = node.toString().length;

    if (!node.next()) {
        if (node.parent.raws.semicolon) {
            nodeLength += ';'.length;
        }

        nodeLength += '}'.length;

        if (node.parent.parent.type === 'atrule') {
            nodeLength += '}'.length;
        }
    } else {
        nodeLength += ';'.length;
    }

    return nodeLength;
}

function getUpdatedNodeLength(node) {
    let nodeLength = lastLineLength(node.value);

    if (!node.next()) {
        if (node.parent.raws.semicolon) {
            nodeLength += ';'.length;
        }

        nodeLength += '}'.length;

        if (node.parent.parent.type === 'atrule') {
            nodeLength += '}'.length;
        }
    } else {
        nodeLength += ';'.length;
    }

    return nodeLength;
}

function processDecl(node, opts, currentWidth) {
    let nodeLength = getNodeLength(node);

    if (currentWidth + nodeLength <= opts.maxWidth) {
        return {
            currentWidth: currentWidth + nodeLength,
            widthType: 'node-fits'
        };
    }

    if (nodeLength <= opts.maxWidth) {
        node.raws.before = `\n`;
        return {
            currentWidth: nodeLength,
            widthType: 'node-fits-new-line'
        };
    }

    let padding = new Array(
        currentWidth +
        node.prop.length +
        node.raws.between.length +
        1
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
