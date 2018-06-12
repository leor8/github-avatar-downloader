/* This program takes two inputs from command line and track avatars related to the repo and save all the avatars images
in .jpg file in the subdirectory */
/* Leo Ruan */
/* June 11/2018 */

// Getting user inputs
var repoOwner = process.argv[2];
var repoName = process.argv[3]

// Requesting files and packages
var request = require("request");
var token = require("./secrets.js");
var fs = require('fs');

// A welcome message
console.log("Welcome to the GitHub Avatar Downloader!");


function getRepoContributors(repoOwner, repoName, cb){
  /*
    This function fetches the user specified api with the repo owner and repo name's avatar url and save it into an
    object. This function takes three inputs, the user inputs from command line (aka.repoOwner, repoName) and a callback
    function that processing further functionalities
    Leo Ruan
    2018/June/11
  */

  // Error handling making sure there are inputs
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

  // requesting data from the giving url
  request(options, function(err, res, body){
    if(err){
      throw err;
    }
    for(var i = 0; i < JSON.parse(body).length; i++){
      contributors[JSON.parse(body)[i].login] = JSON.parse(body)[i];
    }

    // Callback
    cb(err, contributors)
  });

}

function downloadImageByURL(url, filePath){
  /*
  This function takes two inputs, first being the url where the program will get the file from and save it in to second file
  Path.
  Leo Ruan
  2018/June/11
  */

  request.get(url)
  .on('error', function(err){
    throw err;
  })
  .pipe(fs.createWriteStream(filePath));
}

getRepoContributors(repoOwner, repoName, function(err, result) {
  /*
  This callback further manipualte the object that given the url received from <getRepoContributors> and passed in as
  arguments to function <downloadImageByURL> to save the images to a subdirectory.
  Leo Ruan
  2018/June/11
  */
  if(err){
    throw err;
  }
  // console.log("Errors:", err);
  for(var individuals in result){

    downloadImageByURL(result[individuals].avatar_url, './avatarDownloads/' + result[individuals].login + '.jpg');
  }
});




