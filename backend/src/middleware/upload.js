import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const uploadsPath = path.join(__dirname, '../../uploads')

if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true })
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsPath)
  },
  filename: function (req, file, cb) {
    const timestamp = Date.now()
    const sanitized = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_')
    cb(null, `${timestamp}-${sanitized}`)
  }
})

export const upload = multer({ storage })
export const uploadsDir = uploadsPath
