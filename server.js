const bodyParser = require('body-parser');
const express = require('express');
// const dialogflow = require('./server/dialogflow.js');
const firebase = require('./server/firebase.js');
const app = express();
const search = require('./controller/customSearch');
const {WebhookClient, Card, Suggestion} = require('dialogflow-fulfillment');
const {dialogflow, Image} = require('actions-on-google')
 
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

app.post('/api/dialogflow', (request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
const searchByAge = (agent) => {
    console.log(JSON.stringify(request.body, null, 2));
    agent.add(`i am an idiot.`);
  }
  const intentMap = new Map();
  intentMap.set('searchByAge', searchByAge);
  agent.handleRequest(intentMap);
});

app.get('/api/searchAdd', (request, response) => {
  console.log('/api/searchAdd');
  const searchQuery = request.query.searchQuery;
  search.savedSearch(searchQuery, (error, saveSearchResponse) => {
    if (error) {
      console.log(JSON.stringify(error, null, 2));
    }
    else {
      saveSearchResponse.forEach(result => {
        result.disease = 'varicella';
        result.query = 'definition';
        firebase.push('intents', result, (firebaseResponse) => {
          console.log(firebaseResponse);
        });
      });
    }
  });
});

app.get('/api/search', (request, response) => {
  console.log('/api/search');
  const searchQuery = request.query.searchQuery;
  search.search(request, response, searchQuery);
});

app.set('port', (process.env.PORT || 5000));
app.listen(app.get('port'), () => {
  console.log('Port ' + app.get('port'));
});

