import { Router } from 'express'
import { createCheckoutSession, listPaymentsController } from '../controllers/paymentsController.js'

const router = Router()

router.get('/', listPaymentsController)
router.post('/checkout-session', createCheckoutSession)

export default router
