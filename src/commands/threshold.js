
var threshold = 0.6;
const thresholdRange = [0, 1];

module.exports = {
  threshold,
  name: 'threshold',
  execute(msg, args) {
    if (args.length == 0) {
      msg.reply('The current threshold is: ' + threshold);
    } else {
      if (isNaN(parseFloat(args[0]))) {
        msg.reply("Cannot convert to a number");
        return;
      } else if (parseFloat(args[0]) < thresholdRange[0] || parseFloat(args[0]) > thresholdRange[1]) {
        msg.reply("Threshold should be between " + thresholdRange[0] + " and " + thresholdRange[1]);
        return;
      } else {
        threshold = parseFloat(args[0]);
        msg.reply("Successfully set the threshold to " + threshold);
      }
    }
  }
}