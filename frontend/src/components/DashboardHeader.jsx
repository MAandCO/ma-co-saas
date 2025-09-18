import PropTypes from 'prop-types'

function DashboardHeader ({ title, subtitle, actions }) {
  return (
    <header className="dashboard-header">
      <div>
        <div className="title">{title}</div>
        {subtitle && <div className="subtitle">{subtitle}</div>}
      </div>
      {actions && <div className="section-actions">{actions}</div>}
    </header>
  )
}

DashboardHeader.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  actions: PropTypes.node
}

export default DashboardHeader
