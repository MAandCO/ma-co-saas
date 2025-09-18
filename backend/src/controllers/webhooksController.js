import { getStripeClient } from '../services/stripeService.js'
import { upsertItem } from '../utils/dataStore.js'

export async function stripeWebhook (req, res) {
  const sig = req.headers['stripe-signature']
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secret) {
    return res.status(500).send('Webhook secret not configured.')
  }
  try {
    const stripe = getStripeClient()
    const rawBody = req.rawBody
    if (!rawBody) {
      return res.status(400).send('No raw body provided for webhook verification.')
    }
    const event = stripe.webhooks.constructEvent(rawBody, sig, secret)
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object
      const record = {
        clientId: session.metadata?.clientId || null,
        stripeSessionId: session.id,
        amount: session.amount_total ? session.amount_total / 100 : null,
        currency: session.currency,
        description: session.payment_intent || session.mode,
        status: session.status,
        url: session.url,
        completedAt: new Date().toISOString()
      }
      await upsertItem('payments', record, payment => payment.stripeSessionId === session.id)
    }
    res.json({ received: true })
  } catch (error) {
    res.status(400).send(`Webhook error: ${error.message}`)
  }
}
