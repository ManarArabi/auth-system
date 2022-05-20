import httpStatus from 'http-status'
import mongoose from 'mongoose'
import request from 'supertest'
import app from '../../../app.js'
import { getTestAdminUser } from '../../../../tests/helpers.js'

const { CONFLICT, CREATED } = httpStatus

describe('Permissions endpoints integration tests', () => {
  beforeAll(async () => {
    const { MONGO_TEST_URL } = process.env

    await mongoose.connect(MONGO_TEST_URL)
  })

  afterAll(async () => {
    await mongoose.disconnect()
  })

  describe('POST /permissions/', () => {
    let userJwt

    beforeAll(async () => {
      ({ jwt: userJwt } = await getTestAdminUser({ email: 'testPermissions@test.com' }))
    })

    test('It create an permission successfully', async () => {
      const { status, body } = await request(app)
        .post('/permissions/')
        .set('Authorization', `JWT ${userJwt}`)
        .send({
          permissionName: 'create test permission'
        })

      expect(status).toBe(CREATED)

      expect(body.name).toEqual('create test permission')
    })

    test('It fails if the permission is created before', async () => {
      const { status } = await request(app)
        .post('/permissions/')
        .set('Authorization', `JWT ${userJwt}`)
        .send({
          permissionName: 'create test permission'
        })

      expect(status).toBe(CONFLICT)
    })
  })
})
