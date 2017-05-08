'use strict';

import { requester } from 'requester';

const LOCAL_STORAGE_USERNAME_KEY = 'signed-in-user-username',
    LOCAL_STORAGE_AUTHKEY_KEY = 'signed-in-user-auth-key',
    API = 'https://130.204.27.87:44313/api';

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
        requester.get(API + '/GetTickets')
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
        return requester.post(API + `/ChangeState?Id=${id}&TaskState=${state}`, body)
            .then(function(resp) {
                return resp;
            });
    }

    // get tickets details
    getTicketsDetails(id) {
        const self = this;
        let details = {};
        requester.get(API + `/GetTicketDetails?id=${id}`)
            .then((res) => {
                // get difference between current and created date
                let date2 = new Date();
                let date1 = new Date(res.createDate);
                let diff = moment(date2).preciseDiff(date1);

                details.diffDate = diff;
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

                // comment creater defference
                details.details.comments.forEach((comment) => {
                    comment.dateDiff = moment(date2).preciseDiff(comment.createdOn);

                });

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
        return requester.post(API + '/CreateTicket', body, header);
    }

    assigneeUserToTask(taskId, userId) {
        const body = {
            id: taskId,
            userId: userId
        }
        return requester.post(API + `/AssigneeUserToTask?Id=${taskId}&UserId=${userId}`, body)
            .then(function(resp) {
                return resp;
            });
    }

    deleteTicket(id) {
        const body = {
            ticketId: id
        }
        return requester.post(API + `/DeleteTicket?ticketId=${id}`, body)
            .then(function(resp) {
                return resp;
            });
    }

    addComment(ticketId, commment) {
        const body = {
            ticketId: ticketId,
            content: commment
        }

        let token = localStorage.getItem(LOCAL_STORAGE_AUTHKEY_KEY);
        let header = { "Authorization": "Bearer " + token }
        return requester.post(API + '/AddCommentToTicket', body, header)
            .then(function(res) {
                return res;
            });
    }

    getTicketForCurrentUser() {
        let token = localStorage.getItem(LOCAL_STORAGE_AUTHKEY_KEY);
        let header = { "Authorization": "Bearer " + token }
        return requester.get(API + '/GetTicketsForCurrentUser', header)
            .then(function(res) {
                console.log(res);
                return res;
            });
    }

    deleteComment(id) {
        const body = {
            commentId: id
        }
        return requester.post(API + `/DeleteComment?commentId=${id}`, body)
            .then(function(res) {
                console.log(res);
                return res;
            });
    }

}

export { TicketsModel }