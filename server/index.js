const express = require('express');
const jwt = require('jsonwebtoken');
const jwtMiddleware = require('express-jwt');
const path = require('path');
const bodyParser = require('body-parser');
const { getDatabase, findDoc } = require('./dbUtils');

const app = express();
app.listen(process.env.PORT || 8080);

if (process.env.NODE_ENV !== 'production') {
  const dotenv = require('dotenv');
  dotenv.config();
}
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

const db = getDatabase();

// app.use(express.static(path.join(__dirname, 'public')));
// app.all('*', requireAuthentication., loadUser)
app.use(bodyParser.json());

app.get('/ping', function (req, res) {
  return res.send('pong');
 });

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'public', 'yo.html'));
});

app.post('/api/auth', function(req, res) {
  const { username, password } = req.body;
  const q = {
    selector: {
      username,
      password
    }
  }
  findDoc(q).then((docs) => {
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
      const postedDate = Date.now();
      const type = 'post';
      db.insert({ post, type, postedDate, userId }, (body) => {
        resp.sendStatus(200);
      });
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
        // sort: [{ 'postedDate': 'asc'}]
      };

      db.find(q).then((res) => {
        resp.json(res.docs);
      }).catch((err) => console.log(err));
    } else {
      resp.sendStatus(401);
    }
  }
);

module.exports = {
  app
};
