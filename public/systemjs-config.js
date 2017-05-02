SystemJS.config({
    'transpiler': 'plugin-babel',
    'map': {
        'plugin-babel': '../node_modules/systemjs-plugin-babel/plugin-babel.js',
        'systemjs-babel-build': '../node_modules/systemjs-plugin-babel/systemjs-babel-browser.js',

        // scripts
        'main': 'main.js',
        'router': 'helpers/router.js',
        'templates': 'helpers/templates.js',
        'requester': 'helpers/requester.js',

        // Controllers
        'homeController': 'Controllers/home-controller.js',

        // Models
        'homeModel': 'Models/home-model.js',
        // libs
        'jquery': 'node_modules/jquery/dist/jquery.min.js',
        'jquery-ui': 'node_modules/jquery-ui/..',
        'navigo': 'node_modules/navigo/lib/navigo.min.js'
    }
});

System.import('main');