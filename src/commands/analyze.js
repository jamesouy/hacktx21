const {toneAnalyzer} = require('../analyzer');

module.exports = {
  name: 'analyzeText',
  execute(msg, args) {
    toneParams = {
      toneInput: {'text': msg.content.substring(12).trim() || ""},
      contentType: 'application/json',
    };
    toneAnalyzer.tone(toneParams)
      .then(toneAnalysis => {
        let reply = JSON.stringify(toneAnalysis.result, null, 2);
        toneAnalysis.result.document_tone.tones.forEach(tone => {
          if (tone.tone_id == "anger" && tone.score >= angerThreshold) {
            reply += "\nYou sound angwy.";
          } else if (tone.tone_id == "joy" && tone.score >= joyThreshold) {
            reply += "\nYou sound joyous.";
          }
        });
        msg.reply(reply);
      })
  }
}