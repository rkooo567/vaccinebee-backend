const express = require('express');
const app = express();

app.get('*', (request, response) => {
  response.send('Response');
});

app.set('port', (process.env.PORT || 5000));
app.listen(app.get('port'), () => {
  console.log('Port ' + app.get('port'));
});