const fs = require('fs')
const AwsKms = require('aws-sdk/clients/kms')
const dotenv = require('dotenv')
const debug = require('debug')('shh')

function shh (options) {
  const opts = options || {}
  if (!opts.file) throw new Error('shh is missing file option')

  const Kms = new AwsKms(options)
  const blob = fs.readFileSync(opts.file)

  debug('ssh options %j', opts)

  return (req, res, next) => {
    Kms.decrypt({ CiphertextBlob: blob }, (err, data) => {
      if (err) return next(err)
      const envConfig = dotenv.parse(data.Plaintext)
      for (var k in envConfig) {
        debug('ssh setting %j environment variable', k)
        process.env[k] = envConfig[k]
      }
      next()
    })
  }
}

module.exports = shh
