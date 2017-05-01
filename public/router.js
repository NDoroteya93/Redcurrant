'use strict';

class Router {
    constructor() {
        this._routes = []; // keeps the current registered routes
        this._mode = null; //could be 'hash'  or 'history'                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
        this._root = '/'; // the root URL
    }

    get routes() {
        return this._routes;
    }

    get mode() {
        return this._mode;
    }

    set mode(val) {
        this._mode = val;
    }

    get root() {
        return this._root;
    }

    set root(val) {
        this._root = val;
    }


    config(options) {
        this.mode = options && options.mode && options.mode === 'history' &&
            !!(history.pushState) ? 'history' : 'hash';
        this.root = options && options.root ? '/' + this.clearSlashes(options.root) + '/' : '/';

        return this;
    }

    // getting the url 
    getFragment() {
        debugger;
        let fragment = '';
        if (this.mode === 'history') {
            fragment = this.clearSlashes(decodeURI(location.pathname + location.search));
            fragment = fragment.replace(/\?(.*)$/, '');
            fragment = this.root !== '/' ? fragment.replace(this.root, '') : fragment;
        } else {
            let match = window.location.href.match(/#(.*)$/);
            fragment = match ? match[1] : '';
        }

        return this.clearSlashes(fragment);
    }

    clearSlashes(path) {
        return path.toString().replace(/\/$/, '').replace(/^\//, '');
    }

    add(re, handler) {

        // if only a function is passed
        if (typeof re === 'function') {
            handler = re;
            re = '';
        }

        this.routes.push({ re: re, handler: handler });

        return this;
    }

    remove(param) {
        for (let i = 0; i < this.routes.length; ++i) {
            let r = this.routes[i];
            if (r.handler === param || r.re.toString() === param.toString()) {
                this.routes.splice(i, 1);

                return this;
            }
        }
        return this;
    }

    // reinitiliaze
    flush() {
        this.routes = [];
        this.mode = null;
        this.root = '/';

        return this;
    }

    check(f) {
        let fragment = f || this.getFragment();
        for (let i = 0; i < this.routes.length; i++) {
            let match = fragment.match(this.routes[i].re);
            if (match) {
                match.shift();
                this.routes[i].handler.apply({}, match);
                return this;
            }
        }

        return this;
    }

    // monitoring for changes

    listen() {
        let self = this,
            current = self.getFrag
        let fn = function() {
            if (current !== self.getFragment()) {
                current = self.getFragment();
                self.check(current);
            }
        }

        clearInterval(this.interval);
        this.interval = setInterval(fn, 50);

        return this;
    }

    // changing the URL 
    navigate(path) {
        path = path ? path : '';
        if (this.mode === 'history') {
            history.pushState(null, null, this.root + this.clearSlashes(path));
        } else {
            window.location.href = window.location.href.replace(/#(.*)$/, '') + '#' + path;
        }

        return this;
    }
}

export { Router };