#!/usr/bin/env node
const log = console.log;
const request = require('request');
const yargs = require("yargs");
const chalk = require("chalk");

// options
const options = yargs
.usage("Usage: -u <yourEmail> -p <yourPass> -f <emailToFind>")
.option("u", { alias: "username", describe: "Your LinkedIn username for authentication", type: "string", demandOption: true })
.option("p", { alias: "password", describe: "Your LinkedIn password for authentication", type: "string", demandOption: true })
.option("f", { alias: "find", describe: "Email to search for LinkedIn account", type: "string", demandOption: true })
.argv;

// setup application
const postCookies = request.jar();
const loginRegex = /name=\"loginCsrfParam\" value=\"([\w\d\-]+)\"/
const userAgent = 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36';
// chalk theme
const green = chalk.hex('#75ffb0');
const gray = chalk.hex('#6f6f6f');
const red = chalk.hex('#ff5577');

// run
findUser(options.find);

// function to grab csrf token
function findUser(email){

	clear();
	log(green('>> Getting CSRF Token'));

	const reqOpts = {
		url: 'https://www.linkedin.com/login?fromSignIn=true&trk=guest_homepage-basic_nav-header-signin',
		headers: {
			'user-agent': userAgent
		},
		jar: postCookies
	}

	request(reqOpts, function (error, response, body) {

		if (response.statusCode <= 399) {

			var csrf = body.match(loginRegex)[1];

			if (csrf) {
				log(green('Found: ') + csrf);
				postLogin(csrf, email);
			} else {
				log(red("Error: Could Not Obtain CSRF token."));
			}

		}

	});

}

// takes csrf token, logs in, then scrapes user
function postLogin(csrf, email) {

	log(green('Logging In...'));

	const reqOpts = {
		url: 'https://www.linkedin.com/uas/login-submit',
		form: {
			'session_key': options.username,
			'session_password': options.password,
			'loginCsrfParam': csrf,
			'trk': 'guest_homepage-basic_sign-in-submit'
		},
		headers: {
			'user-agent': userAgent
		},
		jar: postCookies,
		followAllRedirects: true
	}

	request.post(reqOpts, function(err, response, body) {
		
		if (response.statusCode <= 399) {

			log(green('Searching for user...'));

			var testUrl = 'https://www.linkedin.com/sales/gmail/profile/viewByEmail/' + email;

			request({url: testUrl, headers: {'user-agent': userAgent}, jar: postCookies}, function (error, response, body){

				if (response.statusCode <= 399) {

					if (body.includes('sign in')) {
						log(red('Error: Problem Authenticating.'));
					} else if (body.includes('Sorry, we couldn')){
						log(red('No User Found for Email: ' + email));
					} else {

						// test for name info
						var username = body.match(/<span id=\"li-profile-name\" data-fname=\"([\w\d\s]+)\" data-lname=\"([\w\d\s]+)\"/);
						if (username[1]) {

							// continue gathering info
							var location = body.match(/<div class=\"li-user-location\">([\w\d\s\,]+)<\/div>/)[1];
							var profileLink = body.match(/<a id=\"profile-link\" href=\".*?\?profileUrl=([\w\d\s\%\.\-\_]+)\" target=/)[1];
							var returnObj = {};
							returnObj.email = email;
							returnObj.first_name = username[1];
							returnObj.last_name = username[2];
							returnObj.location = location;
							returnObj.profile = decodeURIComponent(profileLink);
							log(returnObj);

						}

					}

				}

			 });

		} else {
			log(red('Error: Could Establish Session.'));
		}

	});

}

// clear screen
function clear() {
	process.stdout.write('\033c');
}