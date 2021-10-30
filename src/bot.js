// import { privateEncrypt } from "crypto";

// // Require the necessary discord.js classes
const fs = require('fs');
const { Client, Intents } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');
require('dotenv').config();

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
client.login(process.env.BOT_TOKEN);

// Initializing commands
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.on('ready', () => console.log('The Bot is ready!'));

//const {toneAnalyzer} = require('./analyzer');
// START OF COPIED SECTION FROM ANALYZER.TS
const ToneAnalyzerV3 = require('ibm-watson/tone-analyzer/v3');
const { IamAuthenticator } = require('ibm-watson/auth');

const toneAnalyzer = new ToneAnalyzerV3({
	version: '2017-09-21',
	authenticator: new IamAuthenticator({
		apikey: process.env.IBM_API_KEY,
	}),
	serviceUrl: 'https://api.us-south.tone-analyzer.watson.cloud.ibm.com',
});
// END OF COPIED SECTION FROM ANALYZER.TS

var angerThreshold = 0.6;
var joyThreshold = 0.6;
const thresholdRange = [0, 1];

function commandListen(message) {
	var member = message.member;
	if (!member) {
		return;
	}
	if (!member.voiceChannel) {
		message.reply(" you need to be in a voice channel first.");
		return;
	}
	if (listening) {
		message.reply(" a voice channel is already being listened to!");
		return;
	}

	listening = true;
	var voiceChannel = member.voiceChannel;
	voiceChannel.join().then((connection) => {
		message.reply("now inside voice channel");
	}).catch(console.error);
}

client.on('message', (msg) => {
	var params = msg.content.split(" ");
	if (params[0] === '?threshold') {
		if(isNaN(parseFloat(params[1]))){
			msg.reply("Cannot convert to a number");
		} else if (parseFloat(params[1]) < thresholdRange[0] || parseFloat(params[1]) > thresholdRange[1]) {
			msg.reply("Threshold should be between " + thresholdRange[0] + " and " + thresholdRange[1]);
		} else {
			angerThreshold = parseFloat(params[1]);
			msg.reply("Successfully set the anger threshold to " + angerThreshold);
		}
	}
	else if(params[0] === '?printThreshold'){
		msg.reply('The current anger threshold is ' + angerThreshold);
	}
	else if (params[0] === "?analyzeText") {
		const toneParams = {
			toneInput: { 'text': msg.content.substring(13) || "" },
			contentType: 'application/json',
		};
		toneAnalyzer.tone(toneParams)
			.then(toneAnalysis => {
				msg.reply(JSON.stringify(toneAnalysis.result, null, 2));
				toneAnalysis.result.document_tone.tones.forEach(tone => {
					
				})
			})
			.catch(err => {
				console.log('error:', err);
			});
	} else if (params[0] === '?record') {
		var voiceChannel = msg.member.voice.channel.id;
		if (!voiceChannel) {
			msg.reply('Please join a voice channel first!');
		} else {
			client.channels.get(voiceChannel).join();
		}
	} else if (params[0] === '?transcribe') {
		
	} else if (params[0]==='?start'){
		commandListen(msg);
	}
});
