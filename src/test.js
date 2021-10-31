// import { privateEncrypt } from "crypto";

// // Require the necessary discord.js classes
const fs = require('fs');
const {Client, Intents} = require('discord.js-v12');
// const {createDiscordJSAdapter} = require './adapter';
const Discord = require('discord.js-v12');
const {joinVoiceChannel} = require('@discordjs/voice');
const {OpusEncoder} = require('@discordjs/opus');
const {Readable} = require('stream');
require('dotenv').config();

const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]});
client.login(process.env.BOT_TOKEN);

const SILENCE_FRAME = Buffer.from([0xF8, 0xFF, 0xFE]);

class Silence extends Readable {
  _read() {
    this.push(SILENCE_FRAME);
    this.destroy();
  }
}

// Initializing commands
// client.commands = new Discord.Collection();
// const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));
// for (const file of commandFiles) {
// 	const command = require(`./commands/${file}`);
// 	client.commands.set(command.name, command);
// }

client.on('ready', () => console.log('The Bot is ready!'));

const {toneAnalyzer} = require('./analyzer');
const {config, transcriber} = require('./speechtotext');
// START OF COPIED SECTION FROM ANALYZER.TS
// const ToneAnalyzerV3 = require('ibm-watson/tone-analyzer/v3');
// const { IamAuthenticator } = require('ibm-watson/auth');

// const toneAnalyzer = new ToneAnalyzerV3({
// 	version: '2017-09-21',
// 	authenticator: new IamAuthenticator({
// 		apikey: process.env.IBM_API_KEY,
// 	}),
// 	serviceUrl: 'https://api.us-south.tone-analyzer.watson.cloud.ibm.com',
// });
// END OF COPIED SECTION FROM ANALYZER.TS

var angerThreshold = 0.6;
var joyThreshold = 0.6;
const thresholdRange = [0, 1];


client.on('message', (msg) => {

  var params = msg.content.split(" ");
  if (params[0] === '?record') {
    if (!msg.member.voice.channel) {
      msg.reply('Please join a voice channel first!');
    } else {
      const fs = require('fs');

      // Create a ReadableStream of s16le PCM audio
      const audio = connection.receiver.createStream(user, {mode: 'pcm'});

      audio.pipe(fs.createWriteStream('user_audio'));
      
      
    }
  }


  // James' stuff below (working on splitting commands into different files)

  if (!msg.content.startsWith("?")) return;
  args = msg.content.slice(1).trim().split(/\s+/);



});
