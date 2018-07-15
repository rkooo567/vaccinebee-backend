const _ = require('lodash');
const firebase = require('./firebase.js');

module.exports = {
  searchByAge: (age, callback) => {
    const arrayStringify = (array) => {
      if (array.length > 1) {
        return array.slice(0, array.length - 1).join(', ') + ' and ' + array[array.length -1];
      }
      else {
        return array[0];
      }
    }
    firebase.read('articles', (error, firebaseResponse) => {
      if (error) {
        callback(error, null);
      }
      else {
        const diseases = {};
        Object.keys(firebaseResponse)
          .map(key => firebaseResponse[key])
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
        callback(null, `The most common disease${Object.keys(diseases).length === 1 ? '' : 's'} for a ${age} year old ${Object.keys(diseases).length === 1 ? 'is' : 'are'} ${arrayStringify(Object.keys(diseases))}.`);
      }
    });
  }
};