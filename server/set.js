const firebase = require('./firebase.js');

const log = (input) => {
  console.log(JSON.stringify(input, null, 2));
}

module.exports = {
  upvote: (articleId, callback) => {
    firebase.get('articles', (error, articles) => {
      const article = articles[articleId];
      if (article) {
        let upvotes;
        if (article.hasOwnProperty('upvotes')) {
          article.upvotes = 1;
        }
        else {
          article.upvotes = article.upvotes + 1;
        }
        firebase.update('articles', articleId, article, (error, updateResponse) => {
          if (error) {
            callback(error, null);
          }
          else {
            callback(null, updateResponse);
          }
        });
      }
      else {
        callback(`Article with id ${articleId} not found`, null);
      }
    });
  }
};