/* couch-daemon
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
    var pipeline = es.pipeline(
      es.map(function(data, done) {
        var cmd = ['log', data];
        if (level) {
          cmd = cmd.concat({ level: level });
        }
        done(null, cmd);
      }),
      stdout
    );

    return function(msg) {
      if (!arguments.length) {
        return  pipeline;
      }

      var cmd = ['log', msg];
      if (level) {
        cmd = cmd.concat({ level: level });
      }

      stdout.write(cmd);
    };
  }


  // Request single configuration value
  // and register for newstart on change
  function getValue(value, callback) {
    var parts = value.split('.');

    if (parts.length !== 2) {
      return callback({ error: 'malformed config key', reason: 'Keys must be of the form "section.key"' });
    }

    var env = parts.map(function(p) { return p.toUpperCase(); }).join('_');
    if (process.env[env]) {
      return callback(null, process.env[env]);
    }

    if (typeof callback === 'function') {
      stdin.once('data', function(data) {
        callback(null, data);
      });
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
    get: function get(stringOrObject, callback) {
      if (typeof stringOrObject === 'string') {
        return getValue(stringOrObject, callback);
      }

      var value = {};

      function getPart(key, next) {
        if (typeof stringOrObject[key] === 'object') {
          get(stringOrObject[key], function(err, r) {
            value[key] = r;
            next(null, value);
          });
          return;
        }

        getValue(stringOrObject[key], function(err, c) {
          if (err) {
            return next(err);
          }

          var r = {};

          r[key] = c;

          next(null, r);
        });
      }

      async.mapSeries(Object.keys(stringOrObject).sort(), getPart, function(err, res) {
        res.forEach(function(r) {
          util._extend(value, r);
        });

        callback(null, value);
      });
    }
  };
};

