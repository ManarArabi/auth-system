import { authenticate } from '../../../common/middlewares/authenticate.js'
import { validateSchema } from '../../../common/middlewares/joi.js'
import { rolesController } from '../controller/index.js'
import { rolesValidation } from '../validation/index.js'
import { Router } from 'express'

const router = Router()

router.post(
  '/',
  authenticate,
  validateSchema(rolesValidation.addRole),
  rolesController.addRole
)

export default router
