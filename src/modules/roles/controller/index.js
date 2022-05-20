import { roleServices } from '../services/index.js'
import httpStatus from 'http-status'

const { CREATED } = httpStatus

export const rolesController = {
  addRole: async (req, res, next) => {
    const {
      body: { roleName, permissions },
      user: { role: callerRole, _id: callerId }
    } = req

    try {
      const role = await roleServices.addRole({ roleName, permissions }, { callerRole, callerId })

      res.status(CREATED).send(role)
    } catch (err) {
      return next(err)
    }
  }
}
