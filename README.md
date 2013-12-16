os-daemon
=========
Ease the use of CouchDBs
[`os_daemons`](http://docs.couchdb.org/en/latest/config/externals.html) with node.

Usage
-----
```js
var daemon = require('os-daemon')(process.stdin, process.stdout, function() {
  process.exit(0);
});

// Log a message
daemon.log('My daemon is starting.');
// ... with a specific log level
daemon.log('I have many options!', 'debug');

// Request a specific configuration
daemon.get('httpd', 'bind_address');

// Request a whole configuration section
daemon.get('my_daemon');

// Access configuration
daemon.config // { bind_address: '127.0.0.1', my_daemon: { foo: 'bar' } }

// Listen to config changes
var feed = daemon.get('my_daemon');
feed.on('data', function(config) {
  // config object
});

// Register daemon to be restarted when configuration changes
daemon.register('my_daemon');
daemon.register('httpd', 'bind_address');
```

Contributing
------------
1. Write tests with [tap](https://github.com/isaacs/node-tap)
2. Lint your code with `npm run jshint`
3. Run the tests with `npm test`

(c) 2013 Johannes J. Schmidt
