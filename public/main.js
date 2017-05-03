'use strict';
import { Router } from 'router';
import { TicketsController } from 'ticketsController';

// create
const tickets = new TicketsController;

let router = new Navigo('#/home', true);

router
    .on(tickets.loadTemplate())
    .resolve();