'use strict';
import { Router } from 'router';
import { HomeController } from 'homeController';
import { TicketsController } from 'ticketsController';
import { UserController } from 'userController';

// create
const tickets = new TicketsController;
const home = new HomeController;

let router = new Navigo('#/home', true);

router
    .on(home.initHome())
    .resolve();


router
    .on({
        '*': function() {
            home.initHome();
        },
        '#/tickets': function() {
            tickets.loadTemplate()
        }
    })
    .resolve();