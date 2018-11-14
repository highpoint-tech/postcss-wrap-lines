const white = new RegExp(/\s/);
const quotes = ["'", '"'];

const getQuotes = (char, inQuotes) => {
  if (!quotes.includes(char)) return inQuotes;

  if (inQuotes.includes(char)) {
    return inQuotes.filter(c => c !== char);
  }

  return [...inQuotes, char];
};

const canBreakOnChar = (char, delimiters) =>
  delimiters.includes(char) || white.test(char);

const wrapLine = (lineIn, opts = {}) => {
  opts = Object.assign(
    {},
    {
      delimiters: [],
      lineDelimeter: '',
      maxWidth: 32768
    },
    opts
  );

  if (lineIn.length < opts.maxWidth) {
    return lineIn;
  }

  let line = lineIn;
  let done = false;
  let res = '';

  do {
    let found = false;

    // Determine which quotes are outside the search area because these will be
    // our starting quotes. This is done by looking for mismatched quotes
    // (uneven count) in the search area.
    const searchArea = line.slice(0, opts.maxWidth);
    let inQuotes = quotes.reduce((acc, quote) => {
      const count = searchArea.split(quote).length - 1;
      if (count % 2 === 0) return acc;
      return [...acc, quote];
    }, []);

    // Inserts new line at first opportunity
    for (let i = opts.maxWidth - 1; i >= 0; i--) {
      const char = line.charAt(i);
      inQuotes = getQuotes(char, inQuotes);

      if (inQuotes.length === 0 && canBreakOnChar(char, opts.delimiters)) {
        const newLine = line.slice(0, i + 1).trim();

        res += [newLine, `\n`].join('');
        line = line.slice(i + 1);
        found = true;
        break;
      }
    }

    // No wrap opportunity found, let's see what we can do about that
    if (!found) {
      const hasPadding = line.includes('~');

      // Wrap line, remove padding, and try again
      if (hasPadding) {
        res += `\n`;
        line = line.replace(/~/g, '');
      }

      // The word is too long to wrap, so force a new line at maxWidth position
      if (!hasPadding) {
        const sliceSize = opts.maxWidth - opts.lineDelimeter.length;

        res += [line.slice(0, sliceSize), `\n`].join(opts.lineDelimeter);
        line = line.slice(sliceSize);
      }
    }

    if (line.length < opts.maxWidth) {
      res += line;
      done = true;
    }
  } while (!done);

  return res;
};

module.exports = wrapLine;
