import { generateJwt } from '../../../common/helpers.js'
import { NORMAL_ROLE } from '../../roles/constants/index.js'
import { Roles } from '../../roles/model/index.js'
import { Users } from '../../users/model/index.js'
import { createUser } from '../../users/services/index.js'
import _ from 'lodash'
import HttpError from '../../../common/httpError.js'
import httpStatus from 'http-status'
import bcrypt from 'bcrypt'
import { Actions } from '../../actions/models/index.js'

const { NOT_FOUND, UNAUTHORIZED } = httpStatus

export const authServices = {
  /**
   * It registers a new normal user
   *
   * @param {Object} args
   * @param {String} args.username
   * @param {String} args.password
   * @param {String} args.email
   *
   * @returns {Promise<Object>} {jwt, username, email, role}
   */
  signup: async ({ username, password, email }) => {
    const roleId = await Roles.distinct('_id', { name: NORMAL_ROLE })

    await createUser({ username, password, email, roleId })

    const jwt = generateJwt({ data: { username, email } })

    return { jwt, username, email, role: NORMAL_ROLE }
  },

  /**
   * It logs a user in
   *
   * @param {Object} args
   * @param {String} args.email
   * @param {String} args.password
   *
   * @returns {Promise<String>} jwt
   */
  login: async ({ email, password }) => {
    const user = await Users.findOne({ email }, { password: 1, username: 1 }).lean()

    if (_.isNil(user)) {
      throw new HttpError({ status: NOT_FOUND, message: 'there is no user with this email' })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      throw new HttpError({ status: UNAUTHORIZED, message: 'Wrong email or password' })
    }

    const jwt = await generateJwt({ data: { email, username: user.username } })
    await Users.updateOne({ email }, { jwt })

    return jwt
  },

  /**
   * It logs a user out by deleting his jwt from DB
   *
   * @param {Object} args
   * @param {String} args.userId
   *
   * @returns {Promise}
   */
  logout: async ({ userId }) => {
    await Users.updateOne({ _id: userId }, { $unset: { jwt: -1 } })
  },

  /**
   * It check whether the provided user role can do certain action
   *
   * @param {Object} args
   * @param {String} args.actionId
   * @param {String} args.userRoleId
   *
   * @returns {Promise<Boolean>}
   */
  authorizeAction: async ({ actionId, userRoleId }) => {
    const [{ requiredPermissionIds }, { permissions }] = await Promise.all([
      Actions.findOne({ _id: actionId }, { requiredPermissionIds: 1 }).lean(),

      Roles.findOne({ _id: userRoleId }, { permissions: 1 }).lean()
    ])

    const rolePermissionIds = permissions.map(({ _id }) => String(_id))

    const isTheRoleContainsTheRequiredPermissions = _.intersection(
      requiredPermissionIds.map(String).sort(),
      rolePermissionIds
    ).length === requiredPermissionIds.length

    return requiredPermissionIds.length > 0 && isTheRoleContainsTheRequiredPermissions
  }
}
