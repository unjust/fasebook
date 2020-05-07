const firebase = require('firebase');
require ('firebase/firestore');
require ('firebase/functions');

if (process.env.NODE_ENV !== 'production') {
  const dotenv = require('dotenv');
  dotenv.config();
}

const config = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.DB_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSENGING_ID,
  appId: process.env.FIREBASE_APP_ID
};

firebase.initializeApp(config);
const db = firebase.firestore();
const functions = firebase.functions();

module.exports = {
  db,
  functions,
  Timestamp: firebase.firestore.Timestamp
} 


