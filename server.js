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
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use('/public', express.static(process.cwd() + '/public'));
app.set('view engine', 'ejs');

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
  const search = (agent) => {
    return get.queryByVoice(agent.parameters).then((getResponse) => {
      agent.add(getResponse);
    });
  }
  const intentMap = new Map();
  intentMap.set('searchByCountry', search);
  intentMap.set('searchByDisease', search);
  intentMap.set('searchByAge', search);
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
app.post('/api/upvote', (request, response) => {
  const articleId = request.query.articleId;
  set.upvote(articleId, (error, upvoteResponse) => {
    if (error) {
      response.send(false);
    }
    else {
      response.send(true);
    }
  });
});
app.get('/api/getQuestions', (request, response) => {
  get.questions(request.query.query, (error, questionsResponse) => {
    if (error) {
      response.send(false);
    }
    else {
      response.send(questionsResponse);
    }
  });
});
app.put('/api/editSnippet', (request, response) => {});

// Run server
app.set('port', (process.env.PORT || 5000));
app.listen(app.get('port'), () => {
  log('Port ' + app.get('port'));
});

// Test
get.queryByText('I am going to Brazil this weekend. Which vaccines should I get?', (error, questionsResponse) => {
  let dummy;
});