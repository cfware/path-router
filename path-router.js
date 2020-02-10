const defaultOptions = {
	exact: {},
	prefixes: {},
	routers: {}
};

class PathRouter {
	_exactRoutes = {};
	_routers = {};

	constructor(options) {
		if (typeof options === 'function') {
			options = {
				...defaultOptions,
				defaultCallback: options
			};
		} else {
			options = {
				...defaultOptions,
				...options
			};
		}

		this._defaultCallback = options.defaultCallback;
		for (const [pathname, callback] of Object.entries(options.exact)) {
			this.add(pathname, callback);
		}

		for (const [basepath, prefixOptions] of Object.entries(options.prefixes)) {
			this.addPrefix(basepath, prefixOptions);
		}

		for (const [basepath, pathRouter] of Object.entries(options.routers)) {
			this.addRouter(basepath, pathRouter);
		}
	}

	add(pathname, callback) {
		if (pathname in this._exactRoutes) {
			throw new Error(`Route already exists for ${pathname}`);
		}

		this._exactRoutes[pathname] = callback;
	}

	addPrefix(basepath, prefixOptions) {
		if (basepath in this._routers) {
			throw new Error(`Subroute already exists for ${basepath}`);
		}

		this._routers[basepath] = new PathRouter(prefixOptions);
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
			const callback = router.findRoute(tailPath);
			if (callback) {
				return callback;
			}
		}

		if (this._defaultCallback) {
			return fullPath => this._defaultCallback(pathname, fullPath);
		}
	}

	executeRoute(pathname) {
		return this.findRoute(pathname)(pathname);
	}
}

export default PathRouter;
