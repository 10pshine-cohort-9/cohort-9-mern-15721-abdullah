const { expect } = require('chai');
const sinon = require('sinon');
const jwt = require('jsonwebtoken');
const { verifyToken } = require('../../src/middleware/auth.middleware');

describe('Auth Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = { headers: {} };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub()
    };
    next = sinon.spy();
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should return 401 if no authorization header is present', () => {
    verifyToken(req, res, next);
    expect(res.status.calledWith(401)).to.be.true;
    expect(res.json.calledWith({ error: 'Access denied. No token provided.' })).to.be.true;
    expect(next.called).to.be.false;
  });

  it('should return 401 if token is invalid', () => {
    req.headers.authorization = 'Bearer invalidtoken';
    sinon.stub(jwt, 'verify').throws(new Error('Invalid token'));

    verifyToken(req, res, next);
    expect(res.status.calledWith(401)).to.be.true;
    expect(res.json.calledWith({ error: 'Invalid or expired token.' })).to.be.true;
    expect(next.called).to.be.false;
  });

  it('should call next and set req.user if token is valid', () => {
    req.headers.authorization = 'Bearer validtoken';
    const decodedPayload = { userId: '123' };
    sinon.stub(jwt, 'verify').returns(decodedPayload);

    verifyToken(req, res, next);
    expect(req.user).to.deep.equal(decodedPayload);
    expect(next.calledOnce).to.be.true;
  });
});
