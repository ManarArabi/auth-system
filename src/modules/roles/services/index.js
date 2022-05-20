import { ADMIN_ROLE } from '../constants/index.js'
import { Roles } from '../model/index.js'
import promiseMemoize from 'promise-memoize'
import { getAdminUser } from '../../users/services/index.js'
import httpStatus from 'http-status'
import HttpError from '../../../common/httpError.js'
import _ from 'lodash'
import { CAN_ADD_PERMISSION, CAN_ADD_ROLE, CAN_ASSIGN_ROLE_PERMISSION } from '../../permissions/constants/index.js'
import { Permissions } from '../../permissions/model/index.js'
import { eventEmitter } from '../../../event-emitter.js'
import { ROLE_PERMISSIONS_UPDATED } from '../constants/events.js'

export const getAdminRoleId = promiseMemoize(async () => Roles.distinct('_id', { name: ADMIN_ROLE }))

export const getAdminRole = promiseMemoize(async () => Roles.findOne({ name: ADMIN_ROLE }).lean())

const { UNAUTHORIZED, CONFLICT, NOT_FOUND } = httpStatus

export const roleServices = {
  /**
   * It creates role with the provided permissions
   *
   * @param {Object} args
   * @param {String} args.roleName
   * @param {[String]} args.permissions
   *
   * @param {Object} callerData
   * @param {String} callerData.callerId
   * @param {Object} callerData.callerRole
   *
   * @returns {Promise<Object>}
   */
  addRole: async ({ roleName, permissions }, { callerId, callerRole: { permissions: callerPermissions } }) => {
    const { _id: adminUserId } = await getAdminUser()

    const callerHasTheRequiredPermissions = _.intersection(callerPermissions, [CAN_ADD_ROLE, CAN_ADD_PERMISSION]) === [CAN_ADD_ROLE, CAN_ADD_PERMISSION]

    if (
      String(adminUserId) !== String(callerId) &&
      !callerHasTheRequiredPermissions
    ) {
      throw new HttpError({ message: 'User not authorized to add new role', status: UNAUTHORIZED })
    }

    if (await Roles.exists({ name: roleName })) {
      throw new HttpError({ message: 'This role was created before', status: CONFLICT })
    }

    const existPermissions = await Permissions.find({ name: { $in: permissions } }).lean()

    const toBeCreatedPermissions = _.difference(permissions, existPermissions.map(permission => permission.name))

    const newPermissions = await Permissions.insertMany(toBeCreatedPermissions.map(p => ({ name: p })))

    const role = await Roles.create({
      name: roleName,
      permissions: _.uniqBy([...existPermissions, ...newPermissions], p => String(p.name))
    })
    return role
  },

  /**
   * It updates role with the provided permissions
   *
   * @param {Object} args
   * @param {String} args.roleId
   * @param {[String]} args.permissions
   *
   * @param {Object} callerData
   * @param {String} callerData.callerId
   * @param {Object} callerData.callerRole
   *
   * @returns {Promise<Object>}
   */
  updateRolePermissions: async (
    { roleId, permissions },
    { callerId, callerRole: { permissions: callerPermissions } }
  ) => {
    const { _id: adminUserId } = await getAdminUser()

    const callerHasTheRequiredPermissions = _.intersection(callerPermissions, [CAN_ASSIGN_ROLE_PERMISSION, CAN_ADD_PERMISSION]) === [CAN_ASSIGN_ROLE_PERMISSION, CAN_ADD_PERMISSION]
    if (
      String(adminUserId) !== String(callerId) &&
      !callerHasTheRequiredPermissions
    ) {
      throw new HttpError({ message: 'User not authorized to update role permission', status: UNAUTHORIZED })
    }

    if (!await Roles.exists({ _id: roleId })) {
      throw new HttpError({ message: 'Role not found', status: NOT_FOUND })
    }

    const existPermissions = await Permissions.find({ name: { $in: permissions } }).lean()

    const toBeCreatedPermissions = _.difference(permissions, existPermissions.map(permission => permission.name))

    const newPermissions = await Permissions.insertMany(toBeCreatedPermissions.map(p => ({ name: p })))
    await Roles.updateOne(
      { _id: roleId },
      { permissions: _.uniqBy([...existPermissions, ...newPermissions], p => String(p.name)) }
    )

    eventEmitter.emit(ROLE_PERMISSIONS_UPDATED, {
      roleId,
      permissions: _.uniqBy([...existPermissions, ...newPermissions], p => String(p.name))
    })
  }
}
