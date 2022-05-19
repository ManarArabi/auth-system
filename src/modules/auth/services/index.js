import { generateJwt } from '../../../common/helpers.js'
import { NORMAL_ROLE } from '../../roles/constants/index.js'
import { Roles } from '../../roles/model/index.js'
import { Users } from '../../users/model/index.js'
import { createUser } from '../../users/services/index.js'
import _ from 'lodash'
import HttpError from '../../../common/httpError.js'
import httpStatus from 'http-status'
import bcrypt from 'bcrypt'

const { NOT_FOUND, UNAUTHORIZED } = httpStatus

export const authServices = {
  signup: async ({ username, password, email }) => {
    const roleId = await Roles.distinct('_id', { name: NORMAL_ROLE })

    await createUser({ username, password, email, roleId })

    const jwt = generateJwt({ data: { username, email } })

    return { jwt, username, email, role: NORMAL_ROLE }
  },

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
  }
}
