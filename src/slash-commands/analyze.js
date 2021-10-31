const {SlashCommandBuilder} = require('@discordjs/builders')
const {toneAnalyzer} = require('../analyzer');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('analyze')
		.setDescription('Analyzes the given text for emotions')
		.addStringOption(option => option
			.setName('text')
			.setDescription('The member to mute')
			.setRequired(true)
		),
  async execute(interaction) {
    text = interaction.options.getString('text')
    toneParams = {
      toneInput: {'text': text},
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
        interaction.reply(`Analysis for "${text}"\n${reply}`);
      })
  }
}