T E C H N I C A L S P E C I F I C A T I O N 

Voyance — Luxury Travel   
Operations Platform 

Full-stack SaaS application for luxury travel advisors. Phase I delivers the web platform; Phase II extends into backend services, mobile-optimized responsive design, and advanced automation. 

Prepared for Engineering Team Version 1.0 Date July 21, 2026 Status Phase I Complete / Phase II Planning 

01 Executive Overview 

Voyance is a multi-tenant operations platform purpose-built for luxury travel agencies. It consolidates trip lifecycle management, client communications, financial tracking, team operations, and client facing portals into a single workspace. The platform is designed to support both independent advisors and agencies managing multiple sub-accounts. 

T O TA L L O C 

8,495 

TypeScript \+ CSS   
S C R E E N S 

15 

across 6 nav sections   
P H A S E I 

$16,000 Web platform   
P H A S E I I 

TBD 

Backend \+ mobile optimized \+ AI  
02 Technology Stack 

Phase I — Current Stack FRONTEND 

L AY E R T E C H N O L O G Y V E R S I O N P U R P O S E 

Runtime React 19.2 Component framework, SPA rendering 

Language TypeScript 5.9 Type safety, interfaces, compile-time checks 

Build Vite 7.3 Dev server, HMR, production bundling 

Styling Tailwind CSS v4 \+ CSS custom properties   
4.2 Utility classes, design token system 

Routing React Router DOM 7.13 Client-side navigation (available, not yet active) 

Database Client Supabase JS 2.99 Backend-ready client (installed, not yet connected) 

Linting ESLint \+ TypeScript-ESLint 9.39 Code quality enforcement 

Payments NMI Gateway API \+ Collect.js — Payment processing, invoicing, tokenization 

Hosting GitHub Pages — Static deployment via gh-pages branch 

Phase II — Additions BACKEND FRONTEND  
L AY E R T E C H N O L O G Y P U R P O S E 

Backend Supabase (PostgreSQL \+ Auth \+ Storage \+ Edge Functions)   
Database, authentication, file storage, serverless API 

Mobile Responsive CSS \+ PWA (Service Worker) Mobile-optimized web app accessible via any mobile browser 

Email SendGrid / Resend Transactional emails, client notifications 

AI Claude API (Anthropic) Itinerary generation, document parsing, trip recommendations 

Search Supabase Full-Text Search or Typesense Client, trip, and template search CDN Vercel / Cloudflare Edge deployment, global latency optimization  
03 Architecture & Design System 

Application Architecture 

SPA with component-based routing — App.tsx manages active screen state via useState , renders the matching screen component from a keyed registry of 15 screen modules 

Layout shell — persistent Topbar \+ collapsible Sidebar (210px) with 6 labeled nav sections, content area fills remaining viewport 

Multi-tenant context — AgencyContext provides agency-switching with per-agency branding, colors, and data. Supports unlimited sub-accounts, not limited to a fixed set 

Theme system — ThemeContext with theme state \+ toggleTheme() , persisted to localStorage. CSS custom properties on :root (dark default) and \[data-theme="light"\] override 

Design tokens — 25+ CSS custom properties covering backgrounds ( \--bg through \--bg4 ), borders, champagne/ivory/slate text, cognac/sapphire/emerald/amethyst/ruby accent palette, shadows 

Typography — Aptos Display (primary) with Inter (Google Fonts) fallback. Shared classes: .playfair , .btn , .btn-champ , .btn-ghost , .card , .badge , .tbl 

Color System (Color Combo No. 323\) 

Peach \#E8A87C Teal \#85CDCA Terracotta \#C27849 Teal \#3B9A9C Navy \#1B4B5A 

File Structure 

src/App.tsx — Root shell, screen registry, tab system (72 LOC) 

src/components/Topbar.tsx — Top navigation bar, agency switcher, theme toggle, search (100 LOC) src/components/Sidebar.tsx — 6-section nav with icons, badges, active state highlighting (54 LOC) src/AgencyContext.tsx — Multi-tenant agency provider with demo data (99 LOC) src/ThemeContext.tsx — Dark/light theme context with localStorage persistence (18 LOC) src/index.css — Global design tokens, utility classes, reset (181 LOC) 

src/screens/\*.tsx — 15 screen modules (7,971 LOC combined)  
Phase I — Web Platform 

Frontend SPA with demo data, full UX/UI, multi-tenant architecture, deployed to GitHub Pages 

$16,000 Completed  
04 Workspace Modules 

Dashboard 164 LOC Central command view — agency health at a glance. 

KPI strip — 4 metric cards: Active Trips, Revenue MTD, Pending Tasks, Client Satisfaction with trend indicators 

Today's Priorities — Prioritized task list with status badges (urgent, due today, follow-up) 

Upcoming Departures — Timeline of next 7-day departures with client, destination, and countdown 

Automation Alerts — Real-time feed of triggered automation events with timestamps 

Trip Requests 90 LOC Inbound lead pipeline with kanban workflow. 

Kanban board — 4-column pipeline: New Inquiry, Qualifying, Proposal Sent, Booked Request cards — Client name, destination, travel dates, budget range, source channel Stage badges — Color-coded status indicators per card 

Master Trip Board 535 LOC Full trip lifecycle tracker with month grouping and stage columns. 

Month-grouped table view — Trips organized by departure month with collapsible sections Stage columns — Planning, Booked, Docs Sent, Confirmed, Traveling, Complete 

Trip detail panel — Click-to-expand with tabbed detail view (Stages, Notes, Documents, Financials) 

Table/Board toggle — Switch between table and board visualization 

Inline data — Client, destination, dates, advisor, total value, margin per trip  
Calendar 399 LOC Monthly calendar with trip events, tasks, and deadlines. 

Month grid — Traditional calendar layout with event dots and trip overlays 

Event categories — Departures, returns, deadlines, follow-ups with color coding Day detail view — Click a day to see all events with full context 

Month navigation — Previous/next with current month indicator  
05 Operations Modules 

Tasks 483 LOC Team task management with kanban workflow. 

4-column kanban — To Do, In Progress, Waiting On Client, Complete 

Task cards — Title, assignee avatar, due date, priority level, related trip 

Priority badges — Urgent (ruby), High (amber), Normal (teal), Low (slate) 

Category filtering — Filter by trip, client, assignee, priority 

Add task form — Create new tasks with full field set 

Time & Retainers 738 LOC Billable time tracking and retainer package management. 

Two-tab interface — Time Tracking | Retainers 

Time log table — Date, client, trip, hours, rate, total, notes with inline editing 

Retainer packages — Package name, client, hours included, hours used, renewal date, status KPI cards — Total hours, billable amount, utilization rate, active retainers 

Timer controls — Start/stop timer with client/trip assignment 

Commissions 399 LOC Commission tracking with supplier and advisor splits. 

Commission table — Supplier, trip, booking value, commission %, amount, status, payment date Summary sidebar — Total earned, pending, paid, upcoming with period filters 

Status indicators — Pending, Received, Overdue with color coding 

Advisor split tracking — Multi-advisor commission split percentages  
06 Client Modules 

Client Feedback 492 LOC Client satisfaction tracking and review management. 

Feedback table — 16 demo entries with client, trip, rating (1-5 stars), category, date, comment Rating visualization — Star display with aggregate scoring 

Category filtering — Overall, Accommodation, Dining, Activities, Transportation, Communication Response management — Track advisor responses to feedback 

KPI cards — Average rating, NPS score, response rate, total reviews 

Client Portal 537 LOC Dual-mode client-facing portal with secure access. 

Advisor View — Portal configuration, branding preview, access code management, client list Client View — Secure sign-in with access code, single-page scrollable layout 

Client authenticated sections — Trip overview, advisor contact, full day-by-day itinerary, trip documents, secure documents, budget & payments (side-by-side cards), travel preferences, feedback form, trip request form 

Two-column grid layout — Responsive layout for documents and financial sections No agency branding — Client-facing view is white-labeled, no advisor brand  
07 Resources Modules 

Templates & Hub 643 LOC Reusable document and communication template library. 

Template categories — All, Emails, Itineraries, Proposals, Contracts, Questionnaires Template cards — Name, category, last modified, usage count, preview snippet Template editor — In-app editing with variable placeholders ( {client\_name} , {trip\_dates} ) Duplicate/archive — Clone templates, archive unused ones 

Search and filter — Full-text search across template names and content 

Advisor Hub 516 LOC Internal team communication and activity feed. 

Channel sidebar — Team channels (General, Sales, Operations, VIP Clients) with unread counts Activity feed — Chronological message stream with sender avatars, timestamps, formatting Channel filtering — All channels or single-channel view 

Message categories — Updates, questions, client notes, supplier alerts 

Reports 526 LOC Business intelligence and analytics dashboard. 

Report tabs — Revenue, Bookings, Client Analytics, Team Performance 

Revenue analytics — MTD, QTD, YTD with period-over-period comparison 

Booking trends — Volume by month, lead conversion rates, average booking value Client metrics — New vs. returning, lifetime value, satisfaction correlation 

Exportable data — Prepared for CSV/PDF export (Phase II activation)  
Admin 654 LOC Agency administration with 7 management tabs. 

Staff & Roles — Team member table with role, email, status, permissions level, last active Automations — Rule-based workflow automation with triggers, conditions, and actions Payments & Invoicing — 3 sub-tabs: 

Payment Gateway — NMI Gateway integration with connect/disconnect, settlement schedule, currency settings, merchant account configuration 

Invoices — 4 KPI cards (Outstanding, Paid, Overdue, Total), invoice table with View/Resend/Copy Link, full create-invoice form with line items, due date, gateway picker 

Payment Links — Shareable payment link cards with client/trip, URL, Copy/Email actions, view counts 

Agency Settings — Business name, address, license, logo, brand colors 

Notifications — Email/push notification preferences per event type 

Passport & Visas — Client travel document tracker with expiration alerts 

Team Calendar — Staff availability, PTO, and scheduling  
08 Platform Module 

Agency Sub-Accounts 649 LOC Multi-tenant platform management with agent workspace mirroring. 

Agent table — Unlimited subscribed agents with name, plan tier, status, join date, revenue, active trips. Dynamically scales as new agents onboard 

Subscription management — Plan tiers (Starter, Professional, Enterprise) with feature matrices, self-service onboarding for new agents 

Mirror Account overlay — Full-screen read-only view into any agent's workspace with 4 tabs: Dashboard — Agent's KPIs, active trip table, revenue summary, workspace stats Trip Board — Agent's trip pipeline in kanban columns 

Clients — Agent's full client roster table 

Settings — Account details, usage metrics, brand configuration 

Mirror badges — "MIRROR MODE" and "READ ONLY" visual indicators 

Agent accent colors — Per-agent brand gradient in overlay header  
09 Phase I — Deliverables Summary 

D E L I V E R A B L E N O T E S 

React SPA with 15 screens All screens functional with demo data 

Design system & theming Dark/light themes, CSS custom properties, Aptos Display typography 

Multi-tenant agency context Unlimited sub-accounts with per-tenant branding, colors, and data isolation 

Client portal (dual-mode) Advisor config \+ client-facing secure portal 

Payment & invoicing with NMI Gateway Gateway integration, invoice creation, payment links, client payment processing 

Mirror account system Read-only workspace mirroring for sub-accounts GitHub Pages deployment Live at Scotland2330.github.io/Luxury-Travel-App TypeScript strict mode Full type safety across all modules 

Phase I scope: All UI/UX is built with demo data. NMI Gateway integration provides full payment processing for invoicing and client payments. Supabase client is installed for Phase II backend wiring. Phase I is a complete, interactive prototype with live payment capabilities that validates the full user experience.  
10 Payment Processing 

NMI Gateway Integration BACKEND 

NMI merchant accounts — Each agency and sub-account connects their own NMI Gateway merchant account. Platform manages per-tenant gateway credentials securely 

Invoice payments — Generate payment transactions from invoice line items via NMI’s Collect.js tokenization, support card and ACH payment methods 

Payment Links — Generate shareable payment URLs with pre-filled amounts, trip context, and agency branding routed through NMI’s hosted payment pages 

Webhook processing — NMI transaction response handling for completed, declined, and refunded events to update invoice and commission status in real time 

Settlement tracking — Surface NMI settlement batches and payout history in the Payments dashboard Multi-currency — Support for USD, EUR, GBP, CAD, AUD with automatic conversion display 

PCI compliance — Collect.js client-side tokenization ensures card data never touches Voyance servers; NMI handles PCI DSS scope 

Sub-account payment isolation — Each sub-account agent processes payments through their own NMI merchant credentials; settlement and reporting are isolated per tenant 

Recurring billing — NMI Customer Vault for stored payment methods, automated recurring charges for retainer billing and installment plans 

Batch processing — Batch transaction submission for bulk invoice processing across multiple clients

Phase II — Production Backend, Mobile & AI 

Connect real data, deploy to production hosting, mobile-optimized responsive design, workflow automation, and AI 

TBD 

Pricing in progress   
10 Backend Services & Database 

Supabase Integration BACKEND 

PostgreSQL schema design — Normalized relational schema for: agencies, users, trips, clients, tasks, invoices, commissions, retainers, templates, feedback, documents, notifications. Row-level security (RLS) policies for multi-tenant data isolation 

Authentication — Supabase Auth with email/password, magic link, and OAuth (Google, Apple) for both advisors and clients. Role-based access: Owner, Admin, Advisor, Read-Only, Client 

Storage — Supabase Storage buckets for: client documents (passports, visas, tickets), itinerary PDFs, agency logos/branding assets, template attachments. Signed URLs for secure client portal document access 

Edge Functions — Serverless TypeScript functions for: webhook handlers (Stripe, email), PDF generation (itineraries, invoices), scheduled jobs (expiration alerts, follow-up reminders), AI proxy calls 

Realtime — Supabase Realtime subscriptions for: live task updates across team, new trip request notifications, advisor hub message streaming, dashboard KPI refresh

Database Schema (Core Tables) BACKEND   
TA B L E K E Y F I E L D S R E L AT I O N S agencies id, name, slug, plan, branding, settings Root tenant entity users id, agency\_id, email, role, avatar belongs to agency clients id, agency\_id, name, email, phone, preferences belongs to agency 

trips id, agency\_id, client\_id, advisor\_id, status, dates, destination, value   
agency → client → advisor 

tasks id, trip\_id, assignee\_id, title, status, priority, due\_date belongs to trip invoices id, agency\_id, client\_id, trip\_id, items\[\], total, status, due\_date agency → client → trip commissions id, trip\_id, supplier, amount, rate, status, paid\_date belongs to trip documents id, trip\_id, client\_id, type, storage\_path, expires\_at trip ∨ client templates id, agency\_id, category, name, content, variables\[\] belongs to agency feedback id, client\_id, trip\_id, rating, category, comment client → trip time\_entries id, user\_id, client\_id, hours, rate, date, notes user → client retainers id, client\_id, hours\_included, hours\_used, renewal\_date belongs to client 

API Layer API 

Supabase auto-generated REST — PostgREST provides typed CRUD endpoints for every table with filtering, pagination, and embedding 

Custom Edge Functions — Complex operations: multi-step invoice creation, commission calculation, trip stage transitions with side effects (emails, task creation) 

Webhook endpoints — NMI payment confirmations, email delivery status, calendar sync callbacks Rate limiting & audit logging — Per-tenant request limits, full audit trail for compliance  
11 Mobile-Optimized Web 

Responsive Design & PWA FRONTEND 

Fully responsive layouts — All 15 screens adapted for mobile viewports (375px–428px) with breakpoints at 640px, 768px, and 1024px. Sidebar collapses to hamburger menu, tables become card stacks, kanban columns scroll horizontally 

Touch-optimized interactions — Tap targets minimum 44px, swipe gestures for kanban cards and navigation, pull-to-refresh on data views, mobile-friendly form inputs with appropriate keyboard types 

Progressive Web App (PWA) — Service worker for asset caching and faster repeat loads. Web app manifest enables "Add to Home Screen" on iOS and Android for app-like launch experience without app stores 

Mobile-first client portal — Client-facing portal optimized for phone access: single-column itinerary, tap to-call advisor, swipeable document cards, mobile payment flow via NMI 

Mobile-Priority Adaptations FRONTEND 

Dashboard — Stacked KPI cards, swipeable priorities and departures, compact alert feed Trip detail — Full trip view with collapsible stage sections, pinch-to-zoom on documents Tasks — Horizontal-scroll kanban with swipe-to-complete, quick-add task from mobile 

Notifications — Browser push notifications (via Push API \+ Service Worker) for new requests, task due dates, payment received 

Offline resilience — Service worker caches critical screens so advisors can view trip details and client info during connectivity gaps; queues updates for sync when back online  
12 AI & Automation 

Itinerary Builder (Phase II flagship) FRONTEND BACKEND 

UI already built — 1,136 LOC, the largest screen module. Visual drag-and-drop itinerary editor with day by-day timeline, accommodation cards, activity blocks, transfer segments, dining reservations 

AI itinerary generation — Claude API integration: provide destination, dates, budget, client preferences → receive structured itinerary JSON. Advisor reviews/edits before publishing 

Template application — Apply saved itinerary templates to new trips, with smart date shifting PDF export — Server-side PDF rendering of branded itineraries for client delivery Supplier linking — Connect itinerary items to supplier bookings for real-time confirmation status 

Workflow Automation BACKEND 

Trigger-based automations — When trip reaches stage X → send email template Y, create task Z, notify advisor 

Document expiration alerts — Automatic notifications when passports/visas approach expiration (90, 60, 30 days) 

Follow-up sequences — Automated post-trip follow-up emails: thank you (day 1), feedback request (day 7), rebooking prompt (day 30\) 

Invoice reminders — Automated payment reminders at configurable intervals before and after due date  
13 Infrastructure & DevOps 

Production Hosting INFRA 

Web app — Vercel or Cloudflare Pages for edge-deployed SPA. Automatic preview deployments per PR. Custom domain with SSL 

Backend — Supabase hosted (Pro plan) with automatic backups, point-in-time recovery, and connection pooling 

CDN — Static assets (images, fonts, compiled CSS/JS) served from edge network 

Environment management — Staging \+ Production environments with isolated databases, feature flags for gradual rollout 

CI/CD Pipeline INFRA 

GitHub Actions — Lint → Type-check → Test → Build → Deploy on every push to main Preview deployments — Every pull request gets a unique preview URL for QA 

Lighthouse CI — Automated performance and PWA compliance audits on every deploy, ensuring mobile responsiveness and Core Web Vitals targets 

Database migrations — Supabase CLI for versioned migration files, applied in CI before deployment 

Monitoring & Security INFRA 

Error tracking — Sentry for frontend and Edge Function error capture with source maps Uptime monitoring — Health check endpoints with alerting (PagerDuty or Opsgenie) 

Security — Row-level security (RLS) on every table, CORS policy, rate limiting, encrypted secrets via environment variables, OWASP Top 10 compliance 

Backups — Daily automated database backups with 30-day retention, point-in-time recovery 

Compliance — GDPR data export/delete, SOC 2 alignment (Supabase provides), PCI compliance via NMI Collect.js tokenization (card data never touches Voyance servers)  
14 Phase II — Scope & Work Breakdown 

W O R K PA C K A G E D E P E N D E N C I E S P R I O R I T Y Supabase schema \+ RLS \+ migrations Schema design approval P0 — Foundation Authentication (advisor \+ client) Supabase project setup P0 — Foundation Wire all 15 screens to live data Schema \+ Auth complete P0 — Core Production deployment \+ CI/CD Domain, Vercel/CF account P0 — Foundation File storage (documents, passports) Storage buckets, signed URLs P1 — Core Email transactional (SendGrid/Resend) Template system, SMTP credentials P1 — Operations Workflow automations (backend) Edge Functions, email service P1 — Operations Monitoring, security audit, compliance Production environment live P1 — Launch AI itinerary generation (Claude API) Itinerary schema, API key P2 — Differentiator Mobile-responsive layouts \+ PWA Core screens stable P2 — Expansion Service worker caching \+ offline resilience PWA manifest, responsive layouts P3 — Polish  
15 Technical Risks & Mitigations 

R I S K I M PA C T M I T I G AT I O N 

Multi-tenant data leakage Critical Row-level security on every table, mandatory agency\_id filtering, automated RLS policy testing 

NMI Gateway integration complexity High Start with direct API \+ Collect.js tokenization. Use NMI sandbox environment extensively for testing. Validate 

PCI scope early 

Mobile responsive complexity Medium Prioritize mobile layouts for high-use screens first (Dashboard, Trips, Tasks, Portal). Dense desktop views 

(Reports, Admin) may need simplified mobile variants 

Real-time sync conflicts Medium Optimistic UI with server reconciliation, last-write-wins for non-critical fields, explicit locking for 

invoices/payments 

PWA limitations on iOS Low iOS Safari limits push notifications and background sync for PWAs. Browser notifications via Push API work 

on Android and desktop; iOS 16.4+ supports web push 

but with restrictions 

Voyance Technical Specification v1.0 Confidential — For Internal Engineering Use