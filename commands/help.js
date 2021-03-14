'use strict';
const messageEmbed = require('discord.js').MessageEmbed;

module.exports = {
    name: 'help',
    description: 'The help',
    execute(client, message, args) {
        const response = new messageEmbed().setTitle('Befehle:')
            //.setColor(0x66ff66)
            .setDescription(`
            :white_small_square: **!wiki** | zeigt den Wiki Link
            :white_small_square: **!beginner** | zeigt den Einsteiger Beispiel Flow Link
            :white_small_square: **!gallery** | zeigt den Pixel Gallery Link
            :white_small_square: **!creator** | zeigt den Pixel Creator Link
            :white_small_square: **!help** | zeigt diese Hilfe...`);  
        //message.react('👍');
        message.channel.send(response);
    },
};