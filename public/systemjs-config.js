SystemJS.config({
    'transpiler': 'plugin-babel',
    'map': {
        'plugin-babel': '../node_modules/systemjs-plugin-babel/plugin-babel.js',
        'systemjs-babel-build': '../node_modules/systemjs-plugin-babel/systemjs-babel-browser.js',

        // scripts
        'main': 'main.js',
        'router': 'router.js',

        // libs
        'jquery': 'node_modules/jquery/dist/jquery.min.js',
        'jquery-ui': 'node_modules/jquery-ui/..',
        'navigo': 'node_modules/navigo/lib/navigo.min.js'
    }
});

System.import('main');