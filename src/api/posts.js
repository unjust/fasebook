import axios from 'axios';
import { getAuthToken } from './auth';

let axiosInstance;

const instance = () => 
  (axiosInstance) ? axiosInstance :
    axiosInstance = axios.create({
      headers: { Authorization: `Bearer ${getAuthToken()}`}
    });

export const getPosts = (userId) => 
  instance().get(`/api/posts/${userId}`)
    .then((resp) => {
      return resp.data;
    }).catch((resp) => {
      // console.log(resp.error);
      return resp.error;
    });

export const savePost = (userId, postContent) =>
  instance().post('/api/post', { post: postContent, userId })
    .then((resp) => {
      return resp.data;
    }).catch((resp) => {
      return resp.error;
    });

export const editPost = (userId, postId, postContent) =>
  instance().put('/api/post', { post: postContent, userId, postId })
    .then((resp) => {
      return resp.data;
    }).catch((resp) => {
      return resp.error;
    });

export const deletePost = (userId, postId) =>
  instance().delete(`/api/post/${postId}/${userId}`)
    .then((resp) => {
      return resp.data;
    }).catch((resp) => {
      return resp.error;
    });

