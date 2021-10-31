const fs = require('fs');
const {transcriber} = require('../speechtotext');
const {toneAnalyzer} = require('../analyzer');
const {angerThreshold, joyThreshold} = require('./threshold');

module.exports = {
  name: 'transcribe',
  execute(msg, args) {
    try {
<<<<<<< HEAD
      var file = fs.readFileSync(args[0] || 'recording.ogg');
      transcriber(file)
      .then(result => {
        if(!result || result.length < 2){
          console.log("no text");
        } else {
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
        }        
        //msg.reply("James Bot: " + reply);
      }).catch(err => msg.reply(err));
=======
      var file = fs.readFileSync('./recordings/r'+args[0]+'.ogg');
      transcriber(file)
      .then(result => {
        let reply = result;
        msg.reply("Linus Bot: " + reply);
        if(reply == "Taiwan is a country"){
          msg.reply("SOCIAL CREDIT -0923482034823040293482304238409 - USER BANNED");
        } else if (reply == "China is great"){
          msg.reply("SOCIAL CREDIT +0923482034823040293482304238409 - XI JIN PING APPROVED");
        }
      });
>>>>>>> 066b64e342da9d4902fe42b55c6ca9dcc2bca1f7
    } catch {
      msg.reply("Linus Bot: file not found");
    }
    //   var file = fs.readFileSync(args[0] || 'recording.ogg');
    //   transcriber(file)
    //   .then(result => {
    //     if (!result) throw new Error("no text");
    //     toneParams = {
    //       toneInput: {'text': result},
    //       contentType: 'application/json',
    //     };
    //     toneAnalyzer.tone(toneParams)
    //       .then(toneAnalysis => {
    //         let reply = JSON.stringify(toneAnalysis.result, null, 2);
    //         toneAnalysis.result.document_tone.tones.forEach(tone => {
    //           if (tone.tone_id == "anger" && tone.score >= angerThreshold) {
    //             reply += "\nYou sound angwy.";
    //           } else if (tone.tone_id == "joy" && tone.score >= joyThreshold) {
    //             reply += "\nYou sound joyous.";
    //           }
    //         });
    //         msg.reply(result+"\n"+reply);
    //       })
    //     //msg.reply("James Bot: " + reply);
    //   }).catch(err => msg.reply(err));
    // } catch {
    //   msg.reply("File not found");
    // }
    
  }
}