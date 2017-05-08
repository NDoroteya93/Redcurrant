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
        return requester.post('https://130.204.27.87:44313/api/CreateTicket', body, header);
    }

    assigneeUserToTask(taskId, userId) {
        const body = {
            id: taskId,
            userId: userId
        }
        return requester.post(`https://130.204.27.87:44313/api/AssigneeUserToTask?Id=${taskId}&UserId=${userId}`, body)
            .then(function(resp) {
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

        let token = localStorage.getItem(LOCAL_STORAGE_AUTHKEY_KEY);
        let header = { "Authorization": "Bearer " + token }
        return requester.post(`https://130.204.27.87:44313/api/AddCommentToTicket`, body, header)
            .then(function(res) {
                return res;
            });
    }

    searchTickets(string) {
        let self = this,
            results = { ticket: [] };
        requester.get(`https://130.204.27.87:44313/api/FindTiketsByTitle/${string}`)
            .then((res) => {
                res.forEach((result) => {
                    results.ticket.push(result);
                });
            });
        return results;
    }
}

export { TicketsModel }