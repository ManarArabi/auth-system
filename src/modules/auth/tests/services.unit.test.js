import mongoose from 'mongoose'
import { Actions } from '../../actions/models/index.js'
import { Permissions } from '../../permissions/model/index.js'
import { Roles } from '../../roles/model/index.js'
import _ from 'lodash'
import { authServices } from '../services/index.js'

describe('Auth services unit tests', () => {
  beforeAll(async () => {
    const { MONGO_TEST_URL } = process.env

    await mongoose.connect(MONGO_TEST_URL)
  })

  afterAll(async () => {
    await mongoose.disconnect()
  })

  describe('authorizeAction service', () => {
    let action
    let role

    beforeAll(async () => {
      const fakePermissions = await Promise.all(_.times(2, i => Permissions.create({ name: `permission ${i}` })))

      action = await Actions.create({
        name: 'an action',
        requiredPermissionIds: [fakePermissions[0]._id]
      })

      role = await Roles.create({
        name: 'an action',
        permissions: fakePermissions
      })
    })

    test('It returns true if the provided role permissions contains the action permissions', async () => {
      const isAuthorized = await authServices.authorizeAction({ actionId: action._id, userRoleId: role._id })

      expect(isAuthorized).toEqual(true)
    })

    test('It returns false if the provided role permissions don\'t contain the action permissions', async () => {
      const { _id: permissionId } = await Permissions.create({ name: 'permission 3' })

      action.requiredPermissionIds.push(permissionId)
      await action.save()

      const isAuthorized = await authServices.authorizeAction({ actionId: action._id, userRoleId: role._id })

      expect(isAuthorized).toEqual(false)
    })
  })
})
