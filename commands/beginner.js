'use strict';
const messageEmbed = require('discord.js').MessageEmbed;

module.exports = {
    name: 'beginner',
    description: 'beginner',
    execute(client, message, args) {
        const response = new messageEmbed().setTitle('Der Einsteiger Flow')
            //.setColor(0x66ff66)
            .setImage('https://docs.bastelbunker.de/einsteiger_flow.png')
            .setURL('https://docs.bastelbunker.de/pixelit/tools.html#einsteiger-flow')
            .setDescription(`Eine kleine Einstiegshilfe 😊.
            https://docs.bastelbunker.de/pixelit/tools.html#einsteiger-flow`);
        //message.react('👍');
        message.channel.send({ embeds: [response] });
    },
};