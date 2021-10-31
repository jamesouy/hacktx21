const {SlashCommandBuilder} = require('@discordjs/builders')
const fs = require('fs');
const {transcriber} = require('../speechtotext');
const {toneAnalyzer} = require('../analyzer');
const {threshold} = require('../slash-commands/threshold');
const warn = require('../slash-commands/warn');

const gifs = ['gifs/gif1.gif', 'gifs/gif2.gif', 'gifs/gif3.gif', 'gifs/gif4.gif',
'gifs/gif5.gif', 'gifs/gif6.gif'];
module.exports = {
  name: 'transcribe',
  execute(msg, args) {
    try {
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
                console.log(tone);
                if (tone.score >= threshold) {
                  reply += "\nYour emotion is "+tone.tone_name+".";
                  if(tone.tone_id == 'anger') {
                    var f = gifs[Math.floor(Math.random() * gifs.length)];
                      msg.reply({ embeds: [{
                        title: 'Warning',
                        description: `${msg.member}, we've detected that you're feeling angry. Here's a gif to cheer you up!`,
                      }],
                      files: [`${f}`]
                    })
                  }
                }
              });
              if(args.length < 2){
                msg.reply(result + "\n" + reply);
              } else {
                msg.channel.send(msg.guild.members.cache.get(args[1]).toString() + " " + result+"\n"+reply);
              }
            })
        }        
        //msg.reply("James Bot: " + reply);
      }).catch(err => msg.reply(err));
    } catch {
      if(args.length < 2){
        msg.reply("File not found");
      } else {
        msg.channel.send(msg.guild.members.cache.get(args[1]).toString() + " File not found");
      }
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