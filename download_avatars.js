var request = require("request");
var token = require("./secrets.js");
var fs = require('fs');

console.log("Welcome to the GitHub Avatar Downloader!");

function getRepoContributors(repoOwner, repoName, cb){

  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': 'token ' + token.GITHUB_TOKEN
    }
  };

  var contributors = {};

  request(options, function(err, res, body){
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
  .pipe(fs.pipe(filePath));
}

getRepoContributors("jquery", "jquery", function(err, result) {
  console.log("Errors:", err);

  for(var individuals in result){
    console.log("The avatar owner's url is: ", result[individuals].avatar_url);
  }
});




