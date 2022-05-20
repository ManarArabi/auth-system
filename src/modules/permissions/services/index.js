import httpStatus from 'http-status'
import HttpError from '../../../common/httpError.js'
import { getAdminUser } from '../../users/services/index.js'
import { CAN_ADD_PERMISSION } from '../constants/index.js'
import { Permissions } from '../model/index.js'

const { UNAUTHORIZED, CONFLICT } = httpStatus

export const permissionServices = {
  /**
   * It creates permission
   *
   * @param {Object} args
   * @param {String} args.permissionName
   *
   * @param {Object} callerData
   * @param {String} callerData.callerId
   * @param {Object} callerData.callerRole
   *
   * @returns {Promise<Object>}
   */
  addPermission: async ({ permissionName }, { callerId, callerRole: { permissions: callerPermissions } }) => {
    const { _id: adminUserId } = await getAdminUser()

    if (String(adminUserId) !== String(callerId) && !callerPermissions.includes(CAN_ADD_PERMISSION)) {
      throw new HttpError({ message: 'User not authorized to add new action', status: UNAUTHORIZED })
    }

    if (await Permissions.exists({ name: permissionName })) {
      throw new HttpError({ message: 'This permission was created before', status: CONFLICT })
    }

    const permission = await Permissions.create({ name: permissionName })
    return permission
  }
}
