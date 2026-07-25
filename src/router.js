/**
 * Lux Router - Hash-based SPA routing
 *
 * Usage:
 *   const router = createRouter({ routes: [...] });
 *   router.push('/users/123');
 *
 * Routes accept component classes or lazy loaders:
 *   { path: '/', component: HomePage }                    // direct class
 *   { path: '/admin', component: () => import('./admin.js') }  // lazy
 */

function registerComponent(name, component) {
    if (!name.includes('-')) throw new Error(`Component name must contain a hyphen: ${name}`);
    if (!customElements.get(name)) customElements.define(name, component);
}

// ─── Route matching ───

function pathToRegex(pattern) {
    let seg = pattern.replace(/\/+$/, '') || '/';
    if (seg === '/') return /^\/?$/;
    const re = '^' + seg.replace(/:(\w+)/g, '([^/]+)').replace(/\(\.\*\)/g, '(.*)') + '$';
    return new RegExp(re);
}

function extractParamNames(pattern) {
    const names = [];
    const re = /:(\w+)/g;
    let m;
    while ((m = re.exec(pattern))) names.push(m[1]);
    return names;
}

function parseQuery(hash) {
    const idx = hash.indexOf('?');
    if (idx === -1) return {};
    const params = {};
    for (const pair of hash.slice(idx + 1).split('&')) {
        const [k, v] = pair.split('=');
        if (k) params[decodeURIComponent(k)] = v ? decodeURIComponent(v) : '';
    }
    return params;
}

function getPathFromHash(hash) {
    return hash.replace(/^#/, '').split('?')[0] || '/';
}

// ─── Component registry ───

const componentRegistry = new Map(); // tagName → class

function resolveComponent(componentOrLoader) {
    if (typeof componentOrLoader === 'string') {
        return Promise.resolve(componentOrLoader);
    }
    if (
        typeof componentOrLoader === 'function' &&
        componentOrLoader.prototype instanceof HTMLElement
    ) {
        return ensureRegistered(componentOrLoader);
    }
    if (typeof componentOrLoader === 'function') {
        // Assume lazy loader: () => import(...)
        return componentOrLoader().then((mod) => {
            const Comp = mod.default || mod[Object.keys(mod)[0]];
            return ensureRegistered(Comp);
        });
    }
    return Promise.resolve(null);
}

function ensureRegistered(ComponentClass) {
    if (!ComponentClass || !ComponentClass.prototype) return Promise.resolve(null);

    const tagName = ComponentClass.tagName || classToTag(ComponentClass.name);

    // Already registered?
    if (customElements.get(tagName)) {
        return Promise.resolve(tagName);
    }

    registerComponent(tagName, ComponentClass);
    return Promise.resolve(tagName);
}

function classToTag(name) {
    // HomePage → home-page, UserProfile → user-profile
    return name
        .replace(/([A-Z])/g, '-$1')
        .toLowerCase()
        .replace(/^-/, '');
}

// ─── Router class ───

class Router {
    constructor(options = {}) {
        this.routes = (options.routes || []).map((r) => ({
            ...r,
            _regex: pathToRegex(r.path),
            _paramNames: extractParamNames(r.path),
            _children: (r.children || []).map((c) => ({
                ...c,
                _regex: pathToRegex(c.path),
                _paramNames: extractParamNames(c.path),
            })),
        }));

        this._guards = [];
        this._listeners = [];
        this.current = null;
        this._prev = null;
        this._onHashChange = this._onHashChange.bind(this);
    }

    start() {
        window.addEventListener('hashchange', this._onHashChange);
        this._resolve();
    }

    stop() {
        window.removeEventListener('hashchange', this._onHashChange);
    }

    push(path) {
        location.hash = path;
    }

    replace(path) {
        const url = new URL(location.href);
        url.hash = path;
        history.replaceState(null, '', url.toString());
        this._onHashChange();
    }

    back() {
        history.back();
    }
    forward() {
        history.forward();
    }

    beforeEach(fn) {
        this._guards.push(fn);
        return () => {
            const i = this._guards.indexOf(fn);
            if (i >= 0) this._guards.splice(i, 1);
        };
    }

    _subscribe(fn) {
        this._listeners.push(fn);
        return () => {
            const i = this._listeners.indexOf(fn);
            if (i >= 0) this._listeners.splice(i, 1);
        };
    }

    _onHashChange() {
        this._resolve();
    }

    _resolve() {
        const hash = location.hash || '#/';
        const path = getPathFromHash(hash);
        const query = parseQuery(hash);

        let matched = null;
        for (const route of this.routes) {
            const hasChildren = route._children.length > 0;

            // For routes with children, use prefix matching
            // For leaf routes, use exact matching
            let m;
            if (hasChildren) {
                // Prefix match: path must start with route path
                const prefix = route.path === '/' ? '' : route.path.replace(/\/+$/, '');
                if (
                    path === prefix ||
                    path.startsWith(prefix + '/') ||
                    (prefix === '' && path.startsWith('/'))
                ) {
                    m = [path]; // fake match for prefix
                }
            } else {
                m = path.match(route._regex);
            }

            if (m) {
                const params = {};
                route._paramNames.forEach((name, i) => {
                    if (m[i + 1] !== undefined) params[name] = decodeURIComponent(m[i + 1]);
                });
                matched = { route, params: { ...params }, query, path };

                // Child matching (check BEFORE redirect)
                if (hasChildren) {
                    const prefix = route.path === '/' ? '' : route.path.replace(/\/+$/, '');
                    const childPath = path.slice(prefix.length) || '/';
                    let childMatched = false;
                    for (const child of route._children) {
                        const cm = childPath.match(child._regex);
                        if (cm) {
                            const childParams = {};
                            child._paramNames.forEach((name, i) => {
                                childParams[name] = decodeURIComponent(cm[i + 1]);
                            });
                            matched.child = {
                                route: child,
                                params: { ...params, ...childParams },
                                query,
                                path,
                            };
                            childMatched = true;
                            break;
                        }
                    }
                    // No child matched — redirect only if path equals parent path
                    if (
                        !childMatched &&
                        route.redirect &&
                        path === (route.path === '/' ? '/' : route.path)
                    ) {
                        this.replace(route.redirect);
                        return;
                    }
                    // No child matched and no redirect — skip this parent, try other routes
                    if (!childMatched) {
                        matched = null;
                        continue;
                    }
                } else if (route.redirect) {
                    this.replace(route.redirect);
                    return;
                }
                break;
            }
        }

        if (!matched) {
            this.current = { route: null, params: {}, query, path };
        } else {
            this.current = matched;
        }

        for (const guard of this._guards) {
            if (guard(this.current, this._prev) === false) {
                if (this._prev) history.replaceState(null, '', '#' + this._prev.path);
                return;
            }
        }

        this._prev = { ...this.current };
        for (const fn of this._listeners) fn(this.current);
    }
}

// ─── Create router + register <router-outlet> ───

export function createRouter(options) {
    const router = new Router(options);

    if (!customElements.get('router-outlet')) {
        class RouterOutlet extends HTMLElement {
            connectedCallback() {
                this.style.display = 'contents';
                this._unsub = router._subscribe(() => this._update());
                this._update();
            }

            disconnectedCallback() {
                this._unsub?.();
                this._loadingAbort?.abort();
            }

            async _update() {
                const match = this._getMatch();
                this._loadingAbort?.abort();

                if (!match || !match.route || !match.route.component) {
                    this.textContent = '';
                    return;
                }

                // Skip re-render if the same route is already rendered
                if (this._lastRoute === match.route) {
                    return;
                }

                const controller = new AbortController();
                this._loadingAbort = controller;

                try {
                    const tagName = await resolveComponent(match.route.component);
                    if (controller.signal.aborted) return;

                    this.textContent = '';
                    if (tagName) {
                        const el = document.createElement(tagName);
                        if (match.params) el.params = match.params;
                        if (match.query) el.query = match.query;
                        this.appendChild(el);
                        this._lastRoute = match.route;
                    }
                } catch (e) {
                    if (!controller.signal.aborted) {
                        console.error('[Lux Router] Failed to load component:', e);
                        this.textContent = '';
                    }
                }
            }

            _getMatch() {
                const level = parseInt(this.getAttribute('level')) || 0;
                let match = router.current;
                for (let i = 0; i < level; i++) {
                    if (!match || !match.child) return null;
                    match = match.child;
                }
                return match;
            }
        }
        registerComponent('router-outlet', RouterOutlet);
    }

    router.start();
    return router;
}
