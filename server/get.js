const _ = require('lodash');
const dialogflow = require('./dialogflow.js');
const firebase = require('./firebase.js');

// Helper
const log = (input) => {
  console.log(JSON.stringify(input, null, 2));
}
const arrayStringify = (array) => {
  if (array.length > 1) {
    return array.slice(0, array.length - 1).join(', ') + ' and ' + array[array.length -1];
  }
  else {
    return array[0];
  }
}

// Private
const searchByDisease = (disease) => {
  return new Promise((resolve, reject) => {
    firebase.read('articles', (error, firebaseResponse) => {
      if (error) {
        reject(error);
      }
      else {
        const summary = Object.keys(firebaseResponse)
          .map(key => firebaseResponse[key])
          .filter(article => article.disease == disease)[0].snippet;
        resolve(`Here is a summart ${summary}`);
      }
    });
  });
};
const searchByCountry = (country, callback) => {
  return new Promise((resolve, reject) => {
    firebase.read('articles', (error, firebaseResponse) => {
      if (error) {
        reject(error);
      }
      else {
        const diseases = {};
        Object.keys(firebaseResponse)
          .map(key => firebaseResponse[key])
          .filter(article => article.countries.includes(country.toLocaleLowerCase()))
          .map(article => article.disease)
          .forEach(disease => {
            if (diseases.hasOwnProperty(disease)) {
              diseases[disease] += 1;
            }
            else {
              diseases[disease] = 0;
            }
          });
        resolve(`For a trip to ${country} you should probably look at ${arrayStringify(Object.keys(diseases))}.`);
      }
    });
  });
};
const searchByAge = (age) => {
  return new Promise((resolve, reject) => {
    firebase.read('articles', (error, articles) => {
      if (error) {
        reject(error);
      }
      else {
        const diseases = {};
        Object.keys(articles)
          .map(key => articles[key])
          .filter(article => article.age.low <= age && age <= article.age.high)
          .map(article => article.disease)
          .forEach(disease => {
            if (diseases.hasOwnProperty(disease)) {
              diseases[disease] += 1;
            }
            else {
              diseases[disease] = 0;
            }
          });
        resolve(`The most common disease${Object.keys(diseases).length === 1 ? '' : 's'} for a ${age} year old ${Object.keys(diseases).length === 1 ? 'is' : 'are'} ${arrayStringify(Object.keys(diseases))}.`);
      }
    });
  });
}

// Public
module.exports = {
  queryByVoice: (parameters, callback) => {
    return new Promise((resolve, reject) => {
      if (parameters.age) {
        resolve(searchByAge(parameters.age.amount));
      }
      else if (parameters.country) {
        resolve(searchByCountry(parameters.country));
      }
      else if (parameters.disease) {
        resolve(searchByDisease(parameters.disease));
      }
      // firebase.read('articles', (error, firebaseResponse) => {
      //   if (error) {
      //     reject(error);
      //   }
      //   else {
      //     const summary = Object.keys(firebaseResponse)
      //       .map(key => firebaseResponse[key])
      //       .filter(article => article.disease == disease)[0].snippet;
      //     resolve(`According to CDC, ${summary}`);
      //   }
      // });
    });
  },
  queryByText: (query, callback) => {
    dialogflow(query, (error, response) => {
      if (error) {
        callback(error, null);
      }
      else {
        if (typeof response === 'string') {
          response = JSON.parse(response);
        }
        const parameters = response.result.parameters;
        if (parameters.age) {
          
        }
        else if (parameters.country) {
          
        }
        else if (parameters.disease) {
          
        }
        log(parameters);
      }
    });
  }
};
