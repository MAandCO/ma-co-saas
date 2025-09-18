import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import routes from './routes/index.js'
import { stripeWebhook } from './controllers/webhooksController.js'
import { uploadsDir } from './middleware/upload.js'
import { requireAuth } from './middleware/auth.js'

dotenv.config()

const app = express()
const port = process.env.PORT || 4000

const allowedOrigins = process.env.CLIENT_APP_URL ? process.env.CLIENT_APP_URL.split(',') : ['http://localhost:5173']

app.use(cors({ origin: allowedOrigins, credentials: true }))
app.use(express.urlencoded({ extended: true }))
app.use(express.json({
  verify: (req, res, buf) => {
    if (req.originalUrl === '/api/webhooks/stripe') {
      req.rawBody = buf
    }
  }
}))

app.use('/uploads', express.static(uploadsDir))

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() })
})

app.post('/api/webhooks/stripe', stripeWebhook)

app.use('/api', requireAuth, routes)

app.use((err, req, res, next) => {
  console.error('Unhandled error', err)
  res.status(500).json({ error: 'Internal server error', details: err.message })
})

app.listen(port, () => {
  console.log(`Ma & Co backend listening on port ${port}`)
})
