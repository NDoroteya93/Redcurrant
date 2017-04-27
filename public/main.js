'use strict';

import { Router } from 'router';

let routing = new Router;

// configuration
routing.config({ mode: 'history' });

// returning the user to the initial stae
routing.navigate();

// adding routes 
routing
    .add('/about/', function() {
        console.log('about');
    })
    .add(/products\/(.*)\/edit\/(.*)/, function() {
        console.log('products', arguments);
    })
    .add(function() {
        console.log('defaults');
    })
    .check('/products/12/edit/22').listen();

// forwarding
routing.navigate('/about');
console.log(routing);