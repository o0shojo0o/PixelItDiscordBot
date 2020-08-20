const db = require('better-sqlite3')('./bot.db');

function GetLastPixelITChnageLogID() {
    var result = db.prepare('select * from forumchangelog').get();

    if (!result) {
        result = -1;
    }
    else {
        result = result.LastID
    }
    return result;
}

function SaveLastPixelITChnageLogID(lastID) {
    db.prepare('delete from forumchangelog').run();
    db.prepare('insert into forumchangelog (lastid) values (?)').run(lastID);
}

module.exports.GetLastPixelITChnageLogID = GetLastPixelITChnageLogID;
module.exports.SaveLastPixelITChnageLogID = SaveLastPixelITChnageLogID