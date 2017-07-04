var sodium = require('sodium-native')
var transform = require('stream').Transform
var peek = require('peek-stream')

var MAGIC_BYTES = Buffer.from('# private-pipe')

module.exports = function (password) {
  var key = Buffer.allocUnsafe(sodium.crypto_stream_KEYBYTES)

  var nonce = Buffer.allocUnsafe(MAGIC_BYTES.length + sodium.crypto_pwhash_SALTBYTES + sodium.crypto_stream_NONCEBYTES)
  var instance

  var cipher = transform({
    transform: function (chunk, enc, next) {
      instance.update(chunk, chunk)
      next(null, chunk)
    },
    flush: function (done) {
      instance.final()
      done()
    }
  })

  return peek({newline: false, maxBuffer: nonce.length, consumeData: true}, function (header, swap) {
    if (Buffer.compare(MAGIC_BYTES, header.slice(0, MAGIC_BYTES.length)) === 0) {
      cipher.mode = 'decrypt'
      nonce.set(header)
    } else {
      cipher.mode = 'encrypt'
      nonce.set(MAGIC_BYTES)
      sodium.randombytes_buf(nonce.slice(MAGIC_BYTES.length))
    }

    crypto_setup(function (err) {
      if (err) return peek.destroy(err)

      if (cipher.mode === 'encrypt') {
        cipher.push(nonce)
        cipher.write(header)
      }

      swap(null, cipher)
    })
  })

  function crypto_setup (cb) {
    sodium.crypto_pwhash_async(
      key,
      password,
      nonce.slice(MAGIC_BYTES.length, MAGIC_BYTES.length + sodium.crypto_pwhash_SALTBYTES),
      sodium.crypto_pwhash_OPSLIMIT_INTERACTIVE,
      sodium.crypto_pwhash_MEMLIMIT_INTERACTIVE,
      sodium.crypto_pwhash_ALG_DEFAULT,
      function (err) {
        if (err) return cb(err)

        instance = sodium.crypto_stream_xor_instance(nonce.slice(MAGIC_BYTES.length + sodium.crypto_passwd_SALTBYTES), key)

        cb()
      }
    )
  }
}
