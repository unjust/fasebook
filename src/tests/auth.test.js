import { 
  accessTokenSecret,
  tokenSessionStorageKey,
  authenticateUser,
  validateUserToken } from '../auth';
import jwt from 'jsonwebtoken';

describe.only('auth', () => {

  afterAll(() => {
    sessionStorage.clear();
  });

  describe('validateUserToken', () => {
    it('returns true if there is a valid token', () => {
      const dummyToken = jwt.sign({ username: 'testuser'}, accessTokenSecret);
      sessionStorage.setItem(tokenSessionStorageKey, dummyToken);
      expect(validateUserToken()).toBe(true);
    });

    it('returns false if no token is found', () => {
      expect(validateUserToken()).toBe(false);
    });

    it('returns false if token is invalid', () => {
      sessionStorage.setItem(tokenSessionStorageKey, 'notarealtoken310');
      expect(validateUserToken()).toBe(false);
    });
  })
})
