import { getStripeClient } from '../services/stripeService.js'
import { supabaseAdmin } from '../services/supabaseClient.js'

const mapPayment = record => ({
  id: record.id,
  clientId: record.client_id,
  stripeSessionId: record.stripe_session_id,
  amount: record.amount,
  currency: record.currency,
  description: record.description,
  status: record.status,
  url: record.url,
  createdAt: record.created_at,
  completedAt: record.completed_at
})

export async function createCheckoutSession (req, res) {
  const { ownerId } = req
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
      metadata: { clientId, ownerId }
    })

    const payload = {
      owner_id: ownerId,
      client_id: clientId,
      stripe_session_id: session.id,
      amount,
      currency: currency || 'gbp',
      description: description || null,
      status: session.status,
      url: session.url,
      created_at: new Date().toISOString()
    }
    const { data, error } = await supabaseAdmin
      .from('payments')
      .insert(payload)
      .select('*')
      .single()
    if (error) throw error
    res.json({ checkoutUrl: session.url, sessionId: session.id, record: mapPayment(data) })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export async function listPaymentsController (req, res) {
  try {
    const { ownerId } = req
    const { data, error } = await supabaseAdmin
      .from('payments')
      .select('*')
      .eq('owner_id', ownerId)
      .order('created_at', { ascending: false })
    if (error) throw error
    res.json(data.map(mapPayment))
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
