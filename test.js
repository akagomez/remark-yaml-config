'use strict';

/* eslint-env node */

/*
 * Dependencies.
 */

var test = require('tape');
var unified = require('unified');
var remark = require('remark');
var html = require('remark-html');
var metaPlugin = require('./');

/*
 * Tests.
 */

test('remark-yaml-meta', function (t) {
    t.equal(
        remark().use(metaPlugin).process('# Foo bar\n').toString(),
        '# Foo bar\n',
        'Should not fail without yaml'
    );

    t.equal(
        remark().use(html).use(metaPlugin).process([
            '---',
            'foo: bar',
            '---',
            ''
        ].join('\n')).meta.foo, 'bar',
        'A meta property is created'
    );

    t.equal(
        remark().use(html).use(metaPlugin).process([
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
        Object.keys(remark().use(html).use(metaPlugin).process([
            '---',
            'foo: bar',
            'bar: foo',
            '---',
            ''
        ].join('\n')).meta), ['foo', 'bar'],
        'All properties are set'
    );

    t.equal(
        remark().use(html).use(metaPlugin).process([
            '---',
            'foo:',
            '  bar: nested',
            '---',
            ''
        ].join('\n')).meta.foo.bar, 'nested',
        'Objects can be nested'
    );

    t.end();
});
