import httpStatus from 'http-status'
import mongoose from 'mongoose'
import request from 'supertest'
import app from '../../../app.js'
import { Permissions } from '../../permissions/model/index.js'
import { getTestAdminUser } from '../../../../tests/helpers.js'
import { Users } from '../../users/model/index.js'
import { Roles } from '../../roles/model/index.js'
import { Actions } from '../models/index.js'

const { CONFLICT, CREATED, NOT_FOUND, OK } = httpStatus

describe('Actions endpoints integration tests', () => {
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
      ({ jwt: userJwt } = await getTestAdminUser({ email: 'testActions@test.com' }));

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

  describe('GET /actions/:id/user/:userId/authorization', () => {
    let adminJwt
    let userId
    let actionId

    beforeAll(async () => {
      ({ jwt: adminJwt } = await getTestAdminUser({ email: 'testActionAuthorization@test.com' }))

      const permission = await Permissions.create({ name: 'test user authorization' })
      const role = await Roles.create({ name: 'test user authorization', permissions: [permission] });
      ({ _id: actionId } = await Actions.create({ name: 'test user authorization', requiredPermissionIds: [permission._id] }));

      ({ _id: userId } = await Users.create({ email: 'testActions@test.com', username: 'test', password: '123', role }))
    })

    test('It returns true if the user permissions contains all action permissions', async () => {
      const { status, body: { isAuthorized } } = await request(app)
        .get(`/actions/${actionId}/users/${userId}/authorization`)
        .set('Authorization', `JWT ${adminJwt}`)

      expect(status).toBe(OK)
      expect(isAuthorized).toEqual(true)
    })

    test('It fails if the user is not exist', async () => {
      const { status } = await request(app)
        .get(`/actions/${actionId}/users/${String(mongoose.Types.ObjectId())}/authorization`)
        .set('Authorization', `JWT ${adminJwt}`)

      expect(status).toBe(NOT_FOUND)
    })

    test('It fails if the action is not exist', async () => {
      const { status } = await request(app)
        .get(`/actions/${String(mongoose.Types.ObjectId())}/users/${userId}/authorization`)
        .set('Authorization', `JWT ${adminJwt}`)

      expect(status).toBe(NOT_FOUND)
    })
  })
})
