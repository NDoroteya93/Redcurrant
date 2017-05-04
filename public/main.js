'use strict';
import { Router } from 'router';
import { HomeController } from 'homeController';
import { TicketsController } from 'ticketsController';
import { UserController } from 'userController';

// create
const tickets = new TicketsController,
    home = new HomeController,
    users = new UserController;

home.initHome();

let router = new Navigo('#/home', true);

router
    .on(home.initHome())
    .resolve();



router
    .on({
        '*': function() {
            home.loadTemplate();
        },
        '#/tickets': function() {
            tickets.loadTemplate()
        },
        '#/register': function() {
            users.loadTemplate('user-register');
        },
        '#/register/submit': function() {
            users.register();
        }
    })
    .resolve();