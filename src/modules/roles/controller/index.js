import { roleServices } from '../services/index.js'
import httpStatus from 'http-status'

const { CREATED, NO_CONTENT } = httpStatus

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
  },

  updateRolePermissions: async (req, res, next) => {
    const {
      params: { id: roleId },
      body: { permissions },
      user: { role: callerRole, _id: callerId }
    } = req

    try {
      await roleServices.updateRolePermissions({ roleId, permissions }, { callerRole, callerId })

      res.status(NO_CONTENT).send()
    } catch (err) {
      return next(err)
    }
  }
}
