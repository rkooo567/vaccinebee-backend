const bodyParser = require('body-parser');
const express = require('express');
const dialogflow = require('./server/dialogflow.js');
const firebase = require('./server/firebase.js');
const app = express();
const search = require('./controller/customSearch').search;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/api/diseases', (request, response, next) => {
  console.log('/api/diseases');
  response.send(`Received ${request.query.name}`);
});

<<<<<<< HEAD
app.get('/api/dialogflow', (request, response, next) => {
  console.log('/api/dialogflow');
  dialogflow(request.query.query, (error, dialogflowResponse) => {
    response.send(dialogflowResponse);
  });
});

// app.get('*', (request, response, next) => {
//   console.log('*');
// });

=======
app.get('/api/search', (request, response) => {
  const searchQuery = request.query.searchQuery
  search(request, response, searchQuery);
});

>>>>>>> c342e7daf3e91f4bf6e2ba0e551903a090cac621
app.set('port', (process.env.PORT || 5000));
app.listen(app.get('port'), () => {
  console.log('Port ' + app.get('port'));
});