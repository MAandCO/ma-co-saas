import { useMemo, useState } from 'react'
import Sidebar from '../components/Sidebar.jsx'
import DashboardHeader from '../components/DashboardHeader.jsx'
import ClientsPanel from '../components/ClientsPanel.jsx'
import WorkersPanel from '../components/WorkersPanel.jsx'
import TasksPanel from '../components/TasksPanel.jsx'
import DocumentsPanel from '../components/DocumentsPanel.jsx'
import PaymentsPanel from '../components/PaymentsPanel.jsx'
import useSaaSData from '../hooks/useSaaSData.js'
import { useAuth } from '../context/AuthContext.jsx'
import SqlEditorPanel from '../components/SqlEditorPanel.jsx'

const sectionCopy = {
  clients: {
    title: 'Client portfolio',
    subtitle: 'UTRs, VAT, PAYE, Companies House numbers, and contact details in one pane.'
  },
  workers: {
    title: 'Team rota',
    subtitle: 'Assign the right accountants to deliverables before deadlines surface.'
  },
  tasks: {
    title: 'Compliance runway',
    subtitle: 'AI suggests what needs doing and who should do it — you approve.'
  },
  documents: {
    title: 'Document vault',
    subtitle: 'Letters of engagement, payroll files, VAT submissions, ready when you are.'
  },
  payments: {
    title: 'Billing centre',
    subtitle: 'Stripe handles collection; Ma & Co sees the cash flow pulse.'
  },
  sql: {
    title: 'SQL workbench',
    subtitle: 'Run read-only SELECT queries against your workspace tables.'
  }
}

function Dashboard () {
  const [section, setSection] = useState('clients')
  const { user, signOut } = useAuth()
  const {
    clients,
    workers,
    tasks,
    documents,
    payments,
    loading,
    error,
    resetError,
    createClient,
    updateClient,
    createWorker,
    createTask,
    updateTask,
    generateTasks,
    uploadDocument,
    createCheckoutSession
  } = useSaaSData()

  const headerCopy = useMemo(() => sectionCopy[section], [section])

  return (
    <div className="app-shell">
      <Sidebar active={section} onSelect={setSection} />
      <main className="dashboard-content">
        <DashboardHeader
          title={headerCopy.title}
          subtitle={headerCopy.subtitle}
          actions={(
            <>
              {loading && <span className="badge">Refreshing…</span>}
              <button type="button" className="primary-button" onClick={signOut}>
                Sign out {user?.email ? `(${user.email})` : ''}
              </button>
            </>
          )}
        />
        {error?.message && (
          <div className="section-card" style={{ background: 'rgba(255, 99, 71, 0.12)' }}>
            <strong>{error.context}</strong>
            <div>{error.message}</div>
            <button type="button" className="primary-button" onClick={resetError}>Dismiss</button>
          </div>
        )}
        {section === 'clients' && (
          <ClientsPanel clients={clients} onCreate={createClient} onUpdate={updateClient} />
        )}
        {section === 'workers' && (
          <WorkersPanel workers={workers} onCreate={createWorker} />
        )}
        {section === 'tasks' && (
          <TasksPanel
            tasks={tasks}
            clients={clients}
            workers={workers}
            onCreate={createTask}
            onUpdate={updateTask}
            onGenerate={generateTasks}
          />
        )}
        {section === 'documents' && (
          <DocumentsPanel documents={documents} clients={clients} onUpload={uploadDocument} />
        )}
        {section === 'payments' && (
          <PaymentsPanel payments={payments} clients={clients} onCreateSession={createCheckoutSession} />
        )}
        {section === 'sql' && (
          <SqlEditorPanel />
        )}
      </main>
    </div>
  )
}

export default Dashboard
