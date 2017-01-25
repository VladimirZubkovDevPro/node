const path = require('path');
const root = path.join(__dirname, '..', '..', '..');
const fs = require('fs');
const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const superagent = require('superagent');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const cloud = require('../../cloudClient');

const stubAgentMethods = ['auth', 'type', 'on', 'attach'];
const VALID_FILE_PATH = `${root}/README.md`;
const INVALID_FILE_PATH = `${root}/README123.md`;
const VALID_FILE_SIZE = fs.statSync(path.resolve(VALID_FILE_PATH)).size;
const VALID_USER = 'qwe';
const VALID_PASSWORD = 'securepass';
const NO_FILE_ERROR_PART = 'ENOENT: no such file or directory';
const STUB_SERVER_RESPONSE = 'ok';
const STUB_SERVER_DUPLICATED_RESPONSE = { duplicate: true };


describe('Upload unit', function() {

  let postRequest;
  let PostStub;
  let PostDuplicateStub;

  before(function() {
    postRequest = sinon.stub(superagent, 'post');

    PostStub = function() {
      stubAgentMethods.map(method => this[method] = () => this);
      this.set = () => STUB_SERVER_RESPONSE;
    };

    PostDuplicateStub = function() {
      stubAgentMethods.map(method => this[method] = () => this);
      this.set = () => STUB_SERVER_DUPLICATED_RESPONSE;
    };
  });

  after(function() {
    postRequest.restore();
  });

  beforeEach(function() {
    sinon.spy(console, 'log');
  });

  afterEach(function() {
    console.log.restore();
  });


  it('should give error if file doesnt exist', function() {
    return cloud.upload(INVALID_FILE_PATH)
      .then(result => {
        return Promise.reject('Got success result' + result);
      })
      .catch(function(err) {
        return expect(err.message.includes(NO_FILE_ERROR_PART)).to.equal(true);
      });
  });


  it('should return result of the cloud response', function() {
    postRequest.returns(new PostStub());

    return cloud.upload(VALID_FILE_PATH, VALID_USER, VALID_PASSWORD)
      .then(function(result) {
        return Promise.all([
          expect(result).to.equal(STUB_SERVER_RESPONSE),
          expect(console.log).to.be.calledWith(
            'Trying to sync file', VALID_FILE_PATH, 'with size', VALID_FILE_SIZE
          )
        ]);
      });
  });


  it('should return result of the cloud response with duplicate', function() {
    postRequest.returns(new PostDuplicateStub());

    return cloud.upload(VALID_FILE_PATH, VALID_USER, VALID_PASSWORD)
      .then(function(result) {
        return Promise.all([
          expect(result).to.equal(STUB_SERVER_DUPLICATED_RESPONSE),
          expect(console.log).to.be.calledWith(
            'Trying to sync file', VALID_FILE_PATH, 'with size', VALID_FILE_SIZE
          )
        ]);
      });
  });

});
