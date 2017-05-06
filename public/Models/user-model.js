'use strict';

import { requester } from 'requester';

class UserModel {
    constructor() {
        this._users = [];
    }

    get users() {
        return this._users;
    }

    getUsers() {
        let self = this,
            users = { user: [] };
        requester.get('https://130.204.27.87:44313/api/accounts/users')
            .then((res) => {
                res.forEach((obj) => {
                    users.user.push(obj);
                });
        });
        return users;
    }

    register(email, username, firstname, lastname, password, confirmPass, roleName) {
        debugger;
        const body = {
            email: email,
            username: username,
            firstName: firstname,
            lastName: lastname,
            roleName: roleName || '',
            password: password,
            confirmPassword: confirmPass
        }
        return requester.post('https://130.204.27.87:44313/api/accounts/CreateUser', body);
    }
    login() {

    }

    logout() {

    }
}


export { UserModel };
