const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const multiparty = require('connect-multiparty');

const app = express();


app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false,
}));
app.use(multiparty());

app.use(function (req, res, next) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
      res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
      res.setHeader('Access-Control-Allow-Credentials', true);
      next();
  });

process.on('uncaughtException', function(err) {
  console.log("=======Error======" + err.stack);
});

console.log('Hello ');

const filmController = require('./api/filmController');
app.get('/api/suggest-movie', filmController.suggestMovie);


app.use('/*', function (req, res) {
  res.sendFile(path.join(__dirname + '/views/home.html'));
});

module.exports = app;
