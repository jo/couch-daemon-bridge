os-daemon
=========
Use CouchDBs
[`os_daemons`](http://docs.couchdb.org/en/latest/config/externals.html) with node.

Usage
-----
```js
var daemon = require('os-daemon');
// Access configuration object
daemon.config
// Request a configuration parameter
daemon.get(section, key);
// Register to be restarted in the event that the configuration changes
daemon.register(section, key);
// Log a message
daemon.log(msg, level);
```

(c) 2013 Johannes J. Schmidt
