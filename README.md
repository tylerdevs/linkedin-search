# linkedin-search

[![Build Status](https://travis-ci.com/tylerdevs/linkedin-search.svg?branch=master)](https://travis-ci.com/tylerdevs/linkedin-search) [![dependencies Status](https://david-dm.org/tylerdevs/linkedin-search/status.svg)](https://david-dm.org/tylerdevs/linkedin-search) [![devDependencies Status](https://david-dm.org/tylerdevs/linkedin-search/dev-status.svg)](https://david-dm.org/tylerdevs/linkedin-search?type=dev) [![Vulns](https://snyk.io/test/github/tylerdevs/linkedin-search/badge.svg)](https://snyk.io/test/github/tylerdevs/linkedin-search) [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

**linkedin-search is an OSINT tool built for Node.js**
Search LinkedIn for user accounts by email address.

# Install

```
$ npm install linkedin-search -g
```

# Usage

In order to search for user accounts using an email address, you need to be logged into LinkedIn with a valid account. You can use any account for this as long as you have the username and password.

```
$ linkedin --help
Usage: -u <yourEmail> -p <yourPass> -f <emailToFind>

Options:
  --help          Show help                                            [boolean]
  --version       Show version number                                  [boolean]
  -u, --username  Your LinkedIn username for authentication  [string] [required]
  -p, --password  Your LinkedIn password for authentication  [string] [required]
  -f, --find      Email to search for LinkedIn account       [string] [required]
```

```
$ linkedin -u myemail@email.com -p mypassword123 -f searchfor@email.com
```

# Return Object

linkedin-search returns an object if a user account was found:
```
{
  email: 'searchfor@email.com',
  first_name: 'John',
  last_name: 'Smith',
  location: 'Los Angeles, CA',
  profile: 'https://www.linkedin.com/in/john-smith-9x547813'
}
```

# License

MIT © Tyler Colwell 