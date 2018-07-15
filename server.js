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
  const bookAppointment = (agent) => {
    let date = new Date(agent.parameters.date);
    let options = {
        weekday: "long", month: "short",
        day: "numeric", hour: "2-digit", minute: "2-digit"
    };

    console.log(date.toLocaleTimeString("en-us", options));
    agent.add(`Cool ! You have your appointment for ${agent.parameters.disease} on ${date.toLocaleTimeString("en-us", options)}`);
  }
  const intentMap = new Map();
  intentMap.set('searchByCountry', search);
  intentMap.set('searchByDisease', search);
  intentMap.set('searchByAge', search);
  intentMap.set('bookAppointment', bookAppointment);
  agent.handleRequest(intentMap);
});
app.get('/api/searchArticlesAndAdd', (request, response) => {
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
app.get('/api/searchArticles', (request, response) => {
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
app.get('/api/searchQuestions', (request, response) => {
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
get.queryByText('I am going to Brazil this weekend. Which vaccines should I get?').then(questionsResponse => {
  log(questionsResponse);
});