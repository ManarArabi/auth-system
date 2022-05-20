import httpStatus from 'http-status'
import mongoose from 'mongoose'
import request from 'supertest'
import app from '../../../app.js'
import { Permissions } from '../../permissions/model/index.js'
import { getTestAdminUser } from '../../../../tests/helpers.js'

const { CONFLICT, CREATED } = httpStatus

describe('Roles endpoints integration tests', () => {
  beforeAll(async () => {
    const { MONGO_TEST_URL } = process.env

    await mongoose.connect(MONGO_TEST_URL)
  })

  afterAll(async () => {
    await mongoose.disconnect()
  })

  describe('POST /roles/', () => {
    let userJwt
    let permissionName

    beforeAll(async () => {
      ({ jwt: userJwt } = await getTestAdminUser({ email: 'testRole@test.com' }));

      ({ name: permissionName } = await Permissions.create({ name: 'permission 1' }))
    })

    test('It create a role successfully', async () => {
      const { status, body } = await request(app)
        .post('/roles/')
        .set('Authorization', `JWT ${userJwt}`)
        .send({
          roleName: 'new role',
          permissions: [permissionName, 'permission 2']
        })

      expect(status).toBe(CREATED)

      expect(body.name).toEqual('new role')
      expect(body.permissions.map(p => p.name)).toEqual([permissionName, 'permission 2'])
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
})
