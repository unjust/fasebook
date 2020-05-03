import { 
  accessTokenSecret,
  tokenSessionStorageKey,
  authenticateUser,
  authData,
  validateUserToken } from '../api/auth';
import jwt from 'jsonwebtoken';
import axios from 'axios';

describe('auth module tests', () => {

  describe('validateUserToken', () => {

    afterEach(() => {
      sessionStorage.clear()
    });

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
  });

  describe('authenticateUser', () => {
    const username = 'Ivy';
    const password = 'password';

    afterEach(() => {
      axios.post.mockReset();
    });

    it('calls the auth api with the appropriate params', done => {
      authenticateUser(username, password);
      expect(axios.post).toHaveBeenCalledWith('/api/auth', { username, password });
      done();
    });

    it('stores the userId and accessToken', async () => {
      const data = {
        userId: 'supercalafragileist',
        accessToken: 'erdamusahcnocal'
      };
      const storeDataSpy = jest.spyOn(authData, 'store');
      axios.post.mockResolvedValue({ data });
      await authenticateUser(username, password);
      expect(storeDataSpy).toHaveBeenCalledWith(
        data.userId, data.accessToken
      );
    });
  });
})
