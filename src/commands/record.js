const {config, transcriber} = require('../speechtotext');
const {joinVoiceChannel, getVoiceConnection} = require('@discordjs/voice');

module.exports = {
  name: 'record',
  execute(msg, args) {
    if (!msg.member.voice.channel) {
      msg.reply('Please join a voice channel first!');
    } else {
      const voiceConnection = joinVoiceChannel({
        channelId: msg.member.voice.channel.id,
        guildId: msg.guild.id,
        adapterCreator: msg.guild.voiceAdapterCreator,
        selfDeaf: false,
      });
    }
  }
};