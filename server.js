const express = require('express');
const firebase = require('./server/firebase.js');
const app = express();

app.get('/', function (req, res) {
  firebase.push('doctors', {key: 'value'}, (error, response) => {
    res.send(response);
  });
});

app.set('port', (process.env.PORT || 5000));
app.listen(app.get('port'), () => {
  console.log('Port ' + app.get('port'));
});