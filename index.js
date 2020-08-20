const fs = require('fs');
const axios = require('axios');
require('dotenv').config();
const Discord = require('discord.js');
const repo = require('./sqlRepo');
//const MessageAttachment = Discord.MessageAttachment;
//const MessageEmbed = Discord.MessageEmbed;
const TOKEN = process.env.TOKEN;
// https://discordapp.com/oauth2/authorize?&client_id=EURE-CLIENT-ID&scope=bot&permissions=8
const bot = new Discord.Client();
bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();
bot.events = new Discord.Collection();

//Command Handler
fs.readdir("./commands/", (err, files) => {
    if (err) return console.log(err);
    files.forEach(file => {
        if (!file.endsWith(".js")) return;
        let props = require(`./commands/${file}`);
        console.log("Successfully loaded " + file)
        let commandName = file.split(".")[0];
        bot.commands.set(commandName, props);
    });
});

//Events "handler"
fs.readdir('./events/', (err, files) => {
    if (err) console.log(err);
    files.forEach(file => {
        let eventFunc = require(`./events/${file}`);
        console.log("Successfully loaded " + file)
        let eventName = file.split(".")[0];
        bot.on(eventName, (...args) => eventFunc.run(bot, ...args));
    });
});

bot.login(TOKEN);

bot.on('ready', () => {
    console.info(`Logged in as ${bot.user.tag}!`);
    console.info('Starting Pixel IT ChnageLog checker..');
    repo.CheckDatabase();
    setInterval(test, 1000);
});
/*
bot.on('message', msg => {
    if (msg.content === 'ping') {
        msg.reply('pong');
        msg.channel.send('pong');
    }

    if (msg.content === 'what is my avatar') {
        // Send the user's avatar URL
        msg.reply(msg.author.displayAvatarURL());

    }

    if (msg.content === 'embed') {
        const embed = new MessageEmbed()
            .setTitle('A slick little embed')
            .setColor(0xff0000)
            .setDescription('Hello, this is a slick embed!');
        msg.channel.send(embed);
    }

    if (msg.content === '!rip') {
        const attachment = new MessageAttachment('https://i.imgur.com/w3duR07.png');
        msg.channel.send(attachment);
    }

    if (msg.guild) {
        if (msg.content.startsWith('!kick')) {
            const user = msg.mentions.users.first();
            if (user) {
                const member = msg.guild.member(user);
                // If the member is in the guild
                if (member) {
                    member
                        .kick('Optional reason that will display in the audit logs')
                        .then(() => {
                            // We let the message author know we were able to kick the person
                            msg.reply(`Successfully kicked ${user.tag}`);
                        })
                        .catch(err => {
                            msg.reply('I was unable to kick the member');
                            // Log the error
                            console.error(err);
                        });
                } else {
                    // The mentioned user isn't in this guild
                    msg.reply("That user isn't in this guild!");
                }
                // Otherwise, if no user was mentioned
            } else {
                msg.reply("You didn't mention the user to kick!");
            }
        }


        if (msg.content.startsWith('!ban')) {
            const user = msg.mentions.users.first();
            // If we have a user mentioned
            if (user) {
                // Now we get the member from the user
                const member = msg.guild.member(user);
                // If the member is in the guild
                if (member) {
                    member
                        .ban({
                            reason: 'They were bad!',
                        })
                        .then(() => {
                            // We let the message author know we were able to ban the person
                            msg.reply(`Successfully banned ${user.tag}`);
                        })
                        .catch(err => {
                            msg.reply('I was unable to ban the member');
                            // Log the error
                            console.error(err);
                        });
                } else {
                    // The mentioned user isn't in this guild
                    msg.reply("That user isn't in this guild!");
                }
            } else {
                // Otherwise, if no user was mentioned
                msg.reply("You didn't mention the user to ban!");
            }
        }
    }
});

*/

bot.on('guildMemberAdd', member => {
    // Send the message to a designated channel on a server:
    const channel = member.guild.channels.cache.find(x => x.name === 'member-log');
    // Do nothing if the channel wasn't found on this server
    if (!channel) return;
    // Send the message, mentioning the member
    channel.send(`Welcome to the server, ${member}`);
});

async function test() {
    var webResult = axios.get("https://forum.bastelbunker.de/api/discussions/21").then(response => {
        const posts = response.data.data.relationships.posts.data;
        return Number(posts[posts.length - 1].id);
    });

    var dbResult = repo.GetLastPixelITChangelogID();

    var result = await Promise.all([webResult, dbResult]);

    var test = result[0] === result[1];

    if (!test) {
        repo.SaveLastPixelITChangelogID(result[0])
    }

    console.log(result[0]);
    console.log(result[1]);
    console.log(test);
}