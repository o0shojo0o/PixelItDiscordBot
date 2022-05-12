'use strict';
const messageEmbed = require('discord.js').MessageEmbed;

module.exports = {
    name: 'gallery',
    description: 'Gallery',
    execute(client, message, args) {
        const response = new messageEmbed().setTitle('Die Pixel Gallery')
            //.setColor(0x66ff66)
            .setThumbnail('https://docs.bastelbunker.de/pixel_gallery.png')
            .setURL('https://docs.bastelbunker.de/pixelit/tools.html#pixel-gallery')
            .setDescription(`Die Sammelsteller unser tollen BMP (PixelArt) Bilder.
            https://docs.bastelbunker.de/pixelit/tools.html#pixel-gallery`);
        //message.react('👍');
        message.channel.send({ embeds: [response] });
    },
};