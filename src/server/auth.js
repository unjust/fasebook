import jwt from 'express-jwt';
import bodyParser from 'body-parser';
// import j from 'jsonwebtoken';
import { app, db } from '../server';

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

const accessTokenSecret = 'youraccesstokensecret';

app.use(bodyParser.json());

app.post('/auth', function(req, res) {
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


