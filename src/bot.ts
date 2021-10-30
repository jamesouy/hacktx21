// import { privateEncrypt } from "crypto";

// // Require the necessary discord.js classes
const { Client, Intents } = require('discord.js');
const Discord = require('discord.js');
require('dotenv').config();
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
client.login(process.env.BOT_TOKEN);

client.on('ready', () => console.log('The Bot is ready!'));

var angerThreshold = 0.4;
const thresholdRange = [0, 1];

client.on('message', (msg) => {
	var params = msg.content.split(" ");
	if (params[0] === '?threshold') {
		if(isNaN(parseFloat(params[1]))){
			msg.channel.send("Cannot convert to a number");
		} else if (parseFloat(params[1]) < thresholdRange[0] || parseFloat(params[1]) > thresholdRange[1]) {
			msg.channel.send("Threshold should be between " + thresholdRange[0] + " and " + thresholdRange[1]);
		} else {
			angerThreshold = parseFloat(params[1]);
			msg.channel.send("Successfully set the anger threshold to " + angerThreshold);
		}
	}
	if(params[0] === '?printThreshold'){
		msg.channel.send('The current anger threshold is ' + angerThreshold);
	}
});
