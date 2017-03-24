'use strict';

var test = require('tape');
var unified = require('unified');
var remark = require('remark');
var html = require('remark-html');
var metaPlugin = require('./');

test('remark-yaml-meta', function (t) {
  t.equal(
    remark().use(metaPlugin).processSync('# Foo bar\n').toString(),
    '# Foo bar\n',
    'Should not fail without yaml'
  );

  t.equal(
    remark().use(html).use(metaPlugin).processSync([
      '---',
      'foo: bar',
      '---',
      ''
    ].join('\n')).meta.foo, 'bar',
    'A meta property is created'
  );

  t.equal(
    remark().use(html).use(metaPlugin).processSync([
      '---',
      'foo: bar',
      '---',
      '---',
      'foo: boo',
      '---',
      ''
    ].join('\n')).meta.foo, 'boo',
    'The meta object is extended'
  );

  t.deepEqual(
    Object.keys(remark().use(html).use(metaPlugin).processSync([
      '---',
      'foo: bar',
      'bar: foo',
      '---',
      ''
    ].join('\n')).meta), ['foo', 'bar'],
    'All properties are set'
  );

  t.equal(
    remark().use(html).use(metaPlugin).processSync([
      '---',
      'foo:',
      '  bar: nested',
      '---',
      ''
    ].join('\n')).meta.foo.bar, 'nested',
    'Objects can be nested'
  );

  t.throws(
    function () {
      remark().use(metaPlugin).processSync([
        '---',
        '[foo',
        '---',
        ''
      ].join('\n')).toString();
    },
    /unexpected end of the stream within a flow collection at line 2, column 1/,
    'Should throw exceptions with location information'
  );

  t.doesNotThrow(
    function () {
      unified().use(metaPlugin).freeze();
    },
    'should not throw without parser / compiler'
  );

  t.end();
});
