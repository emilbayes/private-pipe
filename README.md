# `private-pipe`

[![Build Status](https://travis-ci.org/emilbayes/private-pipe.svg?branch=master)](https://travis-ci.org/emilbayes/private-pipe)

> Simple encryption using UNIX pipes

:warning: The encryption used is **unauthenticated**, which means that this
module will not be able to tell you if an adversary changed parts of the
encrypted stream. However, when you open your file you might soon realise so, if
you are unable to parse it.

## Usage

```js
var privatePipe = require('private-pipe')

process.stdin.pipe(privatePipe(Buffer.from('my password'))).pipe(process.stdout)
```

This module also comes with a handy CLI, that you can use with eg.
[Airpaste](https://github.com/mafintosh/airpaste).

On sending machine:

```sh
cat my-private-file | private-pipe "some shared password" | airpaste
```

On receiving machine:

```sh
airpaste | private-pipe "some shared password" > my-private-file
```

## API

### `var stream = privatePipe(passwordBuf)`

Returns a `Transform` stream, taking `Buffer` password

## Install

```sh
npm install private-pipe
```

## License

[ISC](LICENSE.md)
