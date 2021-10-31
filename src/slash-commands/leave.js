const {SlashCommandBuilder} = require('@discordjs/builders')
const session = require('../session')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('leave')
		.setDescription('Leave the voice channel'),
	async execute(interaction) {
    if(session.isRecording) {
			session.stopSession();
			await interaction.reply("Joined channel!")
		} else {
			interaction.reply("I am not in a channel or I haven't started a monitoring session yet!")
		}
	},
}