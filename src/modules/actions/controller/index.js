import httpStatus from 'http-status'
import { actionServices } from '../services/index.js'

const { CREATED } = httpStatus

export const actionsController = {
  addAction: async (req, res, next) => {
    const {
      body: { actionName, requiredPermissionIds },
      user: { role, _id: callerId }
    } = req

    try {
      const action = await actionServices.addAction({ actionName, requiredPermissionIds }, { callerRole: role, callerId })

      return res.status(CREATED).send(action)
    } catch (err) {
      return next(err)
    }
  }
}
