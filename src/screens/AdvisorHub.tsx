import { useState } from 'react';

/* ───── Types ───── */
type PostCategory = 'Hotels' | 'Restaurants' | 'Destinations' | 'Best Practices' | 'Tips & Tricks';
type TabKey = 'All' | PostCategory;

interface Reply {
  author: string;
  initials: string;
  text: string;
  time: string;
}

interface Post {
  id: number;
  author: string;
  initials: string;
  role: string;
  time: string;
  category: PostCategory;
  title: string;
  body: string;
  rating?: number;
  location?: string;
  likes: number;
  comments: number;
  pinned?: boolean;
  replies: Reply[];
}

interface Contributor {
  name: string;
  initials: string;
  posts: number;
  color: string;
}

/* ───── Constants ───── */
const categoryColors: Record<PostCategory, string> = {
  Hotels: 'var(--champagne)',
  Restaurants: 'var(--emerald-lt)',
  Destinations: 'var(--sapphire-lt)',
  'Best Practices': 'var(--amethyst)',
  'Tips & Tricks': 'var(--cognac-lt)',
};

const categoryBadgeClass: Record<PostCategory, string> = {
  Hotels: 'b-em',
  Restaurants: 'b-sa',
  Destinations: 'b-mu',
  'Best Practices': 'b-og',
  'Tips & Tricks': 'b-ru',
};

const allTabs: TabKey[] = ['All', 'Hotels', 'Restaurants', 'Destinations', 'Best Practices', 'Tips & Tricks'];

const topContributors: Contributor[] = [
  { name: 'Halie M.', initials: 'HM', posts: 24, color: 'linear-gradient(135deg, var(--champagne), var(--cognac-lt))' },
  { name: 'Emily S.', initials: 'ES', posts: 19, color: 'linear-gradient(135deg, var(--sapphire-lt), var(--amethyst))' },
  { name: 'Jordan K.', initials: 'JK', posts: 16, color: 'linear-gradient(135deg, var(--emerald-lt), var(--sapphire-lt))' },
  { name: 'Priya T.', initials: 'PT', posts: 13, color: 'linear-gradient(135deg, var(--amethyst), var(--ruby-lt))' },
];

const popularTags = [
  'Italy', 'Capri', 'Four Seasons', 'Aman', 'Greece', 'Upgrades',
  'Client Gifts', 'Insurance', 'Japan', 'Transfers', 'Positano',
  'Belmond', 'Safari', 'Honeymoon', 'Concierge Tips',
];

/* ───── Seed Data ───── */
const seedPosts: Post[] = [
  {
    id: 1,
    author: 'Halie M.',
    initials: 'HM',
    role: 'Senior Advisor',
    time: '2 hours ago',
    category: 'Hotels',
    title: 'Hotel Caesar Augustus - Capri: An Honest Review',
    body: 'Just returned from a site visit and I cannot say enough about this property. The infinity pool views are genuinely the best I have seen on the island. Suite 301 (the Augustus Suite) has a private terrace that overlooks Marina Grande and is worth the upgrade for honeymoon clients.\n\nKey notes for booking: request the American breakfast package, not continental. Their concierge Massimo is exceptional for restaurant reservations. Book the sunset aperitivo on the terrace for your clients - it is complimentary for suite guests but needs to be arranged in advance.\n\nOne caveat: the walk from the main road is steep. Arrange the hotel shuttle for clients with mobility concerns.',
    rating: 5,
    location: 'Capri, Italy',
    likes: 18,
    comments: 6,
    pinned: true,
    replies: [
      { author: 'Emily S.', initials: 'ES', text: 'Completely agree on Suite 301. I had the Holland family there last month and they raved about it. Also worth noting the hotel can arrange a private boat to the Blue Grotto before the crowds arrive.', time: '1 hour ago' },
      { author: 'Jordan K.', initials: 'JK', text: 'Good call on the shuttle. My clients the Petersons had trouble with the walk last summer. Adding this to my Capri notes.', time: '45 min ago' },
    ],
  },
  {
    id: 2,
    author: 'Emily S.',
    initials: 'ES',
    role: 'Advisor',
    time: '5 hours ago',
    category: 'Restaurants',
    title: 'Da Paolino Lemon Tree Restaurant - Must-Book for Capri Clients',
    body: 'If you are sending anyone to Capri, Da Paolino is a non-negotiable reservation. Dining under hundreds of lemon trees is an experience that photographs beautifully and clients always mention it in their feedback.\n\nBooking tips: reservations open 30 days out and fill immediately for July/August. Ask for a table in the back garden section, not near the entrance. The lemon risotto and the fish of the day are the standout dishes.\n\nPricing is high but fair for the setting. Budget around 120-150 EUR per couple with wine. Their limoncello is house-made and the perfect way to end the meal.',
    rating: 5,
    location: 'Capri, Italy',
    likes: 14,
    comments: 4,
    replies: [
      { author: 'Priya T.', initials: 'PT', text: 'Can confirm - every single client who has been here has sent me photos. It is genuinely magical at night. Pro tip: mention it is a special occasion and they sometimes bring out a complimentary dessert plate.', time: '3 hours ago' },
    ],
  },
  {
    id: 3,
    author: 'Jordan K.',
    initials: 'JK',
    role: 'Senior Advisor',
    time: '1 day ago',
    category: 'Destinations',
    title: 'Greece Peak Season Tips - What I Learned This Summer',
    body: 'After sending 12 groups to Greece this summer, here are my hard-won lessons:\n\n1. Santorini in July/August is genuinely overcrowded. Steer honeymooners to Milos or Folegandros instead - similar beauty, fraction of the crowds.\n\n2. Athens hotel pick: the Grande Bretagne is still the best option. The rooftop bar with Acropolis views is a guaranteed wow moment on arrival night.\n\n3. Island hopping by ferry is romantic in theory but miserable in practice for luxury clients. Always book private yacht transfers or domestic flights.\n\n4. Mykonos restaurant reservations at Nammos and Scorpios need to be made 2+ weeks in advance for prime sunset tables.\n\n5. The Peloponnese is massively underrated. Costa Navarino is a game-changer for families who want Greece without the island logistics.',
    location: 'Greece',
    likes: 22,
    comments: 8,
    replies: [
      { author: 'Marcus W.', initials: 'MW', text: 'Strongly second the Milos recommendation. Sent the Andersons there last month and they said it was the highlight of their entire trip. The Sarakiniko beach is otherworldly.', time: '20 hours ago' },
      { author: 'Halie M.', initials: 'HM', text: 'Great list. I would add: if clients insist on Santorini, Canaves Oia Epitome is my pick. Private plunge pools and the sunset views are unmatched. Just book 4-6 months ahead.', time: '18 hours ago' },
    ],
  },
  {
    id: 4,
    author: 'Priya T.',
    initials: 'PT',
    role: 'Advisor',
    time: '1 day ago',
    category: 'Best Practices',
    title: 'My Insurance Follow-up Workflow That Gets 85% Conversion',
    body: 'I have been refining my travel insurance follow-up process and finally hit a workflow that converts consistently. Sharing because I know insurance is a pain point for many of us.\n\nDay 1: Send initial quote with a personal note explaining why I recommend coverage (use a real example, not generic language).\n\nDay 4: Follow up with a "just checking in" email. Attach a one-page PDF summary of what the policy covers in plain English.\n\nDay 8: Final follow up. Frame it as a deadline - "I want to make sure you are covered before your final payment is due on [date]."\n\nThe key insight: clients do not buy insurance because they understand the policy. They buy it because they trust you. Lead with relationship, not policy details.\n\nThis workflow is now in the Templates Hub if anyone wants to use it.',
    likes: 31,
    comments: 12,
    replies: [
      { author: 'Emily S.', initials: 'ES', text: 'This is gold. I have been struggling with insurance conversions and I think my mistake was leading with the policy details. Going to try your approach starting this week.', time: '22 hours ago' },
      { author: 'Marcus W.', initials: 'MW', text: 'The plain English PDF is a great idea. Would you be willing to share your template? I think a lot of us could benefit from standardizing this.', time: '20 hours ago' },
    ],
  },
  {
    id: 5,
    author: 'Marcus W.',
    initials: 'MW',
    role: 'Lead Advisor',
    time: '2 days ago',
    category: 'Tips & Tricks',
    title: 'Getting Upgrades at Four Seasons Properties - What Actually Works',
    body: 'After 8 years of booking Four Seasons, here is what I have learned about upgrades:\n\n1. Always book through Preferred Partner or Virtuoso, never direct. The amenities and upgrade priority are real.\n\n2. Call the hotel directly 48 hours before arrival and speak with the front office manager (not reservations). Mention it is a special occasion even if it is not - anniversary, birthday, first visit.\n\n3. Arrive early. Properties do upgrade sweeps in the morning and the earlier your client checks in, the better the odds.\n\n4. Build a relationship with the GM. After your first booking, send a handwritten thank-you note. By the third booking, you will have a direct line.\n\n5. The FSPP portal "special requests" field is actually read by the property. Use it strategically.\n\nThis does not work every time, but my upgrade rate is roughly 60% across all FS properties.',
    likes: 27,
    comments: 9,
    replies: [
      { author: 'Halie M.', initials: 'HM', text: 'The handwritten note tip is something I started doing last year and it has completely changed my relationships with GMs. Small effort, enormous return. Can confirm this works at Aman properties too.', time: '1 day ago' },
    ],
  },
  {
    id: 6,
    author: 'Halie M.',
    initials: 'HM',
    role: 'Senior Advisor',
    time: '3 days ago',
    category: 'Restaurants',
    title: 'Le Sirenuse Restaurant - Positano: Worth the Splurge',
    body: 'La Sponda at Le Sirenuse is one of those restaurants where the setting does all the heavy lifting, and the food still manages to exceed expectations. 400 candles lit every evening, overlooking the Positano coastline.\n\nReservation notes: book through the hotel concierge if your clients are staying at Le Sirenuse. For non-guests, you need to call exactly 30 days in advance. Request table 12 or 14 for the best views.\n\nDress code is smart casual but lean toward elegant. Clients should expect 200+ EUR per couple. The tasting menu is the best value if they are adventurous with seafood.\n\nPairs perfectly with a sunset boat ride before dinner - arrange through the hotel.',
    rating: 4,
    location: 'Positano, Italy',
    likes: 11,
    comments: 3,
    replies: [],
  },
  {
    id: 7,
    author: 'Emily S.',
    initials: 'ES',
    role: 'Advisor',
    time: '4 days ago',
    category: 'Destinations',
    title: 'Japan Cherry Blossom Season - Timing is Everything',
    body: 'Cherry blossom season is our most-requested Japan experience, but the timing window is narrow and unpredictable. Here is what I tell clients:\n\nThe bloom typically peaks in late March to mid-April, but it varies by region. Tokyo blooms first (late March), followed by Kyoto (early April), then the northern regions.\n\nMy recommendation: build a 14-day itinerary that moves south to north. This gives clients the best chance of catching peak bloom somewhere along the route.\n\nHotel availability disappears 6+ months ahead. Book the Aman Tokyo and Ritz-Carlton Kyoto as early as possible. Our DMC partner Artisans of Leisure can arrange private hanami (flower viewing) experiences in gardens that are closed to the public.\n\nBudget expectation: $2,000-3,000 per person per day for true luxury tier during peak season.',
    location: 'Japan',
    likes: 19,
    comments: 7,
    replies: [
      { author: 'Jordan K.', initials: 'JK', text: 'The south-to-north routing strategy is brilliant. I have been doing it the opposite way and my clients kept missing peak bloom. Changing my approach for next season.', time: '3 days ago' },
    ],
  },
  {
    id: 8,
    author: 'Jordan K.',
    initials: 'JK',
    role: 'Senior Advisor',
    time: '5 days ago',
    category: 'Hotels',
    title: 'Aman Tokyo - The Benchmark for Urban Luxury',
    body: 'Completed my third stay at Aman Tokyo and it continues to set the standard. The lobby alone - that enormous ikebana arrangement and the floor-to-ceiling windows overlooking the Imperial Palace gardens - sets the tone immediately.\n\nRoom recommendations: Corner suites on floors 33-34 offer the best city views. The standard rooms are generous at 71 sqm but the suites are where the experience really elevates.\n\nThe spa is world-class. Book the 2.5-hour Aman Signature Journey for clients who appreciate wellness. The pool on the 33rd floor is the most serene space in Tokyo.\n\nDining: Musashi by Aman serves the best hotel sushi I have ever had. Arva for Italian is surprisingly excellent. Both need reservations.\n\nOne note: Aman Tokyo is not a "scene" hotel. It is quiet, refined, contemplative. Perfect for sophisticated travelers, less ideal for clients who want buzz and nightlife proximity.',
    rating: 5,
    location: 'Tokyo, Japan',
    likes: 16,
    comments: 5,
    replies: [
      { author: 'Priya T.', initials: 'PT', text: 'The spa recommendation is spot on. My clients the Changs spent their entire first day there and said it was the best spa experience of their lives. Worth every yen.', time: '4 days ago' },
    ],
  },
  {
    id: 9,
    author: 'Priya T.',
    initials: 'PT',
    role: 'Advisor',
    time: '6 days ago',
    category: 'Tips & Tricks',
    title: 'Booking Private Transfers That Actually Impress',
    body: 'Private transfers are one of those details that can make or break the luxury perception of a trip. Here is my checklist for getting them right:\n\n1. Always confirm vehicle class in advance. "Luxury sedan" means different things to different companies. Ask for specific make/model.\n\n2. Request meet-and-greet at arrivals with a name sign. Small touch, big impact for clients arriving exhausted after a long flight.\n\n3. Stock the vehicle: bottled water (still and sparkling), cold towels in summer, a printed welcome note with the day\'s itinerary.\n\n4. For multi-day trips, request the same driver throughout. Continuity builds comfort and the driver becomes a de facto local guide.\n\n5. Rolzo is my go-to globally. Their portal is clean, pricing is transparent, and Alex on their partner team is incredibly responsive.\n\nBudget: airport transfers in Europe run 150-300 EUR for sedan class. Worth every cent versus taxi roulette.',
    location: 'Global',
    likes: 15,
    comments: 4,
    replies: [],
  },
  {
    id: 10,
    author: 'Marcus W.',
    initials: 'MW',
    role: 'Lead Advisor',
    time: '1 week ago',
    category: 'Best Practices',
    title: 'Client Gift Strategy That Drives Referrals',
    body: 'I have been tracking my referral sources for the past two years and discovered that thoughtful gifting generates more new clients than any other channel. Here is my system:\n\nPre-trip (1 week before departure): Send a small gift related to the destination. A Japanese tea set for Japan trips, Italian olive oil for Italy, etc. Budget: $40-60.\n\nDuring trip: Arrange a surprise through the hotel. Birthday cake, champagne and strawberries, a spa credit. Coordinate with the concierge. Budget: $50-100.\n\nPost-trip (2 weeks after return): Handwritten thank-you card with a framed photo from their trip (ask them to share favorites). Budget: $30-50.\n\nAnnual: Holiday gift basket from a local artisan relevant to their past travels. Budget: $75-100.\n\nTotal annual investment per client: roughly $200-300. Average referral value: $15,000+ in bookings. The ROI is extraordinary.\n\nThe key is personalization. Generic gift baskets do not work. Every gift should demonstrate that you remember and care about their specific experience.',
    likes: 34,
    comments: 14,
    replies: [
      { author: 'Emily S.', initials: 'ES', text: 'The pre-trip destination gift is such a smart touch. I am going to start implementing this immediately. Do you have a list of vendors you use for the destination-specific items?', time: '6 days ago' },
      { author: 'Halie M.', initials: 'HM', text: 'Marcus, your referral numbers are incredible. I have been doing post-trip gifts but never thought about pre-trip. That builds anticipation and excitement before they even leave. Brilliant.', time: '5 days ago' },
    ],
  },
];

let nextPostId = seedPosts.length + 1;

/* ═══════════════════════════════════ Component ═══════════════════════════════════ */

export default function AdvisorHub() {
  const [activeTab, setActiveTab] = useState<TabKey>('All');
  const [search, setSearch] = useState('');
  const [posts, setPosts] = useState<Post[]>(seedPosts);
  const [expandedReplies, setExpandedReplies] = useState<Set<number>>(new Set());
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());

  /* New Post panel state */
  const [panelOpen, setPanelOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newBody, setNewBody] = useState('');
  const [newCategory, setNewCategory] = useState<PostCategory>('Hotels');
  const [newRating, setNewRating] = useState(0);
  const [newHoverRating, setNewHoverRating] = useState(0);
  const [newLocation, setNewLocation] = useState('');

  /* ─── Derived data ─── */
  const filteredPosts = posts.filter(p => {
    const matchesCategory = activeTab === 'All' || activeTab === p.category;
    const matchesSearch = !search
      || p.title.toLowerCase().includes(search.toLowerCase())
      || p.body.toLowerCase().includes(search.toLowerCase())
      || p.author.toLowerCase().includes(search.toLowerCase())
      || (p.location && p.location.toLowerCase().includes(search.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const pinnedPost = posts.find(p => p.pinned);

  /* ─── Helpers ─── */
  function toggleReplies(postId: number) {
    setExpandedReplies(prev => {
      const next = new Set(prev);
      if (next.has(postId)) next.delete(postId);
      else next.add(postId);
      return next;
    });
  }

  function toggleLike(postId: number) {
    setLikedPosts(prev => {
      const next = new Set(prev);
      if (next.has(postId)) {
        next.delete(postId);
        setPosts(ps => ps.map(p => p.id === postId ? { ...p, likes: p.likes - 1 } : p));
      } else {
        next.add(postId);
        setPosts(ps => ps.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p));
      }
      return next;
    });
  }

  function openNewPost() {
    setNewTitle('');
    setNewBody('');
    setNewCategory(activeTab !== 'All' ? activeTab as PostCategory : 'Hotels');
    setNewRating(0);
    setNewHoverRating(0);
    setNewLocation('');
    setPanelOpen(true);
  }

  function submitPost() {
    if (!newTitle.trim() || !newBody.trim()) return;
    const post: Post = {
      id: nextPostId++,
      author: 'You',
      initials: 'YO',
      role: 'Advisor',
      time: 'Just now',
      category: newCategory,
      title: newTitle,
      body: newBody,
      rating: (newCategory === 'Hotels' || newCategory === 'Restaurants') && newRating > 0 ? newRating : undefined,
      location: newLocation.trim() || undefined,
      likes: 0,
      comments: 0,
      replies: [],
    };
    setPosts(prev => [post, ...prev]);
    setPanelOpen(false);
  }

  const showRatingInForm = newCategory === 'Hotels' || newCategory === 'Restaurants';

  /* ─── Avatar color helper ─── */
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

  /* ═══════════════════════════════════ Render ═══════════════════════════════════ */
  return (
    <div style={{ padding: 28, overflowY: 'auto', flex: 1 }}>

      {/* ─── Header ─── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 className="playfair" style={{ fontSize: 26, fontWeight: 400, letterSpacing: 0.5 }}>Advisor Hub</h1>
          <p style={{ fontSize: 11, color: 'var(--slate)', marginTop: 4 }}>
            Internal knowledge sharing &middot; Hotel reviews &middot; Restaurant tips &middot; Destination intel
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input
            className="td-input"
            placeholder="Search posts, advisors, locations..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: 260 }}
          />
          <button className="btn btn-champ" onClick={openNewPost}>+ New Post</button>
        </div>
      </div>

      {/* ─── Tabs ─── */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
        {allTabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '6px 14px',
              borderRadius: 20,
              border: activeTab === tab ? '1px solid rgba(59,154,156,0.18)' : '1px solid var(--border)',
              background: activeTab === tab ? 'var(--champ-dim)' : 'transparent',
              color: activeTab === tab ? 'var(--champagne)' : 'var(--slate)',
              fontSize: 10,
              letterSpacing: 0.5,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ─── Main Layout: Feed + Sidebar ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24 }}>

        {/* ════════ Feed Column ════════ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {filteredPosts.map(post => (
            <div
              key={post.id}
              style={{
                background: 'var(--bg2)',
                border: post.pinned ? '1px solid rgba(59,154,156,0.25)' : '1px solid var(--border)',
                borderRadius: 12,
                overflow: 'hidden',
                transition: 'border-color 0.15s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--champagne)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = post.pinned ? 'rgba(59,154,156,0.25)' : 'var(--border)'; }}
            >
              {/* Post header */}
              <div style={{ padding: '18px 20px 0' }}>
                {/* Pinned indicator */}
                {post.pinned && (
                  <div style={{ fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--champagne)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 11 }}>&#9733;</span> Pinned Post
                  </div>
                )}

                {/* Author row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                  {/* Avatar */}
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      background: avatarGradient(post.initials),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 13,
                      color: 'var(--bg)',
                      fontWeight: 600,
                      flexShrink: 0,
                    }}
                  >
                    {post.initials}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 13, color: 'var(--ivory)', fontWeight: 500 }}>{post.author}</span>
                      <span style={{ fontSize: 10, color: 'var(--slate-dim)' }}>{post.role}</span>
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--slate-dim)', marginTop: 2 }}>{post.time}</div>
                  </div>
                  <span className={`badge ${categoryBadgeClass[post.category]}`}>{post.category}</span>
                </div>

                {/* Title */}
                <div style={{ fontSize: 15, color: 'var(--ivory)', fontWeight: 500, marginBottom: 8, lineHeight: 1.4 }}>
                  {post.title}
                </div>

                {/* Rating */}
                {post.rating !== undefined && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                    <div style={{ display: 'flex', gap: 2 }}>
                      {[1, 2, 3, 4, 5].map(star => (
                        <span
                          key={star}
                          style={{
                            fontSize: 14,
                            color: star <= post.rating! ? 'var(--champagne)' : 'var(--slate-dim)',
                          }}
                        >
                          {star <= post.rating! ? '★' : '☆'}
                        </span>
                      ))}
                    </div>
                    <span style={{ fontSize: 10, color: 'var(--slate)', marginLeft: 2 }}>{post.rating}.0</span>
                  </div>
                )}

                {/* Body */}
                <div style={{
                  fontSize: 12,
                  color: 'var(--ivory-dim)',
                  lineHeight: 1.7,
                  marginBottom: 14,
                  whiteSpace: 'pre-line',
                }}>
                  {post.body}
                </div>

                {/* Location tag */}
                {post.location && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--slate)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span style={{ fontSize: 10, color: 'var(--slate)', letterSpacing: 0.3 }}>{post.location}</span>
                  </div>
                )}
              </div>

              {/* Post footer: likes, comments, reply toggle */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 20px',
                  borderTop: '1px solid var(--border2)',
                  background: 'var(--bg3)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  {/* Like button */}
                  <button
                    onClick={() => toggleLike(post.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 5,
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: 11,
                      color: likedPosts.has(post.id) ? 'var(--champagne)' : 'var(--slate)',
                      transition: 'color 0.15s',
                      padding: 0,
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill={likedPosts.has(post.id) ? 'var(--champagne)' : 'none'} stroke={likedPosts.has(post.id) ? 'var(--champagne)' : 'var(--slate)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                    </svg>
                    {post.likes}
                  </button>

                  {/* Comments count */}
                  <button
                    onClick={() => toggleReplies(post.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 5,
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: 11,
                      color: 'var(--slate)',
                      padding: 0,
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--slate)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                    </svg>
                    {post.comments} {post.comments === 1 ? 'comment' : 'comments'}
                  </button>
                </div>

                {post.replies.length > 0 && (
                  <button
                    className="btn btn-ghost btn-xs"
                    onClick={() => toggleReplies(post.id)}
                  >
                    {expandedReplies.has(post.id) ? 'Hide Replies' : `View ${post.replies.length} ${post.replies.length === 1 ? 'Reply' : 'Replies'}`}
                  </button>
                )}
              </div>

              {/* Expanded replies */}
              {expandedReplies.has(post.id) && post.replies.length > 0 && (
                <div style={{ borderTop: '1px solid var(--border2)', background: 'var(--bg3)' }}>
                  {post.replies.map((reply, ri) => (
                    <div
                      key={ri}
                      style={{
                        display: 'flex',
                        gap: 10,
                        padding: '14px 20px 14px 32px',
                        borderBottom: ri < post.replies.length - 1 ? '1px solid var(--border2)' : 'none',
                      }}
                    >
                      <div
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: '50%',
                          background: avatarGradient(reply.initials),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 10,
                          color: 'var(--bg)',
                          fontWeight: 600,
                          flexShrink: 0,
                        }}
                      >
                        {reply.initials}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <span style={{ fontSize: 12, color: 'var(--ivory)', fontWeight: 500 }}>{reply.author}</span>
                          <span style={{ fontSize: 9, color: 'var(--slate-dim)' }}>{reply.time}</span>
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--ivory-dim)', lineHeight: 1.6 }}>
                          {reply.text}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {filteredPosts.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, color: 'var(--slate)', fontSize: 12 }}>
              No posts match your search.
            </div>
          )}
        </div>

        {/* ════════ Right Sidebar ════════ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* New Post CTA */}
          <div className="card">
            <div className="card-b" style={{ textAlign: 'center', padding: 20 }}>
              <div style={{ fontSize: 11, color: 'var(--ivory-dim)', marginBottom: 12, lineHeight: 1.5 }}>
                Share a hotel review, restaurant find, or travel tip with your team.
              </div>
              <button className="btn btn-champ" style={{ width: '100%', padding: 10 }} onClick={openNewPost}>
                + New Post
              </button>
            </div>
          </div>

          {/* Top Contributors */}
          <div className="card">
            <div className="card-h">
              <span className="card-t">Top Contributors</span>
            </div>
            <div className="card-b" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {topContributors.map((c, i) => (
                <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ fontSize: 11, color: 'var(--slate-dim)', width: 14, textAlign: 'center', flexShrink: 0 }}>
                    {i + 1}
                  </div>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: c.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 10,
                      color: 'var(--bg)',
                      fontWeight: 600,
                      flexShrink: 0,
                    }}
                  >
                    {c.initials}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, color: 'var(--ivory)' }}>{c.name}</div>
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--slate)', flexShrink: 0 }}>
                    {c.posts} posts
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Popular Tags */}
          <div className="card">
            <div className="card-h">
              <span className="card-t">Popular Tags</span>
            </div>
            <div className="card-b" style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {popularTags.map(tag => (
                <span
                  key={tag}
                  onClick={() => setSearch(tag)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: 6,
                    background: 'var(--bg4)',
                    border: '1px solid var(--border)',
                    color: 'var(--ivory-dim)',
                    fontSize: 10,
                    cursor: 'pointer',
                    transition: 'all 0.12s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'var(--champ-dim)';
                    e.currentTarget.style.color = 'var(--champagne)';
                    e.currentTarget.style.borderColor = 'rgba(59,154,156,0.18)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'var(--bg4)';
                    e.currentTarget.style.color = 'var(--ivory-dim)';
                    e.currentTarget.style.borderColor = 'var(--border)';
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Pinned / Featured Post */}
          {pinnedPost && (
            <div className="card">
              <div className="card-h">
                <span className="card-t">Featured</span>
              </div>
              <div className="card-b">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      background: avatarGradient(pinnedPost.initials),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 9,
                      color: 'var(--bg)',
                      fontWeight: 600,
                      flexShrink: 0,
                    }}
                  >
                    {pinnedPost.initials}
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--ivory)' }}>{pinnedPost.author}</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--ivory)', fontWeight: 500, marginBottom: 6, lineHeight: 1.4 }}>
                  {pinnedPost.title}
                </div>
                <div style={{
                  fontSize: 10,
                  color: 'var(--slate)',
                  lineHeight: 1.5,
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  marginBottom: 10,
                }}>
                  {pinnedPost.body}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 10, color: 'var(--slate-dim)' }}>
                  <span>{pinnedPost.likes} likes</span>
                  <span>{pinnedPost.comments} comments</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ═══════ New Post Panel (slide-in) ═══════ */}
      <div className={`task-detail${panelOpen ? ' open' : ''}`}>

        {/* Panel header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexShrink: 0 }}>
          <div style={{ fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--slate)' }}>
            New Post
          </div>
          <button
            onClick={() => setPanelOpen(false)}
            style={{ width: 28, height: 28, borderRadius: 6, background: 'var(--bg3)', border: '1px solid var(--border)', cursor: 'pointer', color: 'var(--slate)', fontSize: 14, flexShrink: 0 }}
          >
            &#10005;
          </button>
        </div>

        {/* Panel body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>

          {/* Category */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--slate)', marginBottom: 6 }}>Category</div>
            <select className="td-input" value={newCategory} onChange={e => setNewCategory(e.target.value as PostCategory)}>
              {(['Hotels', 'Restaurants', 'Destinations', 'Best Practices', 'Tips & Tricks'] as PostCategory[]).map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--slate)', marginBottom: 6 }}>Title</div>
            <input
              className="td-input"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              placeholder="e.g., Hotel Caesar Augustus - Capri Review"
            />
          </div>

          {/* Body */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--slate)', marginBottom: 6 }}>Content</div>
            <textarea
              className="td-input"
              value={newBody}
              onChange={e => setNewBody(e.target.value)}
              placeholder="Share your insights, tips, and recommendations..."
              rows={12}
              style={{
                resize: 'vertical',
                lineHeight: 1.6,
                fontSize: 12,
                minHeight: 200,
              }}
            />
          </div>

          {/* Star Rating (conditional) */}
          {showRatingInForm && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--slate)', marginBottom: 6 }}>Rating (Optional)</div>
              <div style={{ display: 'flex', gap: 6 }}>
                {[1, 2, 3, 4, 5].map(star => (
                  <div
                    key={star}
                    onClick={() => setNewRating(star === newRating ? 0 : star)}
                    onMouseEnter={() => setNewHoverRating(star)}
                    onMouseLeave={() => setNewHoverRating(0)}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 6,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      fontSize: 18,
                      background: star <= (newHoverRating || newRating) ? 'var(--champ-dim)' : 'var(--bg4)',
                      border: `1px solid ${star <= (newHoverRating || newRating) ? 'var(--champagne)' : 'var(--border)'}`,
                      color: star <= (newHoverRating || newRating) ? 'var(--champagne)' : 'var(--slate-dim)',
                      transition: 'all 0.15s',
                    }}
                  >
                    {star <= (newHoverRating || newRating) ? '★' : '☆'}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Location */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--slate)', marginBottom: 6 }}>Location Tag (Optional)</div>
            <input
              className="td-input"
              value={newLocation}
              onChange={e => setNewLocation(e.target.value)}
              placeholder="e.g., Capri, Italy"
            />
          </div>
        </div>

        {/* Panel footer */}
        <div style={{
          padding: '12px 24px',
          borderTop: '1px solid var(--border)',
          flexShrink: 0,
          background: 'var(--bg2)',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: 8,
        }}>
          <button className="btn btn-ghost btn-sm" onClick={() => setPanelOpen(false)}>Cancel</button>
          <button className="btn btn-champ btn-sm" onClick={submitPost}>Post</button>
        </div>
      </div>
    </div>
  );
}
