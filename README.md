# PostCSS Wrap Lines [![Build Status][ci-img]][ci] #

[PostCSS] plugin to wrap lines after a specified number of characters.

This functionality is useful if a tool in your chain has a limit on characters-per-line.

```css
.foo {
    html{font-family:sans-serif;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%}body{margin:0}article,aside,details,figcaption,figure,footer,header,hgroup,main,menu,nav,section,summary{display:block}audio,canvas,progress,video{display:inline-block;}
}
```

```css
.foo {
  html{font-family:sans-serif;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%}body{margin:0}
  article,aside,details,figcaption,figure,footer,header,hgroup,main,menu,nav,section,summary{
  display:block}audio,canvas,progress,video{display:inline-block;}
}
```

## Installation ##

`npm i postcss-wrap-lines --save-dev`

## Usage ##

```js
const postcss = require('postcss');
const postcssWrapLines = require('postcss-wrap-lines');

const options = {
    // Your options
};

postcss([postcssWrapLines(options)])
```

See [PostCSS] docs for examples for your environment.

## Options ##

| Key      | Default | Explanation                             |
|----------|---------|-----------------------------------------|
| debug    | false   | Show information for debugging          |
| maxWidth | 32768   | The maximum characters allowed per line |

[PostCSS]: https://github.com/postcss/postcss
[ci-img]:  https://travis-ci.org/hp-mobile/postcss-wrap-lines.svg
[ci]:      https://travis-ci.org/hp-mobile/postcss-wrap-lines
