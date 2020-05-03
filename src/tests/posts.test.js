import axios from 'axios';
import { getPosts, savePost } from '../api/posts';

describe('posts api tests', () => {
  const userId = 'beverlyhills90210';

  afterEach(() => {
    axios.get.mockClear();
    axios.post.mockClear();
  });

  describe('getPosts', () => {
    const endpoint = `/api/posts/${userId}`;

    it('fetches posts of a specific user', done => {
      getPosts(userId);
      expect(axios.get).toHaveBeenCalledWith(endpoint);
      done();
    });

    it('returns the array of posts sent by the server', async () => {
      const fakePosts = [ { postContent: 'hola test', userId } ];
      axios.get.mockResolvedValue(
        { status: 200, data: fakePosts }
      );

      const result = await getPosts(userId);
      expect(result).toEqual(fakePosts);
    });

    it('returns the error message from the server', async () => {
      const error = { message: 'some error' };
      axios.get.mockRejectedValue({ status: 500, error });
      const result = await getPosts(userId);
      expect(result).toEqual(error);
    });
  });

  describe('savePost', () => {
    const endpoint = `/api/post`;

    it('sends the post content and userId via the api', done => {
      const post = 'my first sony';
      savePost(userId, post);
      expect(axios.post).toHaveBeenCalledWith(endpoint, { post, userId });
      done();
    });
  
    it('returns the error message from the server', async () => {
      const errObj = { error: 'mal'};
      axios.post.mockRejectedValue(errObj);
      const result = await savePost(userId, 'mymymy');
      expect(result).toEqual(errObj.error);
    });
  });
})
