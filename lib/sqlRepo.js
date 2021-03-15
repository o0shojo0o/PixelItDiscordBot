'use strict';

const db = require('better-sqlite3')('./database/bot.db');

function getLastPixelITChangelogID() {
    var result = db.prepare('select * from PixelITChangelog').get();

    if (!result || !result.LastID) {
        result = -1;
    }
    else {
        result = result.LastID
    }
    return result;
}

function getLastPixelITNewImageID() {
    let result = db.prepare('select * from PixelITNewImage').get();

    if (!result || !result.LastID) {
        result = -1;
    }
    else {
        result = result.LastID
    }
    return result;
}

function saveLastPixelITChangelogID(lastID) {
    db.prepare('delete from PixelITChangelog').run();
    db.prepare('insert into PixelITChangelog (lastid) values (?)').run(lastID);
}

function saveLastPixelITNewImageID(lastID) {
    db.prepare('delete from PixelITNewImage').run();
    db.prepare('insert into PixelITNewImage (lastid) values (?)').run(lastID);
}

function addToNewImageQueue(imageID, userName, bmpTitle, useUrl, imageUrl){
    db.prepare('insert into PixelITNewImageQueue (imageID, userName, bmpTitle, useUrl, imageUrl) values (?, ?, ?, ?, ?)').run(imageID, userName, bmpTitle, useUrl, imageUrl);
}

function getNewImageQueue(){
    return db.prepare('select * from PixelITNewImageQueue').all();
}

function deleteFromNewImageQueue(imageID){
    db.prepare('delete from PixelITNewImageQueue where ImageID = ?').run(imageID);
}

function checkDatabase(table) {
    db.prepare(`CREATE TABLE IF NOT EXISTS PixelITChangelog(LastID number)`).run();
    db.prepare(`CREATE TABLE IF NOT EXISTS PixelITNewImage(LastID number)`).run();
    db.prepare(`CREATE TABLE IF NOT EXISTS PixelITNewImageQueue(ImageID number, UserName string, BmpTitle string, UseUrl string, ImageUrl string)`).run();
}

module.exports = { 
    getLastPixelITChangelogID,
    saveLastPixelITChangelogID,
    getLastPixelITNewImageID,
    saveLastPixelITNewImageID,
    checkDatabase,
    addToNewImageQueue,
    getNewImageQueue,
    deleteFromNewImageQueue
}