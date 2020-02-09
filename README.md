# @cfware/path-router

[![Travis CI][travis-image]][travis-url]
[![Greenkeeper badge][gk-image]](https://greenkeeper.io/)
[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![MIT][license-image]](LICENSE)

Basic path based callback routing.

### Install @cfware/path-router

This module requires node.js 13.8.0 or above.

```sh
npm i --save @cfware/path-router
```

## Usage

```js
import PathRouter from '@cfware/path-router';

const root = new PathRouter(() => '404 Page');
root.add('/welcome', () => 'Welcome Page');
root.add('/software', () => 'Software Page');
root.add('/user/', () => 'User List Page');
root.addPrefix('/user/', (tailPath, fullPath) => `User Page for ${tailPath}, fullPath: ${fullPath}`);
root.addRoute('/prefix/', new PathRouter((tailPath, fullPath) => `Prefix route hit for tail path ${tailPath}`));
```

[npm-image]: https://img.shields.io/npm/v/@cfware/path-router.svg
[npm-url]: https://npmjs.org/package/@cfware/path-router
[travis-image]: https://travis-ci.org/cfware/path-router.svg?branch=master
[travis-url]: https://travis-ci.org/cfware/path-router
[gk-image]: https://badges.greenkeeper.io/cfware/path-router.svg
[downloads-image]: https://img.shields.io/npm/dm/@cfware/path-router.svg
[downloads-url]: https://npmjs.org/package/@cfware/path-router
[license-image]: https://img.shields.io/npm/l/@cfware/path-router.svg
