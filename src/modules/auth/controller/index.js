import httpStatus from 'http-status'
import { authServices } from '../services/index.js'

export const { CREATED, OK } = httpStatus

export const authController = {
  signup: async (req, res, next) => {
    const {
      body: { username, password, email }
    } = req

    try {
      const user = await authServices.signup({ username, password, email })

      return res.status(CREATED).send(user)
    } catch (err) {
      return next(err)
    }
  },

  login: async (req, res, next) => {
    const {
      body: { password, email }
    } = req

    try {
      const jwt = await authServices.login({ password, email })

      return res.status(OK).send(jwt)
    } catch (err) {
      return next(err)
    }
  }
}
