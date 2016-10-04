import * as fs from 'fs';
import postcss from 'postcss';
import test from 'ava';

import wrapLines from './';

function run(t, input, output, opts = { }) {
    return postcss([ wrapLines(opts) ]).process(input)
        .then( result => {
            t.deepEqual(result.css, output);
            t.deepEqual(result.warnings().length, 0);
        });
}

test('Basic functionality', t => {
    let input = fs.readFileSync('./tests/basic/input.css', 'utf8');
    let output = fs.readFileSync('./tests/basic/output.css', 'utf8');

    return run(t, input, output, { maxWidth: 80 });
});
