export const createRouter = defaultCallback => ({
	_exactRoutes: {},
	_subRouters: {},
	_defaultRoute: defaultCallback
});

export const setExactRoute = (router, pathname, callback) => {
	router._exactRoutes[pathname] = callback;
};

export const setSubRouter = (router, subPath, subRouter) => {
	router._subRouters[subPath] = subRouter;
};

export const findRoute = (router, pathname) => {
	if (pathname in router._exactRoutes) {
		return fullPath => router._exactRoutes[pathname]('', fullPath);
	}

	const subrouterMatches = Object.keys(router._subRouters)
		.filter(p => pathname.startsWith(p))
		.sort((a, b) => b.length - a.length);
	for (const subrouterPath of subrouterMatches) {
		const subrouter = router._subRouters[subrouterPath];
		const tailPath = pathname.replace(subrouterPath, '');
		const callback = findRoute(subrouter, tailPath);
		if (callback) {
			return callback;
		}
	}

	if (router._defaultRoute) {
		return fullPath => router._defaultRoute(pathname, fullPath);
	}
};

export const executeRoute = (router, pathname) => findRoute(router, pathname)(pathname);
