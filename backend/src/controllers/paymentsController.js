import { getStripeClient } from '../services/stripeService.js'
import { listItems, upsertItem } from '../utils/dataStore.js'
import { v4 as uuid } from 'uuid'

export async function createCheckoutSession (req, res) {
  const { clientId, amount, currency, description, successUrl, cancelUrl } = req.body
  if (!clientId || !amount) {
    return res.status(400).json({ error: 'clientId and amount are required.' })
  }
  try {
    const stripe = getStripeClient()
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: req.body.customerEmail || undefined,
      line_items: [
        {
          price_data: {
            currency: currency || 'gbp',
            product_data: {
              name: description || 'Ma & Co Accounting Service'
            },
            unit_amount: Math.round(amount * 100)
          },
          quantity: 1
        }
      ],
      success_url: successUrl || `${process.env.CLIENT_APP_URL}/payments/success`,
      cancel_url: cancelUrl || `${process.env.CLIENT_APP_URL}/payments/cancel`,
      metadata: { clientId }
    })

    const record = {
      id: uuid(),
      clientId,
      stripeSessionId: session.id,
      amount,
      currency: currency || 'gbp',
      description: description || '',
      status: session.status,
      url: session.url,
      createdAt: new Date().toISOString()
    }
    await upsertItem('payments', record, () => false)
    res.json({ checkoutUrl: session.url, sessionId: session.id, record })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export async function listPaymentsController (req, res) {
  const payments = await listItems('payments')
  res.json(payments)
}
