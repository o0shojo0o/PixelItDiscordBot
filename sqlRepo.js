const db = require('better-sqlite3')('./bot.db');

module.exports.getLastPixelITChangelogID = getLastPixelITChangelogID;
module.exports.saveLastPixelITChangelogID = saveLastPixelITChangelogID;
module.exports.checkDatabase = checkDatabase;

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

function saveLastPixelITChangelogID(lastID) {
    db.prepare('delete from PixelITChangelog').run();
    db.prepare('insert into PixelITChangelog (lastid) values (?)').run(lastID);
}

function checkDatabase() {
    db.prepare('CREATE TABLE IF NOT EXISTS PixelITChangelog(LastID number)').run();
}