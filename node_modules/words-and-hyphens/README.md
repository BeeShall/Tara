# words-and-hyphens

Extracts unique words and hyphens from text stripping punctuation on the way.

[![Build Status](https://api.travis-ci.org/borisdiakur/words-and-hyphens.png?branch=master)](https://travis-ci.org/borisdiakur/words-and-hyphens)
[![Coverage Status](https://img.shields.io/coveralls/borisdiakur/words-and-hyphens.svg)](https://coveralls.io/r/borisdiakur/words-and-hyphens)
[![Dependency Status](https://gemnasium.com/borisdiakur/words-and-hyphens.svg)](https://gemnasium.com/borisdiakur/words-and-hyphens)

[![NPM](https://nodei.co/npm/words-and-hyphens.png?downloads=true)](https://nodei.co/npm/words-and-hyphens/)

## Installation

In your project path:

```shell
npm install words-and-hyphens --save
```

## Usage

```javascript
var pattern = require('hyphenation.de'); // for more information visit https://github.com/bramstein/hypher
var extractor = require('words-and-hyphens')(pattern);

extractor.uniqueWords('My, st[ring] *full* of %punct) "and\' of the same Same same words.');
// -> ['and', 'full', 'My', 'of', 'punct', 'same', 'string', 'the', 'words']

extractor.uniqueWords('My, st[ring] *full* of %punct) "and\' of the same Same same words.', true);
// -> ['and', 'full', 'My', 'of', 'punct', 'Same', 'same', 'string', 'the', 'words']

extractor.uniqueHyphens('Fischers\' Fritz fischt frische Fische.');
// -> ['fi', 'fischt', 'fri', 'fritz', 'sche', 'schers'];
```

## Contributing

Issues and Pull-requests are absolutely welcome. If you want to submit a patch, please make sure that you follow this simple rule:

> All code in any code-base should look like a single person typed it, no matter how.
many people contributed. — [idiomatic.js](https://github.com/rwldrn/idiomatic.js/)

Lint with:
```shell
npm run jshint
```

Test with:
```shell
npm run mocha
```

Check code coverage with:

```shell
npm run istanbul
```

Then please commit with a __detailed__ commit message.
