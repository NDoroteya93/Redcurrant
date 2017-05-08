'use strict';

import { requester } from 'requester';

const LOCAL_STORAGE_USERNAME_KEY = 'signed-in-user-username',
    LOCAL_STORAGE_AUTHKEY_KEY = 'signed-in-user-auth-key';

class TicketsModel {
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

    // state state - todo, in progress, done
    changeState(id, state, body) {
        return requester.post(`https://130.204.27.87:44313/api/ChangeState?Id=${id}&TaskState=${state}`, body)
            .then(function(resp) {
                return resp;
            });
    }

    // get tickets details
    getTicketsDetails(id) {
        const self = this;
        let details = {};
        requester.get(`https://130.204.27.87:44313/api/GetTicketDetails?id=${id}`)
            .then((res) => {
                // get difference between current and created date
                let date2 = new Date();
                let date1 = new Date(res.createDate);
                let diff = new Date(date2.getTime() - date1.getTime());
                // diff is: Thu Jul 05 1973 04:00:00 GMT+0300 (EEST)

                // date 
                if ((diff.getUTCFullYear() - 1970) > 0) {
                    details.diffDate = (diff.getUTCFullYear() - 1970) + ' years';
                } else if (diff.getUTCMonth() > 0) {
                    details.diffDate = diff.getUTCMonth() + ' months'
                } else {
                    details.diffDate = diff.getUTCDate() - 1 + ' days'
                }

                // state 
                if (res.taskState === 0) {
                    details.state = 'ToDo';
                } else if (res.taskState === 1) {
                    details.state = 'In Progress';
                } else {
                    details.state = 'Done';
                    details.done = 'done';
                }

                // assigne
                if (res.assignee === '') {
                    details.assignee = 'Unassigned';
                } else {
                    details.assignee = res.assignee;
                }

                details.details = res;
                details.comments = res.comments.length;
            });

        return details;
    }

    // add tickets 
    addTicket(title, description, priority, categoryId, parrent) {
        const body = {
            categoryId: categoryId,
            title: title,
            priority: Number(priority),
            screenshotUrl: "",
            description: description,
            parentTicket_Id: parrent || 0
        }

        let token = localStorage.getItem(LOCAL_STORAGE_AUTHKEY_KEY);
        let header = { "Authorization": "Bearer " + token }
        return requester.post('https://130.204.27.87:44313/api/CreateTicket', body, header);
    }

    assigneeUserToTask(taskId, userId) {
        debugger;
        const body = {
            id: taskId,
            userId: userId
        }
        return requester.post(`https://130.204.27.87:44313/api/AssigneeUserToTask?Id=${taskId}&UserId=${userId}`, body)
            .then(function(resp) {
                console.log(resp);
                return resp;
            });
    }

    deleteTicket(id) {
        const body = {
            ticketId: id
        }
        return requester.post(`https://130.204.27.87:44313/api/DeleteTicket?ticketId=${id}`, body)
            .then(function(resp) {
                return resp;
            });
    }

    addComment(ticketId, commment) {
        const body = {
            ticketId: ticketId,
            content: commment
        }
        return requester.post(`https://130.204.27.87:44313/api/AddCommentToTicket`, body)
            .then(function(resp) {
                console.log(res);
                return resp;
            });
    }

}

export { TicketsModel }