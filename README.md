couch-daemon-bridge
=========
Ease the use of CouchDBs
[`os_daemons`](http://docs.couchdb.org/en/latest/config/externals.html) with node.

Usage
-----
```js
var daemon = require('couch-daemon-bridge')(process.stdin, process.stdout, function() {
  process.exit(0);
});

// Log a message
daemon.info('My daemon is starting.');
daemon.debug('I have so much wow...');
daemon.error('An error occured!');

// Request configuration
daemon.get('httpd.bind_address', function(data) {
  // data is now a string holding the value
});

```

Contributing
------------
1. Write tests with [tap](https://github.com/isaacs/node-tap)
2. Lint your code with `npm run jshint`
3. Run the tests with `npm test`

(c) 2013 Johannes J. Schmidt
