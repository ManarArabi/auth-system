import httpStatus from 'http-status'
import { actionServices } from '../services/index.js'

const { CREATED, OK, NO_CONTENT } = httpStatus

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
  },

  checkUserAuthorization: async (req, res, next) => {
    const {
      params: { id: actionId, userId },
      user: { role, _id: callerId }
    } = req

    try {
      const isAuthorized = await actionServices.checkUserAuthorization({ actionId, userId }, { callerRole: role, callerId })

      return res.status(OK).send(isAuthorized)
    } catch (err) {
      return next(err)
    }
  },

  updateActionPermissionIds: async (req, res, next) => {
    const {
      params: { id: actionId },
      body: { permissionIds },
      user: { role, _id: callerId }
    } = req

    try {
      await actionServices.updateActionPermissionIds({ actionId, permissionIds }, { callerRole: role, callerId })

      return res.status(NO_CONTENT).send()
    } catch (err) {
      return next(err)
    }
  }
}
