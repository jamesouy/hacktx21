const {SlashCommandBuilder} = require('@discordjs/builders')
const Discord = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
	.setName('warn')
	.setDescription('Warns a member')
	.addUserOption(option => option
		.setName('member')
		.setDescription('The member to warn')
		.setRequired(true)
		),
		async execute(interaction) {
			member = interaction.options.getMember('member')
			await interaction.reply({ embeds: [{
				title: 'Warning',
				description: `${member}, please calm down. Anger is not allowed on voice chats. Next time you will be muted.`,
			}]})
		}
	}