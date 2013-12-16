/* os-daemon
 * (c) 2013 Johannes J. Schmidt
 */

var util = require('util');
var es = require('event-stream');

module.exports = function(stdin, stdout, exit) {
  var config = {};
  var configKeys = [];

  function write(json) {
    stdout.write(JSON.stringify(json) + '\n');
  }

  // call exit when stdin closes
  stdin.on('end', exit);

  // parse configuration
  var configurator = es.pipeline(
    stdin,
    es.split(),
    es.map(function map(line, next) {
      if (!line) {
        return;
      }

      var obj = JSON.parse(line);
      var configKey = configKeys.shift();
      if (configKey && typeof obj === 'string') {
        var value = obj;
        obj = {};
        obj[configKey] = value;
      }

      // update configuration
      util._extend(config, obj);

      next(null, config);
    })
  );

  configurator.on('error', function(err) {
    console.log('Error: ', err);
  });

  es.pipeline(
    configurator,
    es.map(function map(data, next) {
      // log out updated configuration
      var msg = [
        'log',
        'updated config: ' + JSON.stringify(data),
        { level: 'debug' }
      ];

      next(null, JSON.stringify(msg) + '\n');
    }),
    stdout
  );
  
  return {
    config: config,

    // Log a message and return log stream
    log: function log(msg, level) {
      var cmd = ['log', msg];

      if (level) {
        cmd = cmd.concat({ level: level });
      }

      write(cmd);
    },

    // Request configuration parameter
    get: function get(section, key) {
      var cmd = ['get', section];

      if (key) {
        configKeys.push(key);
        cmd = cmd.concat(key);
      }

      write(cmd);

      return configurator;
    },

    // Register restart on configuration change
    register: function register(section, key) {
      var cmd = ['register', section];

      if (key) {
        cmd = cmd.concat(key);
      }

      write(cmd);
    }
  };
};
