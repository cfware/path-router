import t from 'libtap';

// eslint-disable-next-line import/no-unresolved
import PathRouter from '@cfware/path-router';

const fn0 = () => {};

t.test('PathRouter is a function', async t => {
	t.equal(typeof PathRouter, 'function');
});

t.test('errors', async t => {
	const pathRouter = new PathRouter();

	pathRouter.add('/', fn0);
	pathRouter.addRouter('/', fn0);

	t.throws(() => pathRouter.add('/', fn0), new Error('Route already exists for /'));
	t.throws(() => pathRouter.addRouter('/', fn0), new Error('Subroute already exists for /'));
	t.throws(() => pathRouter.addPrefix('/', fn0), new Error('Subroute already exists for /'));
});

t.test('totally empty route returns undefined', async t => {
	const pathRouter = new PathRouter();
	t.equal(typeof pathRouter.findRoute(''), 'undefined');
	t.equal(typeof pathRouter.findRoute('page'), 'undefined');
	t.equal(typeof pathRouter.findRoute('path/page'), 'undefined');
});

t.test('executeRoute', async t => {
	const info = {};

	const pathRouter = new PathRouter({
		defaultCallback: (...args) => info.defaultPath.push(args),
		exact: {
			'': (...args) => info.blankPath.push(args),
			'path/page': (...args) => info.pathPage.push(args)
		},
		routers: {
			nullroute: new PathRouter()
		},
		prefixes: {
			route: (...args) => info.routePath.push(args)
		}
	});

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
