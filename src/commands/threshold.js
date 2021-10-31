
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
      msg.reply('The current anger threshold is ' + angerThreshold);
    } else if (isNaN(parseFloat(args[0]))) {
      msg.reply("Cannot convert to a number");
    } else if (parseFloat(args[0]) < thresholdRange[0] || parseFloat(args[0]) > thresholdRange[1]) {
      msg.reply("Threshold should be between " + thresholdRange[0] + " and " + thresholdRange[1]);
    } else {
      angerThreshold = parseFloat(args[0]);
      msg.reply("Successfully set the anger threshold to " + angerThreshold);
    }
  }
}