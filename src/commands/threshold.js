const {SlashCommandBuilder} = require('@discordjs/builders')

var angerThreshold = 0.6;
var joyThreshold = 0.6;
const thresholdRange = [0, 1];

module.exports = {
  angerThreshold,
  joyThreshold,
  name: 'threshold',
  execute(msg, args) {
    // TODO: set anger and joy threshold individually
    if (args.length == 0) {
      msg.reply('The current thresholds are: \nAnger threshold: ' + angerThreshold + "\nJoy threshold: " + joyThreshold);
    } else if (args.length == 1){
      if(args[0] === 'joy'){
        msg.reply('The current joy threshold is: ' + joyThreshold);
      } else if (args[0] === 'anger'){
        msg.reply('The current anger threshold is: ' + angerThreshold);
      } else {
        msg.reply('Other emotions not yet supported');
      }
    } else {
      var num;
      if (isNaN(parseFloat(args[1]))) {
        msg.reply("Cannot convert to a number");
        return;
      } else if (parseFloat(args[1]) < thresholdRange[0] || parseFloat(args[1]) > thresholdRange[1]) {
        msg.reply("Threshold should be between " + thresholdRange[0] + " and " + thresholdRange[1]);
        return;
      } else {
        num = parseFloat(args[1]);
      }

      if(args[0] === 'joy'){
        joyThreshold = num;
        msg.reply("Successfully set the joy threshold to " + joyThreshold);
      } else if (args[0] === 'anger'){
        angerThreshold = num;
        msg.reply("Successfully set the anger threshold to " + angerThreshold);
      } else {
        msg.reply('Other emotions not yet supported');
      }
      
    }
  }
}