'use strict';

var pkg = require('../package.json'),
    assert = require('assert');

module.exports = {
    debuglog: require('debuglog')(pkg.name),

    verbs: [
        'get',
        'post',
        'put',
        'delete',
        'head',
        'options',
        'trace',
        'connect',
        'patch'
    ],

    endsWith: function (haystack, needle) {
        if (!haystack || !needle) {
            return false;
        }

        if (needle.length === 1) {
            return haystack[haystack.length - 1] === needle;
        }

        return haystack.slice(haystack.length - needle.length) === needle;
    },

    prefix: function (str, pre) {
        str = str || '';
        if (str.indexOf(pre) === 0) {
            return str;
        }

        str = pre + str;
        return str;
    },

    unprefix: function (str, pre) {
        str = str || '';
        if (str.indexOf(pre) === 0) {
            str = str.substr(pre.length);
            return str;
        }

        return str;
    },

    suffix: function (str, suff) {
        str = str || '';
        if (this.endsWith(str, suff)) {
            return str;
        }

        str = str + suff;
        return str;
    },

    unsuffix: function (str, suff) {
        str = str || '';
        if (this.endsWith(str, suff)) {
            str = str.substr(0, str.length - suff.length);
            return str;
        }

        return str;
    },

    resolveRef: function (schemas, value) {
        var id, refschema, path, fragment, paths;

        id = value.substr(0, value.indexOf('#') + 1);
        path = value.substr(value.indexOf('#') + 1);

        if (id) {
            refschema = schemas[id] || schemas[id.substr(0, id.length - 1)];
        }
        else {
            refschema = schemas['#'];
        }

        assert.ok(refschema, 'Can not find schema reference: ' + value + '.');

        fragment = refschema;
        paths = Array.isArray(path) ? path : path.split('/');

        for (var i = 1; i < paths.length && fragment; i++) {
            fragment = typeof fragment === 'object' && fragment[paths[i]];
        }

        return fragment;
    }
};
