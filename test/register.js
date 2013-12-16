var stream = require('stream');
var test = require('tap').test;
var daemon = require('..');

test('register on whole section', function(t) {
  var stdin = new stream.Stream();
  stdin.readable = true;

  var stdout = new stream.Stream();
  stdout.writable = true;
  stdout.write = function(data) {
    var message = JSON.stringify(['register', 'my_section']) + '\n';

    return t.equal(data, message, 'should have registered on "my_section"');
  };

  var d = daemon(stdin, stdout, function() {
    t.end();
  });

  d.register('my_section');

  stdin.emit('end');
});

test('register on specific key', function(t) {
  var stdin = new stream.Stream();
  stdin.readable = true;

  var stdout = new stream.Stream();
  stdout.writable = true;
  stdout.write = function(data) {
    var message = JSON.stringify(['register', 'my_section', 'my_key']) + '\n';

    return t.equal(data, message, 'should have registered on "my_key" in "my_section"');
  };

  var d = daemon(stdin, stdout, function() {
    t.end();
  });

  d.register('my_section', 'my_key');

  stdin.emit('end');
});
