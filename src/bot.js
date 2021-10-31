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
client.slashCommands = new Discord.Collection();
for (const file of fs.readdirSync('./src/slash-commands').filter(file => file.endsWith('.js'))) {
	const command = require(`./slash-commands/${file}`);
	client.slashCommands.set(command.data.name, command);
}

// Initializing testing commands
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.once('ready', () => console.log('The Bot is ready!'));

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;
	const command = client.slashCommands.get(interaction.commandName);
	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (err) {
		console.error(err);
		await interaction.channel.send({ embeds: [{
			title: 'OOF!',
			description: 'Error occured lol ur so bad at coding',
		}]});
	}
})

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
