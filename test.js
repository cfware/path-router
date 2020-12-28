import t from 'libtap';

import * as pathRouter from '@cfware/path-router';

const {createRouter, setExactRoute, setSubRouter, findRoute, executeRoute} = pathRouter;

t.same(Object.keys(pathRouter).sort(), [
	'createRouter',
	'setExactRoute',
	'setSubRouter',
	'findRoute',
	'executeRoute'
].sort());

t.test('empty route returns undefined', async t => {
	const router = createRouter();
	t.type(findRoute(router, ''));
	t.type(findRoute(router, 'page'));
	t.type(findRoute(router, 'path/page'));
});

t.test('exact route replacement', async t => {
	const info = {
		fn1: 0,
		fn2: 0
	};
	const fn1 = () => info.fn1++;
	const fn2 = () => info.fn2++;
	const router = createRouter();

	setExactRoute(router, 'path', fn1);
	executeRoute(router, 'path');
	t.same(info, {fn1: 1, fn2: 0});

	setExactRoute(router, 'path', fn2);
	executeRoute(router, 'path');
	t.same(info, {fn1: 1, fn2: 1});
});

t.test('default route match', async t => {
	const info = {
		hit: 0,
		fn1: 0
	};
	const defaultRoute = () => info.hit++;
	const fn1 = () => info.fn1++;
	const router = createRouter(defaultRoute);
	setExactRoute(router, 'path', fn1);

	executeRoute(router, 'path/');
	t.same(info, {hit: 1, fn1: 0});
});

t.test('longest subrouter match', async t => {
	const info = {
		hit: 0,
		router1: 0,
		router2: 0
	};
	const router = createRouter(() => info.hit++);
	setSubRouter(router, 'path/sub', createRouter(() => info.router1++));
	setSubRouter(router, 'path', createRouter(() => info.router2++));

	executeRoute(router, '');
	t.same(info, {hit: 1, router1: 0, router2: 0});

	executeRoute(router, 'path');
	t.same(info, {hit: 1, router1: 0, router2: 1});

	executeRoute(router, 'path/su');
	t.same(info, {hit: 1, router1: 0, router2: 2});

	executeRoute(router, 'path/sub');
	t.same(info, {hit: 1, router1: 1, router2: 2});

	executeRoute(router, 'path/subby');
	t.same(info, {hit: 1, router1: 2, router2: 2});

	executeRoute(router, 'unknown');
	t.same(info, {hit: 2, router1: 2, router2: 2});

	setSubRouter(router, 'broken', createRouter());
	executeRoute(router, 'broken');
	t.same(info, {hit: 3, router1: 2, router2: 2});
});

t.test('fallthrough to shorter subrouter match', async t => {
	const info = {
		hit: 0,
		router: 0
	};
	const router = createRouter(() => info.hit++);
	setSubRouter(router, 'path/sub', createRouter());
	setSubRouter(router, 'path', createRouter(() => info.router++));

	executeRoute(router, 'path/sub');
	t.same(info, {hit: 0, router: 1});

	executeRoute(router, 'path/sub/sub');
	t.same(info, {hit: 0, router: 2});

	executeRoute(router, 'path');
	t.same(info, {hit: 0, router: 3});
});
