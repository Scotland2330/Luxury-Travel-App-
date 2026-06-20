import { useState } from 'react';

type Category = 'All' | 'Email Templates' | 'Workflows' | 'Supplier Info' | 'Destinations' | 'Internal Docs';

interface Template {
  category: Exclude<Category, 'All'>;
  title: string;
  description: string;
  updated: string;
  used: number;
}

const categoryColors: Record<Exclude<Category, 'All'>, string> = {
  'Email Templates': 'var(--champagne)',
  'Workflows': 'var(--sapphire-lt)',
  'Supplier Info': 'var(--emerald-lt)',
  'Destinations': 'var(--amethyst)',
  'Internal Docs': 'var(--cognac-lt)',
};

const allCategories: Category[] = ['All', 'Email Templates', 'Workflows', 'Supplier Info', 'Destinations', 'Internal Docs'];

const templates: Template[] = [
  // Email Templates
  { category: 'Email Templates', title: 'Pre-Arrival Template', description: 'Standard pre-arrival email with allergies, preferences, arrival details', updated: 'Jun 10', used: 34 },
  { category: 'Email Templates', title: 'Bon Voyage Template', description: 'Client-facing departure email with first contact, key details', updated: 'Jun 5', used: 28 },
  { category: 'Email Templates', title: 'Welcome Home Template', description: 'Post-trip follow-up with feedback request', updated: 'May 28', used: 22 },
  { category: 'Email Templates', title: 'Insurance Quote Follow-up', description: '7 and 14-day follow-up after sending insurance quote', updated: 'Jun 1', used: 18 },
  { category: 'Email Templates', title: 'Retainer Renewal Messaging', description: 'Annual retainer renewal outreach template', updated: 'Apr 15', used: 8 },
  // Workflows
  { category: 'Workflows', title: 'Insurance Workflow (Multi-Stage)', description: 'Full insurance quoting pipeline: quote → send → follow-up → confirm', updated: 'Jun 12', used: 15 },
  { category: 'Workflows', title: 'How We Work Overview', description: 'Client onboarding — agency process walkthrough', updated: 'May 1', used: 12 },
  { category: 'Workflows', title: 'Client Intake Form', description: 'New client questionnaire and travel preferences', updated: 'Jun 8', used: 20 },
  { category: 'Workflows', title: 'DMC Vetting Process', description: 'Checklist for evaluating new DMC partners', updated: 'Mar 20', used: 6 },
  // Supplier Info
  { category: 'Supplier Info', title: 'Preferred Partners — Hotels', description: 'Curated list of preferred hotel partners by region', updated: 'Jun 15', used: 40 },
  { category: 'Supplier Info', title: 'Preferred Partners — DMCs', description: 'Vetted DMC contacts by destination', updated: 'Jun 10', used: 25 },
  { category: 'Supplier Info', title: 'Arch Insurance Sales Team', description: 'Contact info and submission process for Arch Insurance', updated: 'May 5', used: 12 },
  { category: 'Supplier Info', title: 'Rolzo Transfer Notes', description: 'Rolzo booking process, contact info, service blurbs', updated: 'Jun 3', used: 16 },
  // Destinations
  { category: 'Destinations', title: 'Japan Requests Template', description: 'Destination-specific draft for Japan trip inquiries', updated: 'Apr 10', used: 4 },
  { category: 'Destinations', title: 'Visa & ETA Tracking by Country', description: 'Country-by-country visa requirements and ETA processing', updated: 'Jun 18', used: 30 },
  // Internal Docs
  { category: 'Internal Docs', title: 'Flight Booking Forwarding Template', description: 'Standard template for forwarding flight confirmations', updated: 'Jun 1', used: 22 },
];

export default function TemplatesHub() {
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [search, setSearch] = useState('');

  const filtered = templates.filter(t => {
    const matchesCategory = activeCategory === 'All' || t.category === activeCategory;
    const matchesSearch = !search || t.title.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ padding: 28, overflowY: 'auto', flex: 1 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 className="playfair" style={{ fontSize: 26, fontWeight: 400, letterSpacing: 0.5 }}>Templates & Knowledge Hub</h1>
          <p style={{ fontSize: 11, color: 'var(--slate)', marginTop: 4 }}>Centralized resource library &middot; 24 items</p>
        </div>
        <input
          className="td-input"
          placeholder="Search templates..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: 220 }}
        />
      </div>

      {/* Category Tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 24 }}>
        {allCategories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: '6px 14px',
              borderRadius: 20,
              border: activeCategory === cat ? '1px solid rgba(212,175,106,0.18)' : '1px solid var(--border)',
              background: activeCategory === cat ? 'var(--champ-dim)' : 'transparent',
              color: activeCategory === cat ? 'var(--champagne)' : 'var(--slate)',
              fontSize: 10,
              letterSpacing: 0.5,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Template Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
        {filtered.map((t, i) => (
          <div
            key={i}
            style={{
              background: 'var(--bg2)',
              border: '1px solid var(--border)',
              borderRadius: 12,
              padding: 18,
              cursor: 'pointer',
              transition: 'border-color 0.15s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--champagne)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
          >
            {/* Category tag */}
            <div style={{
              fontSize: 9,
              letterSpacing: 1.5,
              textTransform: 'uppercase',
              color: categoryColors[t.category],
              marginBottom: 8,
            }}>
              {t.category}
            </div>

            {/* Title */}
            <div style={{ fontSize: 13, color: 'var(--ivory)', fontWeight: 500, marginBottom: 6 }}>
              {t.title}
            </div>

            {/* Description */}
            <div style={{
              fontSize: 10,
              color: 'var(--slate)',
              lineHeight: 1.5,
              marginBottom: 14,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}>
              {t.description}
            </div>

            {/* Footer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: 'var(--slate-dim)' }}>
              <span>Updated: {t.updated}</span>
              <span>Used {t.used} times</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
