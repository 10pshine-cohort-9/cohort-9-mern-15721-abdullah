const { expect } = require('chai');
const sinon = require('sinon');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Mock Prisma DB module before requiring controller
const prismaMock = {
  user: {
    findUnique: () => {},
    create: () => {}
  }
};
require.cache[require.resolve('../../src/db')] = {
  id: require.resolve('../../src/db'),
  filename: require.resolve('../../src/db'),
  loaded: true,
  exports: prismaMock
};

const authController = require('../../src/controllers/auth.controller');

describe('Auth Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub()
    };
    next = sinon.spy();
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('register', () => {
    it('should return 400 if email or password is missing', async () => {
      try {
        await authController.register(req, res, next);
        expect(res.status.calledWith(400)).to.be.true;
        expect(res.json.calledWith({ error: 'Email and password are required' })).to.be.true;
      } catch (err) {
        expect.fail('Unexpected error: ' + err.message);
      }
    });

    it('should return 409 if email already exists', async () => {
      req.body = { email: 'test@example.com', password: 'password123' };
      sinon.stub(prismaMock.user, 'findUnique').resolves({ id: '1' });

      try {
        await authController.register(req, res, next);
        expect(res.status.calledWith(409)).to.be.true;
        expect(res.json.calledWith({ error: 'Email already exists' })).to.be.true;
      } catch (err) {
        expect.fail('Unexpected error: ' + err.message);
      }
    });

    it('should successfully register a user and return 201', async () => {
      req.body = { email: 'test@example.com', password: 'password123', name: 'Test' };
      sinon.stub(prismaMock.user, 'findUnique').resolves(null);
      sinon.stub(bcrypt, 'genSalt').resolves('salt');
      sinon.stub(bcrypt, 'hash').resolves('hashedpassword');
      sinon.stub(prismaMock.user, 'create').resolves({ id: '1', email: 'test@example.com', name: 'Test' });
      sinon.stub(jwt, 'sign').returns('valid.jwt.token');

      try {
        await authController.register(req, res, next);
        expect(res.status.calledWith(201)).to.be.true;
        expect(res.json.calledWithMatch({ message: 'User registered successfully', token: 'valid.jwt.token', user: { id: '1' } })).to.be.true;
      } catch (err) {
        expect.fail('Unexpected error: ' + err.message);
      }
    });
  });

  describe('login', () => {
    it('should return 401 for invalid credentials (user not found)', async () => {
      req.body = { email: 'wrong@example.com', password: 'password123' };
      sinon.stub(prismaMock.user, 'findUnique').resolves(null);

      try {
        await authController.login(req, res, next);
        expect(res.status.calledWith(401)).to.be.true;
      } catch (err) {
        expect.fail('Unexpected error: ' + err.message);
      }
    });

    it('should return 200 and a token for valid credentials', async () => {
      req.body = { email: 'test@example.com', password: 'password123' };
      sinon.stub(prismaMock.user, 'findUnique').resolves({ id: '1', email: 'test@example.com', passwordHash: 'hashed' });
      sinon.stub(bcrypt, 'compare').resolves(true);
      sinon.stub(jwt, 'sign').returns('valid.jwt.token');

      try {
        await authController.login(req, res, next);
        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.calledWithMatch({ token: 'valid.jwt.token' })).to.be.true;
      } catch (err) {
        expect.fail('Unexpected error: ' + err.message);
      }
    });
  });
});
