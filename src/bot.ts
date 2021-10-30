// import { privateEncrypt } from "crypto";

// // Require the necessary discord.js classes
const { Client, Intents } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');
const Discord = require('discord.js');
require('dotenv').config();
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
client.login(process.env.BOT_TOKEN);

client.on('ready', () => console.log('The Bot is ready!'));

//const {toneAnalyzer} = require('./analyzer');

// START OF COPIED SECTION FROM ANALYZER.TS
const ToneAnalyzerV3 = require('ibm-watson/tone-analyzer/v3');
const { IamAuthenticator } = require('ibm-watson/auth');
require("dotenv").config();

const toneAnalyzer = new ToneAnalyzerV3({
	version: '2017-09-21',
	authenticator: new IamAuthenticator({
		apikey: process.env.IBM_API_KEY,
	}),
	serviceUrl: 'https://api.us-south.tone-analyzer.watson.cloud.ibm.com',
});

const text = "Google, headquartered in Mountain View (1600 Amphitheatre Pkwy, Mountain View, CA 940430), unveiled the new Android phone for $799 at the Consumer Electronic Show. Sundar Pichai said in his keynote that users love their new Android phones. I hate Linus.";
// const text = 'Team, I know that times are tough! Product '
//   + 'sales have been disappointing for the past three '
//   + 'quarters. We have a competitive product, but we '
//   + 'need to do a better job of selling it!';

const toneParams = {
	toneInput: { 'text': text },
	contentType: 'application/json',
};
// END OF COPIED SECTION FROM ANALYZER.TS

var angerThreshold = 0.4;
const thresholdRange = [0, 1];

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
				msg.reply(JSON.stringify(toneAnalysis, null, 2));
			})
			.catch(err => {
				console.log('error:', err);
			});
	} else if (params[0] === '?record'){
		console.log(msg.author.voice.channelID);
		// const connection = joinVoiceChannel({
		// 	channelId: msg.author.voice.channelID,
		// 	guildId: channel.guild.id,
		// 	adapterCreator: channel.guild.voiceAdapterCreator,
		// });
	}
});
