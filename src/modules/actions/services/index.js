import httpStatus from 'http-status'
import HttpError from '../../../common/httpError.js'
import { CAN_ADD_ACTION } from '../../permissions/constants/index.js'
import { Permissions } from '../../permissions/model/index.js'
import { getAdminUser } from '../../users/services/index.js'
import { Actions } from '../models/index.js'

const { CONFLICT, UNAUTHORIZED, NOT_FOUND } = httpStatus

export const actionServices = {
  /**
   * It creates new action with the provided permissions
   *
   * @param {Object} args
   * @param {String} args.actionName
   * @param {[String]} args.requiredPermissionIds
   *
   * @param {Object} callerData
   * @param {String} callerData.callerId
   * @param {Object} callerData.callerRole
   *
   * @returns {Promise<Object>}
   */
  addAction: async (
    { actionName, requiredPermissionIds },
    { callerId, callerRole: { permissions: callerPermissions } }
  ) => {
    const { _id: adminUserId } = await getAdminUser()

    if (String(adminUserId) !== String(callerId) && !callerPermissions.includes(CAN_ADD_ACTION)) {
      throw new HttpError({ message: 'User not authorized to add new action', status: UNAUTHORIZED })
    }

    if (await Actions.exists({ name: actionName })) {
      throw new HttpError({ message: 'This action was created before', status: CONFLICT })
    }

    const permissions = await Permissions.find({ _id: { $in: requiredPermissionIds } }, { _id: 1 }).lean()
    if (permissions.length < requiredPermissionIds.length) {
      throw new HttpError({ message: 'There is one or more permission is not exist', status: NOT_FOUND })
    }

    const action = await Actions.create({ name: actionName, requiredPermissionIds })

    return action
  }
}
