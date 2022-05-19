import httpStatus from 'http-status'
import jwt from 'jsonwebtoken'
import { Users } from '../../modules/users/model/index.js'
import _ from 'lodash'
import HttpError from '../httpError.js'

const { UNAUTHORIZED } = httpStatus

export const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('JWT ', '')

    const decoded = await jwt.verify(token, process.env.JWT_SECRET)

    const user = await Users
      .findOne({ email: decoded.email, jwt: token })
      .populate('role._id', { name: 1 })
      .lean()

    if (_.isNil(user)) {
      throw new HttpError({ status: UNAUTHORIZED, message: 'Invalid jwt' })
    }

    req.user = user
    req.token = token
    next()
  } catch (error) {
    res.status(UNAUTHORIZED).send('Invalid jwt')
  }
}
