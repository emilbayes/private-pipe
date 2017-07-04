var test = require('tape')
var choppa = require('choppa')
var privatePipe = require('.')

test('short', function (assert) {
  var data = Buffer.from('some long')

  var a = privatePipe(Buffer.from('secret'))
  var b = privatePipe(Buffer.from('secret'))

  var idx = 0
  b.on('data', function (chunk) {
    assert.ok(chunk.compare(data, idx, idx += chunk.length) === 0)
  })

  b.on('end', assert.end)
  a.on('error', assert.error)
  b.on('error', assert.error)

  var source = choppa(1)
  source.pipe(a).pipe(choppa(1)).pipe(b)
  source.end(data)
})

test('long', function (assert) {
  var data = Buffer.allocUnsafe(Math.pow(2, 16))

  var a = privatePipe(Buffer.from('secret'))
  var b = privatePipe(Buffer.from('secret'))

  var idx = 0
  b.on('data', function (chunk) {
    assert.ok(chunk.compare(data, idx, idx += chunk.length) === 0)
  })

  b.on('end', assert.end)
  a.on('error', assert.error)
  b.on('error', assert.error)

  var source = choppa(13)
  source.pipe(a).pipe(choppa(13)).pipe(b)
  source.end(data)
})
