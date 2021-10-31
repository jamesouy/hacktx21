
const fs = require('fs');
const {transcriber} = require('../speechtotext');

module.exports = {
  name: 'transcribe',
  execute(msg, args) {
    var file = fs.readFileSync("jimmy.mp3");
    transcriber(file)
    .then(result => {
      let reply = result;
      msg.reply(reply);
    })
  }
}