require('dotenv').config();
const axios = require('axios');
const cheerio = require('cheerio');
const messageEmbed = require('discord.js').MessageEmbed;
const sqlRepo = require('../sqlRepo');
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
    const newImageObj = await axios.get(`https://api.bastelbunker.de/PixelItService/GetBMPNewst?token=${pixeltiApiToken}`);
    
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
        sqlRepo.saveLastPixelITNewImageID(lastImageID);     

        const embed = new messageEmbed()
            .setTitle(`Danke an ${userName},`)
            .setColor(0x66ff66)
            .setThumbnail(imageUrl)
            .setURL(useUrl)
            .setDescription('für die Spende des neuen BMPs:')  
            .addField(bmpTitle,'\u200b', false);
        
        discordClient.channels.cache.get(newsChannel).send(embed);
    }
}

