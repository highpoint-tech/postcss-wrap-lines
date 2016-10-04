'use strict';

function testCharacter(char, delimiters) {
    const white = new RegExp(/^\s$/);

    return delimiters.indexOf(char) > -1 || white.test(char);
}

function wrapLine(lineIn, opts = {}) {
    opts = Object.assign({}, {
        delimiters: [],
        lineDelimeter: '',
        maxWidth: 32768
    }, opts);

    let line = lineIn;
    let done = false;
    let res = '';

    if (line.length < opts.maxWidth) {
        return line;
    }

    do {
        let found = false;

        // Inserts new line at first opportunity
        for (let i = opts.maxWidth - 1; i >= 0; i--) {
            if (testCharacter(line.charAt(i), opts.delimiters)) {
                const newLine = line.slice(0, i + 1).trim();

                res += [newLine, `\n`].join('');
                line = line.slice(i + 1);
                found = true;
                break;
            }
        }

        // Inserts new line at maxWidth position, the word is too long to wrap
        if (!found) {
            let sliceSize = opts.maxWidth - opts.lineDelimeter.length;

            res += [line.slice(0, sliceSize), `\n`].join(opts.lineDelimeter);
            line = line.slice(sliceSize);
        }

        if (line.length < opts.maxWidth) {
            res += line;
            done = true;
        }
    } while (!done);

    return res;
}

module.exports = wrapLine;
