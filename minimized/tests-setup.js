"use strict";import{requester}from"requester";import{UserModel}from"userModel";import{TicketsModel}from"ticketsModel";import{CategoryModel}from"categoryModel";mocha.setup("bdd");let expect=chai.expect,assert=chai.assert,userModel=new UserModel,ticketsModel=new TicketsModel,categoryModel=new CategoryModel,spyFunction=sinon.spy();chai.should();const response={result:{username:"test",authKey:"SOME_AUTH_KEY"}};describe("Test Requester and models",function(){let a,b,c;beforeEach(()=>{a=sinon.stub(requester,"post");b=sinon.stub(requester,"get");c=sinon.stub(requester,"put")}),afterEach(()=>{a.restore();b.restore();c.restore()}),it("expect post to make post request",b=>{a.returns(Promise.resolve(response));requester.post("",{}).then(()=>{expect(a).to.have.been.calledOnce}).then(b,b)}),it("expect get to make get request",a=>{b.returns(Promise.resolve(response));requester.get("").then(()=>{expect(b).to.have.been.calledOnce}).then(a,a)}),it("expect put to make put request",a=>{c.returns(Promise.resolve(response));requester.put("",{}).then(()=>{expect(c).to.have.been.calledOnce}).then(a,a)}),describe("Test user model",function(){it("expect User model register to call post request",b=>{a.returns(Promise.resolve(response));userModel.register().then(()=>{expect(a).to.have.been.calledOnce}).then(b,b)}),it("expect User model getUsers to call get ",a=>{b.returns(Promise.resolve([]));userModel.getUsers();expect(b).to.have.been.calledOnce;a()}),it("expect User model getUsers to return list of users ",a=>{const c=[{username:"test",authKey:"SOME_AUTH_KEY"},{username:"test2",authKey:"SOME_AUTH_KEY"}];b.returns(Promise.resolve(c));var d=userModel.getUsers();expect(d.user.length).to.equal(0);setTimeout(()=>{expect(d.user.length).to.equal(2)},1e3);a()}),it("expect User model getUser to call get ",a=>{b.returns(Promise.resolve([]));userModel.getUser();expect(b).to.have.been.calledOnce;a()}),it("expect User model getUser to return user ",a=>{const c=[{username:"test",authKey:"SOME_AUTH_KEY"},{username:"test2",authKey:"SOME_AUTH_KEY"}];b.returns(Promise.resolve(c));var d=userModel.getUser();expect(d.data.length).to.equal(0);setTimeout(()=>{expect(d.data.length).to.equal(2)},1e3);a()})}),describe("Test tickets model",function(){it("expect Ticket model getTickets to call get request",a=>{b.returns(Promise.resolve([]));ticketsModel.getTickets();expect(b).to.have.been.calledOnce;a()}),it("expect Ticket model getTickets to return tickets separated in groups ",a=>{const c=[{taskState:0},{taskState:1},{taskState:2},{taskState:0}];b.returns(Promise.resolve(c));var d=ticketsModel.getTickets();expect(d.todo.length).to.equal(0);expect(d.progress.length).to.equal(0);expect(d.done.length).to.equal(0);setTimeout(()=>{expect(d.todo.length).to.equal(2);expect(d.progress.length).to.equal(1);expect(d.todo.length).to.equal(1)},1e3);a()}),it("expect Ticket model changeState to make post request",b=>{a.returns(Promise.resolve({}));ticketsModel.changeState();expect(a).to.have.been.calledOnce;b()}),it("expect Ticket model getTicketsDetails to call get request",a=>{b.returns(Promise.resolve([]));ticketsModel.getTicketsDetails();expect(b).to.have.been.calledOnce;a()}),it("expect Ticket model getTicketsDetails to return details",a=>{var c={createDate:(new Date).getDate(),taskState:0,assignee:""};b.returns(Promise.resolve(c));var d=ticketsModel.getTicketsDetails();setTimeout(()=>{expect(d.state).to.equal("ToDo");expect(d.assignee).to.equal("Unassigned")},1e3);a()}),it("expect Ticket model addTicket to make post request",b=>{a.returns(Promise.resolve({}));ticketsModel.addTicket().then(()=>{expect(a).to.have.been.calledOnce}).then(b,b)}),it("expect Ticket model assigneeUserToTask to make post request",b=>{a.returns(Promise.resolve({}));ticketsModel.addTicket();expect(a).to.have.been.calledOnce;b()}),it("expect Ticket model assigneeUserToTask to return response",b=>{var c={assignee:"Gosho"};a.returns(Promise.resolve(c));var d=ticketsModel.addTicket();expect(a).to.have.been.calledOnce;setTimeout(()=>{expect(d.assignee).to.equal("Gosho")},1e3);b()}),it("expect Ticket model deleteTicket to make post request",b=>{a.returns(Promise.resolve({}));ticketsModel.deleteTicket();expect(a).to.have.been.calledOnce;b()}),it("expect Ticket model deleteTicket to return response",b=>{var c={id:1};a.returns(Promise.resolve(c));var d=ticketsModel.addTicket();expect(a).to.have.been.calledOnce;setTimeout(()=>{expect(d.id).to.equal(1)},1e3);b()}),it("expect Ticket model addComment to make post request",b=>{a.returns(Promise.resolve({}));ticketsModel.addComment();expect(a).to.have.been.calledOnce;b()}),it("expect Ticket model addComment to return response",b=>{var c={content:"commenting"};a.returns(Promise.resolve(c));var d=ticketsModel.addTicket();expect(a).to.have.been.calledOnce;setTimeout(()=>{expect(d.content).to.equal("commenting")},1e3);b()})}),describe("Test category model",function(){it("expect Category model getCategories to call get request",a=>{b.returns(Promise.resolve([]));categoryModel.getCategories();expect(b).to.have.been.calledOnce;a()})})}),mocha.run();