'use strict';
 import { requester } from 'requester';
// var requester = require('requester');

describe('Test Requester', function() {

 let jsonRequesterStub;
    
    

      beforeEach(() => {
        jsonRequesterStub = sinon.stub(requester, 'request');
       
      });
      afterEach(() => {
        jsonRequesterStub.restore();
        
      });

         it('expect post to make post request', (done) => {
             
        const user = {
          username: 'testuser',
          password: '123456'
        };

        const response = {
          result: {
            username: user.username,
            authKey: 'SOME_AUTH_KEY'
          }
        }

        jsonRequesterStub.returns(Promise.resolve(response));

        requester.register(user)
          .then(() => {
            expect(jsonRequesterStub).to.have.been.calledOnce;
          })
          .then(done, done);
      });

	
});

