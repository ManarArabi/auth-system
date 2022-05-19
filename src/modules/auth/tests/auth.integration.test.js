import httpStatus from 'http-status'
import mongoose from 'mongoose'
import request from 'supertest'
import jwt from 'jsonwebtoken'
import app from '../../../app.js'

const { BAD_REQUEST, CREATED } = httpStatus

describe('Auth endpoints integration tests', () => {
  beforeAll(async () => {
    const { MONGO_TEST_URL } = process.env

    await mongoose.connect(MONGO_TEST_URL)
  })

  afterAll(async () => {
    await mongoose.disconnect()
  })

  describe('POST /signup', () => {
    test('It creates a user and generating jwt successfully', async () => {
      const payload = {
        username: 'test',
        password: 'test123',
        email: 'test@test.com'
      }

      const { status, body } = await request(app)
        .post('/signup')
        .send(payload)

      expect(status).toBe(CREATED)

      const { _id, __v, jwt: token, ...user } = body
      expect(user).toEqual({ username: payload.username, email: payload.email })

      const { exp, iat, ...tokenPayload } = jwt.decode(token)
      expect(tokenPayload).toEqual({ username: payload.username, email: payload.email })
    })

    test('It returns bad request if the request body is not valid', async () => {
      const { status } = await request(app)
        .post('/signup')
        .send({
          username: 'test'
        })

      expect(status).toBe(BAD_REQUEST)
    })
  })
})
