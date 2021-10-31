const {transcriber} = require('../speechtotext');
const {joinVoiceChannel, EndBehaviorType} = require('@discordjs/voice');
const fs = require('fs');
const {toneAnalyzer} = require('../analyzer');
const {Readable} = require('stream');

const {opus} = require('prism-media');
const {pipeline} = require('stream');
const { OpusStream } = require('prism-media/dist/opus/OpusStream');

const SILENCE_FRAME = Buffer.from([0xF8, 0xFF, 0xFE]);
class Silence extends Readable {
  _read(){
    this.push(SILENCE_FRAME);
    this.destroy();
  }
}
const transcribe = require(`./transcribe`);
const filename = `../recording.ogg`;

var recording = false;
var timer;
var connection;

function record(connection, msg) {
  if(!fs.existsSync(`${filename}`)) {
    console.log("RECORDING:");
    const opusStream = connection.receiver.subscribe(msg.member.id, {
        end: {
        behavior: EndBehaviorType.AfterSilence,
        duration: 500,
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
    
    const out = fs.createWriteStream(filename);
    
    pipeline(opusStream, oggStream, out, (err) => {
        if (err) {
          console.warn(`❌ Error recording file ${filename} - ${err.message}`);
        } else {
          console.log(`✅ Recorded ${filename}`);
          transcribe.execute(msg, [`${filename}`]);
          fs.unlinkSync(`${filename}`);
          record(connection, msg); // recursive call to keep tracking
        }
    });
  }
}

module.exports = {
  name: 'session',
  async execute(msg, args) {
      if(recording){
        recording = false;
        connection.destroy();
      } else {
        if (!msg.member.voice.channel) {
            msg.reply('Please join a voice channel first!');
        } else {
          recording = true;

          if(fs.existsSync(`${filename}`)){
            fs.unlinkSync(`${filename}`);
          }

          connection = joinVoiceChannel({
              channelId: msg.member.voice.channel.id,
              guildId: msg.channel.guild.id,
              adapterCreator: msg.channel.guild.voiceAdapterCreator,
              selfDeaf: false,
          });

          record(connection, msg);
        }
    }
  }
};