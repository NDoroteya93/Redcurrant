'use strict';

import { Router } from 'router';


// Config History for back, forwarding
let history = new Router;
history.config({ mode: 'history' });

// config hash routing
let routing = new Router;
routing.config();

$(window).on('hashchange', () => routing.getFragment());

// // returning the user to the initial stae
// routing.navigate();

// // adding routes 
// routing
//     .add('/about/', function() {
//         console.log('about');
//     })
//     .add(/products\/(.*)\/edit\/(.*)/, function() {
//         console.log('products', arguments);
//     })
//     .add(function() {
//         console.log('defaults');
//     })
//     .check('/products/12/edit/22').listen();

// // forwarding
// routing.navigate('/about');