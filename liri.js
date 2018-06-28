require("dotenv").config();
var keys = require("./keys");
var fs = require("fs");
var request = require("request");
var Spotify = require('node-spotify-api');
var Twitter = require("twitter");

var spotify = new Spotify({
    id: "1bbc8ee86b8b483ca60ab9d68b9ddc43",
    secret: "f70108a8f06043969109714730a348ab"
});
var client = new Twitter(keys.twitter);

// console.log(spotify);

var argumentOne = process.argv[2];
var argumentTwo = process.argv[3];
var argumentThree = process.argv[4];
var argumentFour = process.argv[5];
var combined;
function crazyMultiWords() {
    var words = ""
    for (var i = 3; i < process.argv.length; i++) {
        // if (words == "") {
        //     words = words + process.argv[i] + " "
        // }else{
        words = words + process.argv[i] + " "
    }
    return words
}


switch (argumentOne) {
    case "spotify":
        spotifyIt();
        break;

    case "tweet-this":
        twitter();
        break;

    case "omdb-this":
        omdb();
        break;

    case "do-what-it-says":
        idk();
        break;

    default:
        console.log("IDK ¯\_(ツ)_/¯");
        fs.appendFile("log.txt", "IDK ¯\_(ツ)_/¯", function (err) {
            if (err) {
                console.log(err);
            }
        })
}

function twitter() {
    var params = { screen_name: crazyMultiWords(), result_type: "recent", count: "20", };
    client.get('statuses/user_timeline', params, function (err, tweets, response) {
        if (!err) {
            for (var i = 0; i < tweets.length; i++) {
                console.log(tweets[i].created_at);
                console.log(tweets[i].text);
                console.log("=========================================");
                fs.appendFile("log.txt", `\n${tweets[i].created_at}\n${tweets[i].text}\n===============================`, function (err) {
                    if (err) {
                        console.log(err);
                    }
                });
            }
        } else {
            return console.log(err);
        }
    })
};

function spotifyIt() {
    spotify.search({ type: 'track', query: crazyMultiWords(), market: 'US', popularity: 100, limit: 5 }, function (err, result) {
        if (err) {
            return console.log("Error Occurred: " + err);
        } else {
            // var track = result;
            // console.log(result);
            for (var i = 0; i < result.tracks.items.length; i++) {
                console.log(`Popularity: ${result.tracks.items[i].popularity}`);
                console.log("Artist: " + result.tracks.items[i].album.artists[0].name);
                console.log("Song: " + result.tracks.items[i].name);
                console.log("Preview: " + result.tracks.items[i].preview_url);
                console.log("Album: " + result.tracks.items[i].album.name);
                console.log("=======================================================");

                fs.appendFile("log.txt", `\nPopularity: ${result.tracks.items[i].popularity}\nArtist: ${result.tracks.items[i].album.artists[0].name}\nSong: ${result.tracks.items[i].name}\nPreview: ${result.tracks.items[i].preview_url}\nAlbum: ${result.tracks.items[i].album.name}\n===============================`, function (err) {
                    if (err) {
                        console.log(err);
                    }
                });
            }
        }
    })
};

function omdb() {
    // if (typeof argumentFour != "undefined") {
    //     combined = argumentTwo + "%20" + argumentThree + "%20" + argumentFour;
    // } else if (typeof argumentThree != "undefined") {
    //     combined = argumentTwo + "%20" + argumentThree;
    // } else {
    //     combined = argumentTwo;
    // }
    request(`http://www.omdbapi.com/?t=${crazyMultiWords()}&apikey=Trilogy&plot=short`,
        function (error, response, body) {
            if (!error) {
                // console.log(JSON.parse(body));
                var body = JSON.parse(body);
                // console.log(body);
                console.log(`Title: ${body.Title}`);
                console.log(`Year: ${body.Year}`);
                console.log(`IMDB Rating: ${body.imdbRating}`);
                console.log(`Rotten Tomatoes Rating: ${body.Ratings[1].value}`);
                console.log(`Country Produced: ${body.Country}`);
                console.log(`Languages: ${body.Language}`);
                console.log(`Plot: ${body.Plot}`);
                console.log(`Actors: ${body.Actors}`);

                fs.appendFile("log.txt", `\nTitle: ${body.Title}\nYear: ${body.Year}\nIMDB Rating: ${body.imdbRating}\nRotten Tomatoes Rating: ${body.Ratings[1].value}\nCountry Produced: ${body.Country}\nLanguages: ${body.Language}\nPlot: ${body.Plot}\nActors: ${body.Actors}\n===============================`, function (err) {
                    if (err) {
                        console.log(err);
                    }
                });
            } else {
                return console.log(err);
            };
        });
}

function idk() {
    fs.readFile("random.txt", "utf8", function (error, body) {
        if (error) {
            return console.log(error);
        }
        var doIt = body.split(",");
        // console.log(doIt);
        // console.log(`node liri ${doIt[0]} ${doIt[1]}`);
        argumentTwo = doIt[1];
        spotifyIt();
    })
};
