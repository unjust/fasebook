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
  findDocs(q).then((docs) => {
    if (docs.length) {
      const { _id } = docs[0];
      const accessToken = jwt.sign( { _id }, accessTokenSecret);
      res.json({ userId: _id, accessToken });
    } else {
      res.json({ error: 'username or password incorrect'});
    }
  });
});

app.post('/api/post', 
  jwtMiddleware( { secret: accessTokenSecret }),
  function(req, resp) {
    const { post, userId } = req.body;
    if (req.user && req.user._id === userId) {
      const postedDate = Date.now();
      const type = 'post';
      const db = getDatabaseInstance();
      db.insert({ post, type, postedDate, userId }, (body) => {
        resp.sendStatus(200);
      });
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
      updateDoc({ selector: { _id: postId, type }}, { post, editDate })
        .then(() => resp.status(200).send({ post }));
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
          type: 'post'
        },
        fields: [ 'postedDate', 'post', '_id' ]
      };
      findDocs(q).then((docs) => {
        resp.json(docs);
      });
    } else {
      resp.sendStatus(401);
    }
  }
);
