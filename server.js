/* eslint-disable no-console */
const express = require('express');
const jwt = require('jsonwebtoken');
const jwtMiddleware = require('express-jwt');
const bodyParser = require('body-parser');
const path = require('path');
const dotenv = require('dotenv');

const {
  createPost,
  getPostsForUser,
  updatePost,
  deletePost,
  getUser
} = require('./db/databaseFunctions');


if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const app = express();

app.use(bodyParser.json());


if (process.env.NODE_ENV === 'production') {
  const buildDir = path.join(process.cwd(), 'build');
  app.use(express.static(buildDir));

  const indexPath = path.join(buildDir, 'index.html');
  app.get(/^((?!api).)*$/, (req, res) => {
    res.sendFile(indexPath);
  });
}

const port = process.env.PORT || 8080;
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log('Server is up!');
});

const isUserInToken = (req, userId) => req.user && req.user.id === userId;

app.post('/api/auth', (req, resp) => {
  const { username, password } = req.body;
  getUser(username, password)
    .then((user) => {
      if (user) {
        const { id } = user;
        const accessToken = jwt.sign({ id }, accessTokenSecret);
        resp.json({ userId: id, accessToken });
      } else {
        resp.json({ error: 'username or password incorrect' });
      }
    })
    .catch((err) => console.log('error with auth attempt', err));
});

app.get('/api/posts/:userId',
  jwtMiddleware({ secret: accessTokenSecret }),
  (req, resp) => {
    const { userId } = req.params;
    if (req.user && userId) {
      getPostsForUser(userId)
        .then((docs) => {
          resp.send(docs);
        })
        .catch((err) => console.log('error getting posts', err));
    } else {
      resp.sendStatus(401);
    }
  });

app.post('/api/post',
  jwtMiddleware({ secret: accessTokenSecret }),
  (req, resp) => {
    const { post, userId } = req.body;
    if (isUserInToken(req, userId)) {
      const newPost = {
        post,
        postedDate: Date.now(),
        userId
      };
      createPost(newPost)
        .then((id) => {
          resp.status(200).send({ id, ...newPost });
        })
        .catch((err) => console.log(err));
    }
  });

app.put('/api/post',
  jwtMiddleware({ secret: accessTokenSecret }),
  (req, resp) => {
    const { post, userId, postId } = req.body;
    if (isUserInToken(req, userId)) {
      const editDate = Date.now();
      updatePost(postId, { post, editDate })
        .then(() => resp.status(200).send({ post }));
    } else {
      resp.status(401);
    }
  });

app.delete('/api/post/:postId/:userId',
  jwtMiddleware({ secret: accessTokenSecret }),
  (req, resp) => {
    const { postId, userId } = req.params;
    if (isUserInToken(req, userId)) {
      deletePost(postId)
        .then(() => {
          resp.sendStatus(200);
        })
        .catch((err) => {
          console.log('there was an err', err);
        });
    } else {
      resp.sendStatus(401);
    }
  });

module.exports = {
  app
};
