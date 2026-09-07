<p align="center">
  <img src="frontend/public/img.jpg" alt="ReWear Logo" width="130" style="border-radius: 28px; box-shadow: 0 16px 36px rgba(0,0,0,0.5);" />
  <h1 align="center">ReWear</h1>
  <p align="center">
    <strong>Production-Grade Physical-First Textile Exchange & Community Provenance Ledger</strong><br/>
    <em>Fiber Authentication, Natural Dry-Weight Audits, Dynamic Point Accounting, Direct Garment Swaps, and Depot Custody.</em>
  </p>
  <p align="center">
    <a href="#-quick-start"><img src="https://img.shields.io/badge/Vite-7.x-646CFF?logo=vite&logoColor=white" alt="Vite"></a>
    <a href="#-quick-start"><img src="https://img.shields.io/badge/React-19.x-61DAFB?logo=react&logoColor=black" alt="React"></a>
    <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-22c55e.svg" alt="MIT License"></a>
    <img src="https://img.shields.io/badge/Node.js-20.x-339933?logo=node.js&logoColor=white" alt="Node.js">
    <img src="https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white" alt="Express">
    <img src="https://img.shields.io/badge/Database-MongoDB_Atlas-47A248?logo=mongodb&logoColor=white" alt="MongoDB Atlas">
    <img src="https://img.shields.io/badge/Auth-JWT_%2B_Bcrypt-blue" alt="JWT Auth">
    <img src="https://img.shields.io/badge/Uploads-Multer_Storage-FF6F00" alt="Multer">
    <img src="https://img.shields.io/badge/TailwindCSS-Custom_Tokens-38B2AC?logo=tailwind_css&logoColor=white" alt="TailwindCSS">
    <img src="https://img.shields.io/badge/Circularity-Zero_Virgin_Polyester-10B981" alt="Circularity">
  </p>
  <p align="center">
    <a href="#-what-is-rewear">About</a> · 
    <a href="#-the-problem">The Problem</a> · 
    <a href="#-features">Features</a> · 
    <a href="#-architecture">Architecture</a> · 
    <a href="#-pipeline-workflow">Pipeline</a> · 
    <a href="#-feature-comparison">Comparison</a> · 
    <a href="#-quick-start">Quick Start</a> · 
    <a href="#-configuration-reference">Configuration</a> · 
    <a href="#-api-documentation">API Docs</a> · 
    <a href="#-team-information">Team</a>
  </p>
</p>

---

## 🌿 What is ReWear?

**ReWear** is a production-grade, community-driven textile exchange platform and provenance ledger. It eliminates the synthetic waste of fast fashion by transforming pre-loved, natural-fiber garments into a liquid, peer-verified circular wardrobe economy.

Instead of donating wearable clothes to opaque charity pipelines where over 80% end up burned or landfilled abroad, ReWear empowers neighborhood communities to catalogue garments with physical tare dry-weights, verifiable natural fiber compositions, and permanent drop-tag serial identifiers.

ReWear operates on a strict **Physical Integrity & Circular Accountability** philosophy:

- **100% Peer-to-Peer & Depot-Verified** — Garments are physically verified, weighed at regional depot hubs (e.g. Cascadia Regional Node 44-A), and certified for fiber purity.
- **Dual Settlement Mechanics** — Exchange garments directly via 1-to-1 physical item swaps or redeem pieces using community swap points earned from past contributions.
- **Dynamic Point Ledger** — Real-time atomic points accounting with welcome bonus incentives, garment listing rewards (+10 pts), and escrow refund protection on rejected proposals.
- **Member-Only Protocol Gating** — Public browsing is secured by an authenticated circulation gate; live inventory, provenance certificates, and direct proposals are protected behind JWT authentication.
- **Depot Inspector Administrative Terminal** — Complete back-office control panel allowing depot administrators to review physical items, audit fiber standards, approve/reject transfers, and manage member credentials.

---

## ⚠️ The Problem

The modern apparel industry relies on planned obsolescence, synthetic fiber blends, and broken donation streams:

| Challenge Area | Fast Fashion & Traditional Donation | With ReWear Community Exchange |
|---|---|---|
| **Textile Longevity** | Cheap polyester blends discarded after 7–10 wears | **Natural Fiber Focus**: 100% cotton, wool, linen, and canvas kept in continuous orbit |
| **Transparency** | Donated clothes shipped to overseas landfills or incinerated | **Verifiable Ledger**: Every garment has a unique TAG ID, lot number, and inspection record |
| **Exchange Fairness** | Buying new or selling through high-fee resale apps (20–40% fees) | **Zero-Fee Peer Trading**: Pure 1:1 barter swaps or community-backed point redemption |
| **Trust & Authentication**| Unverified thrift items with hidden tears or synthetic counterfeits | **Depot Verification**: Standardized dry-tare weights, fiber inspection, and hygienic laundering seals |
| **Community Incentive** | One-sided transactions with zero ongoing participation reward | **Dynamic Points**: Members earn points for circulating quality pieces and redeem them freely |
| **Data Protection** | Public scraping of user closets and unverified spam listings | **Protocol-Gated Member Circulation**: Protected routes ensuring trusted exchanges |

---

## ✨ Features

### 1. Physical Textile Provenance & Dry-Weight Intake
- Standardized intake metrics: dry tare weight in ounces/grams, weave structure, and fiber disclosure.
- Lot assignment and unique serial identifiers (e.g., `#TAG-C0482`, `LOT-284-A`).
- Zero virgin polyester priority: encourages pure cotton, raw wool, selvedge denim, and flax linen.

### 2. Dynamic Point Ledger & Welcome Bonus
- **Welcome Credit**: Every newly registered community member is immediately credited with **50 Welcome Points**.
- **Contribution Incentives**: Listing a verified garment awards **+10 Points** directly to the user's ledger.
- **Atomic MongoDB Updates**: Points are debited and credited atomically (`$inc`), eliminating concurrency race conditions.
- **Escrow Refund Safety**: Rejecting an active redemption proposal automatically restores points to the requester.
- **Dynamic Membership Tiers**: Real-time rank calculation (`New Member`, `Tier 1 Member`, `Tier 2 Member`, `Tier 3 Elder`).

### 3. Direct Swaps & Point Redemption
- **Dual Exchange Flow**: Members can offer a specific piece from their own wardrobe or spend earned points.
- Real-time stock reservation and exchange status lifecycle (`pending` $\rightarrow$ `accepted` $\rightarrow$ `completed` / `rejected`).
- Bidirectional updates with instant event dispatching across active UI navigation components.

### 4. Member-Only Gate & Authenticated Route Protection
- Public front-page showcases the textile mission, protocol standards, and teaser category racks.
- Private routes (`/dashboard`, `/profile`, `/admin`) are strictly guarded with `ProtectedRoute` and `AdminRoute`.
- Unauthenticated requests are gracefully redirected to `/login` with return destination tracking.

### 5. Depot Inspector Admin Terminal
- Dedicated administrative interface with station-level operational parameters (Cascadia Hub § Node 44-A).
- Full CRUD operations over cataloged garments, transfer status workflows, and member credentials.
- In-line point adjustments and clearance role delegation (`user` vs `admin`).

### 6. Local Drop Tag Generation & Lot Certificates
- Generate printable, authenticated depot swing tags with grommet holes, fiber certifications, and inspector seals.
- Instant modal preview for drop-off at local community lockers and physical collection nodes.

### 7. High-Performance Static Image CDN & Upload Pipeline
- Integrated file upload system powered by **Multer** with MIME-type validation and 10MB size limits.
- Files stored on local disk under `Backend/uploads/` and served statically through Express and Vite proxies.

---

## 🏛️ Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       ReWear Frontend (React 19 + Vite 7)                   │
│   Landing Page · Member Closet & Dashboard · Product Detail · Admin Terminal│
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ REST API / JWT Bearer / Static Assets
┌──────────────────────────────────────▼──────────────────────────────────────┐
│                       ReWear Backend (Node.js + Express)                    │
│   Auth Controller · User Routes · Products API · Orders API · Admin Portal  │
└──────────────┬───────────────────────┬───────────────────────┬──────────────┘
               │                       │                       │
      Mongoose │ Connection            │ Disk I/O              │ Nodemailer
┌──────────────▼─────────────┐ ┌───────▼────────────────┐ ┌────▼──────────────┐
│     MongoDB Atlas          │ │   Local File Storage   │ │   Email Service   │
│   - Users & Roles          │ │   - /Backend/uploads/  │ │   - Password Reset│
│   - Products & Specs       │ │   - Static Garment Img │ │   - Notifications │
│   - Orders & Ledger Points │ │   - High-Speed Cache   │ └───────────────────┘
└────────────────────────────┘ └────────────────────────┘
```

---

## 🔄 Pipeline Workflow

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ Member Signs │────►│ Welcomed with│────►│ Lists Quality│────►│ Physical Hub │
│ Up / In      │     │ 50 Points    │     │ Garment (+10)│     │ Verification │
└──────────────┘     └──────────────┘     └──────────────┘     └──────┬───────┘
                                                                      │
┌──────────────┐     ┌──────────────┐     ┌──────────────┐            │
│ Escrow Points│     │ Swap / Redeem│     │ Cataloged on │            │
│ Settled / Ref│◄────┤ Proposal     │◄────┤ Member Depot │◄───────────┘
└──────────────┘     │ Placed       │     │ Ledger       │
                     └──────────────┘     └──────────────┘
```

---

## 📊 Feature Comparison

| Capability | ReWear | Fast Fashion Retail | Thrift Stores / Goodwill | Commercial Resale Apps |
|---|:---:|:---:|:---:|:---:|
| **Zero Transaction Fees** | ✅ **100% Free** | ❌ High Markups | ❌ High Markups | ❌ 15–30% Seller Cut |
| **Physical Fiber Integrity** | ✅ **Spectrometry-Verified**| ❌ Cheap Synthetics | ⚠️ Uninspected | ⚠️ Self-Reported |
| **Point-Based Ledger** | ✅ **Dynamic Accounting** | ❌ Non-Existent | ❌ Non-Existent | ⚠️ Store Credit Only |
| **Direct 1:1 Barter Trades** | ✅ **Supported** | ❌ | ❌ | ❌ Cash Only |
| **Depot Swing Drop Tags** | ✅ **Integrated Generation** | ❌ | ❌ | ❌ Shipping Labels Only|
| **Role-Based Admin Portal** | ✅ **Depot Clearance** | ❌ | ❌ | ❌ |
| **Self-Hosted / Open Code** | ✅ **Full Control** | ❌ Proprietary | ❌ Proprietary | ❌ Proprietary |

---

## 🚀 Quick Start

### Prerequisites
- **[Node.js 20+](https://nodejs.org/)** and `npm`
- **[MongoDB Atlas Account](https://www.mongodb.com/cloud/atlas)** (or local MongoDB running on `mongodb://localhost:27017/rewear`)
- **Git**

---

### Step 1: Clone the Repository

```bash
git clone https://github.com/akumasan-07/ReWear.git
cd ReWear
```

---

### Step 2: Configure and Start the Backend

1. Navigate to the backend directory:
   ```bash
   cd Backend
   npm install
   ```

2. Create and configure your `.env` file:
   ```env
   # MongoDB Connection String
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.0jgodex.mongodb.net/rewear?appName=Cluster0

   # JWT Token Secret
   JWT_SECRET=your_super_secret_jwt_key_here

   # Server Port
   PORT=5000

   # Frontend Client URL
   FRONTEND_URL=http://localhost:5173

   # Optional Email Setup (Nodemailer for password recovery)
   EMAIL_SERVICE=gmail
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   ```

3. Launch the Backend Server:
   ```bash
   npm run dev
   # Server runs on http://localhost:5000
   ```

---

### Step 3: Configure and Start the Frontend

1. Open a second terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   npm install
   ```

2. Launch the Vite Dev Server:
   ```bash
   npm run dev
   # App runs on http://localhost:5173
   ```

---

### 🌐 Access Your Application:
- 💻 **Web Application**: [http://localhost:5173](http://localhost:5173)
- 🔐 **Member Sign In**: [http://localhost:5173/login](http://localhost:5173/login)
- 🗄️ **Member Closet & Ledger**: [http://localhost:5173/dashboard](http://localhost:5173/dashboard)
- 🛡️ **Depot Inspector Terminal**: [http://localhost:5173/admin](http://localhost:5173/admin) *(requires `role: admin`)*
- ⚙️ **Backend Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## ⚙️ Configuration Reference

| Variable | Default | Description |
|---|---|---|
| `PORT` | `5000` | Port for the Express backend API server |
| `MONGO_URI` | *required* | MongoDB Atlas or local MongoDB connection URI |
| `JWT_SECRET` | *required* | Secret key for signing and validating session tokens |
| `FRONTEND_URL` | `http://localhost:5173` | Allowed origin for CORS headers and password reset links |
| `EMAIL_SERVICE` | `gmail` | Nodemailer service provider |
| `EMAIL_USER` | *(optional)* | SMTP account for password reset dispatch |
| `EMAIL_PASS` | *(optional)* | App password for authenticated SMTP mail delivery |

---

## 📡 API Documentation

### Authentication (`/api/auth`)
- `POST /api/auth/signup` — Register a new member (awards 50 Welcome Points immediately)
- `POST /api/auth/login` — Sign in with email and password, receives JWT token and user profile
- `POST /api/auth/forgot-password` — Request a secure password reset link via email
- `POST /api/auth/reset-password/:token` — Reset account password using verified token

### User Management (`/api/user`)
- `GET /api/user/me` — Retrieve the currently authenticated member's profile and real-time point balance

### Garment Registry (`/api/products`)
- `GET /api/products` — Retrieve all cataloged garments with category and search filter parameters
- `GET /api/products/:id` — Retrieve detailed garment provenance certificate and tare specs
- `POST /api/products` — Register a new garment (awards +10 Points to the member)
- `PUT /api/products/:id` — Update garment title, condition, price, or circulation status
- `DELETE /api/products/:id` — Remove garment from circulation

### Transfer Orders & Escrow (`/api/orders`)
- `POST /api/orders` — Propose a 1:1 physical swap or points redemption (deducts points atomically)
- `GET /api/orders/my` — Fetch incoming and outgoing swap proposals for the authenticated user
- `PUT /api/orders/:id` — Update proposal status (`accepted`, `rejected`, `completed`); automatically refunds points if rejected

### Image Uploads (`/api/upload`)
- `POST /api/upload` — Upload garment photograph (Multer handles JPEG/PNG up to 10MB)

### Depot Administration (`/api/admin`)
- `GET /api/admin/stats` — Operational dashboard counts (total items, active transfers, registered members)
- `GET /api/admin/users` — Audit all community members with their point balances and clearances
- `PUT /api/admin/users/:id` — Adjust member roles (`user` / `admin`) or calibrate point balances
- `DELETE /api/admin/users/:id` — Revoke member registration
- `GET /api/admin/orders` — Master ledger of all active and completed physical transfers
- `PUT /api/admin/orders/:id` — Force update proposal stage or quarantine rejected pieces

---

## 📁 Repository Structure

```text
ReWear/
├── Backend/                     # Node.js + Express REST API
│   ├── middleware/              # Auth guard (auth.js) & Role validation
│   ├── models/                  # Mongoose Schemas (User.js, Product.js, Order.js)
│   ├── routes/                  # API Controllers (auth, user, products, orders, upload, admin)
│   ├── uploads/                 # Local disk image directory (statically served)
│   ├── app.js                   # Express application setup & middleware stack
│   ├── package.json             # Backend dependencies & scripts
│   └── .env                     # Environment variables
├── frontend/                    # React 19 + Vite Frontend Application
│   ├── public/                  # Static assets (img.jpg, shirt.svg)
│   ├── src/
│   │   ├── components/          # Page views & feature components
│   │   │   ├── LandingPage.jsx  # Member-gated protocol home page
│   │   │   ├── Dashboard.jsx    # Member closet, profile, & drop-tag generator
│   │   │   ├── ProductDetail.jsx# Provenance certificate & proposal flow
│   │   │   ├── LoginPage.jsx    # Authentication & password recovery
│   │   │   ├── AdminPanel.jsx   # Depot inspector administrative terminal
│   │   │   ├── LoadingPage.jsx  # Textile protocol demonstration
│   │   │   ├── Navbar.jsx       # Real-time circular avatar & points tracker
│   │   │   ├── ProtectedRoute.jsx # Route authentication guard
│   │   │   └── AdminRoute.jsx   # Administrative privilege guard
│   │   ├── App.jsx              # Application router & navigation layout
│   │   ├── index.css            # Tailwind typography & design tokens
│   │   └── main.jsx             # React DOM root entrypoint
│   ├── index.html               # HTML document shell & favicon configuration
│   ├── vite.config.js           # Vite dev server & proxy settings
│   └── package.json             # Frontend dependencies & scripts
└── README.md                    # Project documentation
```

---

## 👥 Team Information

- **Keshav Agrawal** — [keshavagrawal273@gmail.com](mailto:keshavagrawal273@gmail.com)
- **Kapil Tanwar** — [kapiltanwar340@gmail.com](mailto:kapiltanwar340@gmail.com)
- **Ankur Kumar Verma** — [ankurvr988@gmail.com](mailto:ankurvr988@gmail.com)
- **Rishabh Mirchandani** — [mirchandanirishab@gmail.com](mailto:mirchandanirishab@gmail.com)

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  <strong>ReWear Community Clothing Exchange</strong><br/>
  <em>Circulating honest clothes. Rejecting landfill waste. Sustaining community fibers.</em>
</p>
