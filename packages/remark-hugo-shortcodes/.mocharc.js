'use strict';

module.exports = {
    diff: true,
    extension: ['ts'],
    opts: false,
    package: './package.json',
    reporter: 'spec',
    slow: 75,
    timeout: 0,
    ui: 'bdd',
    require: "./test/register.js",
    recursive: true,
    'watch-files': ['./test/**/*.spec.ts'],
};
