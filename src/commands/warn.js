const Discord = require('discord.js');

module.exports = {
	name: 'warn',
	execute(msg, args) {
	  member = msg.mentions.members?.first();
	  if (member) {
		  msg.channel.send({ embeds: [{
			title: 'Warning',
			description: `${member}, please calm down. Anger is not allowed on voice chats. Next time you will be muted.`,
		  }]})
	  }
	}
  }