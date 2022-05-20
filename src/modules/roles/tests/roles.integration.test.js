import httpStatus from 'http-status'
import mongoose from 'mongoose'
import request from 'supertest'
import app from '../../../app.js'
import { Users } from '../../users/model/index.js'
import { generateJwt, hashString } from '../../../common/helpers.js'
import { getAdminRole } from '../../roles/services/index.js'
import { Permissions } from '../../permissions/model/index.js'

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
