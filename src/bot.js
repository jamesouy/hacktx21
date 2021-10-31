// Require the necessary discord.js classes
const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const fs = require('fs');
const { Client, Intents } = require('discord.js');
const Discord = require('discord.js');
require('dotenv').config();

// Initialize bot client
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] });
client.login(process.env.BOT_TOKEN);

// Initializing slash commands
const commands = [
	new SlashCommandBuilder().setName('join').setDescription('Join your current channel'),
	new SlashCommandBuilder().setName('leave').setDescription('Leave the voice channel'),
	new SlashCommandBuilder().setName('autojoin').setDescription('Set whether the bot automatically joins channels'),
].map(command => command.toJSON())
const rest = new REST({ version: '9' }).setToken(process.env.BOT_TOKEN);

// Initializing testing commands
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.once('ready', () => {
	console.log('The Bot is ready!')
});

client.on('messageCreate', async (msg) => {

	if (!msg.content.startsWith("?")) return;
	args = msg.content.slice(1).trim().split(/\s+/);

	for (const [name, command] of client.commands) {
		if (args[0].toLowerCase() == name.toLowerCase()) {
			try {
				command.execute(msg, args.slice(1));
			} catch (err) {
				msg.channel.send({ embeds: [{
					title: 'OOF!',
					description: 'Error occured lol ur so bad at coding',
				}]});
				console.error(err);
			}
			break;
		}
	}
	
	
	
});
