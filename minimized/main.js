"use strict";import{Router}from"router";import{HomeController}from"homeController";import{TicketsController}from"ticketsController";import{UserController}from"userController";const tickets=new TicketsController,home=new HomeController,users=new UserController;home.initHome();let router=new Navigo("#/home",!0);router.on(home.initHome()).resolve(),router.on({"#/learn":function(){$("body").animate({scrollTop:document.body.scrollHeight},500)},"#/tickets":function(){tickets.ticketTemplate(),tickets.initEvents()},"#/tickets/details/:id":function(a){tickets.loadDetailsTemplate(a.id)},"#/tickets/comments":function(){},"#/tickets/add/:action":function(a){let b=a.id;tickets.addTicket(b)},"#/FindTiketsByTitle/:title":function(a){let b=a.title;tickets.searchTicketByTitle(b)},"#/register":function(){users.loadTemplate("user-register")},"#/register/submit":function(){users.register()},"#/admin":function(){users.viewUserProfile()},"#/admin/users":function(){users.allUsers()},"#/admin/alltickets":function(){tickets.allTickets()},"#/user/:username":function(){users.getUser()},"#/admin/configuration":function(){users.changePass()},"#/admin/categories":function(){users.getCategories()},"*":function(){home.loadTemplate()}}).resolve();