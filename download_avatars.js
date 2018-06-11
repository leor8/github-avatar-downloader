var repoOwner = process.argv[2];
var repoName = process.argv[3]
var request = require("request");
var token = require("./secrets.js");
var fs = require('fs');

console.log("Welcome to the GitHub Avatar Downloader!");

function getRepoContributors(repoOwner, repoName, cb){
  if(!repoOwner || !repoName){
    console.log("No argvs passed into the program. EXITTING.");
    return;
  }

  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': 'token ' + token.GITHUB_TOKEN
    }
  };

  var contributors = {};

  request(options, function(err, res, body){
    if(err){
      throw err;
    }
    for(var i = 0; i < JSON.parse(body).length; i++){
      //console.log(JSON.parse(body)[i]);
      //contributors = JSON.parse(body)[i];
      contributors[JSON.parse(body)[i].login] = JSON.parse(body)[i];
    }

    cb(err, contributors)
  });

}

function downloadImageByURL(url, filePath){
  request.get(url)
  .on('error', function(err){
    throw err;
  })
  .pipe(fs.createWriteStream(filePath));
}

getRepoContributors(repoOwner, repoName, function(err, result) {
  if(err){
    throw err;
  }
  // console.log("Errors:", err);
  for(var individuals in result){

    downloadImageByURL(result[individuals].avatar_url, './avatarDownloads/' + result[individuals].login + '.jpg');
  }
});




