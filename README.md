# couch-daemon-bridge
[![Build Status](https://travis-ci.org/jo/couch-daemon-bridge.svg?branch=master)](https://travis-ci.org/jo/couch-daemon-bridge)

Ease the use of CouchDBs
[`os_daemons`](http://docs.couchdb.org/en/latest/config/externals.html) with node.

## Usage
```js
var daemon = require('couch-daemon-bridge')();

// Log a message
daemon.info('My daemon is starting.');
daemon.debug('I have so much wow...');
daemon.error('An error occured!');

// Request configuration
daemon.get('httpd', function(err, data) {
  // data is now an object holding the whole httpd section
});
daemon.get('httpd.bind_address', function(err, data) {
  // data is now a string holding the value
});
```

### Environment Variables
Every configuration can be overridden via environment variable:
```shell
export HTTPD_BIND_ADDRESS="93.184.216.119"
```

```js
var daemon = require('couch-daemon-bridge')();

// Request configuration
daemon.get('httpd.bind_address', function(err, data) {
  // data is now a string holding the value of HTTPD_BIND_ADDRESS if present
});
```

### Configuration
couch-daemon-bridge takes an object as an optional argument:
* `stdin`: input stream. Default is `process.stdin`.
* `stdout`: output stream. Default is `process.stdout`.
* `exit`: function which is called when stdin closes. Default is to call `process.exit(0)`.

## Contributing
1. Write tests with [tap](https://github.com/isaacs/node-tap)
2. Lint your code with `npm run jshint`
3. Run the tests with `npm test`

## License
Copyright (c) 2014 Johannes J. Schmidt  
Licensed under the MIT license.
