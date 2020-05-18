# @cfware/path-router [![NPM Version][npm-image]][npm-url]

Basic path based callback routing.

## Usage

```js
import PathRouter from '@cfware/path-router';

const root = new PathRouter({
	defaultCallback: () => '404 Page',
	exact: {
		'/welcome': () => 'Welcome Page',
		'/software': () => 'Software page',
		'/user/': () => 'User List Page'
	},
	prefixes: {
		'/user/': (tailPath, fullPath) => `User Page for ${tailPath}, fullPath: ${fullPath}`
	},
	routes: {
		'/prefix/': new PathRouter((tailPath, fullPath) => `Prefix route hit for tail path ${tailPath}`)
	}
});
```

[npm-image]: https://img.shields.io/npm/v/@cfware/path-router.svg
[npm-url]: https://npmjs.org/package/@cfware/path-router
