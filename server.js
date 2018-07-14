const bodyParser = require('body-parser');
const express = require('express');
const dialogflow = require('./server/dialogflow.js');
const firebase = require('./server/firebase.js');
const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/api/diseases', (request, response) => {
  // dialogflow('Hello', () => {});
  response.send(`Received ${request.query.name}`);
});

app.set('port', (process.env.PORT || 5000));
app.listen(app.get('port'), () => {
  console.log('Port ' + app.get('port'));
});