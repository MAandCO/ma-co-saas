import Stripe from 'stripe'

let stripeClient = null

export function getStripeClient () {
  if (stripeClient) return stripeClient
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) {
    throw new Error('Missing STRIPE_SECRET_KEY environment variable.')
  }
  stripeClient = new Stripe(key, { apiVersion: '2023-10-16' })
  return stripeClient
}
