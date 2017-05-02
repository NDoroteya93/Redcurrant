import { Router } from 'router';
import { HomeController } from 'homeController';

// create
const home = new HomeController;

let router = new Navigo('#/home', true);

router
    .on({
        '*': home.loadTemplate()
    })
    .resolve();