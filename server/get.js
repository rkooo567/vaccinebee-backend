const _ = require('lodash');
const dialogflow = require('./dialogflow.js');
const firebase = require('./firebase.js');

// Helper
const log = (input) => {
  console.log(JSON.stringify(input, null, 2));
}
const stringifyCollection = (array) => {
  if (typeof array === 'object') {
    if (!Array.isArray(array)) {
      array = Object.keys(array);
    }
    if (array.length > 1) {
      return array.slice(0, array.length - 1).join(', ') + ' and ' + array[array.length -1];
    }
    else {
      return array[0];
    }
  }
}
const pluralize = (array, singular, plural) => {
  if (typeof array === 'object') {
    if (!Array.isArray(array)) {
      array = Object.keys(array);
    }
    return array.length === 1 ? singular : plural;
  }
  else {
    console.log(`${array} is not a collection`);
  }
}

// Private
const searchArticlesByDisease = (disease) => {
  // disease = 'measles';
  return new Promise((resolve, reject) => {
    firebase.get('articles', (error, firebaseResponse) => {
      if (error) {
        reject(error);
      }
      else {
        resolve(firebaseResponse);
      }
    });
  });
};
const searchArticlesByCountry = (country) => {
  // country = 'India';
  return new Promise((resolve, reject) => {
    firebase.get('articles', (error, firebaseResponse) => {
      if (error) {
        reject(error);
      }
      else {
        resolve(
          Object.keys(firebaseResponse)
            .map(key => firebaseResponse[key])
            .filter(article => article.countries.map(coun => coun.toLocaleLowerCase()).includes(country.toLocaleLowerCase()))
        );
      }
    });
  });
};
const searchArticlesByAge = (age) => {
  // age.amount = 20;
  return new Promise((resolve, reject) => {
    firebase.get('articles', (error, articles) => {
      if (error) {
        reject(error);
      }
      else {
        resolve(
          Object.keys(articles)
            .map(key => articles[key])
            .filter(article => article.age.low <= age && age <= article.age.high)
        );
      }
    });
  });
}
const saveQuestion = (agent) => {
  const newQuestion = {
    query: agent.query || agent.resolvedQuery,
    parameters: agent.parameters,
  };
  firebase.get('questions', (error, questions) => {
    if (error) {
      log(error);
    }
    else {
      let existingQuestionId;
      if (questions) {
        existingQuestionId = Object.keys(questions).find(id => _.isEqual(questions[id].parameters, newQuestion.parameters));
      }
      if (existingQuestionId) { // Question already exists, update by incrementing number of times asked
        newQuestion.timesAsked = questions[existingQuestionId].timesAsked + 1;
        firebase.update('questions', existingQuestionId, newQuestion, (error, updateResponse) => {});
      }
      else { // Question never before asked, initialize number of times asked to 1
        newQuestion.timesAsked = 1;
        firebase.create('questions', newQuestion, (error, createResponse) => {});
      }
    }
  });
};

// Public
module.exports = {
  searchArticlesThroughVoice: (agent, callback) => {
    const parameters = agent.parameters;
    log('------- ' + JSON.stringify(parameters, null, 2) + '-------');
    saveQuestion(agent);
    return new Promise((resolve, reject) => {
      if (parameters.age) {
        searchArticlesByAge(parameters.age.amount).then(searchResponse => {
          const diseases = {};
          searchResponse
            .map(article => article.disease)
            .forEach(disease => {
              if (diseases.hasOwnProperty(disease)) {
                diseases[disease] += 1;
              }
              else {
                diseases[disease] = 0;
              }
            });
          resolve(`The most common disease${pluralize(diseases, '', 's')} for a ${parameters.age.amount} year old ${pluralize(diseases, 'is', 'are')} ${stringifyCollection(diseases)}.`);
        });
      }
      else if (parameters.country) {
        const diseases = {};
        searchArticlesByCountry(parameters.country).then(searchResponse => {
          searchResponse
            .map(article => article.disease)
            .forEach(disease => {
              if (diseases.hasOwnProperty(disease)) {
                diseases[disease] += 1;
              }
              else {
                diseases[disease] = 0;
              }
            });
          resolve(`For a trip to ${parameters.country} you should probably look at ${stringifyCollection(diseases)}.`);
        });
      }
      else if (parameters.disease) {
        searchArticlesByDisease(parameters.disease).then(searchResponse => {
          const summary = Object.keys(searchResponse)
            .map(key => searchResponse[key])
            .find(article => article.disease === parameters.disease);
          if (summary) {
            resolve(`According to CDC, ${summary.snippet}`);
          }
          else {
            resolve('No summary');
          }
        });
      }
      else {
        reject(`${JSON.stringify(parameters)} does not match any parameters`);
      }
    });
  },
  searchArticlesThroughText: (query) => {
    return new Promise((resolve, reject) => {
      dialogflow(query, (error, response) => {
        if (error) {
          callback(error, null);
        }
        else {
          if (typeof response === 'string') {
            response = JSON.parse(response);
          }
          let parameters;
          if (response && response.result && response.result.parameters) {
            parameters = response.result.parameters;
          }
          saveQuestion(response.result);
          if (parameters.age) {
            resolve(searchArticlesByAge(parameters.age.amount));
          }
          else if (parameters.country) {
            resolve(searchArticlesByCountry(parameters.country));
          }
          else if (parameters.disease) {
            resolve(searchArticlesByDisease(parameters.disease));
          }
        }
      });
    });
  },
  searchArticlesAnsweringQuestion: (parameters, callback) => {
    return new Promise((resolve, reject) => {
      if (parameters.age) {
        resolve(searchArticlesByAge(parameters.age.amount));
      }
      else if (parameters.country) {
        resolve(searchArticlesByCountry(parameters.country));
      }
      else if (parameters.disease) {
        resolve(searchArticlesByDisease(parameters.disease));
      }
    });
  }
};
