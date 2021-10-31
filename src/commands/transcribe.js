
const fs = require('fs');
const {transcriber} = require('../speechtotext');

module.exports = {
  name: 'transcribe',
  execute(msg, args) {
    var file = fs.readFileSync(args[0]);
    transcriber(file)
    .then(result => {
      let reply = result;
      msg.reply(reply);
    })
  }
}