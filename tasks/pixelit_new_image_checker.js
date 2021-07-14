'use strict';

require('dotenv').config();
const axios = require('axios');
const cheerio = require('cheerio');
const messageEmbed = require('discord.js').MessageEmbed;
const sqlRepo = require('../lib/sqlRepo');
let discordClient;
const requestIntervalSec = process.env.PIXELIT_NEW_IMAGE_INTERVAL;
const newsChannel = process.env.NEWS_CHANNEL;
const pixeltiApiToken = process.env.PIXELIT_API_TOKEN;

module.exports.run = async (client) => {
    discordClient = client;    
    await checkNewImage();
    requestTimer();
}

async function requestTimer(){
    setTimeout(async ()=>{
        await checkNewImage();
        requestTimer();
    }, Number(requestIntervalSec) * 1000)
}

async function checkNewImage() {
    const newImageObj = await axios.get(`https://pixelit.bastelbunker.de/api/GetBMPNewst?token=${pixeltiApiToken}`);
    
    const lastImageID = Number(newImageObj.data.id);  
    const userName = newImageObj.data.username;
    const bmpTitle = newImageObj.data.name;
    const isAnimated = newImageObj.data.animated;
    const useUrl = `https://pixelit.bastelbunker.de/PixelGallery?id=${lastImageID}`
    const imageUrl = `https://pixelit.bastelbunker.de/images/${lastImageID}.${isAnimated?'gif':'png'}`
    // Get last post ID from db.
    const dbResult = await sqlRepo.getLastPixelITNewImageID();   
    // If new post?
    const newImage = (lastImageID !== dbResult);
    
    if (newImage){
        sqlRepo.addToNewImageQueue(lastImageID, userName, bmpTitle, useUrl, imageUrl);
        sqlRepo.saveLastPixelITNewImageID(lastImageID); 
        console.log(`New image with id: ${lastImageID} add to queue.`);
    }

    const queue = sqlRepo.getNewImageQueue();

    for (const key in queue) {  
        if (!await isImageAvable(queue[key].ImageUrl)){
            console.log(`Queue image with id: ${queue[key].ImageID} is not already generated. Continue!`)
            continue;
        }
        
        sqlRepo.deleteFromNewImageQueue(queue[key].ImageID)
        console.log(`Image with id: ${queue[key].ImageID} delete from queue.`)
        
        const embed = new messageEmbed()
            .setTitle(`Danke an ${queue[key].UserName},`)
            .setColor(0x66ff66)
            .setThumbnail(queue[key].ImageUrl)
            .setURL(queue[key].UseUrl)
            .setDescription('für die Spende des neuen BMPs:')  
            .addField(queue[key].BmpTitle,'\u200b', false);
        
        discordClient.channels.cache.get(newsChannel).send(embed);
    }
}

async function isImageAvable(imageUrl) {
    // Check image is already generated
    try{
       await axios.get(imageUrl); 
    }
    catch (err){       
        return false;        
    } 
    return true; 
}

