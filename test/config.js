var stream = require('stream');
var test = require('tap').test;
var daemon = require('..');

test('configuration object', function(t) {
  var stdin = new stream.Stream();
  stdin.readable = true;

  var stdout = new stream.Stream();
  stdout.writable = true;
  stdout.write = function() {};

  var d = daemon(stdin, stdout, function() {
    t.end();
  });

  t.deepEqual(d.config, {}, 'config should be an object');

  stdin.emit('end');
});

test('request section configuration', function(t) {
  var stdin = new stream.Stream();
  stdin.readable = true;

  var stdout = new stream.Stream();
  stdout.writable = true;
  stdout.write = function(data) {
    var message = JSON.stringify(['get', 'my_section']) + '\n';

    return t.equal(data, message, 'should have requested "my_section" config');
  };

  var d = daemon(stdin, stdout, function() {
    t.end();
  });

  d.get('my_section');

  stdin.emit('end');
});

test('update section configuration', function(t) {
  var stdin = new stream.Stream();
  stdin.readable = true;

  var stdout = new stream.Stream();
  stdout.writable = true;
  stdout.write = function() {};

  var d = daemon(stdin, stdout, function() {
    t.end();
  });

  d.get('my_section');

  stdin.emit('data', JSON.stringify({ foo: 'bar' }) + '\n');

  t.deepEqual(d.config, { foo: 'bar' }, 'config should include "foo"');

  stdin.emit('end');
});

test('request key configuration', function(t) {
  var stdin = new stream.Stream();
  stdin.readable = true;

  var stdout = new stream.Stream();
  stdout.writable = true;
  stdout.write = function(data) {
    var message = JSON.stringify(['get', 'my_section', 'my_key']) + '\n';

    return t.equal(data, message, 'should have requested "my_key" in "my_section" config');
  };

  var d = daemon(stdin, stdout, function() {
    t.end();
  });

  d.get('my_section', 'my_key');

  stdin.emit('end');
});

test('update key configuration', function(t) {
  var stdin = new stream.Stream();
  stdin.readable = true;

  var stdout = new stream.Stream();
  stdout.writable = true;
  stdout.write = function() {};

  var d = daemon(stdin, stdout, function() {
    t.end();
  });

  d.get('my_section', 'foo');

  stdin.emit('data', JSON.stringify('bar') + '\n');

  t.deepEqual(d.config, { foo: 'bar' }, 'config should include "foo"');

  stdin.emit('end');
});

