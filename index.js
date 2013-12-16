/* os-daemon
 * (c) 2013 Johannes J. Schmidt
 */

var util = require('util');
var async = require('async');
var es = require('event-stream');

module.exports = function(read, write, exit) {
  // call exit when read stream close
  read.on('end', exit);

  // Parse newline separated JSON from stdin
  var stdin = es.pipeline(
    read,
    es.split(),
    es.parse()
  );
  stdin.on('error', function(err) {
    console.error('parse error: ' + err);
  });

  // Stringify data and append newlines to stdout
  var stdout = es.pipeline(
    es.stringify(),
    write
  );
  stdout.on('error', function(err) {
    console.error('write error: ' + err);
  });


  // return a logger method for loglevel
  function logger(level) {
    return function(msg) {
      if (!arguments.length) {
        return es.pipeline(
          es.map(function(data, done) {
            var cmd = ['log', data];
            if (level) {
              cmd = cmd.concat({ level: level });
            }
            done(null, cmd);
          }),
          stdout
        );
      }

      var cmd = ['log', msg];
      if (level) {
        cmd = cmd.concat({ level: level });
      }
      stdout.write(cmd);
    }
  };


  // Request single configuration value
  // and register for newstart on change
  function getValue(value, callback) {
    var parts = value.split('.');

    if (typeof callback === 'function') {
      stdin.once('data', callback);
    }

    stdout.write(['register'].concat(parts));
    stdout.write(['get'].concat(parts));

    return stdin;
  }

  return {
    // logging
    info: logger(),
    error: logger('error'),
    debug: logger('debug'),

    // configuration
    get: function get(stringOrObject, callback, ret) {
      if (typeof stringOrObject === 'string') {
        return getValue(stringOrObject, callback);
      }

      ret = ret || {};

      function getPart(key, next) {
        if (typeof stringOrObject[key] === 'object') {
          ret[key] = {};
          return get(stringOrObject[key], next, ret[key]);
        }

        getValue(stringOrObject[key], function(c) {
          var r = {};

          r[key] = c;

          next(null, r);
        });
      }

      async.mapSeries(Object.keys(stringOrObject).sort(), getPart, function(err, res) {
        res.forEach(function(r) {
          util._extend(ret, r);
        });

        callback(ret);
      });
    }
  };
};

