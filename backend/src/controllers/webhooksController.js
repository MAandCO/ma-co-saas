import { getStripeClient } from '../services/stripeService.js'
import { supabaseAdmin } from '../services/supabaseClient.js'

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
      const amount = session.amount_total ? session.amount_total / 100 : null
      const { error } = await supabaseAdmin
        .from('payments')
        .update({
          status: session.status,
          amount,
          currency: session.currency,
          completed_at: new Date().toISOString()
        })
        .eq('stripe_session_id', session.id)
      if (error) {
        console.error('Failed to update payment record', error)
      }
    }
    res.json({ received: true })
  } catch (error) {
    res.status(400).send(`Webhook error: ${error.message}`)
  }
}
