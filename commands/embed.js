const Discord = require('discord.js');
const MessageEmbed = Discord.MessageEmbed;

module.exports = {
    name: 'embed',
    description: 'Embed',
    execute(client, message, args) {
        const embed = new MessageEmbed()
            .setTitle('A slick little embed')
            .setColor(0xff0000)
            .setDescription('Hello, this is a slick embed!');
        message.channel.send(embed);
    },
};