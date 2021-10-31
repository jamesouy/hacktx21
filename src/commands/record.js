const {SlashCommandBuilder} = require('@discordjs/builders')
const {transcriber} = require('../speechtotext');
const {joinVoiceChannel, EndBehaviorType} = require('@discordjs/voice');
const fs = require('fs');
const {toneAnalyzer} = require('../analyzer');
const {Readable} = require('stream');

const {opus} = require('prism-media');
const {pipeline} = require('stream');
const { OpusStream } = require('prism-media/dist/opus/OpusStream');
const transcribe = require('./transcribe');

const SILENCE_FRAME = Buffer.from([0xF8, 0xFF, 0xFE]);

function recordUser(connection, id, msg){
  const opusStream = connection.receiver.subscribe(id, {
      end: {
        behavior: EndBehaviorType.AfterSilence,
        duration: 2000,
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
  
    const filename = './recordings/r'+id+'.ogg';
  
    const out = fs.createWriteStream(filename);
  
    pipeline(opusStream, oggStream, out, (err) => {
      if (err) {
        console.warn(`❌ Error recording file ${filename} - ${err.message}`);
      } else {
        console.log(`✅ Recorded ${filename}`);
        transcribe.execute(msg,filename);
        fs.unlinkSync(`${filename}`);
        recordUser(connection, id, msg);
      }
    });

    setTimeout(()=>{
      opusStream.push(null);
      opusStream.destroy();
    }, 5_000);
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

      const ids = Array.from(msg.member.voice.channel.members.keys());

      for(var i in ids){
        console.log(ids[i]);
        
        recordUser(connection, ids[i], msg);
      }

    }
  }
};