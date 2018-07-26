const express = require('express')
const request = require('supertest')
const shh = require('..')

beforeEach(() => {
  delete process.env.SUPER_SECRET_KEY
  delete process.env.FOO
})

test('shh is defined', () => {
  expect(shh).toBeDefined()
})

test('shh is defined with file option', () => {
  const mw = shh({ file: 'test/test.env.encrypted' })
  expect(mw).toBeDefined()
})

test('shh is defined with no file option', () => {
  expect(() => shh({})).toThrowError(/missing/)
})

test('shh should decrypt on all requests', async () => {
  const app = express()

  app.use(shh({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    file: 'test/test.env.encrypted'
  }))

  app.get('/', (req, res) => {
    res.end('Hello World')
  })

  await request(app)
    .get('/')
    .expect(200)
    .then((res) => {
      expect(res).toBeDefined()
      expect(process.env.SUPER_SECRET_KEY).toEqual('run_you_fools')
      expect(process.env.FOO).toEqual('BAR')
    })
})

test('shh should decrypt on one request', async () => {
  const app = express()

  const mw = shh({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    file: 'test/test.env.encrypted'
  })

  app.get('/', (req, res) => {
    res.end('Hello World')
  })

  app.get('/decrypt', mw, (req, res) => {
    res.end('Hello World')
  })

  await request(app)
    .get('/')
    .expect(200)
    .then((res) => {
      expect(res).toBeDefined()
      expect(process.env.SUPER_SECRET_KEY).toEqual(undefined)
      expect(process.env.FOO).toEqual(undefined)
    })

  await request(app)
    .get('/decrypt')
    .expect(200)
    .then((res) => {
      expect(res).toBeDefined()
      expect(process.env.SUPER_SECRET_KEY).toEqual('run_you_fools')
      expect(process.env.FOO).toEqual('BAR')
    })
})

test('shh should cache after first request for x mins', async () => {
  const app = express()

  const mw = shh({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    file: 'test/test.env.encrypted'
  })

  app.get('/', mw, (req, res) => {
    res.end('Hello World')
  })

  app.get('/decrypt', mw, (req, res) => {
    res.end('Hello World')
  })

  await request(app)
    .get('/')
    .expect(200)
    .then((res) => {
      expect(res).toBeDefined()
      expect(process.env.SUPER_SECRET_KEY).toEqual('run_you_fools')
      expect(process.env.FOO).toEqual('BAR')
    })

  await request(app)
    .get('/decrypt')
    .expect(200)
    .then((res) => {
      expect(res).toBeDefined()
      expect(process.env.SUPER_SECRET_KEY).toEqual('run_you_fools')
      expect(process.env.FOO).toEqual('BAR')
    })
})
