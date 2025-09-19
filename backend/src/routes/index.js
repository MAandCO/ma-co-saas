import { Router } from 'express'
import clientsRoute from './clients.js'
import workersRoute from './workers.js'
import tasksRoute from './tasks.js'
import documentsRoute from './documents.js'
import paymentsRoute from './payments.js'
import sqlRoute from './sql.js'

const router = Router()

router.use('/clients', clientsRoute)
router.use('/workers', workersRoute)
router.use('/tasks', tasksRoute)
router.use('/documents', documentsRoute)
router.use('/payments', paymentsRoute)
router.use('/sql', sqlRoute)

export default router
