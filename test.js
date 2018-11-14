import test from 'ava';
import * as fs from 'fs';
import postcss from 'postcss';

import wrapLines from './src';

const run = (t, input, output, opts = {}) =>
  postcss([wrapLines(opts)])
    .process(input)
    .then(result => {
      t.deepEqual(result.css, output);
      t.deepEqual(result.warnings().length, 0);
    });

const files = fs.readdirSync('./tests');

files.forEach(file => {
  test(file, t => {
    const input = fs.readFileSync(`./tests/${file}/input.css`, 'utf8');
    const output = fs.readFileSync(`./tests/${file}/output.css`, 'utf8');

    return run(t, input, output, { maxWidth: 80 });
  });
});
