# couch-daemon-bridge
[![Build Status](https://travis-ci.org/jo/couch-daemon-bridge.svg?branch=master)](https://travis-ci.org/jo/couch-daemon-bridge)

Ease the use of CouchDBs
[`os_daemons`](http://docs.couchdb.org/en/latest/config/externals.html) with node.

## Usage
```js
var daemon = require('couch-daemon-bridge')(process.stdin, process.stdout, function() {
  process.exit(0);
});

// Log a message
daemon.info('My daemon is starting.');
daemon.debug('I have so much wow...');
daemon.error('An error occured!');

// Request configuration
daemon.get('httpd', function(data) {
  // data is now an object holding the whole httpd section
});
daemon.get('httpd.bind_address', function(data) {
  // data is now a string holding the value
});
```

### Environment Variables
Every configuration can be overridden via environment variable:
```shell
export HTTPD_BIND_ADDRESS="93.184.216.119"
```

```js
var daemon = require('couch-daemon-bridge')(process.stdin, process.stdout, function() {
  process.exit(0);
});

// Request configuration
daemon.get('httpd.bind_address', function(data) {
  // data is now a string holding the value of HTTPD_BIND_ADDRESS if present
});
```

## Contributing
1. Write tests with [tap](https://github.com/isaacs/node-tap)
2. Lint your code with `npm run jshint`
3. Run the tests with `npm test`

(c) 2013 Johannes J. Schmidt
