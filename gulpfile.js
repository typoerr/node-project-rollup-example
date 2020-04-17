const gulp = require('gulp')
const client = require('./task/client')
const server = require('./task/server')
const clean = require('./task/clean-dist')

exports['build:client'] = client.build
exports['watch:client'] = client.watch
exports['clean:client'] = client.client

exports['build:server'] = server.build
exports['watch:server'] = server.watch
exports['clean:server'] = server.clean

exports['clean'] = clean
exports['build'] = gulp.parallel(client.build, server.build)
exports['watch'] = gulp.parallel(client.watch, server.watch)
