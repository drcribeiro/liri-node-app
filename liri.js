// read and set any environment variables with the 
require("dotenv").config(); // dotenv package

var keys = require("./keys.js"); // import keys.js and store it in a variable
//console.log(keysImported);  // output: [object Object]
//console.log(keys);
//console.log(keys.spotify);
//console.log(keys.twitter);
//console.log("OMDB Key: ");
//console.log(keys.omdb);

// **************************************
// should be able to access your keys information like so
//var spotify = new Spotify(keys.spotify);
//var client = new Twitter(keys.twitter);


// Handle user commands
 if(process.argv.length === 2){ // if user enters zero parameters
 	zeroParameters();
 }
 else if(process.argv.length > 2){ 
	if(process.argv[2] === "my-tweets"){ // 1. cmd: 'node liri.js my-tweets'
		myTweets();  
	}
	else if(process.argv[2] === "spotify-this-song"){ // 2. cmd: 'node liri.js spotify-this-song "<song name here>"'
		spotifyThisSong(); 
	} 
	else if(process.argv[2] === "movie-this"){ // 3. cmd: 'node liri.js movie-this "<movie name here>"'
 		movieThis();
 	}
 	else if(process.argv[2] === "do-what-it-says"){ // 4. cmd: 'node liri.js do-what-it-says'
		doWhatItSays(); 
	}
}


function zeroParameters(){ // if user enters zero parameters
	console.log("The command " + process.argv[2] + " is not a valid command."); //ask user to enter a correct cmd
	console.log("Please enter one of the following valid commands: ");
	console.log("my-tweets");
	console.log("spotify-this-song");
	console.log("movie-this");
	console.log("do-what-it-says");
}


function myTweets(){ // command 1
	console.log("show last 20 tweets & when they were created");
}


function spotifyThisSong(){ //command 2
	//console.log("show song info for " + process.argv[3]);
	if(process.argv.length === 4){ // if correct number of arguments are provided
			console.log("correct number of parameters");			
		}
	else // ask user to re-run the app and supply the correct number of arguments
		console.log("Please specify the song as the 4th argument");
}


function movieThis(){ // command 3
	var omdbKey = keys.omdb.omdb_key;
	var movieTitleProvided = false;
	if(process.argv.length === 4){ // if correct number of arguments are provided
		movieTitleProvided = true;
		omdbRequest(movieTitleProvided, omdbRequestInput(omdbKey, convertMovieTitle(process.argv[3])));  // movie title paramenter entered by user
	}
	else { // if user doesn't specify a movie output the movie "Mr. Nobody"
		omdbRequest(movieTitleProvided, omdbRequestInput(omdbKey, 'Mr.+Nobody'));  	
	}
}


function countWords(str) { //subfunction of movieThis function
  return str.trim().split(/\s+/).length;
}


function splitString(str){ //subfunction of movieThis function
	return str.trim().split(/\s+/);
}


function convertMovieTitle(movieTitleInput){ //subfunction of movieThis function
	var movieTitle = "";
	console.log("number of words in movieTitleInput = " + countWords(movieTitleInput));
	console.log("splitString = " + splitString(movieTitleInput));

	for(var i=0; i<countWords(movieTitleInput); i++){
		movieTitle += splitString(movieTitleInput)[i];
		if(i != countWords(movieTitleInput)-1)
			movieTitle += "+";
		console.log("word[" + i + "]: " + "movieTitle = " + movieTitle);
	} 
	console.log("movieTitle = " + movieTitle);
	return movieTitle;
}


function omdbRequestInput(omdbKey, movieTitleInput){ //subfunction of movieThis function
	requestURL = 'http://www.omdbapi.com/?t=' + movieTitleInput + '&apikey=' + omdbKey;
	console.log("requestURL = " + requestURL);
	return requestURL;

}


function omdbRequest(movieTitleProvided, requestURL){ //subfunction of movieThis function
	var request = require('request');
	request(requestURL, function (error, response, body) {
		if (!error && response.statusCode === 200) {
			// if user enters movie title param & if they don't
			console.log("Title: " + JSON.parse(body).Title); // Parse the body of the site and recover just the imdbRating
			console.log("Year: " + JSON.parse(body).Year); 
			console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
			console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
			console.log("Country: " + JSON.parse(body).Country);
			console.log("Language: " + JSON.parse(body).Language);
			console.log("Plot: " + JSON.parse(body).Plot);
			console.log("Actors: " + JSON.parse(body).Actors); 

			if(!movieTitleProvided) { //if user doesn't enter movie title param, append this:
				console.log("If you haven't watched " + JSON.parse(body).Title 
					+ "then you should: " + "<http://www.imdb.com/title/" 
					+ JSON.parse(body).imdbID + "/>");
				// not sure if > is the readMe.md notation or should be in the output	
				console.log("It's on Netflix!");
			}
		}
	});
}


function doWhatItSays(){ //command 4
	console.log("do-what-it-says");
}