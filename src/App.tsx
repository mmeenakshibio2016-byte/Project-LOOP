import { useRef, useState, type FormEvent, type ReactNode } from 'react'
import {
  Activity, ArrowDownRight, ArrowRight, ArrowUpRight, BarChart3, Bell, Check,
  CheckCheck, ChevronDown, ChevronLeft, ChevronRight, CircleHelp, ClipboardList,
  CloudUpload, Download, FileText, Filter, Folders, Gauge, Layers3,
  LayoutDashboard, Lightbulb, Menu, MessageSquareText, MoreHorizontal,
  Plus, Search, Send, Settings2, ShieldCheck, Sparkles, Target, ThumbsUp, Upload,
  Users, X,
} from 'lucide-react'
import {
  Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer,
  Scatter, ScatterChart, Tooltip, XAxis, YAxis,
} from 'recharts'
import { classifyFeedback, initialFeedback, sentimentColor, users, type Feedback, type Role, type Sentiment, type Status } from './data'

type Page = 'Overview' | 'Feedback inbox' | 'Ask LOOP' | 'VoC reports' | 'Prioritization' | 'Ingestion' | 'Workspace'

const navItems: { label: Page; icon: typeof LayoutDashboard; roles: Role[] }[] = [
  { label: 'Overview', icon: LayoutDashboard, roles: ['ADMIN', 'ANALYST', 'VIEWER'] },
  { label: 'Feedback inbox', icon: MessageSquareText, roles: ['ADMIN', 'ANALYST', 'VIEWER'] },
  { label: 'Ask LOOP', icon: Sparkles, roles: ['ADMIN', 'ANALYST', 'VIEWER'] },
  { label: 'VoC reports', icon: FileText, roles: ['ADMIN', 'ANALYST', 'VIEWER'] },
  { label: 'Prioritization', icon: Target, roles: ['ADMIN', 'ANALYST', 'VIEWER'] },
  { label: 'Ingestion', icon: CloudUpload, roles: ['ADMIN', 'ANALYST'] },
  { label: 'Workspace', icon: Settings2, roles: ['ADMIN'] },
]

const roleDetails: Record<Role, { description: string; color: string }> = {
  ADMIN: { description: 'Manage your workspace and all feedback', color: 'violet' },
  ANALYST: { description: 'Triage feedback and generate reports', color: 'blue' },
  VIEWER: { description: 'Explore insights in read-only mode', color: 'green' },
}

const trendData = [
  { day: 'May 08', positive: 12, negative: 7 }, { day: 'May 09', positive: 16, negative: 9 },
  { day: 'May 10', positive: 13, negative: 8 }, { day: 'May 11', positive: 20, negative: 12 },
  { day: 'May 12', positive: 18, negative: 10 }, { day: 'May 13', positive: 25, negative: 15 },
  { day: 'May 14', positive: 28, negative: 13 },
]

function readStoredFeedback(): Feedback[] {
  try {
    const value = localStorage.getItem('loop-feedback')
    if (value) return JSON.parse(value) as Feedback[]
  } catch {
    localStorage.removeItem('loop-feedback')
  }
  return initialFeedback
}

function App() {
  const [role, setRole] = useState<Role | null>(null)
  const [page, setPage] = useState<Page>('Overview')
  const [feedback, setFeedback] = useState<Feedback[]>(readStoredFeedback)
  const [selected, setSelected] = useState<Feedback | null>(null)
  const [mobileNav, setMobileNav] = useState(false)
  const [toast, setToast] = useState('')

  const updateFeedback = (next: Feedback[]) => {
    setFeedback(next)
    localStorage.setItem('loop-feedback', JSON.stringify(next))
  }

  const notify = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 3200)
  }

  if (!role) {
    return <LoginScreen onEnter={(selectedRole) => setRole(selectedRole)} />
  }

  const allowedItems = navItems.filter((item) => item.roles.includes(role))
  const navigate = (next: Page) => {
    if (navItems.find((item) => item.label === next)?.roles.includes(role) ?? true) {
      setPage(next)
      setMobileNav(false)
    }
  }
  const switchRole = (nextRole: Role) => {
    setRole(nextRole)
    if (!navItems.find((item) => item.label === page)?.roles.includes(nextRole)) setPage('Overview')
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNav ? 'sidebar-open' : ''}`}>
        <div className="brand-lockup">
          <div className="brand-mark"><Layers3 size={21} strokeWidth={2.6} /></div>
          <div><strong>loop</strong><span>FEEDBACK INTELLIGENCE</span></div>
          <button className="icon-button mobile-close" aria-label="Close menu" onClick={() => setMobileNav(false)}><X size={18} /></button>
        </div>
        <div className="workspace-select">
          <div className="workspace-avatar">A</div>
          <div className="workspace-copy"><strong>Acme, Inc.</strong><span>Growth workspace</span></div>
          <ChevronDown size={15} className="muted-icon" />
        </div>
        <div className="nav-caption">WORKSPACE</div>
        <nav className="main-nav" aria-label="Main navigation">
          {allowedItems.map(({ label, icon: Icon }) => (
            <button key={label} onClick={() => navigate(label)} className={`nav-link ${page === label ? 'active' : ''}`}>
              <Icon size={18} strokeWidth={1.9} /><span>{label}</span>
              {label === 'Feedback inbox' && <span className="nav-count">{feedback.filter((item) => item.status === 'New').length}</span>}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="plan-card">
            <div className="plan-icon"><Gauge size={16} /></div>
            <div className="plan-copy"><strong>Starter plan</strong><span>68% of monthly limit</span></div>
            <div className="plan-progress"><i /></div>
            <button onClick={() => notify('You are on the demo workspace plan.')}>View usage <ArrowRight size={13} /></button>
          </div>
          <button className="nav-link help-link" onClick={() => notify('Demo workspace · help@projectloop.app')}><CircleHelp size={18} /><span>Help & support</span></button>
          <div className="sidebar-footer"><span className="online-dot" /> All systems operational</div>
        </div>
      </aside>
      {mobileNav && <button className="mobile-scrim" aria-label="Close navigation" onClick={() => setMobileNav(false)} />}

      <div className="main-column">
        <header className="topbar">
          <button className="icon-button mobile-menu" aria-label="Open menu" onClick={() => setMobileNav(true)}><Menu size={20} /></button>
          <div className="breadcrumbs"><span>Workspace</span><ChevronRight size={14} /><strong>{page}</strong></div>
          <div className="topbar-actions">
            <span className="demo-chip"><span /> DEMO DATA</span>
            <button className="icon-button notification-button" aria-label="Notifications" onClick={() => notify('You’re all caught up!')}><Bell size={18} /><i /></button>
            <div className="topbar-divider" />
            <div className="role-switch-wrap">
              <select aria-label="Switch demo role" value={role} onChange={(event) => switchRole(event.target.value as Role)}>
                <option value="ADMIN">Admin</option><option value="ANALYST">Analyst</option><option value="VIEWER">Viewer</option>
              </select>
              <ChevronDown size={13} />
            </div>
            <button className="avatar-button" title={`${users[role].name} · Sign out`} onClick={() => setRole(null)}>{users[role].initials}</button>
          </div>
        </header>
        <main className="page-content">
          {page === 'Overview' && <Overview feedback={feedback} greeting={users[role].name.split(' ')[0]} onNavigate={navigate} onSelect={setSelected} />}
          {page === 'Feedback inbox' && <Inbox feedback={feedback} onSelect={setSelected} onUpdate={updateFeedback} role={role} notify={notify} />}
          {page === 'Ask LOOP' && <AskLoop feedback={feedback} />}
          {page === 'VoC reports' && <Reports feedback={feedback} notify={notify} />}
          {page === 'Prioritization' && <Prioritization feedback={feedback} onSelect={setSelected} />}
          {page === 'Ingestion' && <Ingestion feedback={feedback} onUpdate={updateFeedback} notify={notify} />}
          {page === 'Workspace' && <Workspace />}
        </main>
        <footer className="app-footer"><span>© 2025 Project LOOP</span><span><span className="online-dot" /> AI insights are simulated for this demo</span></footer>
      </div>
      {selected && <FeedbackDetail feedback={selected} onClose={() => setSelected(null)} role={role} onStatus={(status) => {
        updateFeedback(feedback.map((item) => item.id === selected.id ? { ...item, status } : item))
        setSelected({ ...selected, status })
      }} />}
      {toast && <div className="toast"><Check size={16} />{toast}</div>}
    </div>
  )
}

function LoginScreen({ onEnter }: { onEnter: (role: Role) => void }) {
  const [selectedRole, setSelectedRole] = useState<Role>('ADMIN')
  return (
    <div className="login-page">
      <div className="login-brand"><div className="brand-mark"><Layers3 size={21} strokeWidth={2.6} /></div><strong>loop</strong><span>FEEDBACK INTELLIGENCE</span></div>
      <div className="login-layout">
        <section className="login-intro">
          <div className="eyebrow"><Sparkles size={14} /> CUSTOMER INTELLIGENCE, IN FOCUS</div>
          <h1>Every voice.<br /><span>One clear picture.</span></h1>
          <p>Turn customer feedback into the insights your team needs to build what matters.</p>
          <div className="login-proof"><div className="proof-avatars"><i>SC</i><i>MW</i><i>AM</i><i>+</i></div><span>One workspace for your whole team</span></div>
          <div className="login-orbit orbit-one" /><div className="login-orbit orbit-two" />
        </section>
        <section className="login-card">
          <div className="login-heading"><h2>Welcome to LOOP</h2><p>Choose a demo role to explore the workspace.</p></div>
          <div className="role-options">
            {(Object.keys(roleDetails) as Role[]).map((item) => (
              <button key={item} className={`role-option ${selectedRole === item ? 'selected' : ''}`} onClick={() => setSelectedRole(item)}>
                <span className={`role-radio ${selectedRole === item ? 'checked' : ''}`}>{selectedRole === item && <i />}</span>
                <span className={`role-symbol ${roleDetails[item].color}`}>{item === 'ADMIN' ? <ShieldCheck size={18} /> : item === 'ANALYST' ? <BarChart3 size={18} /> : <Users size={18} />}</span>
                <span className="role-option-copy"><strong>{users[item].name}</strong><span>{item} · {roleDetails[item].description}</span></span>
                <span className="role-badge">{item}</span>
              </button>
            ))}
          </div>
          <button className="button button-primary login-submit" onClick={() => onEnter(selectedRole)}>Enter demo workspace <ArrowRight size={16} /></button>
          <div className="login-note"><ShieldCheck size={14} /> No password needed · Your data stays in this browser</div>
        </section>
      </div>
      <div className="login-foot"><span>PROJECT LOOP · CUSTOMER FEEDBACK INTELLIGENCE</span><span>Built for better decisions.</span></div>
    </div>
  )
}

function PageHeading({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: ReactNode }) {
  return <div className="page-heading"><div>{eyebrow && <div className="section-eyebrow">{eyebrow}</div>}<h1>{title}</h1>{description && <p>{description}</p>}</div>{action && <div className="heading-action">{action}</div>}</div>
}

function Overview({ feedback, greeting, onNavigate, onSelect }: { feedback: Feedback[]; greeting: string; onNavigate: (page: Page) => void; onSelect: (item: Feedback) => void }) {
  const positive = feedback.filter((item) => item.sentiment === 'Positive').length
  const negative = feedback.filter((item) => item.sentiment === 'Negative').length
  const sentimentData = [{ name: 'Positive', value: positive, color: sentimentColor.Positive }, { name: 'Neutral', value: feedback.filter((item) => item.sentiment === 'Neutral').length, color: sentimentColor.Neutral }, { name: 'Negative', value: negative, color: sentimentColor.Negative }]
  const themes = Object.entries(feedback.reduce<Record<string, number>>((result, item) => {
    result[item.theme] = (result[item.theme] ?? 0) + 1
    return result
  }, {})).sort((a, b) => b[1] - a[1]).slice(0, 5)
  const recent = feedback.slice(0, 5)

  return (
    <>
      <PageHeading eyebrow="WEDNESDAY, MAY 14, 2025" title={`Good morning, ${greeting} ✨`} description="Here’s what customers are saying about your product." action={<button className="button button-secondary" onClick={() => onNavigate('VoC reports')}><FileText size={16} /> Generate report</button>} />
      <div className="insight-banner"><div className="insight-icon"><Sparkles size={17} /></div><div><strong>One thing to know</strong><p>Mentions of <b>mobile app issues</b> are up <b>42%</b> this week. Customers are reporting frequent logouts. <span>4 feedback items</span></p></div><button className="text-button" onClick={() => onNavigate('Feedback inbox')}>Explore insight <ArrowRight size={14} /></button></div>
      <div className="kpi-grid">
        <KpiCard title="Total feedback" value={String(feedback.length + 1246)} delta="+12.8%" subtitle="vs. previous 7 days" icon={<MessageSquareText size={18} />} color="purple" />
        <KpiCard title="Positive sentiment" value={`${feedback.length ? Math.round(positive / feedback.length * 100) : 0}%`} delta="+4.2%" subtitle="vs. previous 7 days" icon={<ThumbsUp size={18} />} color="green" />
        <KpiCard title="Needs attention" value={String(feedback.filter((item) => item.sentiment === 'Negative' && item.status === 'New').length + 18)} delta="-8.1%" subtitle="vs. previous 7 days" icon={<Activity size={18} />} color="orange" negative />
        <KpiCard title="Themes identified" value={String(new Set(feedback.map((item) => item.theme)).size + 3)} delta="+2 new" subtitle="this week" icon={<Layers3 size={18} />} color="blue" />
      </div>
      <div className="analytics-grid">
        <section className="panel trend-panel">
          <PanelHeader title="Feedback volume" subtitle="Sentiment over the last 7 days" extra={<button className="select-chip">Last 7 days <ChevronDown size={14} /></button>} />
          <div className="chart-legend"><span><i className="legend-positive" />Positive</span><span><i className="legend-negative" />Negative</span></div>
          <div className="trend-chart"><ResponsiveContainer width="100%" height="100%"><AreaChart data={trendData} margin={{ top: 10, right: 7, left: -20, bottom: 0 }}>
            <defs><linearGradient id="positiveFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#14b889" stopOpacity={0.17} /><stop offset="95%" stopColor="#14b889" stopOpacity={0} /></linearGradient><linearGradient id="negativeFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f16c6c" stopOpacity={0.13} /><stop offset="95%" stopColor="#f16c6c" stopOpacity={0} /></linearGradient></defs>
            <CartesianGrid strokeDasharray="3 5" vertical={false} stroke="#edf0f4" /><XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#8993a4', fontSize: 11 }} dy={9} /><YAxis axisLine={false} tickLine={false} tick={{ fill: '#8993a4', fontSize: 11 }} /><Tooltip contentStyle={{ border: '1px solid #edf0f4', borderRadius: 10, boxShadow: '0 8px 24px #18223012' }} />
            <Area type="monotone" dataKey="positive" name="Positive" stroke="#14b889" strokeWidth={2.4} fill="url(#positiveFill)" /><Area type="monotone" dataKey="negative" name="Negative" stroke="#f16c6c" strokeWidth={2.4} fill="url(#negativeFill)" />
          </AreaChart></ResponsiveContainer></div>
        </section>
        <section className="panel sentiment-panel">
          <PanelHeader title="Sentiment breakdown" subtitle="Across all feedback" extra={<button className="more-button" aria-label="More sentiment options"><MoreHorizontal size={19} /></button>} />
          <div className="sentiment-content">
            <div className="donut-chart"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={sentimentData} dataKey="value" nameKey="name" innerRadius="72%" outerRadius="94%" startAngle={90} endAngle={-270} paddingAngle={3} stroke="none">{sentimentData.map((item) => <Cell key={item.name} fill={item.color} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer><div className="donut-center"><strong>{feedback.length + 1246}</strong><span>responses</span></div></div>
            <div className="sentiment-legend">{sentimentData.map((item) => <div key={item.name}><span><i style={{ background: item.color }} />{item.name}</span><strong>{Math.round(item.value / Math.max(feedback.length, 1) * 100)}%</strong></div>)}</div>
          </div>
          <div className="sentiment-foot"><span className="trend-positive"><ArrowUpRight size={14} /> 4.2%</span> positive sentiment this week</div>
        </section>
      </div>
      <div className="lower-grid">
        <section className="panel themes-panel">
          <PanelHeader title="Top themes" subtitle="What matters most to customers" extra={<button className="text-button" onClick={() => onNavigate('Prioritization')}>View all <ArrowRight size={14} /></button>} />
          <div className="theme-list">{themes.map(([theme, count], index) => <div className="theme-row" key={theme}><span className={`theme-number number-${index + 1}`}>{String(index + 1).padStart(2, '0')}</span><span className="theme-name">{theme}</span><div className="theme-bar"><i style={{ width: `${Math.max(count / Math.max(themes[0]?.[1] ?? 1, 1) * 100, 8)}%` }} /></div><span className="theme-count">{count + [46, 33, 21, 18, 12][index]} mentions</span><span className={index === 0 ? 'theme-change up' : 'theme-change'}>{index === 0 ? '↑ 18%' : index === 1 ? '↑ 6%' : '—'}</span></div>)}</div>
        </section>
        <section className="panel recent-panel">
          <PanelHeader title="Recent feedback" subtitle="Latest customer voices" extra={<button className="text-button" onClick={() => onNavigate('Feedback inbox')}>View inbox <ArrowRight size={14} /></button>} />
          <div className="recent-list">{recent.map((item) => <button className="recent-item" key={item.id} onClick={() => onSelect(item)}><SentimentDot sentiment={item.sentiment} /><span className="recent-copy"><strong>{item.text}</strong><span>{item.customer} <i>·</i> {item.source}</span></span><span className="recent-date">{formatDate(item.date)}</span></button>)}</div>
        </section>
      </div>
      <div className="demo-disclaimer"><Sparkles size={13} /> Insights include illustrative demo metrics. Feedback interactions are saved locally in this browser.</div>
    </>
  )
}

function KpiCard({ title, value, delta, subtitle, icon, color, negative = false }: { title: string; value: string; delta: string; subtitle: string; icon: ReactNode; color: string; negative?: boolean }) {
  return <section className="kpi-card"><div className={`kpi-icon ${color}`}>{icon}</div><span className="kpi-delta">{negative ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />}{delta}</span><div className="kpi-value">{value}</div><div className="kpi-label">{title}</div><div className="kpi-subtitle">{subtitle}</div></section>
}

function PanelHeader({ title, subtitle, extra }: { title: string; subtitle?: string; extra?: ReactNode }) {
  return <div className="panel-header"><div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div>{extra}</div>
}

function SentimentDot({ sentiment }: { sentiment: Sentiment }) {
  return <span className={`sentiment-dot ${sentiment.toLowerCase()}`} title={sentiment} />
}

function SentimentBadge({ sentiment }: { sentiment: Sentiment }) {
  return <span className={`sentiment-badge ${sentiment.toLowerCase()}`}><i />{sentiment}</span>
}

function StatusBadge({ status }: { status: Status }) {
  return <span className={`status-badge ${status.toLowerCase()}`}>{status}</span>
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(`${value}T12:00:00`))
}

function Inbox({ feedback, onSelect, onUpdate, role, notify }: { feedback: Feedback[]; onSelect: (item: Feedback) => void; onUpdate: (next: Feedback[]) => void; role: Role; notify: (message: string) => void }) {
  const [search, setSearch] = useState('')
  const [sentiment, setSentiment] = useState('All sentiments')
  const [status, setStatus] = useState('All statuses')
  const [source, setSource] = useState('All sources')
  const filtered = feedback.filter((item) => {
    const query = search.toLowerCase()
    return (!query || `${item.text} ${item.customer} ${item.theme} ${item.id}`.toLowerCase().includes(query))
      && (sentiment === 'All sentiments' || item.sentiment === sentiment)
      && (status === 'All statuses' || item.status === status)
      && (source === 'All sources' || item.source === source)
  })
  const canTriage = role !== 'VIEWER'
  return <>
    <PageHeading eyebrow="VOICE OF THE CUSTOMER" title="Feedback inbox" description="Review, prioritize, and take action on every customer voice." action={canTriage ? <button className="button button-primary" onClick={() => notify('Use Ingestion to add feedback to your workspace.')}><Plus size={16} /> Add feedback</button> : undefined} />
    <section className="panel inbox-panel">
      <div className="inbox-toolbar"><div className="inbox-count"><strong>{filtered.length}</strong> feedback items <span>·</span> {feedback.filter((item) => item.status === 'New').length} new</div><div className="filter-controls">
        <label className="search-input"><Search size={16} /><input placeholder="Search feedback..." value={search} onChange={(event) => setSearch(event.target.value)} /></label>
        <select aria-label="Filter by sentiment" value={sentiment} onChange={(event) => setSentiment(event.target.value)}><option>All sentiments</option><option>Positive</option><option>Neutral</option><option>Negative</option></select>
        <select aria-label="Filter by status" value={status} onChange={(event) => setStatus(event.target.value)}><option>All statuses</option><option>New</option><option>Reviewed</option><option>Actioned</option></select>
        <select aria-label="Filter by source" value={source} onChange={(event) => setSource(event.target.value)}><option>All sources</option>{[...new Set(feedback.map((item) => item.source))].map((item) => <option key={item}>{item}</option>)}</select>
      </div></div>
      <div className="table-scroll"><table className="feedback-table"><thead><tr><th>FEEDBACK</th><th>SENTIMENT</th><th>THEME</th><th>SOURCE</th><th>STATUS</th><th>DATE</th><th /></tr></thead><tbody>
        {filtered.map((item) => <tr key={item.id} onClick={() => onSelect(item)} className="clickable-row"><td><div className="feedback-cell"><SentimentDot sentiment={item.sentiment} /><div><strong>{item.text}</strong><span>{item.customer} <i>·</i> {item.id}</span></div></div></td><td><SentimentBadge sentiment={item.sentiment} /></td><td><span className="theme-tag">{item.theme}</span></td><td><span className="source-cell">{item.source}</span></td><td onClick={(event) => event.stopPropagation()}>{canTriage ? <select className={`inline-status ${item.status.toLowerCase()}`} aria-label={`Status for ${item.id}`} value={item.status} onChange={(event) => onUpdate(feedback.map((entry) => entry.id === item.id ? { ...entry, status: event.target.value as Status } : entry))}><option>New</option><option>Reviewed</option><option>Actioned</option></select> : <StatusBadge status={item.status} />}</td><td><span className="table-date">{formatDate(item.date)}</span></td><td><button className="row-open" aria-label={`View ${item.id}`} onClick={(event) => { event.stopPropagation(); onSelect(item) }}><ArrowRight size={15} /></button></td></tr>)}
        {filtered.length === 0 && <tr><td colSpan={7}><div className="empty-state"><Filter size={24} /><strong>No feedback matches those filters</strong><span>Try a different search or clear a filter.</span><button className="text-button" onClick={() => { setSearch(''); setSentiment('All sentiments'); setStatus('All statuses'); setSource('All sources') }}>Clear filters</button></div></td></tr>}
      </tbody></table></div>
      <div className="table-footer"><span>Showing {filtered.length} of {feedback.length} items</span><div><button disabled aria-label="Previous page"><ChevronLeft size={16} /></button><b>1</b><button disabled aria-label="Next page"><ChevronRight size={16} /></button></div></div>
    </section>
    <div className="demo-disclaimer"><Sparkles size={13} /> Sentiment and themes are demo classifications. Change status inline to triage items.</div>
  </>
}

function FeedbackDetail({ feedback, onClose, role, onStatus }: { feedback: Feedback; onClose: () => void; role: Role; onStatus: (status: Status) => void }) {
  return <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}><section className="detail-drawer" role="dialog" aria-modal="true" aria-labelledby="detail-title">
    <div className="drawer-top"><span>FEEDBACK DETAIL</span><button className="icon-button" onClick={onClose} aria-label="Close details"><X size={19} /></button></div>
    <div className="drawer-content"><div className="drawer-tags"><SentimentBadge sentiment={feedback.sentiment} /><StatusBadge status={feedback.status} /></div><h2 id="detail-title">Customer feedback</h2><blockquote>“{feedback.text}”</blockquote>
      <div className="detail-score"><div><span>AI confidence</span><strong>{Math.round(feedback.score * 100)}%</strong></div><div className="score-track"><i style={{ width: `${feedback.score * 100}%` }} /></div><small>Simulated classification</small></div>
      <div className="detail-info"><h3>Feedback details</h3><InfoRow label="Customer" value={feedback.customer} /><InfoRow label="Source" value={feedback.source} /><InfoRow label="Theme" value={feedback.theme} /><InfoRow label="Received" value={formatDate(feedback.date)} /><InfoRow label="Feedback ID" value={feedback.id} /></div>
      {role !== 'VIEWER' && <div className="drawer-actions"><span>Update status</span><div>{(['New', 'Reviewed', 'Actioned'] as Status[]).map((value) => <button key={value} className={`button ${feedback.status === value ? 'button-primary' : 'button-secondary'}`} onClick={() => onStatus(value)}>{value === 'Actioned' && <CheckCheck size={15} />}{value}</button>)}</div></div>}
    </div>
  </section></div>
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return <div className="info-row"><span>{label}</span><strong>{value}</strong></div>
}

function Ingestion({ feedback, onUpdate, notify }: { feedback: Feedback[]; onUpdate: (next: Feedback[]) => void; notify: (message: string) => void }) {
  const [text, setText] = useState('')
  const [customer, setCustomer] = useState('')
  const [source, setSource] = useState('Support')
  const [dragging, setDragging] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const addFeedback = (value: string, name: string, channel: string) => {
    const trimmed = value.trim()
    if (!trimmed) return undefined
    const classification = classifyFeedback(trimmed)
    return { id: `FB-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`, text: trimmed, customer: name.trim() || 'Demo customer', source: channel, date: new Date().toISOString().slice(0, 10), ...classification, status: 'New', score: 0.82, impact: 5 } satisfies Feedback
  }

  const submitManual = (event: FormEvent) => {
    event.preventDefault()
    const item = addFeedback(text, customer, source)
    if (item) {
      onUpdate([item, ...feedback])
      setText(''); setCustomer('')
      notify('Feedback added and classified for your demo workspace.')
    }
  }

  const parseCsv = (raw: string) => {
    const lines = raw.split(/\r?\n/).filter((line) => line.trim())
    const rows = lines.map((line) => line.match(/("([^"]|"")*"|[^,]*)(,|$)/g)?.map((cell) => cell.replace(/,$/, '').replace(/^"|"$/g, '').replace(/""/g, '"').trim()) ?? [])
    const header = rows[0]?.map((cell) => cell.toLowerCase()) ?? []
    const hasHeader = header.some((cell) => ['feedback', 'text', 'comment', 'customer', 'source'].includes(cell))
    const records = rows.slice(hasHeader ? 1 : 0)
    const textColumn = hasHeader ? Math.max(header.findIndex((cell) => ['feedback', 'text', 'comment'].includes(cell)), 0) : 0
    const customerColumn = hasHeader ? header.findIndex((cell) => ['customer', 'name'].includes(cell)) : -1
    const sourceColumn = hasHeader ? header.findIndex((cell) => cell === 'source') : -1
    const added = records.flatMap((row) => {
      const item = addFeedback(row[textColumn] ?? '', customerColumn >= 0 ? row[customerColumn] ?? '' : '', sourceColumn >= 0 ? row[sourceColumn] || 'CSV import' : 'CSV import')
      return item ? [item] : []
    })
    const count = added.length
    if (count) onUpdate([...added, ...feedback])
    if (count) notify(`${count} feedback ${count === 1 ? 'item' : 'items'} imported and classified.`)
    else notify('No feedback rows found. Include a feedback or text column and try again.')
  }

  const handleFile = (file?: File) => {
    if (!file) return
    if (!file.name.toLowerCase().endsWith('.csv') && file.type !== 'text/csv') {
      notify('Please choose a .csv file.')
      return
    }
    const reader = new FileReader()
    reader.onload = () => parseCsv(String(reader.result ?? ''))
    reader.onerror = () => notify('The CSV could not be read. Please try another file.')
    reader.readAsText(file)
  }

  return <>
    <PageHeading eyebrow="BRING EVERY VOICE TOGETHER" title="Ingest feedback" description="Add customer feedback manually or import a CSV. LOOP will organize it for you." />
    <div className="ingestion-grid">
      <section className="panel import-panel"><PanelHeader title="Import a CSV" subtitle="Bring in feedback from a spreadsheet" />
        <button className={`drop-zone ${dragging ? 'dragging' : ''}`} onDragOver={(event) => { event.preventDefault(); setDragging(true) }} onDragLeave={() => setDragging(false)} onDrop={(event) => { event.preventDefault(); setDragging(false); handleFile(event.dataTransfer.files[0]) }} onClick={() => fileRef.current?.click()}>
          <span className="upload-icon"><Upload size={20} /></span><strong>Drop your CSV file here</strong><span>or <b>browse files</b> from your computer</span><small>CSV format · Up to 10 MB</small>
        </button><input ref={fileRef} type="file" accept=".csv,text/csv" hidden onChange={(event) => handleFile(event.target.files?.[0])} />
        <div className="import-tip"><Lightbulb size={15} /><span><strong>Quick tip</strong> Include a <code>feedback</code> or <code>text</code> column. Optional columns: customer, source.</span></div>
        <button className="template-link" onClick={() => { const blob = new Blob(['feedback,customer,source\n"The new experience is much faster",Taylor Morgan,App Store\n"I have trouble finding reports",Jamie Park,Support\n'], { type: 'text/csv' }); const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = 'loop-feedback-template.csv'; link.click(); URL.revokeObjectURL(link.href) }}><Download size={14} /> Download CSV template</button>
      </section>
      <section className="panel manual-panel"><PanelHeader title="Add feedback manually" subtitle="Capture an individual customer voice" />
        <form className="manual-form" onSubmit={submitManual}><label>FEEDBACK TEXT<textarea required minLength={3} maxLength={1000} placeholder="What did your customer say? Paste their feedback here..." value={text} onChange={(event) => setText(event.target.value)} /></label><div className="form-row"><label>CUSTOMER NAME<input placeholder="e.g. Taylor Morgan" value={customer} onChange={(event) => setCustomer(event.target.value)} /></label><label>SOURCE<select value={source} onChange={(event) => setSource(event.target.value)}><option>Support</option><option>App Store</option><option>Sales call</option><option>NPS survey</option><option>Zendesk</option><option>Email</option></select></label></div><div className="classification-hint"><Sparkles size={15} /><span>Sentiment and theme will be <strong>automatically classified</strong> on submit.</span></div><button className="button button-primary" type="submit"><Plus size={16} /> Add feedback</button></form>
      </section>
    </div>
    <section className="ingest-footnote"><div className="ingest-feature"><span><ShieldCheck size={17} /></span><div><strong>Private by design</strong><small>Demo data is stored only in your browser.</small></div></div><div className="ingest-feature"><span><Sparkles size={17} /></span><div><strong>AI-assisted organization</strong><small>Automatic sentiment and theme labels.</small></div></div><div className="ingest-feature"><span><Folders size={17} /></span><div><strong>Easy to get started</strong><small>Works with simple CSV exports.</small></div></div></section>
    <div className="demo-disclaimer"><Sparkles size={13} /> This MVP uses lightweight local classification, not a live AI service or backend.</div>
  </>
}

function AskLoop({ feedback }: { feedback: Feedback[] }) {
  const starters = ['What are customers asking us to improve?', 'What do people love about the product?', 'Summarize the biggest customer pain points']
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState<{ question: string; summary: string; citations: Feedback[] } | null>(null)
  const [history, setHistory] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  const ask = (value: string) => {
    const cleaned = value.trim()
    if (!cleaned) return
    const query = cleaned.toLowerCase()
    const terms = query.split(/\W+/).filter((word) => word.length > 3)
    let citations = feedback.filter((item) => terms.some((term) => `${item.text} ${item.theme} ${item.sentiment}`.toLowerCase().includes(term)))
    if (citations.length < 2) citations = feedback.filter((item) => item.sentiment === (query.includes('love') || query.includes('positive') ? 'Positive' : 'Negative'))
    if (citations.length === 0) citations = feedback
    citations = citations.slice(0, 3)
    const topicCounts = Object.entries(citations.reduce<Record<string, number>>((result, item) => { result[item.theme] = (result[item.theme] ?? 0) + 1; return result }, {})).sort((a, b) => b[1] - a[1])
    const summary = citations.length
      ? `Based on ${citations.length} relevant feedback ${citations.length === 1 ? 'item' : 'items'} in this demo workspace, ${topicCounts[0]?.[0].toLowerCase()} is the clearest recurring theme. ${citations.filter((item) => item.sentiment === 'Negative').length} of the cited items are negative, which suggests an opportunity for the team to investigate and validate with more customer data.`
      : 'There is not enough feedback in this workspace to answer that yet.'
    setAnswer({ question: cleaned, summary, citations })
    setHistory((previous) => [cleaned, ...previous.filter((item) => item !== cleaned)].slice(0, 5))
    setQuestion('')
  }

  return <>
    <PageHeading eyebrow="GROUNDED IN CUSTOMER VOICES" title="Ask LOOP" description="Ask a question and explore answers grounded in your feedback." />
    <div className="ask-layout"><section className="panel ask-main"><div className="ask-intro"><div className="ask-spark"><Sparkles size={22} /></div><h2>Your customer feedback, in plain English.</h2><p>Ask LOOP to find patterns, summarize feedback, and surface the voices behind the trends.</p></div>
      {!answer && <div className="starter-list"><span>TRY ASKING</span>{starters.map((starter) => <button key={starter} onClick={() => ask(starter)}>{starter}<ArrowRight size={15} /></button>)}</div>}
      {answer && <div className="answer-card"><div className="question-pill"><Sparkles size={14} />{answer.question}</div><div className="answer-copy"><span className="answer-label"><Sparkles size={14} /> LOOP INSIGHT <i>·</i> SIMULATED AI</span><p>{answer.summary}</p></div><div className="citation-heading"><strong>Sources from your feedback</strong><span>{answer.citations.length} citations</span></div><div className="citations">{answer.citations.map((item, index) => <article className="citation-card" key={item.id}><div className="citation-meta"><span>[{index + 1}]</span><SentimentBadge sentiment={item.sentiment} /><span>{item.theme}</span></div><p>“{item.text}”</p><small>{item.customer} · {item.source} · {formatDate(item.date)} · {item.id}</small></article>)}</div><p className="grounding-note"><ShieldCheck size={14} /> Answer generated from {feedback.length} feedback items in this local demo. Always verify before making decisions.</p></div>}
      <form className="ask-input-wrap" onSubmit={(event) => { event.preventDefault(); ask(question) }}><input ref={inputRef} aria-label="Ask LOOP a question" placeholder="Ask a question about your feedback..." value={question} onChange={(event) => setQuestion(event.target.value)} /><button type="submit" disabled={!question.trim()} aria-label="Submit question"><Send size={17} /></button></form><div className="ask-input-caption">LOOP can make mistakes. Check the cited feedback for context.</div>
    </section><aside className="panel ask-sidebar"><div className="ask-side-heading"><span className="tiny-spark"><Sparkles size={15} /></span><div><strong>About Ask LOOP</strong><small>Grounded answers from your data</small></div></div><div className="ask-info"><span className="ask-info-icon"><MessageSquareText size={16} /></span><div><strong>Evidence-backed answers</strong><p>Each response links back to specific feedback so you can verify the context.</p></div></div><div className="ask-info"><span className="ask-info-icon"><Folders size={16} /></span><div><strong>{feedback.length} items in scope</strong><p>Only feedback in this demo workspace is used to generate answers.</p></div></div><div className="ask-info"><span className="ask-info-icon"><ShieldCheck size={16} /></span><div><strong>Demo simulation</strong><p>Answers are generated locally with simple keyword matching. No AI provider or API key is connected.</p></div></div>{history.length > 0 && <div className="ask-history"><span>RECENT QUESTIONS</span>{history.map((item) => <button key={item} onClick={() => { setQuestion(item); inputRef.current?.focus() }}>{item}</button>)}</div>}</aside></div>
    <div className="demo-disclaimer"><Sparkles size={13} /> AI responses are simulated and grounded in the sample feedback above; they are not generated by an external model.</div>
  </>
}

function Reports({ feedback, notify }: { feedback: Feedback[]; notify: (message: string) => void }) {
  const [generated, setGenerated] = useState(false)
  const negatives = feedback.filter((item) => item.sentiment === 'Negative')
  const positives = feedback.filter((item) => item.sentiment === 'Positive')
  const themeCounts = Object.entries(feedback.reduce<Record<string, number>>((result, item) => { result[item.theme] = (result[item.theme] ?? 0) + 1; return result }, {})).sort((a, b) => b[1] - a[1])
  const downloadReport = () => {
    const body = `PROJECT LOOP · VOICE OF CUSTOMER REPORT\nDemo sample · Local demo workspace\n\nEXECUTIVE SUMMARY\n${positives.length} positive, ${feedback.length - positives.length - negatives.length} neutral, and ${negatives.length} negative feedback items analyzed.\n\nTOP THEMES\n${themeCounts.map(([theme, count]) => `- ${theme}: ${count} mentions`).join('\n')}\n\nCUSTOMER VOICES\n${feedback.slice(0, 8).map((item) => `- [${item.sentiment}] ${item.customer} (${item.source}): "${item.text}"`).join('\n')}\n\nNote: This is a simulated demo report generated from local sample data.`
    const blob = new Blob([body], { type: 'text/plain' }); const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = 'project-loop-voc-report.txt'; link.click(); URL.revokeObjectURL(link.href); notify('Report downloaded.')
  }
  return <>
    <PageHeading eyebrow="TURN INSIGHTS INTO ACTION" title="Voice of Customer" description="Create a clear, shareable summary of what your customers are saying." action={<button className="button button-secondary" disabled={!generated} onClick={downloadReport}><Download size={16} /> Export report</button>} />
    <section className="report-config panel"><div><span className="config-icon"><FileText size={18} /></span><div><strong>Generate an executive digest</strong><p>Summarize sentiment, emerging themes, and representative customer voices.</p></div></div><div className="report-config-actions"><span className="sample-coverage">{feedback.length} demo items</span><button className="button button-primary" onClick={() => { setGenerated(true); notify('Your Voice of Customer report is ready.') }}><Sparkles size={16} /> Generate report</button></div></section>
    {generated ? <section className="voc-report panel"><div className="report-title-row"><div><span className="report-tag"><Sparkles size={12} /> AI-GENERATED · DEMO</span><h2>Voice of Customer — Demo sample</h2><p>Acme, Inc. · Generated just now · {feedback.length} feedback items analyzed</p></div><button className="icon-button" aria-label="More report actions" onClick={downloadReport}><Download size={18} /></button></div><div className="report-summary"><span>EXECUTIVE SUMMARY</span><p>Customer sentiment is <strong>{Math.round(positives.length / Math.max(feedback.length, 1) * 100)}% positive</strong> across this sample. <strong>{themeCounts[0]?.[0]}</strong> is the most frequently discussed theme, while <strong>{negatives.length} negative items</strong> highlight areas that may need attention. These findings are based on a small illustrative dataset; validate trends against live customer data before acting.</p></div><div className="report-sections"><div className="report-section"><h3><span className="report-bullet green-bullet" /> What customers love</h3>{positives.slice(0, 3).map((item) => <p className="report-quote" key={item.id}>“{item.text}”<small>{item.customer} · {item.theme}</small></p>)}</div><div className="report-section"><h3><span className="report-bullet red-bullet" /> Opportunities to improve</h3>{negatives.slice(0, 3).map((item) => <p className="report-quote" key={item.id}>“{item.text}”<small>{item.customer} · {item.theme}</small></p>)}</div></div><div className="report-themes"><h3>Top customer themes</h3><div>{themeCounts.slice(0, 5).map(([theme, count]) => <span key={theme}>{theme}<b>{count} mentions</b></span>)}</div></div><div className="report-footer"><ShieldCheck size={14} /> Generated with simulated AI for demonstration. Customer quotes are from the local sample dataset.</div></section> : <section className="report-empty panel"><span className="empty-report-icon"><ClipboardList size={25} /></span><h2>Your next customer story starts here.</h2><p>Generate a Voice of Customer digest to bring feedback themes, sentiment, and real customer quotes together.</p><button className="button button-secondary" onClick={() => setGenerated(true)}>Preview sample report <ArrowRight size={15} /></button></section>}
    <div className="demo-disclaimer"><Sparkles size={13} /> Reports are generated from local demo data; no external AI service is connected.</div>
  </>
}

function Prioritization({ feedback, onSelect }: { feedback: Feedback[]; onSelect: (item: Feedback) => void }) {
  const data = feedback.map((item) => ({ ...item, x: item.impact, y: item.sentiment === 'Negative' ? 9 - item.score * 4 : item.sentiment === 'Neutral' ? 5 : 2 + (1 - item.score) * 3 }))
  const priorities = [...feedback].sort((a, b) => (b.impact * (b.sentiment === 'Negative' ? 1 : 0.55)) - (a.impact * (a.sentiment === 'Negative' ? 1 : 0.55))).slice(0, 5)
  return <>
    <PageHeading eyebrow="MAKE THE RIGHT THINGS MATTER" title="Prioritization matrix" description="See which customer themes combine the highest impact with the strongest signals." action={<button className="button button-secondary" onClick={() => window.print()}><Download size={16} /> Export view</button>} />
    <div className="priority-callout"><span><Target size={18} /></span><div><strong>Start with high-impact pain points</strong><p>Negative feedback from important customer moments is the clearest signal to investigate first.</p></div><span className="priority-callout-tag">LIVE FROM DEMO DATA</span></div>
    <div className="priority-grid"><section className="panel matrix-panel"><PanelHeader title="Impact vs. sentiment" subtitle="Each dot represents an individual feedback item" /><div className="matrix-legend"><span><i className="legend-negative" />Negative</span><span><i className="legend-neutral" />Neutral</span><span><i className="legend-positive" />Positive</span></div><div className="matrix-chart"><ResponsiveContainer width="100%" height="100%"><ScatterChart margin={{ top: 14, right: 24, bottom: 16, left: 3 }}><CartesianGrid stroke="#edf0f4" strokeDasharray="3 5" /><XAxis type="number" dataKey="x" name="Impact" domain={[0, 10]} tick={{ fill: '#8993a4', fontSize: 11 }} tickLine={false} axisLine={false} label={{ value: 'CUSTOMER IMPACT', position: 'insideBottom', offset: -5, fill: '#8993a4', fontSize: 10 }} /><YAxis type="number" dataKey="y" name="Priority signal" domain={[0, 10]} tick={{ fill: '#8993a4', fontSize: 11 }} tickLine={false} axisLine={false} label={{ value: 'PRIORITY SIGNAL', angle: -90, position: 'insideLeft', fill: '#8993a4', fontSize: 10 }} /><Tooltip cursor={{ strokeDasharray: '3 3' }} content={({ active, payload }) => active && payload?.length ? <div className="scatter-tooltip"><strong>{String(payload[0].payload.theme)}</strong><span>{String(payload[0].payload.customer)} · {String(payload[0].payload.sentiment)}</span><p>{String(payload[0].payload.text)}</p></div> : null} /><Scatter name="Feedback" data={data} fill="#8884d8">{data.map((item) => <Cell key={item.id} fill={sentimentColor[item.sentiment]} fillOpacity={0.83} />)}</Scatter></ScatterChart></ResponsiveContainer><span className="quadrant-label q-high">INVESTIGATE</span><span className="quadrant-label q-low">MONITOR</span></div><div className="axis-caption"><span>Lower impact</span><span>Higher impact</span></div></section>
      <aside className="panel priority-list-panel"><PanelHeader title="Suggested focus" subtitle="Ranked by impact and sentiment" /><div className="priority-list">{priorities.map((item, index) => <button className="priority-item" key={item.id} onClick={() => onSelect(item)}><span className={`priority-rank ${index < 2 ? 'urgent-rank' : ''}`}>{String(index + 1).padStart(2, '0')}</span><span className="priority-item-copy"><strong>{item.theme}</strong><small>{item.customer} · {item.source}</small><span>{item.text}</span></span><SentimentDot sentiment={item.sentiment} /></button>)}</div><div className="priority-list-note"><Lightbulb size={15} /><span>Priorities are heuristic suggestions based on sample data — validate with your team.</span></div></aside></div>
    <div className="demo-disclaimer"><Sparkles size={13} /> Matrix positioning is illustrative and based on demo impact and sentiment scores.</div>
  </>
}

function Workspace() {
  return <>
    <PageHeading eyebrow="YOUR TEAM, YOUR WORKSPACE" title="Workspace settings" description="Manage team access for your Acme, Inc. demo workspace." />
    <section className="panel workspace-panel"><PanelHeader title="Team members" subtitle="Demo users and their access levels" /><div className="team-list">{(Object.keys(users) as Role[]).map((role) => <div className="team-member" key={role}><span className={`team-avatar ${role.toLowerCase()}`}>{users[role].initials}</span><div><strong>{users[role].name}</strong><small>{users[role].email}</small></div><span className="team-role">{role}</span><span className="team-access">{roleDetails[role].description}</span></div>)}</div><div className="workspace-note"><ShieldCheck size={16} /> Role switching is available from the top bar to test permission differences.</div></section>
  </>
}

export default App
