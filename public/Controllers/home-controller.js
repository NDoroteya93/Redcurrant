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
        // load template
        let settings = {
            authority: 'https://130.204.27.87:44314/identity/',
            client_id: 'ticketingsystem',
            //redirect_uri: 'http://localhost:92/public/callback.html',
            popup_redirect_uri: 'http://localhost:92/public/popup.html',
            silent_redirect_uri: 'http://localhost:92/public/silent-renew.html',
            //automaticSilentRenew: true,
            post_logout_redirect_uri: 'http://localhost:92/public/index.html',
            response_type: 'id_token token',
            scope: 'openid profile email ClimbingGymapi',
            accessTokenExpiringNotificationTime: 4,
            automaticSilentRenew: true,
            filterProtocolClaims: true
        };


        let manager = new Oidc.UserManager(settings);
        let user;
        Oidc.Log.logger = console;
        manager.events.addUserLoaded(function(loadedUser) {
            user = loadedUser;
            localStorage.setItem('testObject', JSON.stringify(loadedUser));
            $(".signed-user").removeClass('hidden');
            $(".unsigned-user").addClass('hidden');
            self.display('.js-user', user);
        });
        manager.events.addSilentRenewError(function(error) {
            console.error('error while renewing the access token', error);
        });
        manager.events.addUserSignedOut(function() {
            $(".signed-user").addClass('hidden');
            $(".unsigned-user").removeClass('hidden');
            alert('The user has signed out');
        });

        // login
        $('#login-btn').on('click', function() {
            debugger;
            self.userController.login(manager);
        });

        $('#token').on('click', function() {
            var retrievedObject = JSON.parse(localStorage.getItem('testObject'));
            retrievedObject.access_token;
        });

        // logout
        $('#logoutBtn').on('click', function() {
            self.userController.logout(manager);
        });

        return this;
    }

    display(selector, data) {
        $('.user-name').text(data.profile.preferred_username);
        $('.user-email').text(data.profile.email);
        if (data && typeof data === 'string') {
            data = JSON.parse(data);
        }
        if (data) {
            data = JSON.stringify(data, null, 2);
        }
        $(selector).text(data);
    }


}

export { HomeController };