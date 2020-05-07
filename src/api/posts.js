import axios from 'axios';
import { getAuthToken } from './auth';

let axiosInstance;

const instance = () => {
  if (axiosInstance) {
    return axiosInstance;
  }
  axiosInstance = axios.create({
    headers: { Authorization: `Bearer ${getAuthToken()}` }
  });
  return axiosInstance;
};

export const getPosts = (userId) =>
  instance().get(`/api/posts/${userId}`)
    .then((resp) => resp.data)
    .catch((resp) => resp.error);

export const savePost = (userId, postContent) =>
  instance().post('/api/post', { post: postContent, userId })
    .then((resp) => resp.data)
    .catch((resp) => resp.error);

export const editPost = (userId, postId, postContent) =>
  instance().put('/api/post', { post: postContent, userId, postId })
    .then((resp) => resp.data)
    .catch((resp) => resp.error);

export const deletePost = (userId, postId) =>
  instance().delete(`/api/post/${postId}/${userId}`)
    .then((resp) => resp.data)
    .catch((resp) => resp.error);
