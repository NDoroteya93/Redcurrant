"use strict";import{requester}from"requester";const LOCAL_STORAGE_USERNAME_KEY="signed-in-user-username",LOCAL_STORAGE_AUTHKEY_KEY="signed-in-user-auth-key",API="https://130.204.27.87:44313/api";class TicketsModel{constructor(){this._tickets=[]}get tickets(){return this._tickets}getTickets(){let b={todo:[],progress:[],done:[]};return requester.get(API+"/GetTickets").then(a=>{a.forEach(a=>{0===a.taskState&&b.todo.push(a);1===a.taskState&&b.progress.push(a);2===a.taskState&&b.done.push(a)})}),b}changeState(a,b,c){return requester.post(API+`/ChangeState?Id=${a}&TaskState=${b}`,c).then(function(a){return a})}getTicketsDetails(a){let c={};return requester.get(API+`/GetTicketDetails?id=${a}`).then(a=>{let b=new Date;let d=new Date(a.createDate);let e=moment(b).preciseDiff(d);c.diffDate=e;0===a.taskState?c.state="ToDo":1===a.taskState?c.state="In Progress":(c.state="Done",c.done="done");""===a.assignee?c.assignee="Unassigned":c.assignee=a.assignee;c.details=a;c.details.comments.forEach(a=>{a.dateDiff=moment(b).preciseDiff(a.createdOn)});c.comments=a.comments.length}),c}addTicket(a,b,c,d,e){const f={categoryId:d,title:a,priority:Number(c),screenshotUrl:"",description:b,parentTicket_Id:e||0};let g=localStorage.getItem(LOCAL_STORAGE_AUTHKEY_KEY),h={Authorization:"Bearer "+g};return requester.post(API+"/CreateTicket",f,h)}assigneeUserToTask(a,b){const c={id:a,userId:b};return requester.post(API+`/AssigneeUserToTask?Id=${a}&UserId=${b}`,c).then(function(a){return a})}deleteTicket(a){const b={ticketId:a};return requester.post(API+`/DeleteTicket?ticketId=${a}`,b).then(function(a){return a})}addComment(a,b){const c={ticketId:a,content:b};let d=localStorage.getItem(LOCAL_STORAGE_AUTHKEY_KEY),e={Authorization:"Bearer "+d};return requester.post(API+"/AddCommentToTicket",c,e).then(function(a){return a})}getTicketForCurrentUser(){let a=localStorage.getItem(LOCAL_STORAGE_AUTHKEY_KEY),b={Authorization:"Bearer "+a};return requester.get(API+"/GetTicketsForCurrentUser",b).then(function(a){return a})}deleteComment(a){const b={commentId:a};return requester.post(API+`/DeleteComment?commentId=${a}`,b).then(function(a){return a})}searchTickets(a){let c={ticket:[]};return requester.get(API+`/FindTiketsByTitle/${a}`).then(a=>{a.forEach(a=>{c.ticket.push(a)})}),c}}export{TicketsModel};