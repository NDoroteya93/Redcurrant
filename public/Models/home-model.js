'use strict';

import { requester } from 'requester';

const LOCAL_STORAGE_USERNAME_KEY = 'signed-in-user-username',
    LOCAL_STORAGE_AUTHKEY_KEY = 'signed-in-user-auth-key';

class HomeModel {
    constructor() {
        this._tickets = [];
    }

    get tickets() {
        return this._tickets;
    }

    getTickets() {
        let self = this,
            states = { todo: [], progress: [], done: [] };
        requester.get('https://130.204.27.87:44313/api/GetTickets')
            .then((res) => {
                res.forEach((ticket) => {
                    if (ticket.taskState === 0) {
                        states.todo.push(ticket);
                    }

                    if (ticket.taskState === 1) {
                        states.progress.push(ticket);
                    }

                    if (ticket.taskState === 2) {
                        states.done.push(ticket);
                    }
                });
            });
        return states;
    }
}

export { HomeModel }