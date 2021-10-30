// Require the necessary discord.js classes
const { Client, Intents } = require('discord.js');

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
});

// Login to Discord with your client's token
client.login("OTA0MDkwMzkyODI2MzU1NzUz.YX2dyg.zscL-pr4VzxHjC2vW75K_ZO5eZE");

client.on('message', (msg : any) => {
	if (msg.content === '?set') msg.reply('Hi');
});