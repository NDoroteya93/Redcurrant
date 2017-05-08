
'use strict'
import { requester } from 'requester';
import { UserModel } from 'userModel';

mocha.setup('bdd');

let expect = chai.expect;
let assert = chai.assert;

let userModel = new UserModel;
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

});

mocha.run();