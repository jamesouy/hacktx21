const {transcriber} = require('../speechtotext');
const {joinVoiceChannel, getVoiceConnection} = require('@discordjs/voice');
const fs = require('fs');
const {toneAnalyzer} = require('../analyzer');
const {maxHeaderSize} = require("http");

async function connectToChannel(channel) {
  const connection = joinVoiceChannel({
    channelId: channel.id,
    guildId: channel.guild.id,
    adapterCreator: createDiscordJSAdapter(channel),
  });

  try {
    await entersState(connection, VoiceConnectionStatus.Ready, 30e3);
    return connection;
  } catch (error) {
    connection.destroy();
    throw error;
  }
}

module.exports = {
  name: 'record',
  execute(msg, args) {
    if (!msg.member.voice.channel) {
      msg.reply('Please join a voice channel first!');
    } else {
      msg.member.voice.channel.join()
      .then(conn => 
      {
        const dispatcher = conn.play(__dirname + '/../sounds/jimmy.mp3');
        dispatcher.on('finish', () => {console.log(`Joined ${voiceChannel.name}!\n\nREADY TO RECORD\n`);});
        const receiver = connection.receiver;
        connection.on('speaking', (user, speaking) => {
          if (speaking) {
            console.log(`${user.username} started speaking`);
            const audioStream = receiver.createStream(user, {mode: 'mp3'});
            audioStream.on('end', () => {console.log(`${user.username} stopped speaking`);});
            var text = transcriber(audioStream);
            toneAnalyzer.tone(toneParams)
              .then(toneAnalysis => {
                let reply = JSON.stringify(toneAnalysis.result, null, 2);
                toneAnalysis.result.document_tone.tones.forEach(tone => {
                  if (tone.tone_id == "anger" && tone.score >= angerThreshold) {
                    reply += "\n-1 social credit";
                  } else if (tone.tone_id == "joy" && tone.score >= joyThreshold) {
                    reply += "\n+1 social credit";
                  }
                });
                msg.reply(reply);
              })
          }
        });
      });
    }
  }
};