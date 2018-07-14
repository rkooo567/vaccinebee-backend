const bodyParser = require('body-parser');
const express = require('express');
// const dialogflow = require('./server/dialogflow.js');
const firebase = require('./server/firebase.js');
const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// https://oshaw-vacspider-backend.herokuapp.com/api/diseases?name=varicella
app.get('/api/diseases', function (request, response) {
  // console.log(JSON.stringify(request, null, 2));
  response.send(`Received ${request.query.name}`);
  // switch (request.query.name) {
  //   case 'varicella': {
  //     response.send('Received the message');
  //     break;
  //   }
  // }
  // firebase.push('doctors', {key: 'value'}, (error, firebaseResponse) => {
  //   response.send(firebaseResponse);
  // });
});

app.set('port', (process.env.PORT || 5000));
app.listen(app.get('port'), () => {
  console.log('Port ' + app.get('port'));
});