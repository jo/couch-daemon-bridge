/* os-daemon
 * (c) 2013 Johannes J. Schmidt
 */

var util = require('util');
var es = require('event-stream');

module.exports = function(stdin, stdout, exit) {
  var config = {};
  var lastConfigKey;

  function write(json) {
    stdout.write(JSON.stringify(json) + '\n');
  }

  // call exit when stdin closes
  stdin.on('end', exit);

  // parse configuration
  es.pipeline(
    stdin,
    es.split(),
    es.map(function map(line, next) {
      if (!line) {
        return;
      }

      var obj = JSON.parse(line);

      if (lastConfigKey && typeof obj === 'string') {
        var value = obj;
        obj = {};
        obj[lastConfigKey] = value;
      }

      // update configuration
      util._extend(config, obj);

      // log out updated configuration
      var msg = [
        'log',
        'updated configuration: ' + JSON.stringify(config),
        { level: 'debug' }
      ];

      next(null, JSON.stringify(config) + '\n');
    }),
    stdout
  ).on('error', function(err) {
    console.log('Error: ', err);
  });

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
        lastConfigKey = key;
        cmd = cmd.concat(key);
      }

      write(cmd);
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
