import t from 'libtap';

import PathRouter from './path-router.js';

const fn0 = () => {};

t.test('PathRouter is a function', async t => {
	t.equal(typeof PathRouter, 'function');
});

t.test('errors', async t => {
	const pathRouter = new PathRouter();

	pathRouter.add('', fn0);
	pathRouter.addRouter('', fn0);

	t.throws(() => pathRouter.add('', fn0));
	t.throws(() => pathRouter.addRouter('', fn0));
});

t.test('totally empty route returns undefined', async t => {
	const pathRouter = new PathRouter();
	t.equal(typeof pathRouter.findRoute(''), 'undefined');
	t.equal(typeof pathRouter.findRoute('page'), 'undefined');
	t.equal(typeof pathRouter.findRoute('path/page'), 'undefined');
});

t.test('executeRoute', async t => {
	const info = {};

	const pathRouter = new PathRouter((...args) => info.defaultPath.push(args));
	pathRouter.add('', (...args) => info.blankPath.push(args));
	pathRouter.add('path/page', (...args) => info.pathPage.push(args));
	pathRouter.addRouter('route', new PathRouter((...args) => info.routePath.push(args)));
	pathRouter.addRouter('nullroute', new PathRouter());

	const testPath = (id, path, expected) => {
		info[id] = [];
		pathRouter.executeRoute(path);
		t.same(info[id], [expected]);
		delete info[id];
	};

	testPath('blankPath', '', ['', '']);
	testPath('defaultPath', 'page', ['page', 'page']);
	testPath('defaultPath', 'path', ['path', 'path']);
	testPath('pathPage', 'path/page', ['', 'path/page']);
	testPath('defaultPath', 'path/page/sub', ['path/page/sub', 'path/page/sub']);
	testPath('routePath', 'route', ['', 'route']);
	testPath('routePath', 'route/sub', ['/sub', 'route/sub']);
	testPath('defaultPath', 'nullroute', ['nullroute', 'nullroute']);
});
