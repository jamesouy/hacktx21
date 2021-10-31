

module.exports = {
  name: 'mute',
  execute(msg, args) {
	member = msg.mentions.members?.first();
    if (member.voice.channel) {
		member.voice.setMute()
	}
  }
}