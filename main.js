const util = require('minecraft-server-util');
const mcping = require('mc-ping-updated');
const Discord = require('discord.js');
const config = require('./config');

let pingFrequency = (30 * 1000);

const client = new Discord.Client({
    disableMentions: 'all'
});

client.on('ready', async () => {
    console.log('READY!');
    getServerStatus();
    client.setInterval(getServerStatus, pingFrequency);
});

client.on('message', message => {
    if (message.content.trim() == config.prefix + 'status') {
        return replyStatus(message);
    }
});

async function replyStatus(message) {
    util.status(config.host, {
        port: config.portNumber
    }).then(async res => {
        const embed = new Discord.MessageEmbed()
        if (message.guild.me.roles.highest.color === 0) {
            embed.setColor(0x2EAAD3)
        } else {
            embed.setColor(message.guild.me.roles.highest.color)
        }
        embed.setTitle('Minecraft Server')
        embed.addField('Host/IP', res.host, true)
        embed.addField('Description', res.description.descriptionText)
        console.log(res.onlinePlayers)
        embed.addField('Version', res.version, true)
        if (res.onlinePlayers === 0) {
            embed.addField('Players', 'No one is playing')
        } else {
            embed.addField('Players', res.samplePlayers.map(p => p.name).join('\n').substr(0, 1024))
        }
        embed.setTimestamp();

        return message.channel.send(embed);
    }).catch(async err => {
        return message.channel.send('Error getting Minecraft server status...');
    });
}

async function getServerStatus() {
    mcping(config.host, config.port, async function (err, res) {
        let serverStatus = '';
        if (!(typeof err === 'undefined' || err === null)) {
            client.user.setStatus('dnd');

            serverStatus = 'Server offline';

            client.user.setActivity(serverStatus, {
                type: 'PLAYING'
            });
        }
        if (typeof res.players.sample === 'undefined') {
            client.user.setStatus('idle');
        }
        if (!(typeof res.players.sample === 'undefined')) {
            client.user.setStatus('online');
        }

        serverStatus = 'Players: ' + res.players.online + ' / ' + res.players.max + ' | ' + config.prefix + 'status';

        client.user.setActivity(serverStatus, {
            type: 'PLAYING'
        });
    });
}

client.login(config.token);