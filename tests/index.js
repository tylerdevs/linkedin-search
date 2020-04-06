const test = require('tape');
const request = require('request');
const userAgent = 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36';
const loginRegex = /name=\"loginCsrfParam\" value=\"([\w\d\-]+)\"/

test('Test Login Page For CSRF', function (t) {

  var result = false;

  // setup request
  const reqOpts = {
    url: 'https://www.linkedin.com/login?fromSignIn=true&trk=guest_homepage-basic_nav-header-signin',
    headers: {
      'user-agent': userAgent
    }
  }

  // fetch
  request(reqOpts, function (error, response, body) {
    
    if (response.statusCode <= 399) {
      var csrf = body.match(loginRegex)[1];
      if (csrf) {
        result = true;
      }
    }

    // tape
    t.ok(result);
    t.end();

  });


});
