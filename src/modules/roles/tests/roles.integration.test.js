import httpStatus from 'http-status'
import mongoose from 'mongoose'
import request from 'supertest'
import app from '../../../app.js'
import { Permissions } from '../../permissions/model/index.js'
import { getTestAdminUser } from '../../../../tests/helpers.js'
import { Roles } from '../model/index.js'
import { eventEmitter } from '../../../event-emitter.js'

const { CONFLICT, CREATED, NO_CONTENT, NOT_FOUND } = httpStatus

describe('Roles endpoints integration tests', () => {
  let userJwt

  beforeAll(async () => {
    const { MONGO_TEST_URL } = process.env

    await mongoose.connect(MONGO_TEST_URL);

    ({ jwt: userJwt } = await getTestAdminUser({ email: 'testRole2@test.com' }))
  })

  afterAll(async () => {
    await mongoose.disconnect()
  })

  describe('POST /roles/', () => {
    let permissionName

    beforeAll(async () => {
      ({ name: permissionName } = await Permissions.create({ name: 'test create permission 1' }))
    })

    test('It create a role successfully', async () => {
      const { status, body } = await request(app)
        .post('/roles/')
        .set('Authorization', `JWT ${userJwt}`)
        .send({
          roleName: 'new role',
          permissions: [permissionName, 'test create permission 2']
        })

      expect(status).toBe(CREATED)

      expect(body.name).toEqual('new role')
      expect(body.permissions.map(p => p.name)).toEqual([permissionName, 'test create permission 2'])
    })

    test('It fails if the role is created before', async () => {
      const { status } = await request(app)
        .post('/roles/')
        .set('Authorization', `JWT ${userJwt}`)
        .send({
          roleName: 'new role',
          permissions: [permissionName]
        })

      expect(status).toBe(CONFLICT)
    })
  })

  describe('PUT /roles/:id/permissions', () => {
    let roleId

    beforeAll(async () => {
      ({ _id: roleId } = await Roles.create({ name: 'update role permissions' }))

      eventEmitter.emit = jest.fn(() => true)
    })

    test('It updates role permissions successfully', async () => {
      const { status } = await request(app)
        .put(`/roles/${roleId}/permissions`)
        .set('Authorization', `JWT ${userJwt}`)
        .send({
          permissions: ['update role permission']
        })

      expect(status).toBe(NO_CONTENT)

      expect(await Roles.countDocuments({ _id: roleId, 'permissions.name': 'update role permission' })).toEqual(1)
      expect(await Permissions.countDocuments({ name: 'update role permission' })).toEqual(1)

      expect(eventEmitter.emit).toBeCalled()
    })

    test('It fails if the role is not exist', async () => {
      const { status } = await request(app)
        .put(`/roles/${String(mongoose.Types.ObjectId())}/permissions`)
        .set('Authorization', `JWT ${userJwt}`)
        .send({
          permissions: ['update role permission2']
        })

      expect(status).toBe(NOT_FOUND)
    })
  })
})
