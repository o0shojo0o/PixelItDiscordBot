const db = require('better-sqlite3')('./bot.db');

module.exports = { 
    getLastPixelITChangelogID,
    saveLastPixelITChangelogID,
    getLastPixelITNewImageID,
    saveLastPixelITNewImageID,
    checkDatabase
}

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
    var result = db.prepare('select * from PixelITNewImage').get();

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

function checkDatabase(table) {
    db.prepare(`CREATE TABLE IF NOT EXISTS PixelITChangelog(LastID number)`).run();
    db.prepare(`CREATE TABLE IF NOT EXISTS PixelITNewImage(LastID number)`).run();
}