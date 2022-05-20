import { Roles } from '../../roles/model/index.js'
import _ from 'lodash'
import promiseMemoize from 'promise-memoize'
import HttpError from '../../../common/httpError.js'
import httpStatus from 'http-status'
import { Users } from '../model/index.js'
import { hashString } from '../../../common/helpers.js'
import { getAdminRoleId } from '../../roles/services/index.js'

const { NOT_FOUND, CONFLICT } = httpStatus

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
