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
const searchByDisease = (disease) => {
  return new Promise((resolve, reject) => {
    firebase.read('articles', (error, firebaseResponse) => {
      if (error) {
        reject(error);
      }
      else {
        resolve(firebaseResponse);
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
        resolve(
          Object.keys(firebaseResponse)
            .map(key => firebaseResponse[key])
            .filter(article => article.countries.includes(country.toLocaleLowerCase()))
        );
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
        resolve(
          Object.keys(articles)
            .map(key => articles[key])
            .filter(article => article.age.low <= age && age <= article.age.high)
        );
      }
    });
  });
}

// Public
module.exports = {
  queryByVoice: (parameters, callback) => {
    return new Promise((resolve, reject) => {
      if (parameters.age) {
        searchByAge(parameters.age.amount).then(searchResponse => {
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
        searchByCountry(parameters.country).then(searchResponse => {
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
        searchByDisease(parameters.disease).then(searchResponse => {
          const summary = Object.keys(searchResponse)
            .map(key => searchResponse[key])
            .filter(article => article.disease == disease)[0].snippet;
          resolve(`Here is a summary ${summary}`);
        });
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
    return new Promise((resolve, reject) => {
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
            resolve(searchByAge(parameters.age.amount));
          }
          else if (parameters.country) {
            resolve(searchByCountry(parameters.country));
          }
          else if (parameters.disease) {
            resolve(searchByDisease(parameters.disease));
          }
        }
      });
    });
  }
};
