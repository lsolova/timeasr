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
        'browser': true,
        'es6': true,
        'mocha': true,
        'node': true
    },
    "parserOptions": {
        "sourceType": "module"
    }
}
