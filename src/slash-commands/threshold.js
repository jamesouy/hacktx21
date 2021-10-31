const {SlashCommandBuilder} = require('@discordjs/builders')

var threshold = 0.6;
const thresholdRange = [0, 1];

module.exports = {
  threshold,
	data: new SlashCommandBuilder()
		.setName('threshold')
		.setDescription('Sets the emotion threshold')
		.addNumberOption(option => option
			.setName('threshold')
			.setDescription('The emotion threshold')
			.setRequired(false)
		),
  async execute(interaction) {
    num = interaction.options.getNumber('threshold')
    if (!num) {
      await interaction.reply('The current threshold is: ' + threshold);
    } else {
      if (num < thresholdRange[0] || num > thresholdRange[1]) {
        interaction.reply("Threshold should be between " + thresholdRange[0] + " and " + thresholdRange[1]);
        return;
      } else {
        threshold = num;
        interaction.reply("Successfully set the threshold to " + threshold);
      }
    }
  }
}