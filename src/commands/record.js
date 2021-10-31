const {transcriber} = require('../speechtotext');
const {joinVoiceChannel, EndBehaviorType} = require('@discordjs/voice');
const fs = require('fs');
const {toneAnalyzer} = require('../analyzer');
const {Readable} = require('stream');


const SILENCE_FRAME = Buffer.from([0xF8, 0xFF, 0xFE]);
class Silence extends Readable {
  _read(){
    this.push(SILENCE_FRAME);
    this.destroy();
  }
}

module.exports = {
  name: 'record',
  async execute(msg, args) {
    if (!msg.member.voice.channel) {
      msg.reply('Please join a voice channel first!');
    } else {
      const connection = joinVoiceChannel({
        channelId: msg.member.voice.channel.id,
        guildId: msg.channel.guild.id,
        adapterCreator: msg.channel.guild.voiceAdapterCreator,
        selfDeaf: false,
      });

      const opusStream = connection.receiver.subscribe(msg.member.id, {
      end: {
        behavior: EndBehaviorType.AfterSilence,
        duration: 100,
      },
      });
    
      const oggStream = new opus.OggLogicalBitstream({
        opusHead: new opus.OpusHead({
          channelCount: 2,
          sampleRate: 48000,
        }),
        opusTags: new opus.OpusTags({
          maxPackets: 10,
        }),
      });
    
      const filename = `./recording.ogg`;
    
      const out = fs.createWriteStream(filename);
    
      pipeline(opusStream, oggStream, out, (err) => {
        if (err) {
          console.warn(`❌ Error recording file ${filename} - ${err.message}`);
        } else {
          console.log(`✅ Recorded ${filename}`);
        }
      });

      // stream = connection.receiver.subscribe(msg.member.id, {
      //   end: {
      //     behavior: EndBehaviorType.AfterSilence,
      //     duration: 100,
      //   },
      // }) 
      // // writer = stream.pipe(fs.createWriteStream('./recording.pcm'));
      // writer = stream.pipe(fs.createWriteStream('./recording.opus'));
      // stream.on('end', () => {
      //   console.log('end')
      // });
    }
  }
};