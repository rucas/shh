const connect = require('connect')
const request = require('supertest')
const shh = require('..')

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

test('shh should decrypt on request', async () => {
  const app = connect()

  app.use(shh({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    file: 'test/test.env.encrypted'
  }))

  app.use('/', (req, res, next) => {
    res.end('Hello World')
    next()
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
