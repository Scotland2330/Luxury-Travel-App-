import { useState } from 'react';
import { useTheme } from '../ThemeContext';

type Task = { title: string; trip: string; client?: string; tags?: string[]; due: string; dueClass?: string; assignees: string[]; attach?: string; comments?: string; border?: string; start?: string; done?: string; category?: string };

const columns: { title: string; count: number; ruby?: boolean; tasks: Task[] }[] = [
  { title: 'TO DO', count: 7, tasks: [
    { title: 'Send Pre-Arrival — Diaz DC Trip', trip: 'DC Business', client: 'Diaz', tags: ['Pre-Arrival', 'Urgent'], due: 'Today', dueClass: 'today', assignees: ['HM'], category: 'Admin' },
    { title: 'Follow up insurance quote — Holland', trip: 'Capri', client: 'Holland', tags: ['Insurance'], due: 'Today', dueClass: 'today', assignees: ['HM'], category: 'Insurance Quoting' },
    { title: 'Confirm transfer details — Baker', trip: 'Westlake', client: 'Baker', tags: ['Transfers'], due: 'Jun 25', assignees: ['HM'], category: 'Transfers' },
    { title: 'Send Bon Voyage — Diaz', trip: 'DC Business', client: 'Diaz', tags: ['Bon Voyage', 'Auto-triggered'], due: 'Jun 20', assignees: ['HM'], category: 'Admin' },
  ]},
  { title: 'IN PROGRESS', count: 5, tasks: [
    { title: 'AXUS Review — Holland Capri itinerary', trip: 'Capri', client: 'Holland', tags: ['AXUS Review'], due: 'Jun 21', comments: '2', assignees: ['HM', 'ES'], category: 'AXUS Review' },
    { title: 'Concierge dining res — Holland', trip: 'Capri', client: 'Holland', tags: ['Concierge'], due: 'Jun 28', assignees: ['HM'], category: 'Concierge' },
    { title: 'DMC final details follow-up — Hastings Kenya', trip: 'Kenya Safari', client: 'Hastings', tags: ['Touring', '30-day check'], due: 'Jul 15', assignees: ['ES'], category: 'Touring/DMC' },
  ]},
  { title: 'BLOCKED / OVERDUE', count: 3, ruby: true, tasks: [
    { title: 'Welcome Home send — McGarey Scotland', trip: 'Scotland', client: 'McGarey', tags: ['Overdue 5d'], due: 'Was Jun 15', dueClass: 'overdue', assignees: ['HM'], border: 'rgba(155,58,58,0.3)', category: 'Admin' },
    { title: 'Client passport submission — Baker', trip: 'Westlake', client: 'Baker', tags: ['Awaiting Client'], due: 'Was Jun 18', dueClass: 'overdue', assignees: ['HM'], border: 'rgba(155,58,58,0.3)', category: 'Admin' },
    { title: 'Insurance decision — Stern/Gross Spain', trip: 'Spain', client: 'Stern/Gross', tags: ['Insurance', 'Overdue 2d'], due: 'Was Jun 18', dueClass: 'overdue', assignees: ['HM'], border: 'rgba(155,58,58,0.3)', category: 'Insurance Quoting' },
  ]},
  { title: 'COMPLETED', count: 6, tasks: [
    { title: 'Flight check — Diaz departing', trip: 'DC Business', client: 'Diaz', done: 'Done Jun 20', due: '', assignees: ['HM'], category: 'Flights' },
    { title: 'Book flights — Holland Capri', trip: 'Capri', client: 'Holland', done: 'Done Jun 8', due: '', assignees: ['HM'], category: 'Flights' },
    { title: 'Reserve Hotel Caesar Augustus', trip: 'Capri', client: 'Holland', done: 'Done Jun 5', due: '', assignees: ['HM'], category: 'Hotels' },
    { title: 'Send Welcome Home — O\'Brien', trip: 'Palm Heights', client: "O'Brien", done: 'Done Jun 1', due: '', assignees: ['HM'], category: 'Admin' },
    { title: 'Insurance confirmed — Hastings Kenya', trip: 'Kenya Safari', client: 'Hastings', done: 'Done May 28', due: '', assignees: ['ES'], category: 'Insurance Quoting' },
    { title: 'Pre-Arrival sent — McGarey Scotland', trip: 'Scotland', client: 'McGarey', done: 'Done May 8', due: '', assignees: ['HM'], category: 'Admin' },
  ]},
];

const checklist = [
  { done: true, text: 'Upload itinerary to AXUS platform' },
  { done: true, text: 'Verify all flight details match bookings' },
  { done: false, text: 'Confirm hotel check-in/out times' },
  { done: false, text: 'Add transfer pickup details' },
  { done: false, text: 'Final review with team before sending to client' },
];

const chatMessages = [
  { init: 'HM', name: 'Halie M.', text: 'Itinerary uploaded to AXUS. Flight details verified. Need to confirm hotel check-in times with Caesar Augustus.', time: 'Jun 18, 2:30pm' },
  { init: 'ES', name: 'Emily S.', text: 'I\'ll call the hotel tomorrow AM to confirm. Also — should we add the Blue Grotto tour timing?', time: 'Jun 18, 4:15pm' },
  { init: 'HM', name: 'Halie M.', text: 'Yes, please add it. Client specifically requested morning slot.', time: 'Jun 19, 9:00am' },
];

const avColorsDark: Record<string, string> = { HM: 'linear-gradient(135deg,#2a1a0a,#5a3a10)', ES: 'linear-gradient(135deg,#0d1b3a,#1a3a6a)' };
const avColorsLight: Record<string, string> = { HM: 'linear-gradient(135deg,#e8cc94,#d4af6a)', ES: 'linear-gradient(135deg,#94b8e8,#6a8ed4)' };
const avTextColorsDark: Record<string, string> = { HM: 'var(--champagne)', ES: 'var(--sapphire-lt)' };
const avTextColorsLight: Record<string, string> = { HM: '#4a3a1a', ES: '#1a2a4a' };

/* Auto-rate defaults by category */
const categoryRates: Record<string, number> = {
  'Flights': 0.15,
  'Insurance Quoting': 0.5,
  'Hotels': 0.15,
  'Transfers': 0.25,
  'Concierge': 0.5,
  'AXUS Review': 1.5,
  'Touring/DMC': 1.0,
  'Admin': 0.25,
};

const HOURLY_RATE = 150;

export default function Tasks() {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const avColors = isLight ? avColorsLight : avColorsDark;
  const avTextColors = isLight ? avTextColorsLight : avTextColorsDark;
  const [panelOpen, setPanelOpen] = useState(false);
  const [checkState, setCheckState] = useState(checklist.map(c => c.done));
  const [autoPromptTime, setAutoPromptTime] = useState(true);

  /* Time entry modal state */
  const [timeModal, setTimeModal] = useState(false);
  const [timeModalData, setTimeModalData] = useState({
    taskTitle: '',
    hours: '',
    rate: HOURLY_RATE.toString(),
    client: '',
    billableType: 'Billable' as 'Billable' | 'Retainer',
  });

  /* Travel documents state */
  const [travelDocsOpen, setTravelDocsOpen] = useState(false);
  const [passportExpiry, setPassportExpiry] = useState('');
  const [passportVerified, setPassportVerified] = useState(false);
  const [visaRequired, setVisaRequired] = useState(false);
  const [visaType, setVisaType] = useState('');
  const [visaStatus, setVisaStatus] = useState('N/A');

  /* Show time entry popup */
  const showTimePrompt = (taskTitle: string, category?: string, client?: string) => {
    if (!autoPromptTime) return;
    const autoHours = category && categoryRates[category] ? categoryRates[category] : 0.25;
    setTimeModalData({
      taskTitle,
      hours: autoHours.toString(),
      rate: HOURLY_RATE.toString(),
      client: client || '',
      billableType: 'Billable',
    });
    setTimeModal(true);
  };

  /* Handle task card checkbox click */
  const handleTaskComplete = (task: Task, e: React.MouseEvent) => {
    e.stopPropagation();
    showTimePrompt(task.title, task.category, task.client);
  };

  /* Handle checklist item completion */
  const handleChecklistToggle = (index: number) => {
    const wasChecked = checkState[index];
    setCheckState(s => s.map((v, j) => j === index ? !v : v));
    if (!wasChecked) {
      showTimePrompt(checklist[index].text, undefined, 'Holland');
    }
  };

  return (
    <div style={{ padding: 28, overflowY: 'auto', flex: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 className="playfair" style={{ fontSize: 26, fontWeight: 400, letterSpacing: 0.5 }}>Tasks</h1>
          <p style={{ fontSize: 11, color: 'var(--slate)', marginTop: 4, letterSpacing: 0.5 }}>All advisors · 22 active · 3 overdue · Board view</p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {/* Auto-prompt time entry toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginRight: 8, padding: '5px 10px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8 }}>
            <span style={{ fontSize: 10, color: autoPromptTime ? 'var(--champagne)' : 'var(--slate)', letterSpacing: 0.3 }}>Auto-prompt time entry</span>
            <div
              className={`toggle${autoPromptTime ? ' on' : ''}`}
              onClick={() => setAutoPromptTime(p => !p)}
              style={{ width: 30, height: 16 }}
            />
          </div>
          <select className="td-input" style={{ width: 120, fontSize: 10, padding: '6px 10px' }}><option>All Trips</option></select>
          <select className="td-input" style={{ width: 120, fontSize: 10, padding: '6px 10px' }}>
            <option>All Advisors</option>
            <option>Halie McGee</option>
            <option>Emily Stone</option>
          </select>
          <button className="btn btn-champ" onClick={() => setPanelOpen(true)}>+ New Task</button>
        </div>
      </div>

      {/* Task Board */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
        {columns.map((col, ci) => (
          <div key={ci} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: 1.5, textTransform: 'uppercase', color: col.ruby ? 'var(--ruby-lt)' : 'var(--ivory-dim)' }}>{col.title}</span>
              <span style={{ fontSize: 9, padding: '2px 7px', borderRadius: 8, background: col.ruby ? (isLight ? 'rgba(122,26,26,0.15)' : 'rgba(155,58,58,0.2)') : 'var(--bg4)', color: col.ruby ? (isLight ? '#7a1a1a' : 'var(--ruby-lt)') : 'var(--slate)' }}>{col.count}</span>
            </div>
            <div style={{ padding: 10, display: 'flex', flexDirection: 'column', gap: 8, minHeight: 160 }}>
              {col.tasks.map((t, ti) => (
                <div key={ti} className="task-card" onClick={() => setPanelOpen(true)}
                  style={{ borderColor: t.border || 'var(--border)', opacity: col.title === 'COMPLETED' ? 0.7 : 1 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 6 }}>
                    {/* Completion checkbox */}
                    {col.title !== 'COMPLETED' && (
                      <div
                        className="cl-check"
                        onClick={(e) => handleTaskComplete(t, e)}
                        style={{ marginTop: 1, flexShrink: 0 }}
                      />
                    )}
                    {col.title === 'COMPLETED' && (
                      <div className="cl-check done" style={{ marginTop: 1, flexShrink: 0 }}>
                        <span style={{ fontSize: 9, color: 'white' }}>&#10003;</span>
                      </div>
                    )}
                    <div style={{ fontSize: 12, color: 'var(--ivory)', fontWeight: 400, lineHeight: 1.4 }}>{t.title}</div>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 8, marginLeft: 24 }}>
                    <span style={{ fontSize: 9, padding: '2px 7px', borderRadius: 5, background: 'var(--champ-dim)', color: 'var(--champagne)' }}>{t.trip}</span>
                    {t.tags?.map((tag, i) => (
                      <span key={i} style={{ fontSize: 9, padding: '2px 7px', borderRadius: 5, background: tag.includes('Overdue') ? (isLight ? 'rgba(122,26,26,0.15)' : 'rgba(155,58,58,0.3)') : 'var(--bg5)', color: tag.includes('Overdue') ? (isLight ? '#7a1a1a' : 'var(--ruby-lt)') : 'var(--slate)' }}>{tag}</span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginLeft: 24 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {t.done ? <span style={{ fontSize: 9, color: 'var(--slate)' }}>{t.done}</span> :
                        <span style={{ fontSize: 9, color: t.dueClass === 'overdue' ? 'var(--ruby-lt)' : t.dueClass === 'today' ? 'var(--champagne)' : 'var(--slate)' }}>Due: {t.due}</span>}
                      {t.attach && <span style={{ fontSize: 9, color: 'var(--slate)' }}>&#128206; {t.attach}</span>}
                      {t.comments && <span style={{ fontSize: 9, color: 'var(--slate)' }}>&#128172; {t.comments}</span>}
                    </div>
                    <div style={{ display: 'flex' }}>
                      {t.assignees.map((a, i) => (
                        <div key={i} style={{ width: 20, height: 20, borderRadius: '50%', background: avColors[a], border: '1.5px solid var(--bg3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, color: avTextColors[a], fontWeight: 500, marginLeft: i > 0 ? -4 : 0 }}>{a}</div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Task Detail Panel */}
      <div className={`task-detail${panelOpen ? ' open' : ''}`}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexShrink: 0 }}>
          <textarea className="playfair" style={{ fontSize: 20, fontWeight: 400, color: 'var(--ivory)', background: 'transparent', border: 'none', outline: 'none', width: '100%', resize: 'none', lineHeight: 1.4, fontFamily: "'Playfair Display',serif" }} defaultValue="AXUS Review — Holland Capri Itinerary" rows={2} />
          <button onClick={() => setPanelOpen(false)} style={{ width: 28, height: 28, borderRadius: 6, background: 'var(--bg3)', border: '1px solid var(--border)', cursor: 'pointer', color: 'var(--slate)', fontSize: 14, flexShrink: 0 }}>&#10005;</button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          {/* Fields */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
            <div><div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--slate)', marginBottom: 6 }}>Trip</div>
              <select className="td-input"><option>Capri [Augusta Holland]</option></select></div>
            <div><div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--slate)', marginBottom: 6 }}>Assigned To</div>
              <select className="td-input"><option>Halie McGee</option><option>Emily Stone</option></select></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
            <div><div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--slate)', marginBottom: 6 }}>Start Date</div>
              <input className="td-input" type="date" defaultValue="2026-06-18" /></div>
            <div><div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--slate)', marginBottom: 6 }}>Due Date</div>
              <input className="td-input" type="date" defaultValue="2026-06-21" /></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
            <div><div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--slate)', marginBottom: 6 }}>Priority</div>
              <select className="td-input"><option>High</option><option>Urgent</option><option>Normal</option><option>Low</option></select></div>
            <div><div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--slate)', marginBottom: 6 }}>Status</div>
              <select className="td-input"><option>In Progress</option><option>To Do</option><option>Blocked</option><option>Done</option></select></div>
          </div>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--slate)', marginBottom: 6 }}>Tags / Category</div>
            <input className="td-input" defaultValue="AXUS Review, Itinerary, Pre-Departure" />
          </div>

          {/* Assignees */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--slate)', marginBottom: 6 }}>Also Assign To</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {[{ init: 'HM', color: 'var(--champagne)', border: 'rgba(212,175,106,0.2)' }, { init: 'ES', color: 'var(--sapphire-lt)', border: 'rgba(74,134,232,0.2)' }].map((a, i) => (
                <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 6, background: 'var(--bg3)', border: `1px solid ${a.border}`, fontSize: 10, color: a.color }}>
                  <span style={{ width: 14, height: 14, borderRadius: '50%', background: avColors[a.init], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 7, color: avTextColors[a.init] }}>{a.init}</span>
                  {a.init}
                </span>
              ))}
              <span style={{ display: 'inline-flex', alignItems: 'center', padding: '4px 10px', borderRadius: 6, border: '1px dashed var(--border)', fontSize: 10, color: 'var(--slate)', cursor: 'pointer' }}>+ Tag member</span>
            </div>
          </div>

          {/* Repeat */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <span style={{ fontSize: 11, color: 'var(--ivory-dim)' }}>Repeat</span>
            <div className="toggle" onClick={e => e.currentTarget.classList.toggle('on')} />
          </div>

          {/* ── Travel Documents (collapsible) ── */}
          <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--slate)', margin: '16px 0 10px', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => setTravelDocsOpen(p => !p)}>
            <span style={{ flex: 1, height: 1, background: 'var(--border2)' }} />
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 11, transition: 'transform 0.2s', display: 'inline-block', transform: travelDocsOpen ? 'rotate(0deg)' : 'rotate(-90deg)', color: 'var(--champagne)' }}>&#9660;</span>
              TRAVEL DOCUMENTS
            </span>
            <span style={{ flex: 1, height: 1, background: 'var(--border2)' }} />
          </div>
          {travelDocsOpen && (
            <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: 16, marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: 'var(--champagne)', fontWeight: 500, marginBottom: 12, letterSpacing: 0.5 }}>Passport & Visa Check</div>

              {/* Passport Expiry Date */}
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--slate)', marginBottom: 6 }}>Passport Expiry Date</div>
                <input
                  className="td-input"
                  type="text"
                  placeholder="e.g. Mar 2027"
                  value={passportExpiry}
                  onChange={e => setPassportExpiry(e.target.value)}
                  style={{ maxWidth: 200 }}
                />
              </div>

              {/* Passport verified */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div
                  className={`cl-check${passportVerified ? ' done' : ''}`}
                  onClick={() => setPassportVerified(p => !p)}
                >
                  {passportVerified && <span style={{ fontSize: 9, color: 'white' }}>&#10003;</span>}
                </div>
                <span style={{ fontSize: 12, color: passportVerified ? 'var(--emerald-lt)' : 'var(--ivory-dim)' }}>Passport verified valid for travel</span>
              </div>

              {/* Visa Required toggle */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <span style={{ fontSize: 11, color: 'var(--ivory-dim)' }}>Visa Required</span>
                <div
                  className={`toggle${visaRequired ? ' on' : ''}`}
                  onClick={() => setVisaRequired(p => !p)}
                />
                <span style={{ fontSize: 10, color: visaRequired ? 'var(--emerald-lt)' : 'var(--slate)' }}>{visaRequired ? 'Yes' : 'No'}</span>
              </div>

              {/* Visa details (conditional) */}
              {visaRequired && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, paddingLeft: 8, borderLeft: '2px solid var(--border)' }}>
                  <div>
                    <div style={{ fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--slate)', marginBottom: 6 }}>Visa Type Needed</div>
                    <input
                      className="td-input"
                      type="text"
                      placeholder="e.g. Tourist Visa"
                      value={visaType}
                      onChange={e => setVisaType(e.target.value)}
                    />
                  </div>
                  <div>
                    <div style={{ fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--slate)', marginBottom: 6 }}>Visa Status</div>
                    <select className="td-input" value={visaStatus} onChange={e => setVisaStatus(e.target.value)}>
                      <option value="N/A">N/A</option>
                      <option value="Not Started">Not Started</option>
                      <option value="Applied">Applied</option>
                      <option value="Approved">Approved</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Checklist */}
          <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--slate)', margin: '16px 0 10px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ flex: 1, height: 1, background: 'var(--border2)' }} />CHECKLIST<span style={{ flex: 1, height: 1, background: 'var(--border2)' }} />
          </div>
          {checklist.map((c, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--border2)' }}>
              <div className={`cl-check${checkState[i] ? ' done' : ''}`} onClick={() => handleChecklistToggle(i)}>
                {checkState[i] && <span style={{ fontSize: 9, color: 'white' }}>&#10003;</span>}
              </div>
              <span style={{ fontSize: 12, color: checkState[i] ? 'var(--slate)' : 'var(--ivory-dim)', flex: 1, textDecoration: checkState[i] ? 'line-through' : 'none' }}>{c.text}</span>
            </div>
          ))}
          <div style={{ fontSize: 11, color: 'var(--slate)', cursor: 'pointer', padding: '8px 0', marginBottom: 14 }} onMouseEnter={e => (e.currentTarget.style.color = 'var(--champagne)')} onMouseLeave={e => (e.currentTarget.style.color = 'var(--slate)')}>+ Add checklist item</div>

          {/* Attachments */}
          <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--slate)', margin: '16px 0 10px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ flex: 1, height: 1, background: 'var(--border2)' }} />ATTACHMENTS<span style={{ flex: 1, height: 1, background: 'var(--border2)' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 4 }}>
            {[{ name: '\u{1F4C4} Holland_Capri_Itinerary.pdf', size: '1.2MB' }, { name: '\u{1F4CB} AXUS_Review_Notes.docx', size: '45KB' }].map((f, i) => (
              <div key={i} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, padding: 10, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 11, color: 'var(--ivory-dim)' }}>{f.name}<span style={{ fontSize: 9, color: 'var(--slate)', marginLeft: 'auto' }}>{f.size}</span></div>
            ))}
          </div>
          <div style={{ border: '1px dashed var(--border)', borderRadius: 8, padding: 16, textAlign: 'center', fontSize: 11, color: 'var(--slate)', cursor: 'pointer', marginTop: 8 }} onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--champagne)'; e.currentTarget.style.color = 'var(--champagne)'; }} onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--slate)'; }}>&#8593; Drop files or click to upload</div>

          {/* Team Chat */}
          <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--slate)', margin: '16px 0 10px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ flex: 1, height: 1, background: 'var(--border2)' }} />TEAM CHAT<span style={{ flex: 1, height: 1, background: 'var(--border2)' }} />
          </div>
          {chatMessages.map((m, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', flexShrink: 0, background: avColors[m.init], border: `1px solid ${m.init === 'HM' ? 'rgba(212,175,106,0.2)' : 'rgba(74,134,232,0.2)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: avTextColors[m.init] }}>{m.init}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 10, color: m.init === 'HM' ? 'var(--champagne)' : 'var(--sapphire-lt)', fontWeight: 500, marginBottom: 4 }}>{m.name}</div>
                <div className="chat-bubble">{m.text}</div>
                <div style={{ fontSize: 9, color: 'var(--slate)', marginTop: 4 }}>{m.time}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Chat input */}
        <div style={{ padding: '12px 24px', borderTop: '1px solid var(--border)', flexShrink: 0, background: 'var(--bg2)', display: 'flex', gap: 8 }}>
          <input className="td-input" style={{ flex: 1, borderRadius: 20, padding: '8px 16px', fontSize: 11 }} placeholder="Type a message..." />
          <button className="btn btn-champ btn-sm">Send</button>
        </div>
      </div>

      {/* ═══ Time Entry Modal ═══ */}
      {timeModal && (
        <>
          <div onClick={() => setTimeModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200 }} />
          <div style={{
            position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            width: 440, background: 'var(--bg2)', border: '1px solid var(--border)',
            borderRadius: 12, zIndex: 201, boxShadow: 'var(--shadow)',
          }}>
            <div className="card-h">
              <span className="card-t">Log Time for This Task?</span>
              <button
                onClick={() => setTimeModal(false)}
                style={{ width: 24, height: 24, borderRadius: 6, background: 'var(--bg3)', border: '1px solid var(--border)', cursor: 'pointer', color: 'var(--slate)', fontSize: 12 }}
              >&#10005;</button>
            </div>
            <div style={{ padding: 20 }}>
              <div style={{ fontSize: 12, color: 'var(--ivory)', marginBottom: 16, padding: '8px 12px', background: 'var(--bg3)', borderRadius: 8, border: '1px solid var(--border)' }}>
                {timeModalData.taskTitle}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--slate)', marginBottom: 6 }}>Hours</div>
                  <input
                    className="td-input"
                    value={timeModalData.hours}
                    onChange={e => setTimeModalData(d => ({ ...d, hours: e.target.value }))}
                  />
                </div>
                <div>
                  <div style={{ fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--slate)', marginBottom: 6 }}>Rate ($/hr)</div>
                  <input
                    className="td-input"
                    value={timeModalData.rate}
                    onChange={e => setTimeModalData(d => ({ ...d, rate: e.target.value }))}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--slate)', marginBottom: 6 }}>Client</div>
                  <input
                    className="td-input"
                    value={timeModalData.client}
                    onChange={e => setTimeModalData(d => ({ ...d, client: e.target.value }))}
                  />
                </div>
                <div>
                  <div style={{ fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--slate)', marginBottom: 6 }}>Billable Type</div>
                  <div style={{ display: 'flex', gap: 0, borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border)' }}>
                    {(['Billable', 'Retainer'] as const).map(bt => (
                      <button
                        key={bt}
                        onClick={() => setTimeModalData(d => ({ ...d, billableType: bt }))}
                        style={{
                          flex: 1,
                          padding: '9px 12px',
                          fontSize: 11,
                          fontFamily: 'Jost',
                          fontWeight: 400,
                          cursor: 'pointer',
                          border: 'none',
                          background: timeModalData.billableType === bt ? 'var(--champagne)' : 'var(--bg3)',
                          color: timeModalData.billableType === bt ? 'var(--bg)' : 'var(--slate)',
                          transition: 'all 0.15s',
                        }}
                      >
                        {bt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Estimated amount */}
              <div style={{ padding: '10px 12px', background: 'var(--bg3)', borderRadius: 8, border: '1px solid var(--border)', marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 10, color: 'var(--slate)', letterSpacing: 0.5 }}>Estimated Amount</span>
                <span className="playfair" style={{ fontSize: 18, color: 'var(--champagne)' }}>
                  ${((parseFloat(timeModalData.hours) || 0) * (parseFloat(timeModalData.rate) || 0)).toFixed(2)}
                </span>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  className="btn btn-champ"
                  style={{ flex: 1 }}
                  onClick={() => setTimeModal(false)}
                >
                  Log & Complete
                </button>
                <button
                  className="btn btn-ghost"
                  style={{ flex: 1 }}
                  onClick={() => setTimeModal(false)}
                >
                  Skip
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
