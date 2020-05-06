const express = require('express');
const jwt = require('jsonwebtoken');
const jwtMiddleware = require('express-jwt');
const bodyParser = require('body-parser');

const { 
  getDatabaseInstance,
  findDocs, 
  updateDoc 
} = require('./dbUtils');

const app = express();
app.listen(process.env.PORT || 8080);

if (process.env.NODE_ENV !== 'production') {
  const dotenv = require('dotenv');
  dotenv.config();
}
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

app.use(bodyParser.json());

app.post('/api/auth', function(req, res) {
  const { username, password } = req.body;
  const q = {
    selector: {
      username,
      password
    }
  }
  findDocs(q)
    .then((docs) => {
      if (docs.length) {
        const { _id } = docs[0];
        const accessToken = jwt.sign( { _id }, accessTokenSecret);
        res.json({ userId: _id, accessToken });
      } else {
        res.json({ error: 'username or password incorrect'});
      }
    })
    .catch((err) => console.log("error"));
});

app.post('/api/post', 
  jwtMiddleware( { secret: accessTokenSecret }),
  function(req, resp) {
    const { post, userId } = req.body;
    if (req.user && req.user._id === userId) {
      const db = getDatabaseInstance();
      const newPost = { 
        type: 'post',
        post,
        postedDate: Date.now(), 
        userId 
      };
      db.insert(newPost)
        .then((body) => {
          resp.status(200).send({ _id: body.id, ...newPost});
        })
        .catch((err) => console.log(err));
    }
  }
);

app.put('/api/post', 
  jwtMiddleware( { secret: accessTokenSecret }),
  function(req, resp) {
    const { post, userId, postId } = req.body;
    if (req.user && req.user._id === userId) {
      const editDate = Date.now();
      const type = 'post';
      updateDoc(
        { selector: { _id: postId, type }}, 
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
    if (req.user && req.user._id === userId) {
      const q = { selector: { _id: postId, type: 'post' }};
      const update = { _deleted: true };
      updateDoc(q, update).then((res) => {
        resp.status(200).send(res);
      })
      .catch((err) => {
        console.log(err);
      });
    } else {
      resp.status(401);
    }
  }
);

app.get('/api/posts/:userId', 
  jwtMiddleware( { secret: accessTokenSecret }),
  function(req, resp) {
    const { userId } = req.params;
    if (req.user && userId) { // we'd also check for permissions here
      const q = {
        selector: {
          userId,
          type: 'post',
          postedDate: { $gt: null }
        },
        fields: [ 'postedDate', 'post', '_id' ],
        sort: [{'postedDate': 'desc' }],
      };
      findDocs(q).then((docs) => {
        resp.json(docs);
      });
    } else {
      resp.sendStatus(401);
    }
  }
);
