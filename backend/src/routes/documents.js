import { Router } from 'express'
import { upload } from '../middleware/upload.js'
import { getDocuments, uploadDocument, downloadDocument, deleteDocument } from '../controllers/documentsController.js'

const router = Router()

router.get('/', getDocuments)
router.post('/', upload.single('file'), uploadDocument)
router.get('/:id/download', downloadDocument)
router.delete('/:id', deleteDocument)

export default router
