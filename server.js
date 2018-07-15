const bodyParser = require('body-parser');
const express = require('express');
const dialogflow = require('./server/dialogflow.js');
const firebase = require('./server/firebase.js');
const app = express();
const search = require('./controller/customSearch');

const {
  dialogflow,
  Image,
} = require('actions-on-google')
 
// Create an app instance
 
const api_app = dialogflow()


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
  api_app.intent('searchByAge', conv => {
    conv.ask('Hi, how is it going?');
  })
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

