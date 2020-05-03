import axios from 'axios';
import { getAuthToken } from './auth';

const instance = axios.create({
  headers: { Authorization: `Bearer ${getAuthToken()}`}
});

export const getPosts = (userId) => 
  instance.get(`/api/posts/${userId}`)
    .then((resp) => {
      console.log(resp.data);
      return resp.data;
    });


export const savePost = (userId, postContent) =>
  instance.post('/api/post', { post: postContent, userId })
    .then((resp) => {
      console.log(resp.data);
    });
