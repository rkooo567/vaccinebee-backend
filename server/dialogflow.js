const dialogflow = require('dialogflow');
const Storage = require('@google-cloud/storage');



module.exports = {
  init: () => {
    storage.getBuckets()
    .then((results) => {
      const buckets = results[0];
      buckets.forEach((bucket) => {
        console.log(bucket.name);
        const projectId = 'vacspider-2ef59'; // https://dialogflow.com/docs/agents#settings
        const sessionId = 'quickstart-session-id';
        const languageCode = 'en-US';
        const sessionClient = new dialogflow.SessionsClient();
        const sessionPath = sessionClient.sessionPath(projectId, sessionId);
        const storage = new Storage({ keyFilename: 'google-keys.json' });
      });
    })
    .catch((err) => { callback(error, null); });
  },
  call: (query, callback) => {
    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: query,
          languageCode: languageCode,
        },
      },
    };
    sessionClient
      .detectIntent(request)
      .then(responses => { callback(null, responses); })
      .catch(error => { callback(error, null); });
  }
}