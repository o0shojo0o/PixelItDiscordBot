'use strict';

const fs = require('fs');
const axios = require('axios');
require('dotenv').config();
const Discord = require('discord.js');
const sqlRepo = require('./lib/sqlRepo');
//const MessageAttachment = Discord.MessageAttachment;
//const MessageEmbed = Discord.MessageEmbed;
const botToken = process.env.BOT_TOKEN;
// https://discordapp.com/oauth2/authorize?&client_id=EURE-CLIENT-ID&scope=bot&permissions=8
const bot = new Discord.Client();
bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();
bot.events = new Discord.Collection();

sqlRepo.checkDatabase();
// Read all command Handler in commands dir
fs.readdir("./commands/", (err, files) => {
    if (err){
        return console.log(err);
    } 

    for (const key in files){        
        if (!files[key].endsWith(".js")){
            return;
        } 
        const props = require(`./commands/${files[key]}`);        
        const commandName = files[key].split(".")[0];
        bot.commands.set(commandName, props);
        console.log(`Successfully command ${files[key]} loaded.`);
    };
});

//Events "handler"
fs.readdir('./events/', (err, files) => {
    if (err){
        return console.log(err);
    } 

    for (const key in files){        
        if (!files[key].endsWith(".js")){
            return;
        } 
        const eventFunc = require(`./events/${files[key]}`);        
        const eventName = files[key].split(".")[0];
        bot.on(eventName, (...args) => {
                eventFunc.run(bot, ...args)
            }
        );
        console.log(`Successfully event ${files[key]} loaded.`);
    };
});

bot.login(botToken);

bot.on('ready', () => {  
    fs.readdir('./tasks/', (err, files) => {
        if (err){
            return console.log(err);
        } 
    
        for (const key in files){        
            if (!files[key].endsWith(".js")){
                return;
            } 
            console.log(`Successfully task ${files[key]} loaded.`);
            const taskFunc = require(`./tasks/${files[key]}`);
            taskFunc.run(bot);    
        };
    }); 
    
    console.info(`Logged in as ${bot.user.tag}!`);
});
/*
bot.on('guildMemberAdd', member => {
    // Send the message to a designated channel on a server:
    const channel = member.guild.channels.cache.find(x => x.name === 'member-log');
    // Do nothing if the channel wasn't found on this server
    if (!channel) return;
    // Send the message, mentioning the member
    channel.send(`Welcome to the server, ${member}`);
});
*/