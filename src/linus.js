// import { privateEncrypt } from "crypto";

// // Require the necessary discord.js classes
const fs = require('fs');
const {Client, Intents} = require('discord.js');
// const {createDiscordJSAdapter} = require './adapter';
const Discord = require('discord.js');
const {joinVoiceChannel} = require('@discordjs/voice');
const {Readable} = require('stream');
require('dotenv').config();

const {EndBehaviorType, VoiceReceiver} = require('@discordjs/voice');
const { createWriteStream } = require('node:fs');
const prism = require('prism-media');
const pipeline = require('node:stream');
const { OpusStream } = require('prism-media/dist/opus/OpusStream');

 function createListeningStream(receiver, userId) {
	const opusStream = receiver.subscribe(userId, {
		end: {
			behavior: EndBehaviorType.AfterSilence,
			duration: 100,
		},
	});


	const oggStream = new prism.opus.OggLogicalBitstream({
		opusHead: new prism.opus.OpusHead({
			channelCount: 2,
			sampleRate: 48000,
		}),
		pageSizeControl: {
			maxPackets: 10,
		},
	});


	const filename = `./hello.ogg`;

	const out = createWriteStream(filename);

	console.log(`👂 Started recording ${filename}`);

  console.log(opusStream);
  console.log(oggStream);
  console.log(out);

	// pipeline(opusStream, oggStream, out, (err) => {
	// 	if (err) {
	// 		console.warn(`❌ Error recording file ${filename} - ${err.message}`);
	// 	} else {
	// 		console.log(`✅ Recorded ${filename}`);
	// 	}
	// });
  // opusStream.pipe(oggStream, (err)=>console.log("error1")).pipe(out, (err)=>console.log("error2"));
  opusStream.on('error', function(e){handleError(e)})
.pipe(oggStream)
.on('error', function(e){handleError(e)})
.pipe(out)
.on('error', function(e){handleError(e)});

}



const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]});
client.login(process.env.BOT_TOKEN);

client.on('ready', () => console.log('The Bot is ready!'));

client.on('message', (msg) => {

  var params = msg.content.split(" ");
  if (params[0] === '?record') {
    if (!msg.member.voice.channel) {
      msg.reply('Please join a voice channel first!');
    } else {
      const connection = joinVoiceChannel({
        channelId: msg.member.voice.channel.id,
        guildId: msg.guild.id,
        adapterCreator: msg.guild.voiceAdapterCreator,
        selfDeaf: false, 
      });
    
      const receiver = connection.receiver;

      console.log(msg.member.id);
      createListeningStream(receiver, msg.member.id);

    }
  }
});
