import { Router } from 'express'
import AuthRouter from './modules/auth/router/index.js'
import ActionsRouter from './modules/actions/router/index.js'
import RolesRouter from './modules/roles/router/index.js'

const router = new Router()

router.use(AuthRouter)
router.use('/actions', ActionsRouter)
router.use('/roles', RolesRouter)

export default router
