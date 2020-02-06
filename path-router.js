class PathRouter {
	_exactRoutes = {};
	_routers = {};

	constructor(defaultFn) {
		this._defaultFn = defaultFn;
	}

	add(pathname, fn) {
		if (pathname in this._exactRoutes) {
			throw new Error(`Route already exists for ${pathname}`);
		}

		this._exactRoutes[pathname] = fn;
	}

	addRouter(basepath, pathRouter) {
		if (basepath in this._routers) {
			throw new Error(`Subroute already exists for ${basepath}`);
		}

		this._routers[basepath] = pathRouter;
	}

	findRoute(pathname) {
		if (pathname in this._exactRoutes) {
			return fullPath => this._exactRoutes[pathname]('', fullPath);
		}

		const [subrouterPath] = Object.keys(this._routers)
			.filter(p => pathname.startsWith(p))
			.sort((a, b) => b.length - a.length);
		if (typeof subrouterPath === 'string') {
			const router = this._routers[subrouterPath];
			const tailPath = pathname.replace(subrouterPath, '');
			const fn = router.findRoute(tailPath);
			if (fn) {
				return fn;
			}
		}

		if (this._defaultFn) {
			return fullPath => this._defaultFn(pathname, fullPath);
		}
	}

	executeRoute(pathname) {
		return this.findRoute(pathname)(pathname);
	}
}

export default PathRouter;
