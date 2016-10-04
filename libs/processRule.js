'use strict';

const lastLineLength = require('./lastLineLength');
const wrapLine = require('./wrapLine');

function getTrailingChars(node) {
    let trailingChars = 0;

    let nextNode = node.next();
    if (node.parent.type === 'atrule' &&
        (!nextNode || nextNode.parent !== node.parent)
    ) {
        trailingChars += '}'.length;
    }

    return trailingChars;
}

function getNodeLength(node) {
    return node.toString().length;
}

function getSelectorLength(node) {
    let lineLength = node.selector.length +
        node.raws.between.length +
        '{'.length;

    return lineLength + getTrailingChars(node);
}

function getUpdatedSelectorLength(node) {
    let lineLength = lastLineLength(node.selector) +
        node.raws.between.length +
        '{'.length;

    return lineLength + getTrailingChars(node);
}

function makeSelectorMultiLine(node, opts, currentWidth) {
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

    return getUpdatedSelectorLength(node);
}

function processRule(node, opts, currentWidth) {
    // Node fits on the current line
    let nodeLength = getNodeLength(node);

    if (currentWidth + nodeLength < opts.maxWidth) {
        return {
            currentWidth: currentWidth + nodeLength,
            parentRule: node, // Skip this rule's declarations
            widthType: 'node-fits'
        };
    }

    // Selector fits on the current line
    let selectorLength = getSelectorLength(node);

    if (currentWidth + selectorLength <= opts.maxWidth) {
        return {
            currentWidth: currentWidth + selectorLength,
            widthType: 'selector-fits'
        };
    }

    // Selector can be broken down into smaller
    // chunks, spread across multiple lines
    let delimiterFound = node.selector
        .substring(0, opts.maxWidth - currentWidth)
        .match(/(,| )/) !== null;

    if (delimiterFound) {
        return {
            currentWidth: makeSelectorMultiLine(node, opts, currentWidth),
            widthType: 'multi-line-delimited'
        };
    }

    node.raws.before = `\n`;

    // Node fits on a new line
    if (nodeLength <= opts.maxWidth) {
        return {
            currentWidth: nodeLength,
            parentRule: node, // Skip this rule's declarations
            widthType: 'node-fits-new-line'
        };
    }

    // Selector fits on a new line
    if (selectorLength <= opts.maxWidth) {
        return {
            currentWidth: selectorLength,
            widthType: 'selector-fits-new-line'
        };
    }

    // Selector needs to be broken down into smaller
    // chunks, spread across multiple lines
    return {
        currentWidth: makeSelectorMultiLine(node, opts, currentWidth),
        widthType: 'multi-line'
    };
}

module.exports = processRule;
