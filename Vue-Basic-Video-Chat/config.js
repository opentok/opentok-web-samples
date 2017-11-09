// Make a copy of this file and save it as config.js (in the js directory).

// Set this to the base URL of your sample server, such as 'https://your-app-name.herokuapp.com'.
// Do not include the trailing slash. See the README for more information:

var SAMPLE_SERVER_BASE_URL = 'http://YOUR-SERVER-URL';

// OR, if you have not set up a web server that runs the learning-opentok-php code,
// set these values to OpenTok API key, a valid session ID, and a token for the session.
// For test purposes, you can obtain these from https://tokbox.com/account.

var API_KEY = '1127';
var SESSION_ID = '2_MX4xMTI3fn4xNTEwMTQxNzM0NTE2fkg4OUxqMHBxTnNIcVY0OEdNVmI1UC9iQ35-';
var TOKEN = 'T1==cGFydG5lcl9pZD0xMTI3JnNpZz00NWMyMDRkYjY2NTczMDg0Yjg3ZDIxYjNiOTYzZTMzOGVjMTFlNDhlOnNlc3Npb25faWQ9Ml9NWDR4TVRJM2ZuNHhOVEV3TVRReE56TTBOVEUyZmtnNE9VeHFNSEJ4VG5OSWNWWTBPRWROVm1JMVVDOWlRMzUtJmNyZWF0ZV90aW1lPTE1MTAxNDE3MzUmbm9uY2U9MC4zODM0NzU2MDg1MjEzNTMxJnJvbGU9bW9kZXJhdG9yJmV4cGlyZV90aW1lPTE1MTI3MzM3MzU=';

module.exports = {
  API_KEY: JSON.stringify(API_KEY),
  SESSION_ID: JSON.stringify(SESSION_ID),
  TOKEN: JSON.stringify(TOKEN),
  SAMPLE_SERVER_BASE_URL: JSON.stringify(SAMPLE_SERVER_BASE_URL)
};
