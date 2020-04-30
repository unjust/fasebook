const express = require('express');
// import bodyParser from 'body-parser';
const path = require('path');

const app = express();
app.use(express.static(path.join(__dirname, 'public')));

app.get('/ping', function (req, res) {
  return res.send('pong');
 });

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'public', 'yo.html'));
});

app.get('/login', (req, res) => {
  res.render('index', function (err, html) {
    res.send(html)
  })
});

app.listen(process.env.PORT || 8080);

