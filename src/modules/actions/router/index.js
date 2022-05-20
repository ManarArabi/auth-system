import { Router } from 'express'
import { authenticate } from '../../../common/middlewares/authenticate.js'
import { validateSchema } from '../../../common/middlewares/joi.js'
import { actionsController } from '../controller/index.js'
import { actionValidation } from '../validation/index.js'

const router = Router()

router.post(
  '/',
  authenticate,
  validateSchema(actionValidation.addAction),
  actionsController.addAction
)

router.get(
  '/:id/users/:userId/authorization',
  authenticate,
  validateSchema(actionValidation.checkUserAuthorization),
  actionsController.checkUserAuthorization
)
export default router
