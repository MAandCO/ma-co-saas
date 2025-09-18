import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'

axios.defaults.baseURL = ''

const defaultError = () => ({ message: null, context: null })

export default function useSaaSData () {
  const [clients, setClients] = useState([])
  const [workers, setWorkers] = useState([])
  const [tasks, setTasks] = useState([])
  const [documents, setDocuments] = useState([])
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(defaultError())

  const resetError = () => setError(defaultError())

  const fetchClients = useCallback(async () => {
    const res = await axios.get('/api/clients')
    setClients(res.data)
  }, [])

  const fetchWorkers = useCallback(async () => {
    const res = await axios.get('/api/workers')
    setWorkers(res.data)
  }, [])

  const fetchTasks = useCallback(async () => {
    const res = await axios.get('/api/tasks')
    setTasks(res.data)
  }, [])

  const fetchDocuments = useCallback(async () => {
    const res = await axios.get('/api/documents')
    setDocuments(res.data)
  }, [])

  const fetchPayments = useCallback(async () => {
    const res = await axios.get('/api/payments')
    setPayments(res.data)
  }, [])

  const fetchAll = useCallback(async () => {
    setLoading(true)
    try {
      await Promise.all([
        fetchClients(),
        fetchWorkers(),
        fetchTasks(),
        fetchDocuments(),
        fetchPayments()
      ])
    } catch (err) {
      setError({ message: err.message, context: 'Unable to load data' })
    } finally {
      setLoading(false)
    }
  }, [fetchClients, fetchWorkers, fetchTasks, fetchDocuments, fetchPayments])

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  const createClient = async payload => {
    try {
      const res = await axios.post('/api/clients', payload)
      setClients(prev => [...prev, res.data])
    } catch (err) {
      setError({ message: err.message, context: 'Create client' })
      throw err
    }
  }

  const updateClient = async (id, payload) => {
    try {
      const res = await axios.put(`/api/clients/${id}`, payload)
      setClients(prev => prev.map(client => (client.id === id ? res.data : client)))
    } catch (err) {
      setError({ message: err.message, context: 'Update client' })
      throw err
    }
  }

  const createWorker = async payload => {
    try {
      const res = await axios.post('/api/workers', payload)
      setWorkers(prev => [...prev, res.data])
    } catch (err) {
      setError({ message: err.message, context: 'Create worker' })
      throw err
    }
  }

  const createTask = async payload => {
    try {
      const res = await axios.post('/api/tasks', payload)
      setTasks(prev => [...prev, res.data])
    } catch (err) {
      setError({ message: err.message, context: 'Create task' })
      throw err
    }
  }

  const updateTask = async (id, payload) => {
    try {
      const res = await axios.put(`/api/tasks/${id}`, payload)
      setTasks(prev => prev.map(task => (task.id === id ? res.data : task)))
    } catch (err) {
      setError({ message: err.message, context: 'Update task' })
      throw err
    }
  }

  const generateTasks = async clientId => {
    try {
      const res = await axios.post('/api/tasks/generate', { clientId })
      setTasks(prev => [...prev, ...res.data])
      return res.data
    } catch (err) {
      setError({ message: err.message, context: 'Generate tasks' })
      throw err
    }
  }

  const uploadDocument = async payload => {
    try {
      const formData = new FormData()
      Object.entries(payload).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value)
        }
      })
      const res = await axios.post('/api/documents', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setDocuments(prev => [...prev, res.data])
    } catch (err) {
      setError({ message: err.message, context: 'Upload document' })
      throw err
    }
  }

  const createCheckoutSession = async payload => {
    try {
      const res = await axios.post('/api/payments/checkout-session', payload)
      if (res.data?.record) {
        setPayments(prev => [...prev, res.data.record])
      }
      return res.data
    } catch (err) {
      setError({ message: err.message, context: 'Create checkout session' })
      throw err
    }
  }

  return {
    clients,
    workers,
    tasks,
    documents,
    payments,
    loading,
    error,
    resetError,
    fetchAll,
    createClient,
    updateClient,
    createWorker,
    createTask,
    updateTask,
    generateTasks,
    uploadDocument,
    createCheckoutSession
  }
}
