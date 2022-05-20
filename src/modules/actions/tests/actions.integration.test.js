import httpStatus from 'http-status'
import mongoose from 'mongoose'
import request from 'supertest'
import app from '../../../app.js'
import { Users } from '../../users/model/index.js'
import { generateJwt, hashString } from '../../../common/helpers.js'
import { getAdminRole } from '../../roles/services/index.js'
import { Permissions } from '../../permissions/model/index.js'

const { CONFLICT, CREATED, NOT_FOUND } = httpStatus

describe('Auth endpoints integration tests', () => {
  beforeAll(async () => {
    const { MONGO_TEST_URL } = process.env

    await mongoose.connect(MONGO_TEST_URL)
  })

  afterAll(async () => {
    await mongoose.disconnect()
  })

  describe('POST /actions/', () => {
    let userJwt
    let permissionId

    beforeAll(async () => {
      const adminRole = await getAdminRole()

      const userPayload = {
        email: 'test12@test.com',
        username: 'testing',
        role: adminRole
      }

      const hashedPassword = await hashString({ str: '1234' })

      userJwt = generateJwt({ data: userPayload })

      await Users.create({
        ...userPayload,
        password: hashedPassword,
        jwt: userJwt
      });

      ({ _id: permissionId } = await Permissions.create({ name: 'a permission' }))
    })

    test('It create an action successfully', async () => {
      const { status, body } = await request(app)
        .post('/actions/')
        .set('Authorization', `JWT ${userJwt}`)
        .send({
          actionName: 'new action',
          requiredPermissionIds: [String(permissionId)]
        })

      expect(status).toBe(CREATED)

      expect(body.name).toEqual('new action')
    })

    test('It fails if the action is created before', async () => {
      const { status } = await request(app)
        .post('/actions/')
        .set('Authorization', `JWT ${userJwt}`)
        .send({
          actionName: 'new action',
          requiredPermissionIds: [String(permissionId)]
        })

      expect(status).toBe(CONFLICT)
    })

    test('It fails if one of the provided permission ids is invalid', async () => {
      const { status } = await request(app)
        .post('/actions/')
        .set('Authorization', `JWT ${userJwt}`)
        .send({
          actionName: 'new action 2',
          requiredPermissionIds: [String(mongoose.Types.ObjectId())]
        })

      expect(status).toBe(NOT_FOUND)
    })
  })
})
