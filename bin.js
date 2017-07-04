#!/usr/bin/env node

var encryptPipe = require('./')

if (process.argv.indexOf('--help') > -1 || process.argv.indexOf('-h') > -1) {
  console.log('Usage: encrypt-pipe <password>')
  process.exit()
}
if (process.argv.length < 3) process.exit(1)

var stream = encryptPipe(Buffer.from(process.argv[2]))

process.stdin.pipe(stream).pipe(process.stdout)

process.once('uncaughtException', function (err) { // yolo
  if (err.code !== 'EPIPE') throw err
})
