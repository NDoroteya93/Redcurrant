
'use strict'
import { requester } from 'requester';
import { UserModel } from 'userModel';
import { TicketsModel } from 'ticketsModel';

mocha.setup('bdd');

let expect = chai.expect;
let assert = chai.assert;

let userModel = new UserModel;
let ticketsModel = new TicketsModel;
//let sinon = require('sinon');
let spyFunction = sinon.spy();


chai.should();

const response = {
    result: {
        username: "test",
        authKey: 'SOME_AUTH_KEY'
    }
};

describe('Test Requester and models', function () {
    //  this.timeout(15000);

    let jsonRequesterPostStub;
    let jsonRequesterGetStub;
    let jsonRequesterPutStub;

    beforeEach(() => {
        jsonRequesterPostStub = sinon.stub(requester, 'post');
        jsonRequesterGetStub = sinon.stub(requester, 'get');
        jsonRequesterPutStub = sinon.stub(requester, 'put');

    });
    afterEach(() => {
        jsonRequesterPostStub.restore();
        jsonRequesterGetStub.restore();
        jsonRequesterPutStub.restore();
    });

    it('expect post to make post request', (done) => {


        jsonRequesterPostStub.returns(Promise.resolve(response));

        requester.post("", {})
            .then(() => {
                expect(jsonRequesterPostStub).to.have.been.calledOnce;
            })
            .then(done, done);
    });

    it('expect get to make get request', (done) => {


        jsonRequesterGetStub.returns(Promise.resolve(response));

        requester.get("")
            .then(() => {
                expect(jsonRequesterGetStub).to.have.been.calledOnce;
            })
            .then(done, done);
    });

    it('expect put to make put request', (done) => {


        jsonRequesterPutStub.returns(Promise.resolve(response));

        requester.put("", {})
            .then(() => {
                expect(jsonRequesterPutStub).to.have.been.calledOnce;
            })
            .then(done, done);
    });


    describe('Test user model', function () {



        it('expect User model register to call post request', (done) => {


            jsonRequesterPostStub.returns(Promise.resolve(response));

            userModel.register()
                .then(() => {
                    expect(jsonRequesterPostStub).to.have.been.calledOnce;
                })
                .then(done, done);
        });

        it('expect User model getUsers to call get ', (done) => {

            jsonRequesterGetStub.returns(Promise.resolve([]));

            var result = userModel.getUsers();
            expect(jsonRequesterGetStub).to.have.been.calledOnce;
            done();



        });

        it('expect User model getUsers to return list of users ', (done) => {

            const responseUsers =
                [{
                    username: "test",
                    authKey: 'SOME_AUTH_KEY'
                }, {
                    username: "test2",
                    authKey: 'SOME_AUTH_KEY'
                }];

            jsonRequesterGetStub.returns(Promise.resolve(responseUsers));

            var result = userModel.getUsers();


            expect(result.user.length).to.equal(0);
            setTimeout(() => {
                expect(result.user.length).to.equal(2);
            }, 1000)

            done();



        });

        it('expect User model getUser to call get ', (done) => {

            jsonRequesterGetStub.returns(Promise.resolve([]));

            var result = userModel.getUser();
            expect(jsonRequesterGetStub).to.have.been.calledOnce;

            done();

        });

        it('expect User model getUser to return user ', (done) => {

            const responseUsers =
                [{
                    username: "test",
                    authKey: 'SOME_AUTH_KEY'
                }, {
                    username: "test2",
                    authKey: 'SOME_AUTH_KEY'
                }];

            jsonRequesterGetStub.returns(Promise.resolve(responseUsers));

            var result = userModel.getUser();


            expect(result.data.length).to.equal(0);
            setTimeout(() => {
                expect(result.data.length).to.equal(2);
            }, 1000)

            done();



        });


    });


    describe('Test tickets model', function () {

        it('expect Ticket model getTickets to call get request', (done) => {


            jsonRequesterGetStub.returns(Promise.resolve([]));

            var result = ticketsModel.getTickets();
            expect(jsonRequesterGetStub).to.have.been.calledOnce;

            done();
        });

        it('expect Ticket model getTickets to return tickets separated in groups ', (done) => {

            const responseTasks =
                [{
                    taskState: 0
                },
                {
                    taskState: 1
                },
                {
                    taskState: 2
                },
                {
                    taskState: 0
                }
                ];

            jsonRequesterGetStub.returns(Promise.resolve(responseTasks));

            var result = ticketsModel.getTickets();


            expect(result.todo.length).to.equal(0);
            expect(result.progress.length).to.equal(0);
            expect(result.done.length).to.equal(0);

            setTimeout(() => {
                expect(result.todo.length).to.equal(2);
                expect(result.progress.length).to.equal(1);
                expect(result.todo.length).to.equal(1);
            }, 1000)

            done();



        });

        it('expect Ticket model changeState to make post request', (done) => {


            jsonRequesterPostStub.returns(Promise.resolve({}));

            var result = ticketsModel.changeState();
            expect(jsonRequesterPostStub).to.have.been.calledOnce;

            done();
        });


        it('expect Ticket model getTicketsDetails to call get request', (done) => {


            jsonRequesterGetStub.returns(Promise.resolve([]));

            var result = ticketsModel.getTicketsDetails();
            expect(jsonRequesterGetStub).to.have.been.calledOnce;

            done();
        });

        it('expect Ticket model getTicketsDetails to return details', (done) => {

            var res = {
                createDate: new Date().getDate(),
                taskState: 0,
                assignee: ''
            };

            jsonRequesterGetStub.returns(Promise.resolve(res));

            var result = ticketsModel.getTicketsDetails();

            setTimeout(() => {
                expect(result.state).to.equal("ToDo");
                expect(result.assignee).to.equal("Unassigned");

            }, 1000);

            done();
        });

        it('expect Ticket model addTicket to make post request', (done) => {



            jsonRequesterPostStub.returns(Promise.resolve({}));

            var result = ticketsModel.addTicket().then(() =>
            { expect(jsonRequesterPostStub).to.have.been.calledOnce; }

            ).then(done, done);


        });

        it('expect Ticket model assigneeUserToTask to make post request', (done) => {



            jsonRequesterPostStub.returns(Promise.resolve({}));

            var result = ticketsModel.addTicket();
            expect(jsonRequesterPostStub).to.have.been.calledOnce;

            done();


        });

        it('expect Ticket model assigneeUserToTask to return response', (done) => {

            var res = { assignee: "Gosho" }

            jsonRequesterPostStub.returns(Promise.resolve(res));

            var result = ticketsModel.addTicket();
            expect(jsonRequesterPostStub).to.have.been.calledOnce;

            setTimeout(() => {

                expect(result.assignee).to.equal("Gosho");

            }, 1000);

            done();


        });

        it('expect Ticket model deleteTicket to make post request', (done) => {



            jsonRequesterPostStub.returns(Promise.resolve({}));

            var result = ticketsModel.deleteTicket();
            expect(jsonRequesterPostStub).to.have.been.calledOnce;

            done();


        });

        it('expect Ticket model deleteTicket to return response', (done) => {

            var res = { id: 1 }

            jsonRequesterPostStub.returns(Promise.resolve(res));

            var result = ticketsModel.addTicket();
            expect(jsonRequesterPostStub).to.have.been.calledOnce;

            setTimeout(() => {

                expect(result.id).to.equal(1);

            }, 1000);

            done();


        });

        it('expect Ticket model addComment to make post request', (done) => {



            jsonRequesterPostStub.returns(Promise.resolve({}));

            var result = ticketsModel.addComment();
            expect(jsonRequesterPostStub).to.have.been.calledOnce;

            done();


        });

        it('expect Ticket model addComment to return response', (done) => {

            var res = { content: "commenting" }

            jsonRequesterPostStub.returns(Promise.resolve(res));

            var result = ticketsModel.addTicket();
            expect(jsonRequesterPostStub).to.have.been.calledOnce;

            setTimeout(() => {

                expect(result.content).to.equal("commenting");

            }, 1000);

            done();


        });




    });

});

mocha.run();