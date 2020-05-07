/* eslint-disable no-console */
const dotenv = require('dotenv');
const { db, Timestamp } = require('./firestoreInit');


if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

// would maybe use a converter...
const convertDateToTimestamp = (date) => Timestamp.fromMillis(date);

async function getUser(username, password) {
  try {
    const snapshot = await db.collection('users')
      .where('username', '==', username)
      .where('password', '==', password)
      .get();
    if (snapshot.empty) {
      return;
    }
    const doc = snapshot.docs[0];
    // eslint-disable-next-line consistent-return
    return Object.assign(doc.data(), { id: doc.id });
  } catch (err) {
    console.log('error getting user from store', err);
  }
}

const getPostsForUser = (userId) =>
  db.collection('posts')
    .where('userId', '==', userId)
    .orderBy('postedDate', 'desc')
    .get()
    .then((snapshot) =>
      snapshot.docs.map((doc) => {
        const data = doc.data();
        data.postedDate = data.postedDate.toMillis();
        return { id: doc.id, ...data };
      }))
    .catch((err) => {
      console.log(`error getting posts for user ${userId}`, err);
      return [];
    });

const createPost = (postObject) => {
  const newPost = { ...postObject, postedDate: convertDateToTimestamp(postObject.postedDate) };
  return db.collection('posts').add(newPost)
    .then((docRef) => docRef.id)
    .catch((err) => {
      console.log('error creating post in store', err);
    });
};

async function updatePost(postId, update) {
  const postsRef = db.collection('posts');
  try {
    const doc = await postsRef.where('postId', '==', postId).get()[0];
    const updatedDoc = Object.assign(doc.data(), update);
    postsRef.doc(doc.id).set(updatedDoc, { merge: true })
      .then((res) => {
        console.log('doc updated successfully', res);
        return res;
      })
      .catch((err) => {
        console.log('error updating post in store', err);
      });
  } catch (err) {
    console.log('error finding post in store', err);
  }
}

async function deletePost(postId) {
  try {
    await db.collection('posts').doc(postId).delete();
  } catch (err) {
    console.log('error deleting post', postId, err);
  }
}

module.exports = {
  getUser,
  getPostsForUser,
  updatePost,
  createPost,
  deletePost
};
