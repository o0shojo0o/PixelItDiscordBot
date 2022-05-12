'use strict';
const messageEmbed = require('discord.js').MessageEmbed;

module.exports = {
    name: 'wiki',
    description: 'The help',
    execute(client, message, args) {
        const response = new messageEmbed().setTitle('Die Dokumentation')
            //.setColor(0x66ff66)
            .setThumbnail('https://docs.bastelbunker.de/hero.png')
            .setURL('https://docs.bastelbunker.de/')
            .setDescription(`Hier ist alles noch mal dokumentiert.
            https://docs.bastelbunker.de/`);
        //message.react('👍');
        message.channel.send({ embeds: [response] });
    },
};