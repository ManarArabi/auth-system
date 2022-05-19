import { Router } from 'express'
import { validateSchema } from '../../../common/middlewares/joi.js'
import { authController } from '../controller/index.js'
import { authValidation } from '../validation/index.js'

const router = Router()

router.post(
  '/signup',
  validateSchema(authValidation.signup),
  authController.signup
)

router.post(
  '/login',
  validateSchema(authValidation.login),
  authController.login
)

export default router
