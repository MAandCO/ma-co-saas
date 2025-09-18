import { Router } from 'express'
import { getTasks, createTask, updateTask, deleteTask, generateTasks } from '../controllers/tasksController.js'

const router = Router()

router.get('/', getTasks)
router.post('/', createTask)
router.post('/generate', generateTasks)
router.put('/:id', updateTask)
router.delete('/:id', deleteTask)

export default router
