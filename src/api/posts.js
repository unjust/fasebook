import axios from 'axios';
import { getAuthToken } from './auth';

export const instance = axios.create({
  headers: { Authorization: `Bearer ${getAuthToken()}`}
});

export const getPosts = (userId) =>
  instance.get(`/api/posts/${userId}`)
    .then((resp) => {
      // console.log(resp.data);
      return resp.data;
    }).catch((resp) => {
      // console.log(resp.error);
      return resp.error;
    });


export const savePost = (userId, postContent) =>
  instance.post('/api/post', { post: postContent, userId })
    .then((resp) => {
      // console.log('data', resp.data);
      return resp.data;
    }).catch((resp) => {
      // ßconsole.log('err', resp.error);
      return resp.error;
    });
