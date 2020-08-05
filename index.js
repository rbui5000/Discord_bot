const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const client = new Discord.Client();
var servers = {}; // holds queue of songs

const ytdl = require("ytdl-core");

client.once('ready', () => {
	console.log('Ready!');
});



client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return; // check if message starts with '!' and not from bot

    const args = message.content.substring(prefix.length).split(" "); // split input by space
    switch (args[0]) {
        case 'play':

            function play(connection, message){
                var server = servers[message.guild.id];
                server.dispatcher = connection.play(ytdl(server.queue[0], {filter: "audioonly"}));
                server.queue.shift();
                server.dispatcher.on("finish", function(){
                    if(server.queue[0]){
                        play(connection, message);
                    }else {
                        connection.disconnect();
                    }
                });
            }

            if (!args[1]){
                message.channel.send("you need to provide a link!");
                return;
            }

            if(!message.member.voice.channel){
                message.channel.send("Not a member of channel");
                return;
            }

            if(!servers[message.guild.id]) servers[message.guild.id] = {
                queue: []
            }

            if(!servers[message.guild.id]){
                console.log("making new queue?")
            }

            var server = servers[message.guild.id];

            server.queue.push(args[1]); // add song to queue 

            if(!message.member.voice.connection) message.member.voice.channel.join().then(function(connection){
                play(connection, message);
            })

        break;

        case 'skip':
            var server = servers[message.guild.id];
            if(server.dispatcher) server.dispatcher.end();
            message.channel.send("skipping song");
        break;

        case 'stop':
            var server = servers[message.guild.id];
            if (message.guild.voice.connection){
                for(var i = server.queue.length-1; i >= 0; i--){
                    server.queue.splice(i, 1);
                }
                server.dispatcher.end();
                message.channel.send("Ending the queue leaving the voice channel");
                console.log('stopped the queue');
            }

            if (message.guild.connection) message.guild.voice.connection.disconnect();
        break;




    }

	
});


client.login(token);
