// (in case stuff in separate command files weren't up to date)


// // Require the necessary discord.js classes
const fs = require('fs');
const {Client, Intents} = require('discord.js');
const Discord = require('discord.js');
require('dotenv').config();

// Initialize bot client
const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]});
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
  function _() {
    var params = msg.content.split(" ");
    if (params[0] === '?threshold') {
      // TODO: change both anger and joy thresholds
      if (isNaN(parseFloat(params[1]))) {
        msg.reply("Cannot convert to a number");
      } else if (parseFloat(params[1]) < thresholdRange[0] || parseFloat(params[1]) > thresholdRange[1]) {
        msg.reply("Threshold should be between " + thresholdRange[0] + " and " + thresholdRange[1]);
      } else {
        angerThreshold = parseFloat(params[1]);
        msg.reply("Successfully set the anger threshold to " + angerThreshold);
      }
    }
    else if (params[0] === '?printThreshold') {
      msg.reply('The current anger threshold is ' + angerThreshold);
    }
    else if (params[0] === "?analyzeText") {
      const toneParams = {
        toneInput: {'text': msg.content.substring(13) || ""},
        contentType: 'application/json',
      };
      toneAnalyzer.tone(toneParams)
        .then(toneAnalysis => {
          let reply = JSON.stringify(toneAnalysis.result, null, 2);
          toneAnalysis.result.document_tone.tones.forEach(tone => {
            if (tone.tone_id == "anger" && tone.score >= angerThreshold) {
              reply += "\nYou sound angwy.";
            } else if (tone.tone_id == "joy" && tone.score >= joyThreshold) {
              reply += "\nYou sound joyous.";
            }
          });
          msg.reply(reply);
        })
        .catch(err => {
          console.log('error:', err);
        });
    } else if (params[0] === '?record') {
      if (!msg.member.voice.channel) {
        msg.reply('Please join a voice channel first!');
      } else {
        joinVoiceChannel({
          channelId: msg.member.voice.channel.id,
          guildId: msg.guild.id,
          adapterCreator: msg.guild.voiceAdapterCreator
        });
        const connection = getVoiceConnection(msg.member.voice.channel.guild.id);
      }
    } else if (params[0] === '?transcribe') {
      var file = fs.readFileSync("synthesize.mp3");
      msg.reply(transcriber(file));
    }
  }


  // James' stuff below (working on splitting commands into different files)

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
