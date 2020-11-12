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
        replyStatus(message);
    }
});

function replyStatus(message) {
    util.status(config.host, {
        port: config.port
    }).then(res => {
        const embed = new Discord.MessageEmbed()
            .setColor(0x2EAAD3)
            .setTitle('Minecraft Server')
            .addField('Host/IP', res.host, true)
            .addField('Description', res.description.descriptionText)
            .addField('Version', res.version, true)
        if (res.samplePlayers.length === 0) {
            embed.addField('Players', 'No one is playing')
        } else {
            embed.addField('Players', res.samplePlayers.map(p => p.name).join('\n').substr(0, 1024))
        }
        embed.setTimestamp();

        message.channel.send(embed);
    }).catch(err => {
        return message.channel.send('Error getting Minecraft server status...');
    });
}

function getDate() {
    date = new Date();
    cleanDate = date.toLocaleTimeString();
}

function getServerStatus() {
    mcping(config.host, config.port, function (err, res) {
        let serverStatus = '';
        if (!(typeof err === 'undefined' || err === null)) {
            client.user.setStatus('dnd');

            serverStatus = 'Server offline';

            client.user.setActivity(serverStatus, {
                type: 'PLAYING'
            });

            return getDate();
        }
        if (typeof res.players.sample === 'undefined') {
            client.user.setStatus('idle');
        }
        if (!(typeof res.players.sample === 'undefined')) {
            client.user.setStatus('online');
        }

        serverStatus = 'Players: ' + res.players.online + ' / ' + res.players.max + ' | ' + config.prefix + 'status';

        getDate();

        client.user.setActivity(serverStatus, {
            type: 'PLAYING'
        });
    });
}

client.login(config.token);