import PropTypes from 'prop-types'
import { navOptions } from '../constants/navOptions.js'

function Sidebar ({ active, onSelect }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span>Ma</span>
        <div>
          <div>Ma & Co</div>
          <small>Compliance CRM</small>
        </div>
      </div>
      <div className="sidebar-nav">
        {navOptions.map(option => (
          <button
            key={option.key}
            type="button"
            className={option.key === active ? 'active' : ''}
            onClick={() => onSelect(option.key)}
          >
            {option.icon}{option.label}
          </button>
        ))}
      </div>
    </aside>
  )
}

Sidebar.propTypes = {
  active: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired
}

export default Sidebar
