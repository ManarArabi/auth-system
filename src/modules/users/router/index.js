import { authenticate } from '../../../common/middlewares/authenticate.js'
import { validateSchema } from '../../../common/middlewares/joi.js'
import { usersController } from '../controller/index.js'
import { Router } from 'express'
import { usersValidation } from '../validation/index.js'

const router = Router()

router.post(
  '/:id/roles/:roleId',
  authenticate,
  validateSchema(usersValidation.assignRoleToUser),
  usersController.assignRoleToUser
)

export default router
