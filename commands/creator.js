'use strict';
const messageEmbed = require('discord.js').MessageEmbed;

module.exports = {
    name: 'creator',
    description: 'creator',
    execute(client, message, args) {
        const response = new messageEmbed().setTitle('Der Pixel Creator')
            //.setColor(0x66ff66)
            .setThumbnail('https://docs.bastelbunker.de/pixel_creator.png')
            .setURL('https://docs.bastelbunker.de/pixelit/tools.html#pixel-creator')
            .setDescription(`Hier kannst Du deine eigenen PixelArt Bilder erstellen und speichern.
            https://docs.bastelbunker.de/pixelit/tools.html#pixel-creator`);  
        //message.react('👍');
        message.channel.send(response);
    },
};