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

        '#/learn': function() {
            $('body').animate({
                scrollTop: document.body.scrollHeight
            }, 500);
        },

        // tickets
        '#/tickets': function() {
            tickets.ticketTemplate();
            tickets.initEvents();
        },
        '#/tickets/details/:id': function(params) {
            console.log(details);
            tickets.loadDetailsTemplate(params.id);

        },
        '#/tickets/comments': function() {

        },
        '#/tickets/all': function() {
            tickets.allTickets();
        },
        '#/tickets/add/:action': function(params) {
            let id = params.id;
            tickets.addTicket(id);
            console.log(params);
        },

        /// register
        '#/register': function() {
            users.loadTemplate('user-register');
        },
        '#/register/submit': function() {
            users.register();
        },

        /// users
        '#/users': function() {
            users.allUsers();
        },
        '#/user/:username': function() {
            users.getUser();
        },
        '#/users/profile': function() {
            users.viewUserProfile();
        },
        // home 
        '*': function() {
            home.loadTemplate();
        },

    })
    .resolve();