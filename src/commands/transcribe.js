
const fs = require('fs');
const {transcriber} = require('../speechtotext');
const {toneAnalyzer} = require('../analyzer');
const {angerThreshold, joyThreshold} = require('./threshold');

module.exports = {
  name: 'transcribe',
  execute(msg, args) {
    try {
<<<<<<< HEAD
      var file = fs.readFileSync('./recordings/r'+args[0]+'.ogg');
      transcriber(file)
      .then(result => {
        let reply = result;
        msg.reply("Linus Bot: " + reply);
        if(reply == "Taiwan is a country" || reply == "China is great"){
          msg.reply("SOCIAL CREDIT -0923482034823040293482304238409 - USER BANNED");
        }
      });
    } catch {
      msg.reply("Linus Bot: file not found");
    }
=======
      var file = fs.readFileSync(args[0] || 'recording.ogg');
      transcriber(file)
      .then(result => {
        if (!result) throw new Error("no text");
        toneParams = {
          toneInput: {'text': result},
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
            msg.reply(result+"\n"+reply);
          })
        //msg.reply("James Bot: " + reply);
      }).catch(err => msg.reply(err));
    } catch {
      msg.reply("File not found");
    }
    
>>>>>>> 3695814744cdf60788654186e35422e6bcad5823
  }
}