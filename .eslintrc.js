'use strict';

module.exports = {
    'extends': 'eslint:recommended',
    'rules': {
        'curly': 'error',
        'radix': 'error',
        'vars-on-top': 'error',
        'wrap-iife': 'error',
        'max-len': ['error', {'code': 120, 'ignoreUrls': true}]
    },
    'env': {
        'es6': true,
        'mocha': true,
        'node': true
    }
}