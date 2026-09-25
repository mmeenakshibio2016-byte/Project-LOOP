# Project-LOOP
AI Customer Feedback Intelligence Platform
Project LOOP is an AI-powered customer feedback intelligence platform that enables businesses to collect, organize, and analyze customer feedback from multiple channels in one centralized system. Leveraging advanced AI capabilities, it automatically classifies sentiment, identifies recurring themes, detects emerging trends, and generates actionable insights to help organizations understand customer needs more effectively.

Built as a secure, multi-tenant SaaS application, the platform features role-based access control, interactive analytics dashboards, AI-powered question answering, and automated Voice-of-Customer reports. Project LOOP empowers product, support, and leadership teams to make faster, data-driven decisions by transforming raw customer feedback into meaningful business intelligence.


# Project LOOP — AI Customer Feedback Intelligence Platform

> **Zidio Internship Project Brief & Corporate-Grade Web Application**  
> *Ingest multi-channel customer feedback, classify sentiment with AI, cluster emerging themes, perform grounded retrieval Q&A, and generate Voice-of-Customer executive digests.*

---

## 🌟 Executive Overview

**Project LOOP** is a multi-tenant SaaS web application built for product managers, support leads, and founders to transform scattered feedback into evidence-backed product decisions. 

Instead of letting feedback rot in spreadsheets and support tickets, LOOP ingests items from Zendesk, App Stores, Sales Calls, NPS Surveys, and CSV files. The embedded AI engine classifies sentiment, extracts recurring themes, flags spiking issues (+171% WoW), enables plain-English RAG Q&A with verbatim citations, and generates leadership-ready VoC digests.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | React 18 (TypeScript) + Vite | Type-safe, blazingly fast SPA rendering & state management |
| **Styling** | Tailwind CSS + Lucide Icons + Glassmorphic Tokens | Enterprise dark/light responsive design system |
| **Data Visualization** | Recharts | Interactive sentiment donuts, timeline velocity, and prioritization scatter matrix |
| **AI Intelligence** | Claude AI / Custom Classification & RAG | Structured JSON auto-classification, grounded vector Q&A, and VoC report generator |
| **Architecture** | Multi-Tenant Workspace & RBAC | Strict workspace data isolation + Admin, Analyst, Viewer role permissions |

---

## 🔑 Demo Login Credentials (RBAC Testing)

Project LOOP features built-in multi-tenant workspace isolation and live role switching via the top Navbar:

| Role | Demo User | Email | Permissions |
| :--- | :--- | :--- | :--- |
| **ADMIN** | Sarah Connor | `sarah.admin@acme.com` | Full access: Ingest data, reclassify AI tags, manage team members, configure webhooks & API keys |
| **ANALYST** | Mark Watney | `mark.analyst@acme.com` | Core access: Ingest single/CSV feedback, triage inbox statuses, reclassify, generate VoC reports |
| **VIEWER** | Alex Mercer | `alex.viewer@acme.com` | Read-Only: Explore dashboards, inspect feedback details, view reports & prioritization matrix |

---

## ⚡ Quick Start & Local Setup Instructions

### Prerequisites
- Node.js 18 LTS or newer
- npm / yarn / pnpm

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-username/project-loop.git
cd project-loop
npm install
```

### 2. Environment Configuration
Create a `.env` file in the root directory (optional for local mock AI engine):
```env
VITE_APP_TITLE="Project LOOP - AI Feedback Intelligence"
VITE_ANTHROPIC_API_KEY="your_optional_claude_api_key"
```

### 3. Run Development Server
```bash
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

### 4. Build for Production
```bash
npm run build
```

---

## 📐 System Architecture & Data Flow

```
[ Feedback Ingestion Sources ] 
 (Zendesk, App Store, CSV, Webhook, Sales Calls)
                   │
                   ▼
 [ Project LOOP Engine (Multi-Tenant Scope) ]
   ├── AI Auto-Classifier (Sentiment: POS/NEU/NEG, Score -1..1, Feature Area)
   ├── Theme Clustering & Spike Anomaly Detector (+171% WoW)
   ├── Vector Embedding Store & RAG Retrieval Engine
   └── VoC Executive Report Generator
                   │
                   ▼
 [ Interactive Executive Dashboard & Q&A Copilot ]
   ├── Ask LOOP AI (Retrieval-Grounded Q&A with Citations)
   ├── Triage Inbox (NEW -> REVIEWED -> ACTIONED)
   └── Prioritization Matrix (Impact vs Negativity)
```

---

## 🚀 One-Command Vercel Live Deployment

To deploy Project LOOP to Vercel:
```bash
npm install -g vercel
vercel
```
Select default settings. Vercel will auto-detect Vite and deploy a public URL.





