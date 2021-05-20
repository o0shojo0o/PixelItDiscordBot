'use strict';

require('dotenv').config();
const axios = require('axios');
const cheerio = require('cheerio');
const messageEmbed = require('discord.js').MessageEmbed;
const sqlRepo = require('../lib/sqlRepo');
let discordClient;
const requestIntervalSec = process.env.PIXELIT_CHANNGELOG_INTERVAL;
const newsChannel = process.env.NEWS_CHANNEL;

module.exports.run = async (client) => {
    // Deactivate !!!!
    return;
    discordClient = client;
    await checkNewChangeLogPost();
    requestTimer();
}

async function requestTimer(){
    setTimeout(async ()=>{
        await checkNewChangeLogPost();
        requestTimer();
    }, Number(requestIntervalSec) * 1000)
}

async function checkNewChangeLogPost() {
    const threadMetaObj = await axios.get('https://forum.bastelbunker.de/api/discussions/21');
    
    const posts = threadMetaObj.data.data.relationships.posts.data;

    const lastPostDbID = Number(posts[posts.length-1].id);
    const lastPostUrlNumber = Number(threadMetaObj.data.data.attributes.lastPostNumber);
    
    // Get last post ID from db.
    const dbResult = await sqlRepo.getLastPixelITChangelogID();     
    // If new post?
    const newPost = (lastPostDbID !== dbResult);
    if (newPost){
        sqlRepo.saveLastPixelITChangelogID(lastPostDbID);
        const threadObj = await axios.get(`https://forum.bastelbunker.de/api/posts?filter[id]=${lastPostDbID}`); 
        const $ = cheerio.load(threadObj.data.data[0].attributes.contentHtml);        
        const title = $('h3').text();
        const useUrl = `https://forum.bastelbunker.de/d/21-changelog/${lastPostUrlNumber}`;


        const embed = new messageEmbed()
            .setTitle(`:arrow_up: ${title} :arrow_up:`)
            .setColor(0x66ff66)
            .setURL(useUrl)
            .setDescription('Es steht ein neues Update zur Verfügung.')     
        
        discordClient.channels.cache.get(newsChannel).send(embed);
    }
}

