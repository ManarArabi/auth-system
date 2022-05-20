import httpStatus from 'http-status'
import _ from 'lodash'
import HttpError from '../../../common/httpError.js'
import { authServices } from '../../auth/services/index.js'
import { CAN_ADD_ACTION, CAN_ASSIGN_ACTION_PERMISSION, CAN_CHECK_USER_AUTHORIZATION } from '../../permissions/constants/index.js'
import { Permissions } from '../../permissions/model/index.js'
import { Users } from '../../users/model/index.js'
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
  },

  /**
   * It checks whether a certain user can execute a certain action
   *
   * @param {Object} args
   * @param {String} args.actionId
   * @param {String} args.userId
   *
   * @param {Object} callerData
   * @param {String} callerData.callerId
   * @param {Object} callerData.callerRole
   *
   * @returns {Promise<Object>}
   */
  checkUserAuthorization: async (
    { actionId, userId },
    { callerId, callerRole: { permissions: callerPermissions } }
  ) => {
    const { _id: adminUserId } = await getAdminUser()

    if (String(adminUserId) !== String(callerId) && !callerPermissions.includes(CAN_CHECK_USER_AUTHORIZATION)) {
      throw new HttpError({ message: 'User not authorized to check another user action authorization', status: UNAUTHORIZED })
    }

    const [
      user,
      action
    ] = await Promise.all([
      Users.findOne({ _id: userId }).lean(),
      Actions.findOne({ _id: actionId }).lean()
    ])

    if (_.isNil(user)) {
      throw new HttpError({ message: 'User not found', status: NOT_FOUND })
    }

    if (_.isNil(action)) {
      throw new HttpError({ message: 'Action not found', status: NOT_FOUND })
    }

    const isAuthorized = await authServices.authorizeAction({ actionId, userRoleId: user.role._id })

    return { isAuthorized }
  },

  /**
   * It updates action with the provided permissions
   *
   * @param {Object} args
   * @param {String} args.actionId
   * @param {[String]} args.permissionIds
   *
   * @param {Object} callerData
   * @param {String} callerData.callerId
   * @param {Object} callerData.callerRole
   *
   * @returns {Promise}
   */
  updateActionPermissionIds: async (
    { actionId, permissionIds },
    { callerId, callerRole: { permissions: callerPermissions } }
  ) => {
    const { _id: adminUserId } = await getAdminUser()

    if (String(adminUserId) !== String(callerId) && !callerPermissions.includes(CAN_ASSIGN_ACTION_PERMISSION)) {
      throw new HttpError({ message: 'User not authorized to add new action', status: UNAUTHORIZED })
    }

    if (!await Actions.exists({ _id: actionId })) {
      throw new HttpError({ message: 'action not found', status: NOT_FOUND })
    }

    const permissions = await Permissions.find({ _id: { $in: permissionIds } }, { _id: 1 }).lean()
    if (permissions.length < permissionIds.length) {
      throw new HttpError({ message: 'There is one or more permission is not exist', status: NOT_FOUND })
    }

    await Actions.updateOne({ _id: actionId }, { requiredPermissionIds: permissionIds })
  }
}
