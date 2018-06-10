// Read and set any environment variables with the 
require("dotenv").config(); // dotenv package
var keys = require("./keys.js"); // import keys.js and store it in a variable

// Log commands to file log.txt
const fs = require("fs"); // global constant to read and append to files


// Handle user commands through command line arguments
if(process.argv.length === 2){ // if user enters zero parameters
	appendToFile("No command entered by user" + "\n");
	zeroParameters();
}
else if(process.argv.length > 2){ 
	if(process.argv[2] === "my-tweets"){ // 1. cmd: 'node liri.js my-tweets'
		appendToFile(process.argv[2] + "\n");
		myTweets();  
	}
	else if(process.argv[2] === "spotify-this-song"){ // 2. cmd: 'node liri.js spotify-this-song "<song name here>"'
		spotifyThisSong(process.argv.length, process.argv[2], process.argv[3]);
	} 
	else if(process.argv[2] === "movie-this"){ // 3. cmd: 'node liri.js movie-this "<movie name here>"'
		movieThis(process.argv.length, process.argv[2], process.argv[3]);
	}
	else if(process.argv[2] === "do-what-it-says"){ // 4. cmd: 'node liri.js do-what-it-says'
		appendToFile(process.argv[2] + "\n");
		doWhatItSays(); 
	}
}


// Functions:
function appendToFile(text){ 
	fs.appendFile("log.txt", text, function(error) {
		if(error) throw error;
	});
}


function zeroParameters(){ // If user enters zero parameters
	console.log("The command " + process.argv[2] + " is not a valid command."); //ask user to enter a correct cmd
	console.log("Please enter one of the following valid commands: ");
	console.log("my-tweets");
	console.log("spotify-this-song");
	console.log("movie-this");
	console.log("do-what-it-says");
}


function myTweets(){ // Command 1
	// Twitter API Reference: https://developer.twitter.com/en/docs/tweets/post-and-engage/api-reference/get-favorites-list
	// Twitter Node Package Reference: https://www.npmjs.com/package/twitter
	var Twitter = require('twitter');
	var client = new Twitter(keys.twitter);
	client.get('favorites/list', function(error, tweets, response) {
		if(error) throw error;
		console.log("Tweets: ");
		console.log(tweets); // Tweet body
		console.log("Created at: ");
		console.log(response.created_at); // When tweets were created at
		console.log();
		console.log("Response: "); 
		console.log(response.body); // Raw response object
	});
}


//postTweet();
function postTweet(){ // Extra function of Twitter API
	var Twitter = require('twitter');
	var client = new Twitter(keys.twitter);

	client.post('statuses/update', {status: "This is very cool! I'm tweeting from my app."},  function(error, tweet, response) {
	  if(error) throw error;
	  console.log(tweet);  // Tweet body
	  console.log(response);  // Raw response object
	}); 
}


function spotifyThisSong(argvLength, cmd, songName){ // Command 2
	if(argvLength === 4) { // If correct number of arguments are provided
		appendToFile(cmd + " " + songName + "\n");
		console.log("songName: " + songName);
		spotifySong(songName); 
	}
	else { // No song provided by user
		appendToFile(cmd + "\n");
		spotifySong('Rise'); 	
	}
}


//****** Doesnt work with non capital and with >1 word song name
function spotifySong(songName){ // Subfunction of command 2
	// Spotify Node Package Reference: https://www.npmjs.com/package/node-spotify-api
	var Spotify = require('node-spotify-api');
	var spotify = new Spotify(keys.spotify);
	
	spotify.search({type: 'track', query: songName}, function(error, data){
		if(error) 
			return console.log('Error occurred: ' + error);
		
		// Data returns an array of all albums matching the query
		var i = 0;
		while(data.tracks.items[i].album.name != songName) { // Iterate the array until find an item that matches the query
			i++;
		}
		console.log("Artists:"); // "artists" is an array containing objects for each artist
		for(var index=0; index<data.tracks.items[i].album.artists.length; index++){
			console.log(data.tracks.items[i].album.artists[index].name); // no names in json just an object
		}
		console.log("Name: " + data.tracks.items[i].album.name);
		console.log("Spotify preview link: " + data.tracks.items[i].preview_url);
		console.log("Album: " + data.tracks.items[i].album.name);
	});
}	


function movieThis(argvLength, cmd, movieName){ // Command 3
	var omdbKey = keys.omdb.omdb_key;
	var movieTitleProvided = false;

	if(argvLength === 4) { // If correct number of arguments are provided
		appendToFile(cmd + " " + movieName + "\n");
		movieTitleProvided = true;
		omdbRequest(movieTitleProvided, omdbRequestInput(omdbKey, convertMovieTitle(movieName)));  // movie title paramenter entered by user
	}
	else { // If user doesn't specify a movie output the movie "Mr. Nobody"
		appendToFile(cmd + "\n");
		omdbRequest(movieTitleProvided, omdbRequestInput(omdbKey, 'Mr.+Nobody'));  	
	}
}


function countWords(str) { // Subfunction of movieThis function
  return str.trim().split(/\s+/).length;
}


function splitString(str){ // Subfunction of movieThis function
	return str.trim().split(/\s+/);
}


function convertMovieTitle(movieTitleInput){ // Subfunction of movieThis function
	var movieTitle = "";

	for(var i=0; i<countWords(movieTitleInput); i++){
		movieTitle += splitString(movieTitleInput)[i];
		if(i != countWords(movieTitleInput)-1)
			movieTitle += "+";
	} 
	return movieTitle;
}


function omdbRequestInput(omdbKey, movieTitleInput){ // Subfunction of movieThis function
	return requestURL = 'http://www.omdbapi.com/?t=' + movieTitleInput + '&apikey=' + omdbKey;	
}


function omdbRequest(movieTitleProvided, requestURL){ // Subfunction of movieThis function
	var request = require('request');
	request(requestURL, function (error, response, body) {
		if (!error && response.statusCode === 200) {
			console.log("Title: " + JSON.parse(body).Title); 
			console.log("Year: " + JSON.parse(body).Year); 
			console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
			console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
			console.log("Country: " + JSON.parse(body).Country);
			console.log("Language: " + JSON.parse(body).Language);
			console.log("Plot: " + JSON.parse(body).Plot);
			console.log("Actors: " + JSON.parse(body).Actors); 

			if(!movieTitleProvided) { // If user doesn't enter movie title param, append this:
				console.log("If you haven't watched '" + JSON.parse(body).Title 
					+ "' then you should: " + "<http://www.imdb.com/title/" 
					+ JSON.parse(body).imdbID + "/>");
				console.log("It's on Netflix!");
			}
		}
	});
}


function doWhatItSays(){ // Command 4
	//const fs = require("fs"); // Node FS Read File, golbally declared for reading and appending to different files
	fs.readFile('random.txt', 'utf8', readData);
}


function readData(err, data) { // Subfunction of command 4
	var text = data.trim().split(/\,+/); // Splits cmd and argument
	// Returns ['spotify-this-song', '"Rise"']
	
	if(text[0] === "") { // If file is empty
		console.log("File is empty, returned: " + text[0] + text[1]);
		zeroParameters();
	}
	else if(text[0] === "my-tweets"){
		myTweets();	
	}
	else if(text[0] === "spotify-this-song"){
		spotifyThisSong(countParams(text[1]), text[0], removeQuotes(text[1]));
	}
	else if(text[0] === "movie-this") {
		movieThis(countParams(text[1]), text[0], removeQuotes(text[1]));
	}
}


function countParams(name){
	var argvLength = 3; // argvLength is at least 3 if "spotify-this-song" is read from file
	if(name != null) // If the 4th argument is not null, the file specifies the song name
		argvLength++; // Add the 4th argument to the argvLength
	return argvLength; 
}


function removeQuotes(name){
	if(name != null) // If the 4th argument is not null, the file specifies the song name
		name = name.slice(1,name.length-1); // Remove " " around the songName otherwise method spotifyThisSong cannot process the input and error occurs
	return name; 
}