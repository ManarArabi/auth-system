import httpStatus from 'http-status'
import mongoose from 'mongoose'
import request from 'supertest'
import app from '../../../app.js'
import { Permissions } from '../../permissions/model/index.js'
import { getTestAdminUser } from '../../../../tests/helpers.js'
import { Users } from '../../users/model/index.js'
import { Roles } from '../../roles/model/index.js'
import { Actions } from '../models/index.js'

const { CONFLICT, CREATED, NOT_FOUND, OK, NO_CONTENT } = httpStatus

describe('Actions endpoints integration tests', () => {
  let adminJwt

  beforeAll(async () => {
    const { MONGO_TEST_URL } = process.env

    await mongoose.connect(MONGO_TEST_URL);

    ({ jwt: adminJwt } = await getTestAdminUser({ email: 'testActions@test.com' }))
  })

  afterAll(async () => {
    await mongoose.disconnect()
  })

  describe('POST /actions/', () => {
    let permissionId

    beforeAll(async () => {
      ({ _id: permissionId } = await Permissions.create({ name: 'a permission' }))
    })

    test('It create an action successfully', async () => {
      const { status, body } = await request(app)
        .post('/actions/')
        .set('Authorization', `JWT ${adminJwt}`)
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
        .set('Authorization', `JWT ${adminJwt}`)
        .send({
          actionName: 'new action',
          requiredPermissionIds: [String(permissionId)]
        })

      expect(status).toBe(CONFLICT)
    })

    test('It fails if one of the provided permission ids is invalid', async () => {
      const { status } = await request(app)
        .post('/actions/')
        .set('Authorization', `JWT ${adminJwt}`)
        .send({
          actionName: 'new action 2',
          requiredPermissionIds: [String(mongoose.Types.ObjectId())]
        })

      expect(status).toBe(NOT_FOUND)
    })
  })

  describe('GET /actions/:id/user/:userId/authorization', () => {
    let userId
    let actionId

    beforeAll(async () => {
      const permission = await Permissions.create({ name: 'test user authorization' })
      const role = await Roles.create({ name: 'test user authorization', permissions: [permission] });
      ({ _id: actionId } = await Actions.create({ name: 'test user authorization', requiredPermissionIds: [permission._id] }));

      ({ _id: userId } = await Users.create({ email: 'testActions2@test.com', username: 'test', password: '123', role }))
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

  describe('PUT /actions/:id/permissions', () => {
    let actionId
    let permission

    beforeAll(async () => {
      ({ _id: actionId } = await Actions.create({ name: 'test user authorization' }))

      permission = await Permissions.create({ name: 'test updating action permissions' })
    })

    test('It updates action permissions successfully', async () => {
      const { status } = await request(app)
        .put(`/actions/${String(actionId)}/permissions`)
        .set('Authorization', `JWT ${adminJwt}`)
        .send({ permissionIds: [permission._id] })

      expect(status).toBe(NO_CONTENT)
      expect(await Actions.countDocuments({ _id: actionId, requiredPermissionIds: permission._id })).toEqual(1)
    })

    test('It fail if the action is not exist', async () => {
      const { status } = await request(app)
        .put(`/actions/${String(mongoose.Types.ObjectId())}/permissions`)
        .set('Authorization', `JWT ${adminJwt}`)
        .send({ permissionIds: [permission._id] })

      expect(status).toBe(NOT_FOUND)
    })

    test('It fail if one of the permissions is not exist', async () => {
      const { status } = await request(app)
        .put(`/actions/${actionId}/permissions`)
        .set('Authorization', `JWT ${adminJwt}`)
        .send({ permissionIds: [permission._id, String(mongoose.Types.ObjectId())] })

      expect(status).toBe(NOT_FOUND)
    })
  })
})
