import httpStatus from 'http-status'
import { permissionServices } from '../services/index.js'

const { CREATED } = httpStatus

export const permissionsController = {
  addPermission: async (req, res, next) => {
    const {
      body: { permissionName },
      user: { role, _id: callerId }
    } = req

    try {
      const action = await permissionServices.addPermission({ permissionName }, { callerRole: role, callerId })

      return res.status(CREATED).send(action)
    } catch (err) {
      return next(err)
    }
  }
}
