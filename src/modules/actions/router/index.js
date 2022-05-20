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

export default router
