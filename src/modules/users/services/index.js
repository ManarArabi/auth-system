import { Roles } from '../../roles/model/index.js'
import _ from 'lodash'
import promiseMemoize from 'promise-memoize'
import HttpError from '../../../common/httpError.js'
import httpStatus from 'http-status'
import { Users } from '../model/index.js'
import { hashString } from '../../../common/helpers.js'
import { getAdminRoleId } from '../../roles/services/index.js'
import { CAN_ASSIGN_USER_ROLE } from '../../permissions/constants/index.js'

const { NOT_FOUND, CONFLICT, UNAUTHORIZED } = httpStatus

/**
 * It creates new user with the provided data
 *
 * @param {Object} args
 * @param {String} args.username
 * @param {String} args.password
 * @param {String} args.email
 * @param {String} args.roleId
 *
 * @returns {Promise}
 */
export const createUser = async ({ username, password, email, roleId }) => {
  const role = await Roles.findOne({ _id: roleId }, { permissions: 1 }).lean()

  if (_.isNil(role)) {
    throw new HttpError({ message: 'Role is not found', status: NOT_FOUND })
  }

  if (await Users.exists({ email })) {
    throw new HttpError({ message: 'This mail is already exist in the system', status: CONFLICT })
  }

  const hashedPassword = await hashString({ str: password })

  const user = await Users.create({
    username,
    password: hashedPassword,
    email,
    role
  })

  delete user.password

  return user
}

export const getAdminUser = promiseMemoize(async () => {
  const [adminRoleId] = await getAdminRoleId()

  const user = await Users.findOne({ 'role._id': adminRoleId }).lean()

  return user
})

/**
 * It assigns a role to the provided user
 *
 * @param {Object} args
 * @param {String} args.userId
 * @param {String} args.roleId
 *
 * @param {Object} callerData
 * @param {String} callerData.callerId
 * @param {Object} callerData.callerRole
 *
 * @returns {Promise}
 */
export const assignRoleToUser = async ({ userId, roleId }, { callerId, callerRole: { permissions: callerPermissions } }) => {
  const { _id: adminUserId } = await getAdminUser()

  if (String(adminUserId) !== String(callerId) && !callerPermissions.includes(CAN_ASSIGN_USER_ROLE)) {
    throw new HttpError({ message: 'User not authorized to add new action', status: UNAUTHORIZED })
  }

  const role = await Roles.findOne({ _id: roleId }, { name: -1 }).lean()

  if (_.isNil(role)) {
    throw new HttpError({ message: 'Role not found', status: NOT_FOUND })
  }

  await Users.updateOne({ _id: userId }, { role })
}

/**
 * It syncs user permissions with role permissions
 *
 * @param {Object} args
 * @param {String} args.roleId
 * @param {[Object]} args.permissions
 *
 * @returns {Promise}
 */
export const updateUsersPermissions = async ({ roleId, permissions }) => {
  await Users.updateMany({ 'role._id': roleId }, { 'role.permissions': permissions })
}
