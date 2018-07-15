// Packages
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
app.get('/api/searchArticlesUsingGoogleAndAdd', (request, response) => {
  log('/api/searchArticlesUsingGoogleAndAdd');
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
        firebase.create('articles', result, (firebaseResponse) => {

        });
      });
    }
  });
});
app.get('/api/searchArticlesUsingGoogle', (request, response) => {
  log('/api/searchArticlesUsingGoogle');
  const searchQuery = request.query.searchQuery;
  search.search(request, response, searchQuery);
});
app.get('/api/searchArticlesThroughText', (request, response) => {
  get.searchArticlesThroughText(request.query.query, (error, questionsResponse) => {
    if (error) {
      response.send(false);
    }
    else {
      response.send(questionsResponse);
    }
  });
});
app.get('/api/getTrendingQuestions', (request, response) => {
  firebase.get('questions', (error, questionsResponse) => {
    if (error) {
      log(error);
      response.send(false);
    }
    else {
      questionsResponse
      response.send(questionsResponse);
    }
  });
});
app.post('/api/searchArticlesThroughVoice', (request, response) => {
  const search = (agent) => {
    return get.searchArticlesThroughVoice(agent).then((getResponse) => {
      agent.add(getResponse);
    });
  }
  const bookAppointment = (agent) => {
    let date = new Date(agent.parameters.date);
    let options = {
        weekday: "long", month: "short",
        day: "numeric", hour: "2-digit", minute: "2-digit"
    };
    console.log(date.toLocaleTimeString("en-us", options));
    agent.add(`Cool! You have your appointment for ${agent.parameters.disease} on ${date.toLocaleTimeString("en-us", options)}`);
  }
  const agent = new WebhookClient({ request, response });
  const intentMap = new Map();
  intentMap.set('searchByCountry', search);
  intentMap.set('searchByDisease', search);
  intentMap.set('searchByAge', search);
  intentMap.set('bookAppointment', bookAppointment);
  agent.handleRequest(intentMap);
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

// Run server
app.set('port', (process.env.PORT || 5000));
app.listen(app.get('port'), () => {
  log('Port ' + app.get('port'));
});

// Test
get.searchArticlesThroughText('I am going to Brazil this weekend. Which vaccines should I get?').then(questionsResponse => {
  // log(questionsResponse);
});