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
        // home 
        '*': function() {
            home.loadTemplate();
        },
        '#/learn': function() {
            $('body').animate({
                scrollTop: document.body.scrollHeight
            }, 500);
        },

        // tickets
        '#/tickets': function() {
            tickets.loadTemplate();
            tickets.initEvents();
        },
        '#/tickets/edit': function(e) {

        },
        '#/tickets/comments': function() {
            if ($('#container-comments').hasClass('hidden')) {
                $('#container-comments').removeClass('hidden');
            } else {
                $('#container-comments').addClass('hidden');
            }
        },
        '#/tickets/all': function() {
            tickets.allTickets();
        },
        '#/tickets/add': function() {
            tickets.addTicket();
        },

        /// register
        '#/register': function() {
            users.loadTemplate('user-register');
        },
        '#/register/submit': function() {
            users.register();
        }

    })
    .resolve();