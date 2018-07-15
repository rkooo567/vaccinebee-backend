// const https = require('https');

// module.exports = (query, callback) => {
//   const payload = {
//     lang: 'en',
//     query: query,
//     sessionId: '12345',
//     timeZone: 'America/Los_Angeles',
//     v: '20150910',
//   };
//   const options = {
//     headers: {
//       'Authorization': 'Bearer 0f9e1cad5f684665a0ddfcd755bdbc03',
//       'Content-Type': 'application/json',
//     },
//     method: 'POST',
//     host: 'api.dialogflow.com',
//     path: '/v1/query/',
//   };
//   const request = https.request(options, (response) => {
//     let body = [];
//     response
//       .on('data', (chunk) => {
//         body.push(chunk);
//       })
//       .on('end', () => {
//         body = Buffer.concat(body).toString();
//         callback(null, body);
//       });
    
//   });
//   request.write(JSON.stringify(payload));
//   request.end();
// };

const {dialogflow} = require('actions-on-google');

const app = dialogflow({debug: true})
app.intent('searchByAge', (conv) => {
  conv.ask('Are you sure about this ?');
});