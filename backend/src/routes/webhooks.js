import { Router } from 'express'
import { stripeWebhook } from '../controllers/webhooksController.js'

const router = Router()

router.post('/stripe', stripeWebhook)

export default router
