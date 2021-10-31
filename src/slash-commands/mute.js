const {SlashCommandBuilder} = require('@discordjs/builders')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('mute')
		.setDescription('Mutes a member')
		.addUserOption(option => option
			.setName('member')
			.setDescription('The member to mute')
			.setRequired(true)
		),
  async execute(interaction) {
    member = interaction.options.getMember('member')
    member.voice.setMute()
    interaction.reply("muted")
  }
}