require("dotenv").config();
var request = require('request');
var Spotify = require('node-spotify-api');
var keys = require("./keys.js");
var fs = require("fs");
var spotify = new Spotify(keys.spotify);
var moment = require('moment');


var runliri = {
    moviethis: function (str2) {
        var movieName = str2;
        var movieUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=full&apikey=trilogy";

        request(movieUrl, function (error, response, body) {
            
            console.log('error:', error);
            console.log('statusCode:', response && response.statusCode+'\n');
            // console.log('body:', body);
            // console.log(JSON.parse(body).Title);
            body = JSON.parse(body);
            var results = ["* Title of the movie: " + body.Title,
            "* Year the movie came out: " + body.Year,
            "* IMDB Rating of the movie: " + body.Ratings[0].Value,
            "* Rotten Tomatoes Rating of the movie: "+ body.Ratings[1].Value,
            "* Country where the movie was produced: " + body.Country,
            "* Language of the movie: " + body.Language,
            "* Plot of the movie: " + body.Plot,
            "* Actors in the movie: " + body.Actors].join("\n");
            console.log("\x1b[31m\x1b[43m%s\x1b[0m", results);
            logthis(results);
        });
    },
    spotifythissong: function (str2) {

        spotify.search({ type: 'track', limit: '1', query: str2 }, function (err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            }
            // results = JSON.parse(data);
            var results = ["* Artist(s): " + data.tracks.items[0].album.artists[0].name,
            "* Song Name: "+ data.tracks.items[0].name,
            "* Spotify Preview Link: "+ data.tracks.items[0].preview_url,
            "* Album: "+data.tracks.items[0].album.name,].join("\n");
            fs.writeFile("Response.json", JSON.stringify(data) , function(err) {

                // If the code experiences any errors it will log the error to the console.
                if (err) {
                  return console.log(err);
                }
              
                // Otherwise, it will print: "movies.txt was updated!"
                console.log("\nYour Json file was updated!\n");
              
              });
            console.log("\x1b[30m\x1b[42m%s\x1b[0m", results);
            logthis(results);
        });
    },
    concertthis: function (str2) {
        var artist = str2;
        var artistUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
        
        request(artistUrl, function (error, response, body) {
            console.log('error:', error);
            console.log('statusCode:', response && response.statusCode + '\n');
            
            body = JSON.parse(body);
            // console.log('body:', body);

            var results = ["-----Next Concert -----",
            "* Name of the venue: " + body[0].venue.name,
            "* Venue location: "+body[0].venue.country,
            "* Date of the Event (MM/DD/YYYY): "+moment(body[0].datetime).format('MM/DD/YYYY')].join("\n");
            // moment(body.date, 'MM/DD/YYYY');
            console.log("\x1b[31m\x1b[47m%s\x1b[0m", results);
            logthis(results);
        });
    },
    dowhatitsays: function (){
        fs.readFile("random.txt", "utf8", function(error, data) {

            // If the code experiences any errors it will log the error to the console.
            if (error) {
              return console.log(error);
            }
            console.log(data);
            var dataArr = data.split(",");
            var search= dataArr[0].split("-").join("");
            runliri[search](dataArr[1]);
          
          });
    }
};

function logthis(results) {
    fs.appendFile("log.txt", "\nnode " + process.argv[2]+ " "+ str2 +"\n"+ results+'\n\nNext Item!\n\n', function(err) {

        // If the code experiences any errors it will log the error to the console.
        if (err) {
          return console.log(err);
        }
      
        // Otherwise, it will print: "movies.txt was updated!"
        console.log("\nYour log was updated!\n");
      
      });

}

str = process.argv[2].split("-").join("");
str2 = process.argv.splice(3).join(" ");
runliri[str](str2);