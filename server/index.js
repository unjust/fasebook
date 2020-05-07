const express = require('express');
const jwt = require('jsonwebtoken');
const jwtMiddleware = require('express-jwt');
const bodyParser = require('body-parser');
const path = require('path');

const { 
  createPost,
  getPostsForUser, 
  updatePost,
  deletePost,
  getUser
} = require('./dbUtils-firebase');

const app = express();

if (process.env.NODE_ENV !== 'production') {
  const dotenv = require('dotenv');
  dotenv.config();
}
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

app.use(bodyParser.json());

// if (process.env.NODE_ENV !== 'production') {
//   const publicPath = path.join(__dirname, '..', 'build');
//   console.log(publicPath);
//   app.use(express.static(publicPath));
//   console.log(publicPath);
//   app.get('*', (req, res) => {
//     res.sendFile(path.join(publicPath, 'index.html'));
//   });
// }

// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(__dirname));
//   app.use(express.static(path.join(__dirname, 'build')));
 
//   app.get('/*', function (req, res) {
//     res.sendFile(path.join(__dirname, 'build', 'index.html'));
//   });
// }

const port = process.env.PORT || 8080;
app.listen(port, () => {
   console.log('Server is up!');
});

const isUserInToken = (req, userId) => req.user && req.user.id === userId;

app.post('/api/auth', function(req, resp) {
  const { username, password } = req.body;
  getUser(username, password)
    .then((user) => {
      console.log(user);
      if (user) {
        const { id } = user;
        const accessToken = jwt.sign( { id }, accessTokenSecret);
        resp.json({ userId: id, accessToken });
      } else {
        resp.json({ error: 'username or password incorrect'});
      }
    })
    .catch((err) => console.log('error with auth attempt', err));
});

app.get('/api/posts/:userId', 
  jwtMiddleware( { secret: accessTokenSecret }),
  function(req, resp) {
    const { userId } = req.params;
    if (req.user && userId) {
      getPostsForUser(userId).then((docs) => {
        resp.send(docs);
      })
      .catch((err) => console.log('error getting posts', err));
    } else {
      resp.sendStatus(401);
    }
  }
);

app.post('/api/post', 
  jwtMiddleware( { secret: accessTokenSecret }),
  function(req, resp) {
    const { post, userId } = req.body;
    if (isUserInToken(req, userId)) {
      const newPost = { 
        post,
        postedDate: Date.now(), 
        userId 
      };
      createPost(newPost)
        .then((id) => {
          console.log("NEW POST", newPost);
          resp.status(200).send({ id, ...newPost});
        })
        .catch((err) => console.log(err));
    }
  }
);

app.put('/api/post', 
  jwtMiddleware( { secret: accessTokenSecret }),
  function(req, resp) {
    const { post, userId, postId } = req.body;
    if (isUserInToken(req, userId)) {
      const editDate = Date.now();
      updatePost(
        postId, 
        { post, editDate })
        .then(() => resp.status(200).send({ post }));
    } else {
      resp.status(401);
    }
  }
);

app.delete('/api/post/:postId/:userId', 
  jwtMiddleware( { secret: accessTokenSecret }),
  function(req, resp) {
    const { postId, userId } = req.params;
    if (isUserInToken(req, userId)) {
      deletePost(postId).then(() => {
        resp.sendStatus(200);
      })
      .catch((err) => {
        console.log('there was an err', err);
      });
    } else {
      resp.sendStatus(401);
    }
  }
);

module.exports = {
  app
}
