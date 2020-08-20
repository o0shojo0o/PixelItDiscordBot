const axios = require('axios');
const repo = require('../sqlRepo');

module.exports.CheckNewChangeLogPost = CheckNewChangeLogPost;

async function CheckNewChangeLogPost() {
    const _webResult = axios.get("https://forum.bastelbunker.de/api/discussions/21").then(response => {
        const posts = response.data.data.relationships.posts.data;
        return Number(posts[posts.length - 1].id);
    });

    const _dbResult = repo.GetLastPixelITChangelogID();
    var _result = await Promise.all([_webResult, _dbResult]);
    var _newPost = _result[0] !== _result[1];
    return { NewPost: _newPost, WebResult: _result[0], DBResult: _result[1] };
}

