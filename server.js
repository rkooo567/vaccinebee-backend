// Modules
const bodyParser = require('body-parser');
const express = require('express');
const {WebhookClient, Card, Suggestion} = require('dialogflow-fulfillment');
const {dialogflow, Image} = require('actions-on-google');

// Files
const firebase = require('./server/firebase.js');
const get = require('./server/get.js');
const set = require('./server/set.js');
const search = require('./controller/customSearch');

// Setup
const app = express();
app.use('/public', express.static(process.cwd() + '/public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Helpers
const log = (input) => {
  console.log(JSON.stringify(input, null, 2));
}

// Routes

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
    return get.searchByAge(agent.parameters.age.amount).then((getResponse) => {
      agent.add(getResponse);
    });
  }
  const searchByCountry = (agent) => {
    log(agent.parameters);
    agent.add(`Responding to by country ${agent.parameters.country}`);
  }
  const intentMap = new Map();
  intentMap.set('searchByCountry', searchByCountry);
  intentMap.set('searchByAge', searchByAge);
  agent.handleRequest(intentMap);
});

app.get('/api/searchAdd', (request, response) => {
  log('/api/searchAdd');
  const searchQuery = request.query.searchQuery;
  search.savedSearch(searchQuery, (error, saveSearchResponse) => {
    if (error) {
      log(error);
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

set.upvote('-LHQO8ZxtHp2AT77mS_l', (error, response) => {
  log(error);
  log(response);
});