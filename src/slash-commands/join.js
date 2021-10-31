const {SlashCommandBuilder} = require('@discordjs/builders')
const session = require('../session')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('join')
		.setDescription('Join your current channel'),
	async execute(interaction) {
    if(session.isRecording) {
			await interaction.reply('I am already in a channel!')
			return
		}
		if (!interaction.member.voice.channel) {
				interaction.reply('Please join a voice channel first!');
				return
		}
		session.startSession(interaction.member.voice.channel, interaction.channel);
		leave = setTimeout(() => session.stopSession(), 3600000);
		await interaction.reply("Joined channel!")
	},
}