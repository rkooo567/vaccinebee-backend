const dialogflow = require('dialogflow');

const projectId = 'vacspider-2ef59'; // https://dialogflow.com/docs/agents#settings
const sessionId = 'quickstart-session-id';
const languageCode = 'en-US';
const sessionClient = new dialogflow.SessionsClient();
const sessionPath = sessionClient.sessionPath(projectId, sessionId);
 
module.exports = (query, callback) => {
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
    .then(responses => {
      callback(null, responses);
    })
    .catch(error => {
      callback(error, null);
    });
}