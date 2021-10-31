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
const { Client } = require('discord.js');
const filename = `../recording.ogg`;

var recording = false;
var timer;
var connection;
var leave;

function recordUser(connection, id, msg){
  const filename = './recordings/r'+id+'.ogg';

  if(!fs.existsSync(`${filename}`)) {
    const opusStream = connection.receiver.subscribe(id, {
        end: {
        behavior: EndBehaviorType.AfterSilence,
        duration: 1000,
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
        transcribe.execute(msg, [filename, id]);
        fs.unlinkSync(`${filename}`);
        recordUser(connection, id, msg); // recursive call to keep tracking
      }
    });

    setTimeout(()=>{
      console.log("Stream closed");
      opusStream.push(null);
      // opusStream.unpipe(oggStream);
      // opusStream.emit('close');
      opusStream.destroy();
    }, 5_000);
  }
}

module.exports = {
  name: 'session',
  async execute(msg, args) {
    if(recording){
      recording = false;
      connection.destroy();
      clearTimeout(leave);
    } else {
      if (!msg.member.voice.channel) {
          msg.reply('Please join a voice channel first!');
      } else {
        recording = true;

        connection = joinVoiceChannel({
            channelId: msg.member.voice.channel.id,
            guildId: msg.channel.guild.id,
            adapterCreator: msg.channel.guild.voiceAdapterCreator,
            selfDeaf: false,
        });

        const ids = Array.from(msg.member.voice.channel.members.keys());
        for(var i in ids){
          if(ids[i] != 904103150758293514){ // Bot ID
            const filename = './recordings/r'+ids[i]+'.ogg';
            if(fs.existsSync(`${filename}`)){
              fs.unlinkSync(`${filename}`);
            }
            recordUser(connection, ids[i], msg);
          }
        } 

        leave = setTimeout(() => execute(msg, args), 3600000);
      }
    }
  }
};