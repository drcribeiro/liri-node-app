**Table of Contents**
1. What the project does
1. Why the project is useful
1. How users can get started with the project


**1. What the project does:**
	This Language Interpretation and Recognition Interface (LIRI) is a command line node application that takes in arguments and returns data from the following APIs: Twitter, Spotify, and Open Movie Database (OMDB). Commands can also be saved to a file and excuted with the application. User commands are logged to a file.

**1. Why the project is useful:**
	* Connects to different useful APIs (Twitter, Spotify, and Open Movie Database).
	* Processes different commands from command line arguments as well as reading commands from a file and outputing all user commands to a seperate file.
	* Uses NodeJS framework and multiple packages.

**1. How users can get started with the project:** 
	* install the following modules:
		* npm i request
		* npm i twitter
		* npm i dotenv
		* npm i node-spotify-api
	* Use Request to grab data from the [OMDB API](http://www.omdbapi.com) 
	* API keys need to be saved to a .env file.  Sign up as a developer with Spotify, Twitter, and OMDB to obtain your own API keys. These keys must be kept secret.
		* The .env file will be used by the `dotenv` package to set environment variables to the global `process.env` object in node. 
		* When commiting this code use gitignore on this file, so that it won't be pushed to github &mdash; keeping your API key information private.