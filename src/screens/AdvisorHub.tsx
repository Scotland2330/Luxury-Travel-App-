import { useState } from 'react';

/* ───── Types ───── */
type Channel = 'general' | 'hotels' | 'restaurants' | 'destinations' | 'workflows' | 'wins';

interface Thread {
  id: number;
  channel: Channel;
  author: string;
  initials: string;
  role: string;
  time: string;
  title: string;
  body: string;
  replies: Reply[];
  pinned?: boolean;
  reactions: { label: string; count: number }[];
  tags: string[];
}

interface Reply {
  author: string;
  initials: string;
  text: string;
  time: string;
  reactions?: { label: string; count: number }[];
}

/* ───── Constants ───── */
const channels: { id: Channel; label: string; icon: string; desc: string }[] = [
  { id: 'general', label: 'General', icon: '◈', desc: 'Agency-wide discussions' },
  { id: 'hotels', label: 'Hotel Intel', icon: '✦', desc: 'Property reviews & tips' },
  { id: 'restaurants', label: 'Restaurant Finds', icon: '◆', desc: 'Dining recommendations' },
  { id: 'destinations', label: 'Destination Notes', icon: '◫', desc: 'Destination guides & logistics' },
  { id: 'workflows', label: 'Workflows & SOPs', icon: '☑', desc: 'Process improvements' },
  { id: 'wins', label: 'Client Wins', icon: '★', desc: 'Celebrate great outcomes' },
];

const channelColors: Record<Channel, string> = {
  general: 'var(--champagne)',
  hotels: 'var(--sapphire-lt)',
  restaurants: 'var(--emerald-lt)',
  destinations: 'var(--amethyst)',
  workflows: 'var(--cognac-lt)',
  wins: 'var(--champagne)',
};

function avatarGradient(initials: string): string {
  const map: Record<string, string> = {
    HM: 'linear-gradient(135deg, var(--champagne), var(--cognac-lt))',
    ES: 'linear-gradient(135deg, var(--sapphire-lt), var(--amethyst))',
    JK: 'linear-gradient(135deg, var(--emerald-lt), var(--sapphire-lt))',
    PT: 'linear-gradient(135deg, var(--amethyst), var(--ruby-lt))',
    MW: 'linear-gradient(135deg, var(--cognac-lt), var(--champagne))',
  };
  return map[initials] || 'linear-gradient(135deg, var(--champagne), var(--cognac-lt))';
}

/* ───── Seed Data ───── */
const seedThreads: Thread[] = [
  {
    id: 1, channel: 'general', author: 'Halie M.', initials: 'HM', role: 'Senior Advisor',
    time: '2 hours ago', pinned: true,
    title: 'Team meeting notes — July planning',
    body: 'Quick recap from today\'s call:\n\n1. Peak season is here — please double-check all July/August transfer confirmations by end of week.\n2. We\'re switching our insurance provider from Arch to Allianz starting August 1. I\'ll share the new workflow once it\'s finalized.\n3. Emily wants everyone to start logging client preferences in the portal (not just in your notes). This helps when clients get reassigned or when we need coverage.\n4. Reminder: FAM trip to Aman Venice is Sept 12-15. Let me know by Friday if you want a spot.\n\nAnything I missed, drop it below.',
    replies: [
      { author: 'Emily S.', initials: 'ES', text: 'Can we also discuss the retainer renewal process? I have 3 coming up in August and want to make sure we\'re all using the same approach.', time: '1 hour ago' },
      { author: 'Jordan K.', initials: 'JK', text: 'Interested in the Venice FAM. Putting my name in. Also — can someone share the Allianz contact? Want to get ahead of the switch.', time: '45 min ago' },
      { author: 'Halie M.', initials: 'HM', text: '@Jordan — I\'ll send over the Allianz contact this afternoon. And yes @Emily, let\'s add retainer renewal to next week\'s agenda.', time: '30 min ago' },
    ],
    reactions: [{ label: '👍', count: 4 }, { label: '📌', count: 2 }],
    tags: ['team', 'planning'],
  },
  {
    id: 2, channel: 'hotels', author: 'Emily S.', initials: 'ES', role: 'Advisor',
    time: '5 hours ago',
    title: 'Has anyone booked Belmond Caruso recently?',
    body: 'I have a couple requesting Belmond Caruso in Ravello for August. Last time I booked there (2024) the service was incredible but I\'ve heard mixed things lately about the renovation.\n\nSpecifically:\n- Are the infinity pool renovations done?\n- Which room categories are affected?\n- Is it still worth booking or should I steer them to San Pietro in Positano instead?\n\nAny recent intel would be really helpful.',
    replies: [
      { author: 'Marcus W.', initials: 'MW', text: 'I had clients there 3 weeks ago. Renovation is fully done — pool area looks amazing. Rooms in the main building are perfect. Avoid the Garden Rooms though, they\'re smaller than listed and some still had noise from construction finishing nearby. Suite 301 and above are excellent.', time: '4 hours ago', reactions: [{ label: '🙏', count: 3 }] },
      { author: 'Priya T.', initials: 'PT', text: 'Seconding Marcus. My clients the Taylors were there last month in a Junior Suite and loved it. The restaurant terrace is still one of the best dinner settings on the Amalfi Coast. That said, if your couple wants beach access, San Pietro is better — Caruso is a 15-min drive to any beach.', time: '3 hours ago' },
      { author: 'Emily S.', initials: 'ES', text: 'This is exactly what I needed. Going with Caruso, Suite 301 request. Thank you both!', time: '2 hours ago' },
    ],
    reactions: [{ label: '🏨', count: 2 }],
    tags: ['Amalfi Coast', 'Belmond'],
  },
  {
    id: 3, channel: 'restaurants', author: 'Priya T.', initials: 'PT', role: 'Advisor',
    time: '1 day ago',
    title: 'Hidden gem in Florence — book this NOW',
    body: 'Just discovered Buca Mario through our Florence DMC. It\'s been open since 1886 and somehow none of us have been sending clients there.\n\nWhy it\'s great: authentic Florentine bistecca, zero tourist crowds, incredible wine cellar, and the staff treats every guest like family. Table 4 in the back room is the move — private and atmospheric.\n\nReservation tip: they don\'t use a booking platform. Call directly, speak to Giovanni, mention you\'re sending luxury clients. He\'ll take care of everything.\n\nBudget: 80-120 EUR per couple. A fraction of what Enoteca Pinchiorri charges with arguably better food.',
    replies: [
      { author: 'Halie M.', initials: 'HM', text: 'Adding this to my Florence master list immediately. Do they accommodate dietary restrictions? I have a celiac client heading there in September.', time: '20 hours ago' },
      { author: 'Priya T.', initials: 'PT', text: '@Halie — Yes! Giovanni is very accommodating. Just let him know when you call. They have a separate GF menu they don\'t always advertise.', time: '18 hours ago' },
    ],
    reactions: [{ label: '🍝', count: 5 }, { label: '🔖', count: 3 }],
    tags: ['Florence', 'Italian dining'],
  },
  {
    id: 4, channel: 'workflows', author: 'Jordan K.', initials: 'JK', role: 'Senior Advisor',
    time: '1 day ago',
    title: 'New pre-departure checklist — feedback wanted',
    body: 'I\'ve been refining our pre-departure process and want to standardize it across the team. Here\'s what I\'m proposing:\n\nT-30 days: Final itinerary review with client\nT-21 days: Send packing list + destination guide\nT-14 days: Confirm all reservations (hotels, restaurants, transfers)\nT-10 days: Insurance policy reminder if not yet purchased\nT-7 days: Send final docs package + emergency contacts\nT-3 days: Personal call from advisor with last-minute tips\nT-1 day: Text message with Day 1 logistics\n\nI\'ve built this as a workflow template in Templates Hub. Does this cadence work for everyone, or are there steps I\'m missing?',
    replies: [
      { author: 'Halie M.', initials: 'HM', text: 'Love this. I\'d add a T-48 hour check on weather and any last-minute restaurant closures (Italy is notorious for random closures). Also, are we texting the Day 1 logistics or emailing? I think text lands better.', time: '22 hours ago' },
      { author: 'Marcus W.', initials: 'MW', text: 'This is great, Jordan. For the T-7 package, I also include a small gift — a destination-themed item. Creates a wow moment before they even leave. Cost is $40-60 per client but the feedback has been amazing.', time: '18 hours ago' },
      { author: 'Jordan K.', initials: 'JK', text: 'Great additions from both of you. Updating the template now. @Halie — agree on text for Day 1. @Marcus — love the gift idea, going to start incorporating that.', time: '16 hours ago' },
    ],
    reactions: [{ label: '✅', count: 4 }, { label: '💡', count: 2 }],
    tags: ['process', 'pre-departure'],
  },
  {
    id: 5, channel: 'wins', author: 'Marcus W.', initials: 'MW', role: 'Lead Advisor',
    time: '2 days ago',
    title: 'The Nakamura family just sent this',
    body: '"Marcus — we genuinely cannot thank you enough. The cherry blossom timing was perfect, the ryokan in Hakone was a once-in-a-lifetime experience, and the private tea ceremony you arranged in Kyoto had us all in tears. Our family will talk about this trip for the rest of our lives. We\'ve already told 4 families about you."\n\nThis started as a referral from the Changs last November. 14-day Japan itinerary, family of 5, $52K total spend. Every single element landed exactly as planned.\n\nSharing because it\'s a reminder that the details matter. The tea ceremony was a $200 add-on that I almost cut from the budget. It ended up being the highlight of their entire trip.',
    replies: [
      { author: 'Halie M.', initials: 'HM', text: 'This is incredible, Marcus. And that last point about the tea ceremony — such a good lesson. The moments that feel like \"extras\" are often the ones clients remember most.', time: '1 day ago' },
      { author: 'Emily S.', initials: 'ES', text: '4 referrals from one trip! That\'s the dream. Well deserved. I want to hear more about the ryokan — was it Gora Kadan?', time: '1 day ago' },
      { author: 'Marcus W.', initials: 'MW', text: '@Emily — yes, Gora Kadan. The kaiseki dinner alone is worth the stay. I\'ll post a detailed breakdown in the Hotels channel.', time: '1 day ago' },
    ],
    reactions: [{ label: '🎉', count: 7 }, { label: '❤️', count: 5 }],
    tags: ['Japan', 'referrals'],
  },
  {
    id: 6, channel: 'destinations', author: 'Halie M.', initials: 'HM', role: 'Senior Advisor',
    time: '3 days ago',
    title: 'Greece 2026 — what\'s changed this season',
    body: 'I\'ve sent 8 groups to Greece already this summer. Here\'s what\'s different:\n\n• Santorini cap on cruise ships is being enforced — actually less crowded on non-cruise days now\n• New direct flight from JFK to Athens on Delta (started June 1) — game changer for itinerary timing\n• Milos is officially \"discovered\" — book 4+ months ahead or forget it\n• Villa Katikies in Santorini changed management — quality seems to have dipped. I\'d go Canaves Oia instead\n• Mykonos restaurant scene: Nobu finally opened, reservations through hotel concierge only\n\nHappy to answer specific questions if anyone has Greek trips coming up.',
    replies: [
      { author: 'Jordan K.', initials: 'JK', text: 'The Delta direct flight is huge. Saves my clients the dreaded connection through Istanbul or Frankfurt. What time does it land? I want to know if same-day connections to the islands are realistic.', time: '2 days ago' },
      { author: 'Halie M.', initials: 'HM', text: '@Jordan — lands at 10:45am local. Aegean has 1pm and 3pm flights to Santorini/Mykonos, so yes, same-day connections work perfectly. I build in a VIP airport assist at ATH for smooth transfers.', time: '2 days ago' },
    ],
    reactions: [{ label: '🇬🇷', count: 4 }, { label: '✈️', count: 3 }],
    tags: ['Greece', 'seasonal update'],
  },
  {
    id: 7, channel: 'general', author: 'Emily S.', initials: 'ES', role: 'Advisor',
    time: '4 days ago',
    title: 'How is everyone handling the credit card authorization process?',
    body: 'I keep running into friction with the CC auth process for hotels. Some properties want the form emailed, others want it faxed (seriously, in 2026), and a few only accept it through their own portal.\n\nIs anyone using a standardized approach? I feel like I\'m reinventing the wheel every time.\n\nAlso — how do you handle it when clients are uncomfortable sharing CC details over email? I totally get their concern.',
    replies: [
      { author: 'Priya T.', initials: 'PT', text: 'I use the secure document sharing in the Client Portal now. Clients upload their CC auth there, I download and send to the hotel. Way better than email chains. For hotels that want their own form, I pre-fill everything except the CC number and have the client complete it on a video call.', time: '3 days ago', reactions: [{ label: '💡', count: 4 }] },
      { author: 'Marcus W.', initials: 'MW', text: 'What Priya said. The portal is the way to go. I also keep a spreadsheet of each hotel\'s preferred method (email/fax/portal) so I\'m not figuring it out every time. Happy to share it.', time: '3 days ago' },
      { author: 'Emily S.', initials: 'ES', text: 'Both great ideas. @Marcus yes please share that spreadsheet — that would save so much time. @Priya the video call approach is smart for the security-conscious clients.', time: '2 days ago' },
    ],
    reactions: [{ label: '🔒', count: 2 }],
    tags: ['process', 'CC authorization'],
  },
  {
    id: 8, channel: 'hotels', author: 'Jordan K.', initials: 'JK', role: 'Senior Advisor',
    time: '5 days ago',
    title: 'Four Seasons Maui — post-renovation honest take',
    body: 'Just completed a site visit. The renovation is beautiful but there are things to be aware of:\n\nPros:\n- Pool area completely redesigned — cabanas are now true private spaces\n- New adults-only pool on the south terrace\n- Spago rebranded as a seafood concept, much better menu\n- Suite bathrooms are stunning — double rain showers, soaking tubs with ocean views\n\nCons:\n- Still occasional construction noise near the north wing until September\n- Rates jumped 20% post-renovation\n- Pool service is overwhelmed — flagging staff for drinks takes longer than it should\n- The kids club hours were reduced (closes at 6pm now instead of 8pm)\n\nBottom line: worth it for couples and honeymooners. For families, I\'d wait until October when construction fully wraps and kids club presumably extends hours again.',
    replies: [
      { author: 'Halie M.', initials: 'HM', text: 'Thank you for the honest take. The kids club hours are a dealbreaker for my family clients — that 6-8pm window is when parents want dinner alone. Will wait until October for family bookings.', time: '4 days ago' },
    ],
    reactions: [{ label: '🏝️', count: 3 }, { label: '📝', count: 2 }],
    tags: ['Hawaii', 'Four Seasons', 'renovations'],
  },
];

/* ═══════════════════════════════════ Component ═══════════════════════════════════ */

export default function AdvisorHub() {
  const [activeChannel, setActiveChannel] = useState<Channel | 'all'>('all');
  const [search, setSearch] = useState('');
  const [expandedReplies, setExpandedReplies] = useState<Set<number>>(new Set([1]));
  const [showCompose, setShowCompose] = useState(false);

  const filtered = seedThreads.filter(t => {
    if (activeChannel !== 'all' && t.channel !== activeChannel) return false;
    if (search) {
      const q = search.toLowerCase();
      return t.title.toLowerCase().includes(q) || t.body.toLowerCase().includes(q) || t.author.toLowerCase().includes(q) || t.tags.some(tag => tag.toLowerCase().includes(q));
    }
    return true;
  });

  const pinnedThreads = filtered.filter(t => t.pinned);
  const regularThreads = filtered.filter(t => !t.pinned);

  return (
    <div style={{ padding: 28, overflowY: 'auto', flex: 1 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 className="playfair" style={{ fontSize: 26, fontWeight: 400, letterSpacing: 0.5 }}>Advisor Hub</h1>
          <p style={{ fontSize: 11, color: 'var(--slate)', marginTop: 4 }}>
            Internal knowledge sharing &middot; Team discussions &middot; Best practices
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input
            className="td-input"
            placeholder="Search discussions..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: 220 }}
          />
          <button className="btn btn-champ" onClick={() => setShowCompose(!showCompose)}>
            {showCompose ? 'Cancel' : '+ Start Discussion'}
          </button>
        </div>
      </div>

      {/* Compose panel */}
      {showCompose && (
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="card-h"><span className="card-t">New Discussion</span></div>
          <div className="card-b" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ flex: 2 }}>
                <div style={{ fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--slate)', marginBottom: 4 }}>Topic</div>
                <input className="td-input" placeholder="What do you want to discuss?" style={{ fontSize: 11 }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--slate)', marginBottom: 4 }}>Channel</div>
                <select className="td-input" style={{ fontSize: 11 }}>
                  {channels.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--slate)', marginBottom: 4 }}>Message</div>
              <textarea className="td-input" placeholder="Share your question, recommendation, or update..." rows={4} style={{ fontSize: 11, resize: 'vertical' }} />
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--slate)', marginBottom: 4 }}>Tags (optional)</div>
                <input className="td-input" placeholder="e.g., Italy, Belmond, process" style={{ fontSize: 11 }} />
              </div>
              <div style={{ display: 'flex', gap: 8, alignSelf: 'flex-end' }}>
                <button className="btn btn-ghost" onClick={() => setShowCompose(false)}>Cancel</button>
                <button className="btn btn-champ">Post</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main layout: channels sidebar + feed */}
      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 20 }}>
        {/* Channel sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ fontSize: 8, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--slate-dim)', padding: '0 8px', marginBottom: 6 }}>Channels</div>
          <div
            onClick={() => setActiveChannel('all')}
            style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderRadius: 8,
              background: activeChannel === 'all' ? 'var(--champ-dim)' : 'transparent',
              border: activeChannel === 'all' ? '1px solid rgba(59,154,156,0.18)' : '1px solid transparent',
              color: activeChannel === 'all' ? 'var(--champagne)' : 'var(--slate)',
              fontSize: 11, cursor: 'pointer', transition: 'all 0.15s',
            }}
          >
            <span style={{ fontSize: 12, width: 16, textAlign: 'center' }}>◈</span>
            All Discussions
          </div>
          {channels.map(ch => (
            <div
              key={ch.id}
              onClick={() => setActiveChannel(ch.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderRadius: 8,
                background: activeChannel === ch.id ? 'var(--champ-dim)' : 'transparent',
                border: activeChannel === ch.id ? '1px solid rgba(59,154,156,0.18)' : '1px solid transparent',
                color: activeChannel === ch.id ? 'var(--champagne)' : 'var(--slate)',
                fontSize: 11, cursor: 'pointer', transition: 'all 0.15s',
              }}
            >
              <span style={{ fontSize: 12, width: 16, textAlign: 'center' }}>{ch.icon}</span>
              {ch.label}
            </div>
          ))}

          {/* Team members */}
          <div style={{ fontSize: 8, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--slate-dim)', padding: '0 8px', marginTop: 20, marginBottom: 6 }}>Team</div>
          {[
            { name: 'Halie M.', initials: 'HM', status: 'online' },
            { name: 'Emily S.', initials: 'ES', status: 'online' },
            { name: 'Jordan K.', initials: 'JK', status: 'away' },
            { name: 'Priya T.', initials: 'PT', status: 'online' },
            { name: 'Marcus W.', initials: 'MW', status: 'offline' },
          ].map(member => (
            <div key={member.name} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px' }}>
              <div style={{ position: 'relative' }}>
                <div style={{
                  width: 24, height: 24, borderRadius: '50%',
                  background: avatarGradient(member.initials),
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 9, color: 'var(--bg)', fontWeight: 600,
                }}>{member.initials}</div>
                <div style={{
                  position: 'absolute', bottom: -1, right: -1,
                  width: 8, height: 8, borderRadius: '50%',
                  background: member.status === 'online' ? 'var(--emerald-lt)' : member.status === 'away' ? 'var(--cognac-lt)' : 'var(--slate-dim)',
                  border: '2px solid var(--bg2)',
                }} />
              </div>
              <span style={{ fontSize: 10, color: member.status === 'offline' ? 'var(--slate-dim)' : 'var(--ivory-dim)' }}>{member.name}</span>
            </div>
          ))}
        </div>

        {/* Thread feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Channel description */}
          {activeChannel !== 'all' && (
            <div style={{
              padding: '10px 16px', background: 'var(--bg2)', border: '1px solid var(--border)',
              borderRadius: 8, display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <span style={{ fontSize: 14, color: channelColors[activeChannel] }}>{channels.find(c => c.id === activeChannel)?.icon}</span>
              <div>
                <span style={{ fontSize: 12, color: 'var(--ivory)', fontWeight: 500 }}>{channels.find(c => c.id === activeChannel)?.label}</span>
                <span style={{ fontSize: 10, color: 'var(--slate)', marginLeft: 8 }}>{channels.find(c => c.id === activeChannel)?.desc}</span>
              </div>
            </div>
          )}

          {/* Pinned threads */}
          {pinnedThreads.map(thread => renderThread(thread, true))}

          {/* Regular threads */}
          {regularThreads.map(thread => renderThread(thread, false))}

          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, color: 'var(--slate)', fontSize: 12 }}>
              No discussions found. Start a new one!
            </div>
          )}
        </div>
      </div>
    </div>
  );

  function renderThread(thread: Thread, isPinned: boolean) {
    const isExpanded = expandedReplies.has(thread.id);
    const channelInfo = channels.find(c => c.id === thread.channel);

    return (
      <div
        key={thread.id}
        style={{
          background: 'var(--bg2)',
          border: isPinned ? '1px solid rgba(59,154,156,0.25)' : '1px solid var(--border)',
          borderRadius: 12,
          overflow: 'hidden',
        }}
      >
        <div style={{ padding: '18px 20px' }}>
          {/* Pinned indicator */}
          {isPinned && (
            <div style={{ fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--champagne)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>📌</span> Pinned
            </div>
          )}

          {/* Author row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{
              width: 34, height: 34, borderRadius: '50%',
              background: avatarGradient(thread.initials),
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, color: 'var(--bg)', fontWeight: 600, flexShrink: 0,
            }}>{thread.initials}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 12, color: 'var(--ivory)', fontWeight: 500 }}>{thread.author}</span>
                <span style={{ fontSize: 10, color: 'var(--slate-dim)' }}>{thread.role}</span>
              </div>
              <div style={{ fontSize: 10, color: 'var(--slate-dim)', marginTop: 1 }}>{thread.time}</div>
            </div>
            {channelInfo && (
              <span style={{
                fontSize: 9, padding: '3px 10px', borderRadius: 12,
                background: 'var(--bg4)', border: '1px solid var(--border)',
                color: channelColors[thread.channel], letterSpacing: 0.5,
              }}>
                {channelInfo.icon} {channelInfo.label}
              </span>
            )}
          </div>

          {/* Title */}
          <div style={{ fontSize: 14, color: 'var(--ivory)', fontWeight: 500, marginBottom: 10, lineHeight: 1.4 }}>
            {thread.title}
          </div>

          {/* Body */}
          <div style={{ fontSize: 12, color: 'var(--ivory-dim)', lineHeight: 1.7, whiteSpace: 'pre-line', marginBottom: 12 }}>
            {thread.body}
          </div>

          {/* Tags */}
          {thread.tags.length > 0 && (
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 10 }}>
              {thread.tags.map(tag => (
                <span key={tag} onClick={() => setSearch(tag)} style={{
                  padding: '3px 8px', borderRadius: 6,
                  background: 'var(--bg4)', border: '1px solid var(--border)',
                  color: 'var(--ivory-dim)', fontSize: 9, cursor: 'pointer',
                }}>{tag}</span>
              ))}
            </div>
          )}

          {/* Reactions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            {thread.reactions.map((r, i) => (
              <span key={i} style={{
                padding: '3px 8px', borderRadius: 12,
                background: 'var(--bg4)', border: '1px solid var(--border2)',
                fontSize: 10, color: 'var(--ivory-dim)', cursor: 'pointer',
              }}>{r.label} {r.count}</span>
            ))}
            <span style={{
              padding: '3px 8px', borderRadius: 12,
              background: 'var(--bg4)', border: '1px solid var(--border2)',
              fontSize: 10, color: 'var(--slate)', cursor: 'pointer',
            }}>+</span>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 20px', borderTop: '1px solid var(--border2)', background: 'var(--bg3)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {thread.replies.length > 0 && (
              <div style={{ display: 'flex', marginRight: 4 }}>
                {[...new Set(thread.replies.map(r => r.initials))].slice(0, 3).map((init, i) => (
                  <div key={init} style={{
                    width: 22, height: 22, borderRadius: '50%',
                    background: avatarGradient(init),
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 8, color: 'var(--bg)', fontWeight: 600,
                    marginLeft: i > 0 ? -6 : 0, border: '2px solid var(--bg3)',
                  }}>{init}</div>
                ))}
              </div>
            )}
            <span style={{ fontSize: 10, color: 'var(--slate)' }}>
              {thread.replies.length} {thread.replies.length === 1 ? 'reply' : 'replies'}
            </span>
          </div>
          {thread.replies.length > 0 && (
            <button
              className="btn btn-ghost btn-xs"
              onClick={() => {
                const next = new Set(expandedReplies);
                if (next.has(thread.id)) next.delete(thread.id); else next.add(thread.id);
                setExpandedReplies(next);
              }}
            >
              {isExpanded ? 'Collapse' : 'View Thread'}
            </button>
          )}
        </div>

        {/* Expanded replies */}
        {isExpanded && thread.replies.length > 0 && (
          <div style={{ borderTop: '1px solid var(--border2)', background: 'var(--bg3)' }}>
            {thread.replies.map((reply, ri) => (
              <div key={ri} style={{
                display: 'flex', gap: 10, padding: '14px 20px 14px 32px',
                borderBottom: ri < thread.replies.length - 1 ? '1px solid var(--border2)' : 'none',
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: avatarGradient(reply.initials),
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, color: 'var(--bg)', fontWeight: 600, flexShrink: 0,
                }}>{reply.initials}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 11, color: 'var(--ivory)', fontWeight: 500 }}>{reply.author}</span>
                    <span style={{ fontSize: 9, color: 'var(--slate-dim)' }}>{reply.time}</span>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--ivory-dim)', lineHeight: 1.6 }}>{reply.text}</div>
                  {reply.reactions && (
                    <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
                      {reply.reactions.map((r, i) => (
                        <span key={i} style={{
                          padding: '2px 6px', borderRadius: 10,
                          background: 'var(--bg4)', border: '1px solid var(--border2)',
                          fontSize: 9, color: 'var(--ivory-dim)',
                        }}>{r.label} {r.count}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {/* Reply input */}
            <div style={{
              padding: '12px 20px 12px 32px', borderTop: '1px solid var(--border2)',
              display: 'flex', gap: 8, alignItems: 'center',
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--champagne), var(--cognac-lt))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, color: 'var(--bg)', fontWeight: 600, flexShrink: 0,
              }}>You</div>
              <input className="td-input" placeholder="Reply to this thread..." style={{ fontSize: 11, flex: 1 }} />
              <button className="btn btn-ghost btn-xs">Send</button>
            </div>
          </div>
        )}
      </div>
    );
  }
}
