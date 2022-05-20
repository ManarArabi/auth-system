import { Router } from 'express'
import { authenticate } from '../../../common/middlewares/authenticate.js'
import { validateSchema } from '../../../common/middlewares/joi.js'
import { permissionsController } from '../controller/index.js'
import { permissionsValidation } from '../validation/index.js'

const router = new Router()

router.post(
  '/',
  authenticate,
  validateSchema(permissionsValidation.addPermission),
  permissionsController.addPermission
)

export default router
