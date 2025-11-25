# Creovine Platform Restructure Plan

---

## 🎯 ONBOARDING FLOWS MASTER PLAN

### Service Categories & Their Onboarding Flows

We have **14 service categories**. Each has a tailored onboarding flow, but they share common modules that can be **pre-filled** when selected as add-ons.

---

## 📊 SERVICE INTERCONNECTION MATRIX

| Primary Service | Can Include As Add-Ons |
|----------------|------------------------|
| **Full-Stack App** | Frontend, Backend, Database, Authentication, Payment, Smart Contract, API Integration, Deployment |
| **Frontend Development** | UI/UX Design, API Integration, Authentication |
| **Backend Development** | Database, Authentication, API Integration, Payment, Deployment |
| **Landing Page** | UI/UX Design, Payment, Smart Contract, Authentication, QR Code |
| **UI/UX Design** | Frontend Development |
| **Smart Contract** | Frontend, Backend, Landing Page |
| **Bug Fix** | (Standalone - no add-ons, just context) |
| **API Integration** | Backend, Authentication, Payment |
| **QR Code System** | Backend, Database, Landing Page |
| **Database Setup** | Backend, Authentication |
| **Authentication** | Backend, Database |
| **Payment Integration** | Backend, Database, Authentication |
| **Deployment Help** | (Standalone - deployment context only) |
| **Code Refactoring** | (Standalone - code context only) |

---

## 🔄 SHARED MODULES (Reusable Across Flows)

These modules can appear in multiple flows and will be **pre-filled** if selected as add-ons:

### Module: Authentication
- Auth methods (Email, Google, Facebook, Apple, Phone, Magic Link)
- User roles (Customer, Admin, Vendor, etc.)
- Security features (2FA, session management)

### Module: Database
- Data types needed (Users, Products, Orders, Content, etc.)
- Storage requirements
- Relationships/queries needed

### Module: Payment
- Payment providers (Stripe, PayPal, Paystack)
- Payment types (One-time, Subscription, Marketplace)
- Currency/region requirements

### Module: Smart Contract
- Blockchain (Ethereum, Polygon, Solana, etc.)
- Contract type (Token, NFT, DeFi, Custom)
- Features (Minting, Staking, Trading, etc.)

### Module: API Integration
- Third-party services needed
- Custom API requirements
- Webhook needs

### Module: Deployment
- Platform preference (Firebase, Vercel, AWS, etc.)
- Domain setup
- CI/CD requirements

### Module: Design/UI
- Design style (Modern, Minimalist, Playful, Professional)
- Color scheme
- Branding assets

---

## 📝 DETAILED ONBOARDING FLOWS

### 1. FULL-STACK APP (Existing - 6 Phases) ✅
**Route:** `/onboarding/phase1` → `phase6`
**Status:** Already built

| Phase | Name | Questions |
|-------|------|-----------|
| 1 | App Vision | App type, Core purpose, Key features, Inspiration |
| 2 | Target Users | Target audience, User types/roles, User journey |
| 3 | Features | Auth methods, Account features, Core features, Additional features |
| 4 | Backend & Data | Database needs, Integrations, File storage, Realtime features |
| 5 | Identity & Design | Project name, Tagline, Colors, Design style, Logo |
| 6 | Deployment | Platform, Domain, Timeline, Support needs |

**Add-on Integration Points:**
- If `Smart Contract` add-on → Show blockchain questions in Phase 3
- If `Payment` add-on → Pre-select payment in Phase 3 integrations
- If `QR Code` add-on → Add QR features to Phase 3

---

### 2. FRONTEND DEVELOPMENT (New - 4 Steps)
**Route:** `/onboarding/frontend/step1` → `step4`

| Step | Name | Questions |
|------|------|-----------|
| 1 | Project Overview | Project type (New/Existing), Framework preference (React, Vue, Next.js, etc.), Current state description |
| 2 | UI Requirements | Pages/screens needed, Components needed, Responsive requirements, Design reference |
| 3 | Integration Needs | API endpoints to connect, State management, Third-party libraries |
| 4 | Delivery | Timeline, Deliverables format, Support needs |

**Add-on Integration:**
- If `UI/UX Design` add-on → Show design style questions in Step 2
- If `API Integration` add-on → Expand API section in Step 3
- If `Authentication` add-on → Add auth UI components to Step 2

---

### 3. BACKEND DEVELOPMENT (New - 4 Steps)
**Route:** `/onboarding/backend/step1` → `step4`

| Step | Name | Questions |
|------|------|-----------|
| 1 | Project Overview | Project type (New/Existing), Tech stack preference (Node, Python, Go, etc.), Architecture style |
| 2 | Data & Database | Database type (SQL/NoSQL), Data models needed, Relationships, Storage needs |
| 3 | API & Services | API endpoints needed, Third-party integrations, Background jobs, Realtime needs |
| 4 | Deployment & Security | Hosting preference, Security requirements, Scaling needs, Timeline |

**Add-on Integration:**
- If `Database` add-on → Pre-fill database section in Step 2
- If `Authentication` add-on → Add auth endpoints to Step 3
- If `Payment` add-on → Add payment endpoints to Step 3
- If `API Integration` add-on → Expand integrations in Step 3

---

### 4. LANDING PAGE (New - 3 Steps)
**Route:** `/onboarding/landing-page/step1` → `step3`

| Step | Name | Questions |
|------|------|-----------|
| 1 | Purpose & Audience | Page purpose (Launch, Waitlist, Sales, Portfolio, Event), Target audience, Call-to-action goal |
| 2 | Content & Design | Sections needed (Hero, Features, Pricing, Testimonials, FAQ, Contact), Design style, Brand colors, Copy assistance needed? |
| 3 | Features & Delivery | Forms/integrations (Email capture, Payment, Calendar), Domain setup, Timeline |

**Add-on Integration:**
- If `Smart Contract` add-on → Add Web3 connect section, NFT showcase options
- If `Payment` add-on → Add pricing/checkout section
- If `Authentication` add-on → Add login/signup section
- If `QR Code` add-on → Add QR display/download section
- If `UI/UX Design` add-on → Expand design questions in Step 2

---

### 5. UI/UX DESIGN (New - 3 Steps)
**Route:** `/onboarding/design/step1` → `step3`

| Step | Name | Questions |
|------|------|-----------|
| 1 | Project Scope | Design type (App, Website, Dashboard, Component library), Platform (Web, Mobile, Both), Current state (New/Redesign) |
| 2 | Style & Brand | Design style preference, Color preferences, Brand assets, Inspiration/references |
| 3 | Deliverables | Screens/pages needed, Deliverable format (Figma, Sketch, Code), Timeline, Handoff requirements |

**Add-on Integration:**
- If `Frontend` add-on → Add implementation handoff questions

---

### 6. SMART CONTRACT (New - 4 Steps)
**Route:** `/onboarding/contract/step1` → `step4`

| Step | Name | Questions |
|------|------|-----------|
| 1 | Blockchain & Type | Blockchain (Ethereum, Polygon, Solana, BSC, etc.), Contract type (Token, NFT, DeFi, DAO, Custom) |
| 2 | Contract Features | Specific features (Minting, Burning, Staking, Trading, Royalties, Voting), Tokenomics (if token), Supply/pricing |
| 3 | Frontend & Integration | Need frontend? (Mint page, Dashboard, Marketplace), Wallet integration, Backend needs |
| 4 | Security & Deployment | Audit requirements, Testnet deployment, Mainnet deployment, Documentation needs |

**Add-on Integration:**
- If `Landing Page` add-on → Add mint page/showcase questions in Step 3
- If `Frontend` add-on → Expand dApp frontend in Step 3
- If `Backend` add-on → Add backend API for contract interaction

---

### 7. BUG FIX (New - 2 Steps)
**Route:** `/onboarding/bugfix/step1` → `step2`

| Step | Name | Questions |
|------|------|-----------|
| 1 | Issue Description | Bug description, Expected vs actual behavior, When it started, Error messages/screenshots, Steps to reproduce |
| 2 | Technical Context | Tech stack, Code access method (GitHub, ZIP, Screen share), Environment (Dev/Staging/Prod), Urgency level |

**Note:** Bug fix is standalone - no add-ons affect it

---

### 8. API INTEGRATION (New - 3 Steps)
**Route:** `/onboarding/api/step1` → `step3`

| Step | Name | Questions |
|------|------|-----------|
| 1 | Integration Overview | Service to integrate (Stripe, Twilio, SendGrid, Custom API, etc.), Current tech stack, Integration scope |
| 2 | Requirements | Specific features needed, Authentication method, Data flow requirements, Error handling needs |
| 3 | Testing & Delivery | Test environment, Documentation needs, Timeline, Support requirements |

**Add-on Integration:**
- If `Backend` add-on → Add backend setup questions
- If `Authentication` add-on → Add auth flow integration
- If `Payment` add-on → Focus payment-specific questions

---

### 9. QR CODE SYSTEM (New - 3 Steps)
**Route:** `/onboarding/qrcode/step1` → `step3`

| Step | Name | Questions |
|------|------|-----------|
| 1 | Use Case | QR purpose (Product tracking, Event tickets, Restaurant menu, Payments, Marketing), Static vs Dynamic QR |
| 2 | Features | Generation requirements, Scanning requirements, Data storage, Analytics/tracking needs |
| 3 | Integration | Where to display (Web, Print, App), Backend needs, Management dashboard, Timeline |

**Add-on Integration:**
- If `Backend` add-on → Add database/API questions
- If `Landing Page` add-on → Add display page questions
- If `Database` add-on → Pre-fill storage questions

---

### 10. DATABASE SETUP (New - 3 Steps)
**Route:** `/onboarding/database/step1` → `step3`

| Step | Name | Questions |
|------|------|-----------|
| 1 | Database Requirements | Database type (PostgreSQL, MongoDB, MySQL, Firebase, etc.), New or migration, Data types overview |
| 2 | Schema Design | Tables/collections needed, Relationships, Indexes, Query patterns |
| 3 | Setup & Access | Hosting preference, Backup requirements, Access patterns, Timeline |

**Add-on Integration:**
- If `Backend` add-on → Add API layer questions
- If `Authentication` add-on → Add user table requirements

---

### 11. AUTHENTICATION (New - 3 Steps)
**Route:** `/onboarding/auth/step1` → `step3`

| Step | Name | Questions |
|------|------|-----------|
| 1 | Auth Requirements | Auth methods (Email, Social, Phone, SSO), User types/roles, Existing system integration? |
| 2 | Security Features | Password requirements, 2FA, Session management, Account recovery |
| 3 | Implementation | Tech stack, Database for users, Frontend integration, Timeline |

**Add-on Integration:**
- If `Backend` add-on → Add API endpoint questions
- If `Database` add-on → Pre-fill user storage questions

---

### 12. PAYMENT INTEGRATION (New - 3 Steps)
**Route:** `/onboarding/payment/step1` → `step3`

| Step | Name | Questions |
|------|------|-----------|
| 1 | Payment Overview | Payment provider (Stripe, PayPal, Paystack, etc.), Payment types (One-time, Subscription, Marketplace), Currencies needed |
| 2 | Features | Checkout flow, Webhooks needed, Refund handling, Invoice/receipts |
| 3 | Integration | Tech stack, Frontend checkout UI, Backend setup, Testing requirements |

**Add-on Integration:**
- If `Backend` add-on → Add payment endpoint questions
- If `Database` add-on → Add transaction storage questions
- If `Authentication` add-on → Link payments to users

---

### 13. DEPLOYMENT HELP (New - 2 Steps)
**Route:** `/onboarding/deployment/step1` → `step2`

| Step | Name | Questions |
|------|------|-----------|
| 1 | Project Overview | What to deploy (Frontend, Backend, Full-stack, Database), Current setup, Tech stack |
| 2 | Deployment Requirements | Platform preference (Vercel, Firebase, AWS, DigitalOcean, etc.), Domain setup, CI/CD needs, Environment variables, Timeline |

**Note:** Deployment is mostly standalone

---

### 14. CODE REFACTORING (New - 3 Steps)
**Route:** `/onboarding/refactor/step1` → `step3`

| Step | Name | Questions |
|------|------|-----------|
| 1 | Current State | Codebase overview, Tech stack, Main pain points, Code access method |
| 2 | Goals | Refactoring goals (Performance, Readability, Scalability, Modernization), Specific areas to focus |
| 3 | Scope & Delivery | Scope (Full codebase, Specific modules), Documentation needs, Timeline, Code review process |

**Note:** Refactoring is standalone

---

## 🛒 ASSISTED SERVICES (Per Module)

Each flow will have **AssistedToggle** options:

| Module | Assisted Service | Price |
|--------|-----------------|-------|
| Vision/Purpose | "Help me define this" | $15-25 |
| Features | "Brainstorm for me" | $25-35 |
| Database Schema | "Design for me" | $30-50 |
| Authentication | "Set up for me" | $40-60 |
| Payment | "Configure for me" | $50-75 |
| Smart Contract | "Write for me" | $100-500 |
| Design | "Design for me" | $50-150 |
| Deployment | "Deploy for me" | $30-50 |

---

## 🚀 IMPLEMENTATION ORDER

1. ✅ **Full-Stack App** - Already complete
2. 🔜 **Frontend Development** - Next to implement
3. **Backend Development**
4. **Landing Page** (has partial implementation)
5. **UI/UX Design**
6. **Smart Contract**
7. **Bug Fix**
8. **API Integration**
9. **QR Code System**
10. **Database Setup**
11. **Authentication**
12. **Payment Integration**
13. **Deployment Help**
14. **Code Refactoring**

---

## 📋 ADD-ON PRE-FILL LOGIC

When user selects add-ons on `/get-started`:

```javascript
// In onboarding flow, check for add-ons:
const { projectData } = useProject();
const addOns = projectData.addOns || [];

// Show/pre-fill sections based on add-ons
const hasSmartContract = addOns.some(a => a.id === 'smart-contract');
const hasPayment = addOns.some(a => a.id === 'payment');
const hasAuth = addOns.some(a => a.id === 'authentication');
const hasDatabase = addOns.some(a => a.id === 'database');
// etc.
```

This allows each onboarding flow to conditionally show relevant sections based on what the user selected as add-ons.

---
## From "App Builder" to "Code Solutions Platform"

---

## 🎯 Executive Summary

Creovine is evolving from a single-purpose "app builder" into a comprehensive **Code Solutions Platform**. This document outlines the new user journey, service categories, dynamic onboarding flows, and pricing structure.

**Core Philosophy:** "What do you need built today?" — not "Build your app"

---

## 📐 New Platform Architecture

### Current Flow (Old)
```
Landing Page → Get Started → App Vision (Phase 1) → Frontend → Backend → ... → Checkout
```

### New Flow (Proposed)
```
Landing Page → Get Started → Solution Hub (Google-style) → Category Selection → Dynamic Onboarding → Checkout
```

---

## 🏠 The Solution Hub (New Entry Point)

### Design Concept
A clean, Google-inspired interface that asks one simple question:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                         [Creovine Logo]                                 │
│                                                                         │
│                    What do you need built today?                        │
│                                                                         │
│    ┌─────────────────────────────────────────────────────────────┐     │
│    │  🔍  Describe what you need...                              │     │
│    └─────────────────────────────────────────────────────────────┘     │
│                                                                         │
│    ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                │
│    │ 📱 Full App  │  │ 🌐 Landing   │  │ ⛓️ Smart     │                │
│    │    Build     │  │    Page      │  │   Contract   │                │
│    └──────────────┘  └──────────────┘  └──────────────┘                │
│                                                                         │
│    ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                │
│    │ 🐛 Bug Fix   │  │ 🔌 API       │  │ 🏗️ Code      │                │
│    │              │  │ Integration  │  │ Architecture │                │
│    └──────────────┘  └──────────────┘  └──────────────┘                │
│                                                                         │
│    ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                │
│    │ 🖥️ Backend   │  │ 📦 Dependency│  │ 💬 Talk to   │                │
│    │   Support    │  │   Resolution │  │   Expert     │                │
│    └──────────────┘  └──────────────┘  └──────────────┘                │
│                                                                         │
│              Don't see what you need? Talk to an expert →               │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Key Features

1. **Smart Search Input**
   - Auto-suggest as user types
   - Maps natural language to service categories
   - Examples:
     - "I want to build a dating app" → Routes to Full App Build
     - "My React app has memory leaks" → Routes to Bug Fix
     - "Need a token on Ethereum" → Routes to Smart Contract
     - "Connect Stripe to my backend" → Routes to API Integration

2. **Category Chips**
   - Visual, clickable chips for quick selection
   - Icon + Label for clarity
   - Hover states showing brief descriptions
   - Selected state with checkmark

3. **Fallback to Expert**
   - If search yields no matches → "Talk to an Expert" CTA
   - Creates a support ticket with their query
   - Routes to expert chat system we built

---

## 📦 Service Categories & Dynamic Onboarding

Each service category has its own tailored onboarding flow:

### 1. 📱 Full App Build
**Description:** Complete mobile or web application development

**Onboarding Phases:**
```
Phase 1: App Vision
├── App name & description
├── Platform (iOS, Android, Web, Cross-platform)
├── Target audience
└── Similar apps for reference

Phase 2: Design & Frontend
├── Design style preference
├── Color scheme
├── Key screens needed
└── [Assisted] Custom UI/UX Design (+$)

Phase 3: Backend & Data
├── User authentication needs
├── Database requirements
├── Third-party integrations
└── [Assisted] Complex backend architecture (+$)

Phase 4: Features
├── Core features checklist
├── Advanced features
├── AI/ML requirements
└── [Assisted] Custom feature development (+$)

Phase 5: Launch & Deployment
├── App store submission
├── Hosting preferences
├── Domain setup
└── [Assisted] Managed deployment (+$)

Phase 6: Review & Checkout
├── Project summary
├── Timeline estimate
├── Total price calculation
└── Payment
```

**Base Complexity Pricing:**
| App Type | Base Price | Complexity Multiplier |
|----------|------------|----------------------|
| Simple Utility App | $800 | 1.0x |
| Social/Dating App | $2,500 | 1.5x |
| E-commerce App | $3,500 | 2.0x |
| Fintech App | $5,000 | 2.5x |
| Healthcare App | $6,000 | 3.0x |
| Enterprise App | $8,000+ | 3.5x+ |

---

### 2. 🌐 Landing Page
**Description:** Single-page marketing websites

**Onboarding Phases:**
```
Phase 1: Page Purpose
├── Business/product name
├── Page goal (launch, waitlist, sales, portfolio)
├── Target audience
└── Call-to-action type

Phase 2: Content & Design
├── Sections needed (Hero, Features, Pricing, FAQ, etc.)
├── Design style (Modern, Minimal, Bold, Corporate)
├── Brand colors & logo upload
└── [Assisted] Copywriting (+$)

Phase 3: Functionality
├── Email capture/newsletter
├── Contact form
├── Analytics integration
├── Payment integration (if selling)
└── [Assisted] Custom animations (+$)

Phase 4: Hosting & Domain
├── Domain preferences
├── Hosting setup
└── SSL certificate

Phase 5: Review & Checkout
├── Preview mockup
├── Total price
└── Payment
```

**Base Complexity Pricing:**
| Landing Page Type | Base Price |
|-------------------|------------|
| Simple (1-3 sections) | $150 |
| Standard (4-6 sections) | $300 |
| Advanced (7+ sections, animations) | $500 |
| E-commerce Landing | $800 |

---

### 3. ⛓️ Smart Contract
**Description:** Blockchain smart contract development

**Onboarding Phases:**
```
Phase 1: Contract Type
├── Blockchain (Ethereum, Solana, BSC, Polygon, etc.)
├── Contract purpose:
│   ├── Token (ERC-20, ERC-721 NFT, ERC-1155)
│   ├── DeFi (Staking, Yield, DEX)
│   ├── DAO/Governance
│   ├── Marketplace
│   └── Custom Logic
└── Existing contracts to integrate with?

Phase 2: Token Details (if applicable)
├── Token name & symbol
├── Total supply
├── Tokenomics (mint, burn, tax)
├── Distribution plan
└── [Assisted] Tokenomics design (+$)

Phase 3: Smart Contract Features
├── Access control
├── Upgradability
├── Multi-sig requirements
├── Time locks
└── [Assisted] Security audit (+$)

Phase 4: Testing & Deployment
├── Testnet deployment
├── Mainnet deployment
├── Verification on explorer
└── [Assisted] Ongoing maintenance (+$)

Phase 5: Review & Checkout
├── Contract specifications
├── Security considerations
├── Total price
└── Payment
```

**Base Complexity Pricing:**
| Contract Type | Base Price |
|---------------|------------|
| Simple ERC-20 Token | $300 |
| NFT Collection (ERC-721) | $600 |
| Staking Contract | $1,200 |
| DEX/AMM | $3,000 |
| Full DeFi Protocol | $5,000+ |
| Custom Complex Logic | Quote Required |

---

### 4. 🐛 Bug Fix
**Description:** Debugging and fixing existing code issues

**Onboarding Phases:**
```
Phase 1: Issue Overview
├── Brief description of the bug
├── When did it start happening?
├── Error messages (if any)
└── Screenshots/recordings

Phase 2: Technical Context
├── Programming language(s)
├── Framework(s) used
├── Environment (local, staging, production)
└── Recent changes made

Phase 3: Code Access
├── GitHub/GitLab repo link
├── Specific file(s) affected
├── Steps to reproduce
└── [Assisted] Full codebase review (+$)

Phase 4: Priority & Timeline
├── Urgency level (Critical, High, Medium, Low)
├── Preferred turnaround time
└── Ongoing support needed?

Phase 5: Review & Checkout
├── Issue summary
├── Estimated fix time
├── Total price
└── Payment
```

**Base Complexity Pricing:**
| Bug Type | Base Price |
|----------|------------|
| Simple syntax/typo fix | $25 |
| Logic error | $50-100 |
| Performance issue | $100-200 |
| Memory leak | $150-300 |
| Security vulnerability | $200-500 |
| Complex multi-file bug | $300+ |

---

### 5. 🔌 API Integration
**Description:** Connecting third-party services to your application

**Onboarding Phases:**
```
Phase 1: Integration Type
├── Which API(s) to integrate?
│   ├── Payment (Stripe, PayPal, Paystack)
│   ├── Auth (Google, Apple, Facebook, Auth0)
│   ├── Maps (Google Maps, Mapbox)
│   ├── Communication (Twilio, SendGrid)
│   ├── AI/ML (OpenAI, Google AI)
│   ├── Storage (AWS S3, Firebase, Cloudinary)
│   └── Custom/Other
└── Multiple integrations?

Phase 2: Your Application
├── Tech stack
├── Current architecture
├── Existing integrations
└── Code access method

Phase 3: Requirements
├── Specific features needed
├── Data flow requirements
├── Error handling preferences
└── [Assisted] Architecture planning (+$)

Phase 4: Testing & Documentation
├── Test environment setup
├── Documentation needs
└── [Assisted] Ongoing maintenance (+$)

Phase 5: Review & Checkout
├── Integration summary
├── Total price
└── Payment
```

**Base Complexity Pricing:**
| Integration Type | Base Price |
|------------------|------------|
| Single simple API | $100 |
| Payment gateway | $200 |
| OAuth/Social login | $150 |
| Complex API with webhooks | $300 |
| Multiple integrations | $400+ |

---

### 6. 🏗️ Code Architecture
**Description:** Restructuring and cleaning up existing codebases

**Onboarding Phases:**
```
Phase 1: Current State
├── Codebase size estimate
├── Main issues/pain points
├── Tech debt concerns
└── Current tech stack

Phase 2: Goals
├── Performance improvement
├── Scalability needs
├── Maintainability
├── Modern framework migration
└── Security hardening

Phase 3: Code Access
├── Repository access
├── Documentation available?
├── Team handoff needed?
└── [Assisted] Full code audit (+$)

Phase 4: Deliverables
├── Refactored code
├── Documentation
├── Migration guide
├── Team training
└── [Assisted] Ongoing support (+$)

Phase 5: Review & Checkout
├── Scope summary
├── Timeline
├── Total price
└── Payment
```

**Base Complexity Pricing:**
| Service | Base Price |
|---------|------------|
| Small codebase cleanup | $200 |
| Medium refactor | $500 |
| Large restructure | $1,000+ |
| Full migration | $2,000+ |

---

### 7. 🖥️ Backend Support
**Description:** Backend development, database, server support

**Onboarding Phases:**
```
Phase 1: Support Type
├── New backend development
├── Existing backend modifications
├── Database design/optimization
├── Server setup/DevOps
└── Performance optimization

Phase 2: Technical Details
├── Preferred stack (Node.js, Python, Go, etc.)
├── Database type (SQL, NoSQL)
├── Hosting preference (AWS, GCP, Firebase, etc.)
└── Scale requirements

Phase 3: Scope Definition
├── Specific tasks needed
├── API endpoints required
├── Authentication needs
├── Third-party integrations
└── [Assisted] Architecture design (+$)

Phase 4: Deliverables
├── Code delivery
├── Documentation
├── Deployment
└── [Assisted] Ongoing maintenance (+$)

Phase 5: Review & Checkout
├── Scope summary
├── Total price
└── Payment
```

---

### 8. 📦 Dependency Resolution
**Description:** Fixing package conflicts, version issues, build errors

**Onboarding Phases:**
```
Phase 1: Issue Type
├── Package conflicts
├── Version incompatibility
├── Build/compile errors
├── Security vulnerabilities
└── Upgrade assistance

Phase 2: Environment
├── Package manager (npm, yarn, pip, etc.)
├── Framework/platform
├── Node/Python/Ruby version
└── Error logs

Phase 3: Code Access
├── Repository link
├── package.json/requirements.txt
├── Lock file
└── Build configuration

Phase 4: Resolution
├── Fix delivery
├── Documentation
└── [Assisted] Dependency audit (+$)

Phase 5: Review & Checkout
├── Issue summary
├── Total price
└── Payment
```

**Base Complexity Pricing:**
| Issue Type | Base Price |
|------------|------------|
| Simple conflict | $30 |
| Multiple conflicts | $75 |
| Major version upgrade | $150 |
| Full dependency audit | $250 |

---

## 💰 Pricing System Architecture

### Components

1. **Base Price** - Determined by service category and type
2. **Complexity Multiplier** - Based on project specifics
3. **Assisted Services** - Optional add-ons throughout onboarding
4. **Rush Fee** - For expedited delivery

### Formula
```
Final Price = (Base Price × Complexity Multiplier) + Assisted Services + Rush Fee
```

### Assisted Services (Add to Cart)
Each phase can have optional "assisted" upgrades:

| Service | Price Range |
|---------|-------------|
| Custom UI/UX Design | $200-500 |
| Complex Architecture | $300-800 |
| Security Audit | $400-1,000 |
| Managed Deployment | $150-300 |
| Copywriting | $100-250 |
| Ongoing Maintenance | $200/month |
| Priority Support | $100/month |
| Code Documentation | $150-400 |
| Team Training | $300-600 |

### Rush Fees
| Timeline | Multiplier |
|----------|------------|
| Standard (7-14 days) | 1.0x |
| Fast (3-7 days) | 1.25x |
| Rush (1-3 days) | 1.5x |
| Emergency (24 hours) | 2.0x |

---

## 🛤️ User Journey Flow

### Step 1: Solution Hub Entry
```
User clicks "Get Started Now"
        ↓
Solution Hub loads (Google-style interface)
        ↓
User types OR clicks category chip
```

### Step 2: Smart Routing
```
IF user types in search:
    ├── AI matches to category → Route to onboarding
    ├── Partial match → Show suggestions dropdown
    └── No match → "Talk to Expert" CTA

IF user clicks chip:
    └── Direct route to category onboarding
```

### Step 3: Dynamic Onboarding
```
Category-specific phases load
        ↓
User progresses through phases
        ↓
Assisted services shown (add to cart)
        ↓
Cart updates in real-time
```

### Step 4: Checkout
```
All phases complete
        ↓
Final summary with:
    ├── Service selected
    ├── Options chosen
    ├── Assisted services
    ├── Complexity calculation
    └── Total price
        ↓
Payment processing
        ↓
Project kickoff / Expert assignment
```

---

## 🎨 UI/UX Considerations

### Solution Hub Design
- **Minimal & Clean** - No distractions, focus on the search/chips
- **Animated Chips** - Subtle hover effects, selection animations
- **Dark Theme** - Consistent with current Creovine branding
- **Mobile-First** - Full functionality on mobile devices

### Search Behavior
- **Debounced Input** - 300ms delay before suggestions
- **Dropdown Suggestions** - Max 5 relevant matches
- **Keyboard Navigation** - Arrow keys + Enter to select
- **Recent Searches** - For returning users

### Chip Design
```css
/* Chip States */
Default:    bg-#214055, border-transparent, text-white
Hover:      bg-#2A5270, border-#29BD98, transform: scale(1.02)
Selected:   bg-gradient(#29BD98, #2497F9), border-none, checkmark icon
```

### Progress Persistence
- Save progress to localStorage
- Resume incomplete onboarding
- Show "Continue where you left off" on return

---

## 🗂️ File Structure (New)

```
src/
├── pages/
│   ├── SolutionHub.jsx          # New entry point (Google-style)
│   ├── onboarding/
│   │   ├── AppBuildFlow/        # Full app phases (existing, restructured)
│   │   │   ├── Phase1Vision.jsx
│   │   │   ├── Phase2Design.jsx
│   │   │   ├── Phase3Backend.jsx
│   │   │   ├── Phase4Features.jsx
│   │   │   └── Phase5Launch.jsx
│   │   │
│   │   ├── LandingPageFlow/     # Landing page phases
│   │   │   ├── Phase1Purpose.jsx
│   │   │   ├── Phase2Content.jsx
│   │   │   ├── Phase3Function.jsx
│   │   │   └── Phase4Hosting.jsx
│   │   │
│   │   ├── SmartContractFlow/   # Smart contract phases
│   │   │   ├── Phase1Type.jsx
│   │   │   ├── Phase2Token.jsx
│   │   │   ├── Phase3Features.jsx
│   │   │   └── Phase4Deploy.jsx
│   │   │
│   │   ├── BugFixFlow/          # Bug fix phases
│   │   │   ├── Phase1Issue.jsx
│   │   │   ├── Phase2Context.jsx
│   │   │   ├── Phase3Access.jsx
│   │   │   └── Phase4Priority.jsx
│   │   │
│   │   ├── APIIntegrationFlow/  # API integration phases
│   │   │   ├── Phase1Type.jsx
│   │   │   ├── Phase2App.jsx
│   │   │   ├── Phase3Requirements.jsx
│   │   │   └── Phase4Testing.jsx
│   │   │
│   │   ├── CodeArchitectureFlow/ # Code architecture phases
│   │   │   ├── Phase1Current.jsx
│   │   │   ├── Phase2Goals.jsx
│   │   │   ├── Phase3Access.jsx
│   │   │   └── Phase4Deliverables.jsx
│   │   │
│   │   ├── BackendSupportFlow/  # Backend support phases
│   │   │   ├── Phase1Type.jsx
│   │   │   ├── Phase2Technical.jsx
│   │   │   ├── Phase3Scope.jsx
│   │   │   └── Phase4Deliverables.jsx
│   │   │
│   │   └── DependencyFlow/      # Dependency resolution phases
│   │       ├── Phase1Issue.jsx
│   │       ├── Phase2Environment.jsx
│   │       └── Phase3Access.jsx
│   │
│   ├── Checkout.jsx             # Unified checkout (existing)
│   └── ...
│
├── components/
│   ├── solutionHub/
│   │   ├── SearchInput.jsx      # Smart search with suggestions
│   │   ├── CategoryChip.jsx     # Service category chip
│   │   ├── SuggestionDropdown.jsx
│   │   └── NoMatchCTA.jsx       # "Talk to Expert" fallback
│   │
│   └── onboarding/
│       ├── DynamicPhaseWrapper.jsx  # Handles different flows
│       ├── AssistedServiceCard.jsx  # Add-to-cart cards
│       └── ProgressIndicator.jsx    # Flow progress
│
├── context/
│   ├── ProjectContext.jsx       # Extended for all categories
│   └── CartContext.jsx          # Unchanged
│
├── config/
│   ├── serviceCategories.js     # All category definitions
│   ├── pricingRules.js          # Pricing logic
│   └── searchMappings.js        # Search → Category mappings
│
└── utils/
    ├── complexityCalculator.js  # Calculate final prices
    └── searchMatcher.js         # Smart search matching
```

---

## 🚀 Implementation Phases

### Phase 1: Foundation (Week 1)
- [ ] Create `SolutionHub.jsx` page
- [ ] Build `SearchInput` component with basic functionality
- [ ] Create `CategoryChip` component
- [ ] Set up routing from landing page
- [ ] Define `serviceCategories.js` configuration

### Phase 2: Search Intelligence (Week 1-2)
- [ ] Implement search suggestion logic
- [ ] Create `searchMappings.js` with keyword → category maps
- [ ] Build `SuggestionDropdown` component
- [ ] Add "Talk to Expert" fallback for no matches

### Phase 3: Dynamic Onboarding (Week 2-3)
- [ ] Create `LandingPageFlow` phases
- [ ] Create `SmartContractFlow` phases
- [ ] Create `BugFixFlow` phases
- [ ] Create `APIIntegrationFlow` phases
- [ ] Create `CodeArchitectureFlow` phases
- [ ] Create `BackendSupportFlow` phases
- [ ] Create `DependencyFlow` phases
- [ ] Restructure existing app build flow

### Phase 4: Pricing & Cart (Week 3)
- [ ] Implement `pricingRules.js`
- [ ] Create `complexityCalculator.js`
- [ ] Update `CartContext` for multi-category support
- [ ] Add assisted service cards to all flows

### Phase 5: Polish & Testing (Week 4)
- [ ] Mobile responsiveness testing
- [ ] Animation polish
- [ ] Progress persistence
- [ ] End-to-end testing
- [ ] User testing & feedback

---

## 📝 Search Keyword Mappings (Example)

```javascript
// config/searchMappings.js
export const searchMappings = {
  'full-app-build': {
    keywords: [
      'app', 'application', 'mobile app', 'web app', 'ios', 'android',
      'dating app', 'social app', 'e-commerce', 'marketplace', 'fintech',
      'build an app', 'create an app', 'develop an app', 'make an app'
    ],
    phrases: [
      'i want to build', 'i need an app', 'create a mobile', 'develop a web'
    ]
  },
  'landing-page': {
    keywords: [
      'landing page', 'landing', 'website', 'single page', 'marketing page',
      'sales page', 'waitlist', 'coming soon', 'portfolio'
    ],
    phrases: [
      'i need a website', 'simple website', 'one page', 'launch page'
    ]
  },
  'smart-contract': {
    keywords: [
      'smart contract', 'solidity', 'blockchain', 'ethereum', 'token',
      'erc20', 'erc721', 'nft', 'defi', 'crypto', 'web3', 'dao',
      'staking', 'yield', 'dex', 'swap'
    ],
    phrases: [
      'create a token', 'launch a coin', 'nft collection', 'defi protocol'
    ]
  },
  'bug-fix': {
    keywords: [
      'bug', 'fix', 'error', 'broken', 'not working', 'crash', 'issue',
      'debug', 'problem', 'memory leak', 'performance'
    ],
    phrases: [
      'my app is broken', 'code not working', 'fix my code', 'debug my'
    ]
  },
  'api-integration': {
    keywords: [
      'api', 'integration', 'connect', 'stripe', 'paypal', 'twilio',
      'sendgrid', 'firebase', 'aws', 'google', 'webhook', 'oauth'
    ],
    phrases: [
      'integrate with', 'connect to', 'add stripe', 'setup payment'
    ]
  },
  'code-architecture': {
    keywords: [
      'refactor', 'architecture', 'cleanup', 'restructure', 'optimize',
      'tech debt', 'legacy', 'migrate', 'modernize', 'scalability'
    ],
    phrases: [
      'clean up code', 'improve architecture', 'refactor my', 'migrate to'
    ]
  },
  'backend-support': {
    keywords: [
      'backend', 'server', 'database', 'api development', 'node',
      'python', 'django', 'express', 'graphql', 'rest api', 'devops'
    ],
    phrases: [
      'build a backend', 'need a server', 'database design', 'api endpoints'
    ]
  },
  'dependency-resolution': {
    keywords: [
      'dependency', 'package', 'npm', 'yarn', 'pip', 'version',
      'conflict', 'incompatible', 'upgrade', 'install error'
    ],
    phrases: [
      'package conflict', 'version error', 'npm install failing', 'cannot resolve'
    ]
  }
};
```

---

## 🔗 MULTI-SELECT INTEGRATION (POST-BUILD IMPLEMENTATION)

After all 14 onboarding flows are complete, implement the following:

### Phase 1: Add-on Data Flow
When user clicks "Continue" from Solution Hub with multiple selections:
1. **Primary service** → Navigate to its onboarding flow
2. **Add-ons array** → Store in ProjectContext and carry through all steps
3. Each step should check for relevant add-ons and:
   - Show highlighted indicator boxes (already implemented in flows)
   - Pre-fill or show related questions
   - Skip redundant questions that add-on will cover

### Phase 2: Add-on Question Integration
For each add-on type, identify which questions should appear in the primary flow:

| Add-on | Questions to Show in Primary Flow |
|--------|----------------------------------|
| Database | DB type, models needed (show in Backend step) |
| Authentication | Auth methods, user roles (show in relevant step) |
| Payment | Provider, payment types (show in relevant step) |
| UI/UX Design | Design style, brand assets (show in design step) |
| API Integration | External APIs list (show in integration step) |
| Smart Contract | Blockchain, contract type (show as section) |

### Phase 3: Final Summary Enhancement
Before submission, show a comprehensive summary including:
```
┌─────────────────────────────────────────────────────────────┐
│                    PROJECT SUMMARY                          │
├─────────────────────────────────────────────────────────────┤
│ PRIMARY SERVICE: Backend Development                        │
│ ├── Tech Stack: Node.js (Express)                          │
│ ├── Database: PostgreSQL                                    │
│ ├── API Type: REST                                          │
│ └── Timeline: 2-4 weeks                                     │
├─────────────────────────────────────────────────────────────┤
│ ADD-ONS INCLUDED:                                           │
│                                                             │
│ ✓ Database Setup                                            │
│   └── Pre-configured with your Backend                      │
│                                                             │
│ ✓ Authentication                                            │
│   ├── Methods: Email, Google                                │
│   └── Roles: User, Admin                                    │
│                                                             │
│ ✓ Payment Integration                                       │
│   ├── Provider: Stripe                                      │
│   └── Type: Subscriptions                                   │
├─────────────────────────────────────────────────────────────┤
│ ASSISTED SERVICES:                                          │
│ ├── API Design Assist ($45)                                 │
│ └── Backend Support ($150)                                  │
├─────────────────────────────────────────────────────────────┤
│ ESTIMATED TOTAL: $X,XXX                                     │
└─────────────────────────────────────────────────────────────┘
```

### Phase 4: Implementation Checklist
- [ ] Update SolutionHub "Continue" to properly save primaryService + addOns
- [ ] Create shared AddOnSummary component for final step
- [ ] Add add-on mini-questionnaires in relevant steps
- [ ] Create unified submission that includes all add-on data
- [ ] Test all 14 flows with various add-on combinations
- [ ] Ensure cart items + add-ons + assisted services all appear in final summary

### Code Pattern for Add-on Questions
```jsx
// In any onboarding step
const { projectData } = useProject();
const addOns = projectData?.addOns || [];

// Check for specific add-ons
const hasDatabase = addOns.some(a => a.id === 'database');
const hasAuth = addOns.some(a => a.id === 'authentication');
const hasPayment = addOns.some(a => a.id === 'payment');

// Render add-on specific section
{hasPayment && (
  <AddOnSection 
    title="Payment Integration (Add-on)"
    description="Configure your payment setup"
  >
    <PaymentProviderSelect />
    <PaymentTypeSelect />
  </AddOnSection>
)}
```

---

## ✅ Success Metrics

1. **Conversion Rate** - Users who complete onboarding vs. start
2. **Time to Checkout** - Average time from Solution Hub to payment
3. **Category Distribution** - Which services are most popular
4. **Search Success Rate** - % of searches that find a match
5. **Expert Escalation Rate** - % that need human help
6. **Cart Value** - Average order value per category
7. **Assisted Service Adoption** - % who add premium services

---

## 🎯 Summary

This restructure transforms Creovine from a single-purpose tool into a comprehensive code solutions platform. The key changes:

1. **New Entry Point** - Solution Hub with search + category chips
2. **Multiple Service Paths** - 8 distinct onboarding flows
3. **Smart Routing** - AI-powered search matching
4. **Dynamic Pricing** - Category-specific complexity calculations
5. **Preserved Cart System** - Assisted services throughout all flows
6. **Expert Fallback** - Human support for edge cases

The result is a platform that can serve a much wider audience while maintaining the quality and personalized experience Creovine is known for.

---

*Document Version: 1.0*
*Last Updated: November 25, 2025*
*Author: Creovine Development Team*
