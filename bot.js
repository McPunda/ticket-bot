const discord = require('discord.js');
const client = new discord.Client();

const config = require('./config.json');

var userTickets = new Map(); 

client.login(config.token);

client.on('ready', () => {
    console.log(client.user.username + " has logged in.");
});

client.on('message', message => {
    if(message.author.bot) {
        if(message.embeds.length === 1 && message.embeds[0].description.startsWith('React')) {
            message.react(':ticketreact:625925895013662721')
            .then(msgReaction => console.log('Reacted.'))
            .catch(err => console.log(err));
        }
        if(message.embeds.length === 1 && message.embeds[0].title === 'Ticket Support') {
            message.react(':checkreact:625938016510410772')
            .then(reaction => console.log("Reacted with " + reaction.emoji.name))
            .catch(err => console.log(err));
        }
    };
    if(message.content.toLowerCase() === '?create' && message.channel.id === '643744578280882176') {

        if(userTickets.has(message.author.id) || 
        message.guild.channels.some(channel => channel.name.toLowerCase() === message.author.username + 's-ticket')) {
            message.author.send("You already have a ticket");
        } 
        else {
            let guild = message.guild;
            message.reply('Ticket Created')
            .then(msg => {
                msg.delete(5000)
            })
            .catch(err => console.log(err));
            message.author.send('Use /bk, /galaxy /ikonik /feedback in your ticket to see instructions')
            guild.createChannel(`${message.author.username}s-ticket`, {
                type: 'text',
                permissionOverwrites: [
                    {
						allow: 'VIEW_CHANNEL',
                        id: message.author.id
                    },
                    {
                        deny: 'VIEW_CHANNEL',
                        id: guild.id
                    },
                    {
						allow: 'VIEW_CHANNEL',
                        id: '455381569486454786'
					},
                ],
            }).then(ch => {
                userTickets.set(message.author.id, ch.id); 
            }).catch(err => console.log(err));
        }
    }
    else if(message.content.toLowerCase() === '?delete') { 
        if(userTickets.has(message.author.id)) { 
            if(message.channel.id === userTickets.get(message.author.id)) {
                message.channel.delete('closing ticket') 
                .then(channel => {
                    console.log("Deleted " + channel.name);
                    userTickets.delete(message.author.id);
                })
                .catch(err => console.log(err));
            }
        }
        if(message.guild.channels.some(channel => channel.name.toLowerCase() === message.author.username + 's-ticket')) {
            message.guild.channels.forEach(channel => {
                if(channel.name.toLowerCase() === message.author.username + 's-ticket') {
                    channel.delete().then(ch => console.log('Deleted Channel ' + ch.id))
                    .catch(err => console.log(err));
                }
            });
        }
    }
});

client.login(process.env.BOT_TOKEN);//BOT_TOKEN is the Client Secret
