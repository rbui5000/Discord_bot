const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const client = new Discord.Client();

client.once('ready', () => {
	console.log('Ready!');
});


client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();

	if (message.content.startsWith(`${prefix}ping`)) {
        // send back "Pong." to the channel the message was sent in
        message.channel.send('Pong.');
    } else if (message.content.startsWith(`${prefix}beep`)) {
        message.channel.send('Boop.');
    } else if (message.content === `${prefix}server`) {
        message.channel.send(`This server's name is: ${message.guild.name}\nTotal members: ${message.guild.memberCount}`);
    }
});


client.login(token);
