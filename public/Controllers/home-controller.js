'use strict';
import { loadTemplate } from 'templates';
import { HomeModel } from 'homeModel';
import { UserController } from 'userController';

class HomeController {
    constructor() {
        this._container = $('#container');
        this._userController = new UserController;
    }

    get container() {
        return this._container;
    }

    get userController() {
        return this._userController;
    }

    loadTemplate() {
        const getTemplate = new loadTemplate('home');
        let self = this;
        getTemplate.getTemplate()
            .then(template => {
                self.container.html(template());
            });
    }

    initHome() {
        let self = this;

        let settings = {
            authority: 'https://130.204.27.87:44314/',
            client_id: 'js',
            popup_redirect_uri: 'http://localhost:91/public/popup.html',
            // silent_redirect_uri: 'http://localhost:56668/silent-renew.html',
            post_logout_redirect_uri: 'http://localhost:91/public/index.html',
            response_type: 'id_token token',
            scope: 'openid profile email api',
            accessTokenExpiringNotificationTime: 4,
            automaticSilentRenew: true,
            filterProtocolClaims: true
        };


        let manager = new Oidc.UserManager(settings);
        let user;
        Oidc.Log.logger = console;
        manager.events.addUserLoaded(function(loadedUser) {
            user = loadedUser;
            display('.js-user', user);
        });
        manager.events.addSilentRenewError(function(error) {
            console.error('error while renewing the access token', error);
        });
        manager.events.addUserSignedOut(function() {
            alert('The user has signed out');
        });

        // login
        $('#login-btn').on('click', function() {
            self.userController.login(manager);
        });

        // logout
        $('#logout-btn').on('click', function() {
            self.userController.logout(manager);
        });

        return this;
    }

}

export { HomeController };