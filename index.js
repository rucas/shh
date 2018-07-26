const fs = require('fs')
const ms = require('ms')
const AwsKms = require('aws-sdk/clients/kms')
const dotenv = require('dotenv')
const LRU = require('lru-cache')
const debug = require('debug')('shh')

function shh (options) {
  const opts = options || {}
  if (!opts.file) throw new Error('shh is missing file option')
  debug('options %j', opts)

  const Kms = new AwsKms(options)
  const cache = LRU({
    max: 500,
    maxAge: opts.maxAge || ms('1d'),
    length: (n, key) => n.length
  })

  return (req, res, next) => {
    // we have decrypted already and cache is not too old...
    if (cache.get(`decrypted:${opts.file}`)) {
      debug('cache found')
      const unecrypted = cache.get(`decrypted:${opts.file}`)
      for (var k in unecrypted) {
        debug('setting %j environment variable', k)
        process.env[k] = unecrypted[k]
      }
      next()
    } else {
      const blob = fs.readFileSync(opts.file)
      Kms.decrypt({ CiphertextBlob: blob }, (err, data) => {
        if (err) return next(err)
        const envConfig = dotenv.parse(data.Plaintext)
        for (var k in envConfig) {
          debug('setting %j environment variable', k)
          process.env[k] = envConfig[k]
          debug('setting cache for %j', `decrypted:${opts.file}`)
          cache.set(`decrypted:${opts.file}`, envConfig)
        }
        next()
      })
    }
  }
}

module.exports = shh
