import { Router } from 'express'
import AuthRouter from './modules/auth/router/index.js'

const router = new Router()

router.use(AuthRouter)

export default router
