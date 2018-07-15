const bodyParser = require('body-parser');
const express = require('express');
const dialogflow = require('./server/dialogflow.js');
const firebase = require('./server/firebase.js');
const app = express();
const search = require('./controller/customSearch').search;

app.use('/public', express.static(process.cwd() + '/public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/', (request, response) => {
  response.render('doctor-dashboard');
});

app.get('/api/diseases', (request, response) => {
  // dialogflow('Hello', () => {});
  response.send(`Received ${request.query.name}`);
});
app.get('/api/dialogflow', (request, response, next) => {
  console.log('/api/dialogflow');
  dialogflow(request.query.query, (error, dialogflowResponse) => {
    response.send(dialogflowResponse);
  });
});
app.get('/api/search', (request, response) => {
  const searchQuery = request.query.searchQuery;
  search(request, response, searchQuery);
});

app.set('port', (process.env.PORT || 5000));
app.listen(app.get('port'), () => {
  console.log('Port ' + app.get('port'));
});