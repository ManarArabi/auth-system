import httpStatus from 'http-status'
import mongoose from 'mongoose'
import request from 'supertest'
import app from '../../../app.js'
import { getTestAdminUser } from '../../../../tests/helpers.js'
import { Roles } from '../../roles/model/index.js'
import { Users } from '../model/index.js'

const { NOT_FOUND, NO_CONTENT } = httpStatus

describe('Users endpoints integration tests', () => {
  beforeAll(async () => {
    const { MONGO_TEST_URL } = process.env

    await mongoose.connect(MONGO_TEST_URL)
  })

  afterAll(async () => {
    await mongoose.disconnect()
  })

  describe('POST /users/:id/role/:roleId', () => {
    let adminJwt
    let userId
    let roleId

    beforeAll(async () => {
      ({ jwt: adminJwt } = await getTestAdminUser({ email: 'testRole@test.com' }));

      ({ _id: userId } = await Users.create({ email: 'testUsers@test.com', username: 'test', password: '123' }));

      ({ _id: roleId } = await Roles.create({ name: 'test role 1' }))
    })

    test('It create a role successfully', async () => {
      const { status } = await request(app)
        .post(`/users/${userId}/roles/${roleId}`)
        .set('Authorization', `JWT ${adminJwt}`)

      expect(status).toBe(NO_CONTENT)

      const user = await Users.findOne({ _id: userId }, { role: 1 })
      expect(String(user.role._id)).toEqual(String(roleId))
    })

    test('It fails if the role is not exist', async () => {
      const { status } = await request(app)
        .post(`/users/${userId}/roles/${String(mongoose.Types.ObjectId())}`)
        .set('Authorization', `JWT ${adminJwt}`)

      expect(status).toBe(NOT_FOUND)
    })
  })
})
