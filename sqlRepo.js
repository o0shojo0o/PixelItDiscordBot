const db = require('better-sqlite3')('./bot.db');

module.exports.GetLastPixelITChangelogID = GetLastPixelITChangelogID;
module.exports.SaveLastPixelITChangelogID = SaveLastPixelITChangelogID
module.exports.CheckDatabase = CreateDatabase

function GetLastPixelITChangelogID() {
    var result = db.prepare('select * from PixelITChangelog').get();

    if (!result) {
        result = -1;
    }
    else {
        result = result.LastID
    }
    return result;
}

function SaveLastPixelITChangelogID(lastID) {
    db.prepare('delete from PixelITChangelog').run();
    db.prepare('insert into PixelITChangelog (lastid) values (?)').run(lastID);
}

function CreateDatabase() {
    db.prepare('CREATE TABLE IF NOT EXISTS PixelITChangelog(LastID number)').run();
}