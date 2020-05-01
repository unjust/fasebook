const express = require('express');
const nano = require('nano')('http://admin:couchdb!@localhost:5984');
const jwt = require('jsonwebtoken');

const jwtMiddleware = require('express-jwt');
const path = require('path');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

const DB = 'fasebook';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

async function setupDatabase() {
  const response = await nano.db.list().catch((e) => {
    console.log('nano db list failed', e);
  });
  if (response.indexOf(DB) === -1) {
    const success = await nano.db.create('fasebook').catch((e) => {
      console.log('create db error', e);
    });
    console.log(success);
  }
}

setupDatabase();

const db = nano.use(DB);

const users = [
  {
    username: 'ivy',
    password: 'ivy'
  },
  {
    username: 'ivy2',
    password: 'ivy'
  }
];

const addUsers = function() {
  db.insert( { docs: users });
}
addUsers();

const app = express();
app.listen(process.env.PORT || 8080);
// app.use(express.static(path.join(__dirname, 'public')));
// app.all('*', requireAuthentication, loadUser)
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
  console.log(username, password);
  const user = db.find(q);
  if (user) {
    const accessToken = jwt.sign( { username }, accessTokenSecret);
    res.json(accessToken);
  } else {
    res.send('Username or password incorrect');
  }
});

app.get('/api/posts', 
  jwtMiddleware( { secret: accessTokenSecret }),
  function(req, resp) {
    if (req.user) {
      console.log('valid');
      resp.sendStatus(200);
    } else {
      resp.sendStatus(401);
    }
  }
);

module.exports = {
  db,
  app
};
