const ToneAnalyzerV3 = require('ibm-watson/tone-analyzer/v3');
const { IamAuthenticator } = require('ibm-watson/auth');
require("dotenv").config();

const toneAnalyzer = new ToneAnalyzerV3({
  version: '2017-09-21',
  authenticator: new IamAuthenticator({
    apikey: process.env.IBM_API_KEY,
  }),
  serviceUrl: 'https://api.us-south.tone-analyzer.watson.cloud.ibm.com',
});

const text = "Google, headquartered in Mountain View (1600 Amphitheatre Pkwy, Mountain View, CA 940430), unveiled the new Android phone for $799 at the Consumer Electronic Show. Sundar Pichai said in his keynote that users love their new Android phones. I hate Linus.";
// const text = 'Team, I know that times are tough! Product '
//   + 'sales have been disappointing for the past three '
//   + 'quarters. We have a competitive product, but we '
//   + 'need to do a better job of selling it!';

const toneParams = {
  toneInput: { 'text': text },
  contentType: 'application/json',
};

// toneAnalyzer.tone(toneParams)
//   .then(toneAnalysis => {
//     console.log(JSON.stringify(toneAnalysis, null, 2));
//   })
//   .catch(err => {
//     console.log('error:', err);
//   });
  
export {toneAnalyzer};