import httpStatus from 'http-status'
import mongoose from 'mongoose'
import request from 'supertest'
import jwt from 'jsonwebtoken'
import app from '../../../app.js'
import { Users } from '../../users/model/index.js'
import { generateJwt, hashString } from '../../../common/helpers.js'
import { NORMAL_ROLE } from '../../roles/constants/index.js'

const { BAD_REQUEST, CREATED, OK, NOT_FOUND, UNAUTHORIZED } = httpStatus

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
      expect(user).toEqual({ username: payload.username, email: payload.email, role: NORMAL_ROLE })

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

  describe('POST /login', () => {
    const userPassword = '1234'
    let user

    beforeAll(async () => {
      const hashedPassword = await hashString({ str: userPassword })

      user = await Users.create({
        email: 'test123@test.com',
        username: 'testing',
        password: hashedPassword
      })
    })

    test('A user can login successfully', async () => {
      const { status, body } = await request(app)
        .post('/login')
        .send({ email: user.email, password: userPassword })

      expect(status).toBe(OK)
      expect(body).not.toBeFalsy()
    })

    test('It returns not found if there is not user', async () => {
      const { status } = await request(app)
        .post('/login')
        .send({ email: 'here@123.com', password: userPassword })

      expect(status).toBe(NOT_FOUND)
    })

    test('It returns unauthorized if the password is wring', async () => {
      const { status } = await request(app)
        .post('/login')
        .send({ email: user.email, password: 'wrong-password' })

      expect(status).toBe(UNAUTHORIZED)
    })
  })

  describe('POST /logout', () => {
    let userJwt
    const userPayload = {
      email: 'test12@test.com',
      username: 'testing'
    }

    beforeAll(async () => {
      const hashedPassword = await hashString({ str: '1234' })

      userJwt = generateJwt({ data: userPayload })

      await Users.create({
        ...userPayload,
        password: hashedPassword,
        jwt: userJwt
      })
    })

    test('It logs user out successfully', async () => {
      const { status } = await request(app)
        .post('/logout')
        .set('Authorization', `JWT ${userJwt}`)

      expect(status).toBe(OK)

      const user = await Users.findOne({ email: userPayload.email }, { jwt: 1 }).lean()
      expect(user.jwt).toBeFalsy()
    })
  })
})
