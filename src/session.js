const fs = require('fs');
const {joinVoiceChannel, EndBehaviorType} = require('@discordjs/voice');
const {transcriber} = require('./speechtotext');
const {toneAnalyzer} = require('./analyzer');
const {threshold} = require('./slash-commands/threshold');
const {opus} = require('prism-media');
const {pipeline} = require('stream');

var isRecording = false
var connection;
var leave;

const gifs = ['gifs/gif1.gif', 'gifs/gif2.gif', 'gifs/gif3.gif', 'gifs/gif4.gif',
'gifs/gif5.gif', 'gifs/gif6.gif'];

function recordUser(connection, id, channel){
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
        transcribe(channel, filename, id);
        fs.unlinkSync(`${filename}`);
        recordUser(connection, id, channel); // recursive call to keep tracking
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

function startSession(voiceChannel, msgChannel) {
	if (isRecording) return
	isRecording = true;
	connection = joinVoiceChannel({
			channelId: voiceChannel.id,
			guildId: voiceChannel.guild.id,
			adapterCreator: voiceChannel.guild.voiceAdapterCreator,
			selfDeaf: false,
	});

	const ids = Array.from(voiceChannel.members.keys());
	for(var i in ids){
		if(ids[i] != 904103150758293514){ // Bot ID
			const filename = './recordings/r'+ids[i]+'.ogg';
			if(fs.existsSync(`${filename}`)){
				fs.unlinkSync(`${filename}`);
			}
			recordUser(connection, ids[i], msgChannel);
		}
	} 

	leave = setTimeout(() => session.stopSession(), 3600000);
}

function stopSession() {
	if (!isRecording) return
	isRecording = false;
	connection.destroy();
	clearTimeout(leave);
}

function transcribe(channel, filename, id) {
	try {
		var file = fs.readFileSync(filename);
		transcriber(file)
		.then(result => {
			if(!result || result.length < 2){
				console.log("no text");
			} else {
				toneParams = {
					toneInput: {'text': result},
					contentType: 'application/json',
				};
				toneAnalyzer.tone(toneParams)
					.then(toneAnalysis => {
						let reply = JSON.stringify(toneAnalysis.result, null, 2);
						toneAnalysis.result.document_tone.tones.forEach(tone => {
							console.log(tone);
							if (tone.score >= threshold) {
								reply += "\nYour emotion is "+tone.tone_name+".";
								if(tone.tone_id == 'anger') {
									var f = gifs[Math.floor(Math.random() * gifs.length)];
										channel.send({ embeds: [{
											title: 'Warning',
											description: `<!@${id}>, we've detected that you're feeling angry. Here's a gif to cheer you up!`,
										}],
										files: [`${f}`]
									})
								}
							}
						});
						channel.send(channel.guild.members.cache.get(id).toString() + " " + result+"\n"+reply);
					})
			}
		}).catch(err => console.error(err));
	} catch {
		channel.send(channel.guild.members.cache.get(id).toString() + " File not found")
		.catch(console.error)
	}
}

module.exports = {
	isRecording,
	startSession,
	stopSession,
}