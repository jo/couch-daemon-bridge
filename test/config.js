var es = require('event-stream');
var test = require('tap').test;
var daemon = require('..');


test('get whole configuration section', function(t) {
  var config = {
    my_key: 'my_value'
  };

  var stdin = es.readArray([
      JSON.stringify(config)
    ])
    .pipe(es.stringify());

  var stdout = es.writeArray(function(err, data) {
    var message;

    message = JSON.stringify(['register', 'my_section']) + '\n';
    t.equal(data[0], message, 'should have registered for "my_section"');

    message = JSON.stringify(['get', 'my_section']) + '\n';
    t.equal(data[1], message, 'should have requested "my_section" config');
  });

  var d = daemon(stdin, stdout, function() {
    t.end();
  });

  d.get('my_section', function(err, res) {
    t.deepEqual(res, config, 'correct object returned');
  });
});

test('get whole configuration section from object', function(t) {
  var config = {
    my_key: 'my_value'
  };

  var stdin = es.readArray([
      JSON.stringify(config)
    ])
    .pipe(es.stringify());

  var stdout = es.writeArray(function(err, data) {
    var message;

    message = JSON.stringify(['register', 'my_section']) + '\n';
    t.equal(data[0], message, 'should have registered for "my_section"');

    message = JSON.stringify(['get', 'my_section']) + '\n';
    t.equal(data[1], message, 'should have requested "my_section" config');
  });

  var d = daemon(stdin, stdout, function() {
    t.end();
  });

  d.get({ myconfig: 'my_section' }, function(err, res) {
    t.deepEqual(res.myconfig, config, 'correct object returned');
  });
});

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

  d.get('my_section.my_key', function(err, key) {
    t.equal(key, 'my_value', 'correct value returned');
  });
});

test('single configuration key with empty value', function(t) {
  var stdin = es.readArray([
      ''
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

  d.get('my_section.my_key', function(err, key) {
    t.equal(key, '', 'correct value returned');
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
  }, function(err, value) {
    t.deepEqual(value, { foo: 'my_value', bar: 'other_value' }, 'correct value returned');
  });
});

test('nested configuration object', function(t) {
  var stdin = es.readArray([
      'nested_value'
    ])
    .pipe(es.stringify());

  var stdout = es.writeArray(function() {});

  var d = daemon(stdin, stdout, function() {
    t.end();
  });

  d.get({
    nested: {
      baz: 'my_section.nested_value'
    }
  }, function(err, value) {
    t.deepEqual(value, {
      nested: {
        baz: 'nested_value'
      }
    }, 'correct value returned');
  });
});

test('single key after nested configuration object', function(t) {
  var stdin = es.readArray([
      'nested_value',
      'other_value'
    ])
    .pipe(es.stringify());

  var stdout = es.writeArray(function() {});

  var d = daemon(stdin, stdout, function() {
    t.end();
  });

  d.get({
    nested: {
      baz: 'my_section.nested_value'
    },
    zoo: 'my_section.other_key'
  }, function(err, value) {
    t.deepEqual(value, {
      nested: {
        baz: 'nested_value'
      },
      zoo: 'other_value'
    }, 'correct value returned');
  });
});
