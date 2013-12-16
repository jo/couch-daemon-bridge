var stream = require('stream');
var test = require('tap').test;
var daemon = require('..');

test('info logging', function(t) {
  var input = new stream.Stream();
  input.readable = true;

  var output = new stream.Stream();
  output.writable = true;
  output.write = function(data) {
    var message = JSON.stringify(['log', 'my message']) + '\n';

    return t.equal(data, message, 'should have logged "my message"');
  };

  var d = daemon(input, output, function() {
    t.end();
  });

  d.info('my message');

  input.emit('end');
});

test('debug logging', function(t) {
  var stdin = new stream.Stream();
  stdin.readable = true;

  var stdout = new stream.Stream();
  stdout.writable = true;
  stdout.write = function(data) {
    var message = JSON.stringify(['log', 'my message', { level: 'debug' }]) + '\n';

    return t.equal(data, message, 'should have logged "my message"');
  };

  var d = daemon(stdin, stdout, function() {
    t.end();
  });

  d.debug('my message');

  stdin.emit('end');
});

test('error logging', function(t) {
  var stdin = new stream.Stream();
  stdin.readable = true;

  var stdout = new stream.Stream();
  stdout.writable = true;
  stdout.write = function(data) {
    var message = JSON.stringify(['log', 'my message', { level: 'error' }]) + '\n';

    return t.equal(data, message, 'should have logged "my message"');
  };

  var d = daemon(stdin, stdout, function() {
    t.end();
  });

  d.error('my message');

  stdin.emit('end');
});
