// Require the necessary discord.js classes
const fs = require('fs');
const { Client, Intents } = require('discord.js');
const Discord = require('discord.js');
require('dotenv').config();

// Initialize bot client
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
client.login(process.env.BOT_TOKEN);

// Initializing commands
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.once('ready', () => console.log('The Bot is ready!'));

client.on('message', (msg) => {

	if (!msg.content.startsWith("?")) return;
	args = msg.content.slice(1).trim().split(/\s+/);

	for (const [name, command] of client.commands) {
		if (args[0].toLowerCase() == name.toLowerCase()) {
			try {
				command.execute(msg, args.slice(1));
			} catch (err) {
				msg.channel.send(
					new Discord.MessageEmbed()
						.setTitle('OOF!')
						.setDescription('Error occured lol ur so bad at coding')
				);
				console.error(err);
			}
			break;
		}
	}
	
	
	
});
