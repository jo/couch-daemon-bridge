var es = require('event-stream');
var stream = require('stream');
var test = require('tap').test;
var daemon = require('..');

test('single configuration key', function(t) {
  var stdin = es.readArray([
      'my_value'
    ])
    .pipe(es.stringify());

  var stdout = es.writeArray(function(err, data) {
    var message;

    message = JSON.stringify(['register', 'my_section', 'my_key']) + '\n';
    t.equal(data[0], message, 'should have registered for "my_key" in "my_section"');

    message = JSON.stringify(['get', 'my_section', 'my_key']) + '\n';
    t.equal(data[1], message, 'should have requested "my_key" in "my_section" config');
  });

  var d = daemon(stdin, stdout, function() {
    t.end();
  });

  d.get('my_section.my_key', function(key) {
    t.equal(key, 'my_value', 'correct value returned');
  });
});

test('configuration object', function(t) {
  var stdin = es.readArray([
      'other_value',
      'my_value'
    ])
    .pipe(es.stringify());

  var stdout = es.writeArray(function() {});

  var d = daemon(stdin, stdout, function() {
    t.end();
  });

  d.get({
    foo: 'my_section.my_key',
    bar: 'my_section.other_key'
  }, function(value) {
    t.deepEqual(value, { foo: 'my_value', bar: 'other_value' }, 'correct value returned');
  });
});

test('nested configuration object', function(t) {
  var stdin = es.readArray([
      'other_value',
      'my_value',
      'nested_value'
    ])
    .pipe(es.stringify());

  var stdout = es.writeArray(function() {});

  var d = daemon(stdin, stdout, function() {
    t.end();
  });

  d.get({
    foo: 'my_section.my_key',
    bar: 'my_section.other_key',
    nested: {
      baz: 'my_section.nested_value'
    }
  }, function(value) {
    t.deepEqual(value, {
      foo: 'my_value',
      bar: 'other_value',
      nested: {
        baz: 'nested_value'
      }
    }, 'correct value returned');
  });
});
