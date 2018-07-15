const bodyParser = require('body-parser');
const express = require('express');
const search = require('./controller/customSearch');
const get = require('./server/get.js');
const firebase = require('./server/firebase.js');
const {WebhookClient, Card, Suggestion} = require('dialogflow-fulfillment');
const {dialogflow, Image} = require('actions-on-google');

const app = express();
app.use('/public', express.static(process.cwd() + '/public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const log = (input) => {
  console.log(JSON.stringify(input, null, 2));
}

app.get('/', (request, response) => {
  response.render('doctor-dashboard');
});

app.get('/api/diseases', (request, response) => {
  // dialogflow('Hello', () => {});
  response.send(`Received ${request.query.name}`);
});

app.post('/api/dialogflow', (request, response) => {
  const agent = new WebhookClient({ request, response });
  const searchByAge = (agent) => {
    get.searchByAge(agent.parameters.age.amount, (error, response) => {
      if (error) {
        agent.add('Sorry, something went wrong on my end!');
      }
      else {
        log('Dialogflow Request body: ' + response);
        agent.add(response);
      }
    });
  }

  const searchByCountry = (agent) => {
    console.log(JSON.stringify(agent.parameters, null, 2));
    agent.add(`Responding to by country ${agent.parameters.country}`);
  }

  const intentMap = new Map();
  intentMap.set('searchByAge', searchByAge);
  intentMap.set('searchByCountry', searchByCountry);
  agent.handleRequest(intentMap);
});

app.get('/api/searchAdd', (request, response) => {
  log('/api/searchAdd');
  const searchQuery = request.query.searchQuery;
  search.savedSearch(searchQuery, (error, saveSearchResponse) => {
    if (error) {
      log(JSON.stringify(error, null, 2));
    }
    else {
      saveSearchResponse.forEach(result => {
        result.disease = 'varicella';
        result.query = 'definition';
        result.age = {
          low: 20,
          high: 50,
        };
        result.countries = [
          
        ];
        firebase.push('articles', result, (firebaseResponse) => {
          
        });
      });
    }
  });
});

app.get('/api/search', (request, response) => {
  log('/api/search');
  const searchQuery = request.query.searchQuery;
  search.search(request, response, searchQuery);
});

app.set('port', (process.env.PORT || 5000));
app.listen(app.get('port'), () => {
  log('Port ' + app.get('port'));
});