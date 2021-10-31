
const fs = require('fs');
const {transcriber} = require('../speechtotext');

module.exports = {
  name: 'transcribe',
  execute(msg, args) {
    try {
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
  }
}