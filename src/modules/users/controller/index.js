import httpStatus from 'http-status'
import { assignRoleToUser } from '../services/index.js'

const { NO_CONTENT } = httpStatus

export const usersController = {
  assignRoleToUser: async (req, res, next) => {
    const {
      params: { id: userId, roleId },
      user: { role: callerRole, _id: callerId }
    } = req

    try {
      await assignRoleToUser({ userId, roleId }, { callerId, callerRole })

      res.status(NO_CONTENT).send()
    } catch (err) {
      return next(err)
    }
  }
}
