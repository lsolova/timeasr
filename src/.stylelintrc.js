'use strict';

module.exports = {
    'rules': {
        'selector-list-comma-newline-after': 'always',
        'indentation': [4],
        'max-empty-lines': 1,
        'max-line-length': 120,
        'no-browser-hacks': true,
        'no-missing-end-of-source-newline': true,
        'no-unsupported-browser-features': [true, {
            browsers: [
                'last 2 Chrome versions',
                'last 2 ChromeAndroid versions',
                'last 2 Firefox versions',
                'Explorer 11'
            ].join(','),
            severity: 'warning'
        }],
        'no-extra-semicolons': true
    }
}