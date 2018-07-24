# shh

> AWS KMS simplified 

AWS Key Managment Service, can be hard to incorporate into your stack. This
tries to make things simpler. All you need is an encrypted .env file that 
[dotenv](https://github.com/motdotla/dotenv) can parse.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [Simple Usage (Enable Decryption on *All* Routes)](#simple-usage-enable-decryption-on-all-routes)
  - [Enable Decryption for a Single Route](#enable-decryption-for-a-single-route)
- [API](#api)
  - [shh({options})](#shhoptions)
    - [Options](#options)
- [Contributing](#contributing)
- [FAQ](#faq)
  - [What is AWS KMS?](#what-is-aws-kms)
  - [Is there a way to debug and set the log level?](#is-there-a-way-to-debug-and-set-the-log-level)
  - [How do I encrypt an *.env file?](#how-do-i-encrypt-an-env-file)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installation

This is a Node.js module avalible through the npm registry.

```bash
$ yarn add @rucas/shh
```

## Usage

Shh requires an encrypted `*.env` file

### Simple Usage (Enable Decryption on *All* Routes)

```javascript
const shh = require('@rucas/shh')
const express = require('express')

const app = express()

app.use(shh({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  file: 'production.env.encrypted' 
}))

```

### Enable Decryption for a Single Route

```javascript
const shh = require('@rucas/shh')
const express = require('express')

const app = express()

const mw = shh({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  file: 'production.env.encrypted' 
})

app.get('/decryption', mw, (req, res, next) => 
    res.json('This is a decrypted route'))
```

## API

```javascript
const shh = require('@rucas/shh')

```

### shh({options})

Returns middleware using the given options. Middleware will attempt to decrypt
file once upon request and use cache for each other subsequent request. 

#### Options

- file (String) — The location of encrypted *.env file
 
- params (map) — An optional map of parameters to bind to every request 
sent by this service object. For more information on bound parameters, 
see "Working with Services" in the Getting Started Guide.

- endpoint (String) — The endpoint URI to send requests to. The default 
endpoint is built from the configured region. The endpoint should be a 
string like 'https://{service}.{region}.amazonaws.com'.

- accessKeyId (String) — your AWS access key ID.

- secretAccessKey (String) — your AWS secret access key.

- sessionToken (AWS.Credentials) — the optional AWS session token to sign requests with.

- credentials (AWS.Credentials) — the AWS credentials to sign requests with. You can either specify this object, or specify the accessKeyId and secretAccessKey options directly.

- credentialProvider (AWS.CredentialProviderChain) — the provider chain used to resolve credentials if no static credentials property is set.

- region (String) — the region to send service requests to. See AWS.KMS.region for more information.

- maxRetries (Integer) — the maximum amount of retries to attempt with a request. See AWS.KMS.maxRetries for more information.

- maxRedirects (Integer) — the maximum amount of redirects to follow with a request. See AWS.KMS.maxRedirects for more information.

- sslEnabled (Boolean) — whether to enable SSL for requests.

- paramValidation (Boolean|map) — whether input parameters should be validated against the operation description before sending the request. Defaults to true. Pass a map to enable any of the following specific validation features:
    - min [Boolean] — Validates that a value meets the min constraint. This is enabled by default when paramValidation is set to true.
    - max [Boolean] — Validates that a value meets the max constraint.
    - pattern [Boolean] — Validates that a string value matches a regular expression.
    - enum [Boolean] — Validates that a string value matches one of the allowable enum values.

- computeChecksums (Boolean) — whether to compute checksums for payload bodies when the service accepts it (currently supported in S3 only)

- convertResponseTypes (Boolean) — whether types are converted when parsing response data. Currently only supported for JSON based services. Turning this off may improve performance on large response payloads. Defaults to true.

- correctClockSkew (Boolean) — whether to apply a clock skew correction and retry requests that fail because of an skewed client clock. Defaults to false.

- s3ForcePathStyle (Boolean) — whether to force path style URLs for S3 objects.

- s3BucketEndpoint (Boolean) — whether the provided endpoint addresses an individual bucket (false if it addresses the root API endpoint). Note that setting this configuration option requires an endpoint to be provided explicitly to the service constructor.

- s3DisableBodySigning (Boolean) — whether S3 body signing should be disabled when using signature version v4. Body signing can only be disabled when using https. Defaults to true.

- retryDelayOptions (map) — A set of options to configure the retry delay on retryable errors. Currently supported options are:
    - base [Integer] — The base number of milliseconds to use in the exponential backoff for operation retries. Defaults to 100 ms for all services except DynamoDB, where it defaults to 50ms.
    - customBackoff [function] — A custom function that accepts a retry count and returns the amount of time to delay in milliseconds. The base option will be ignored if this option is supplied.

- httpOptions (map) — A set of options to pass to the low-level HTTP request. Currently supported options are:
    - proxy [String] — the URL to proxy requests through
    - agent [http.Agent, https.Agent] — the Agent object to perform HTTP requests with. Used for connection pooling. Defaults to the global agent (http.globalAgent) for non-SSL connections. Note that for SSL connections, a special Agent object is used in order to enable peer certificate verification. This feature is only available in the Node.js environment.
    - connectTimeout [Integer] — Sets the socket to timeout after failing to establish a connection with the server after connectTimeout milliseconds. This timeout has no effect once a socket connection has been established.
    - timeout [Integer] — Sets the socket to timeout after timeout milliseconds of inactivity on the socket. Defaults to two minutes (120000).
    - xhrAsync [Boolean] — Whether the SDK will send asynchronous HTTP requests. Used in the browser environment only. Set to false to send requests synchronously. Defaults to true (async on).
    - xhrWithCredentials [Boolean] — Sets the "withCredentials" property of an XMLHttpRequest object. Used in the browser environment only. Defaults to false.

- apiVersion (String, Date) — a String in YYYY-MM-DD format (or a date) that represents the latest possible API version that can be used in all services (unless overridden by apiVersions). Specify 'latest' to use the latest possible version.

- apiVersions (map<String, String|Date>) — a map of service identifiers (the lowercase service class name) with the API version to use when instantiating a service. Specify 'latest' for each individual that can use the latest available version.

- logger (#write, #log) — an object that responds to .write() (like a stream) or .log() (like the console object) in order to log information about requests

- systemClockOffset (Number) — an offset value in milliseconds to apply to all signing times. Use this to compensate for clock skew when your system may be out of sync with the service time. Note that this configuration option can only be applied to the global AWS.config object and cannot be overridden in service-specific configuration. Defaults to 0 milliseconds.

- signatureVersion (String) — the signature version to sign requests with (overriding the API configuration). Possible values are: 'v2', 'v3', 'v4'.

- signatureCache (Boolean) — whether the signature to sign requests with (overriding the API configuration) is cached. Only applies to the signature version 'v4'. Defaults to true.

- dynamoDbCrc32 (Boolean) — whether to validate the CRC32 checksum of HTTP response bodies returned by DynamoDB. Default: true.

## Contributing

:wave::point_right: Check out the [Contributing](CONTRIBUTING.md) doc to get you started.

## FAQ

### What is AWS KMS?

A service that allows you to manage and control encryption keys used to
encrypt/decrypt data. Also integrated with AWS Cloudtrail to provide you with
logs of all key usage.

### Is there a way to debug and set the log level?

Shh uses [debug](https://github.com/visionmedia/debug) to show detailed logging.

```sh
$ DEBUG=shh yarn test
```

### How do I encrypt an *.env file?

```sh
$ aws kms encrypt --key-id cd1a609d-3735-4347-9e3d-28cc8551f071 \
    --plaintext fileb://test/test.env \
    --output text \
    --query CiphertextBlob \
    | base64 --decode > ExampleEncryptedFile
```

## License

MIT