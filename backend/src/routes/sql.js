import { Router } from 'express'
import { executeSql } from '../controllers/sqlController.js'

const router = Router()

router.post('/', executeSql)

export default router
