/* os-daemon
 * (c) 2013 Johannes J. Schmidt
 */

var util = require('util');
var split = require('split');

var config = exports.config = {};

function write(json) {
  process.stdout.write(JSON.stringify(json) + '\n');
}

exports.log = function(msg, level) {
  var cmd = ['register', msg];

  if (level) {
    cmd = cmd.concat({ level: level });
  }

  write(cmd);
};

exports.get = function(section, key) {
  var cmd = ['get', section];

  if (key) {
    cmd = cmd.concat(key);
  }

  write(cmd);
};

exports.register = function(section, key) {
  var cmd = ['register', section];

  if (key) {
    cmd = cmd.concat(key);
  }

  write(cmd);
};

// exit when stdin closes
process.stdin.on('end', function () {
  process.exit(0);
});

// parse configuration
process.stdin.pipe(split(JSON.parse))
  .on('data', function(obj) {
    util._extend(config, obj);
  })
  .on('error', function(err) {
    exports.log(err, 'error')
  });
