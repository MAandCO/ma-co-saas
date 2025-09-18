import { Link } from 'react-router-dom'
import './LandingPage.css'

function LandingPage () {
  return (
    <div className="landing-wrapper">
      <header className="landing-hero">
        <nav className="landing-nav">
          <div className="brand">Ma & Co Accountants</div>
          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#automation">Automation</a>
            <a href="#compliance">Compliance</a>
            <Link to="/dashboard" className="nav-cta">Launch App</Link>
          </div>
        </nav>
        <div className="hero-content">
          <div className="hero-text">
            <div className="hero-badge">The Compliance Command Centre</div>
            <h1>Operate every client deadline with AI precision.</h1>
            <p>
              A modern practice cockpit built for proactive accountants. Ma & Co CRM orchestrates clients, staff, compliance tasks, documents, and billing in a single navy & gold workspace.
            </p>
            <div className="hero-actions">
              <Link to="/dashboard" className="hero-primary">Enter dashboard</Link>
              <a href="#features" className="hero-secondary">Discover more</a>
            </div>
          </div>
          <div className="hero-visual">
            <div className="visual-card">
              <div className="visual-header">
                <span>Upcoming compliance</span>
                <strong>12 alerts</strong>
              </div>
              <ul>
                <li>
                  <span className="tag warning">19th</span>
                  CIS return — Construction clients
                </li>
                <li>
                  <span className="tag">Quarterly</span>
                  VAT return — Retail cohort
                </li>
                <li>
                  <span className="tag">Weekly</span>
                  Payroll RTI — Hospitality crew
                </li>
              </ul>
            </div>
          </div>
        </div>
      </header>

      <section id="features" className="features-section">
        <h2>Command clients, people, and work from one pane.</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Client intelligence hub</h3>
            <p>Centralise UTR, VAT, PAYE, Companies House data, and instantly surface risk flags before deadlines slip.</p>
          </div>
          <div className="feature-card">
            <h3>Staff choreography</h3>
            <p>Assign accountants and payroll specialists to the right portfolio with availability and expertise matching.</p>
          </div>
          <div className="feature-card">
            <h3>AI compliance runway</h3>
            <p>Generate CIS, VAT, payroll, CT600, and self-assessment tasks automatically using model-powered context.</p>
          </div>
          <div className="feature-card">
            <h3>Document vault</h3>
            <p>Store letters of engagement, submissions, and payroll packs in a secure, quick-search repository.</p>
          </div>
          <div className="feature-card">
            <h3>Stripe-native billing</h3>
            <p>Collect invoices, monitor standing orders, and reconcile payments without leaving the practice cockpit.</p>
          </div>
          <div className="feature-card">
            <h3>Board views with pulse</h3>
            <p>Visualise workflows Monday-style with statuses, assignees, due dates, and AI-suggested next steps.</p>
          </div>
        </div>
      </section>

      <section id="automation" className="automation-section">
        <div className="automation-card">
          <h2>Automation tuned for UK compliance.</h2>
          <p>Every client type triggers the right compliance universe — from contractors needing CIS to limited companies prepping CT600 filings. AI suggestions remove the administrative overhead so Ma & Co can focus on advisory value.</p>
          <ul>
            <li>Auto-generate compliance calendars across CIS, VAT, payroll, CT600, and SA</li>
            <li>Assign tasks to the accountants best suited to deliver</li>
            <li>Send proactive email nudges before statutory deadlines</li>
          </ul>
        </div>
      </section>

      <section id="compliance" className="compliance-section">
        <div className="compliance-copy">
          <h2>Trust built on data integrity.</h2>
          <p>Bank-grade security, segregated document storage, and full audit trails across every change. Stripe handles payments; OpenRouter powers intelligence — you stay in control.</p>
        </div>
        <div className="compliance-cta">
          <span>Ready to orchestrate Ma & Co?</span>
          <Link to="/dashboard" className="hero-primary">Open the cockpit</Link>
        </div>
      </section>

      <footer className="landing-footer">
        <div>© {new Date().getFullYear()} Ma & Co Accountants. All rights reserved.</div>
        <div className="footer-links">
          <a href="mailto:hello@maaccountants.co.uk">hello@maaccountants.co.uk</a>
          <span>•</span>
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
