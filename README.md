# TenantPulse — Enterprise Multi-Tenant Administration Platform

A complete Next.js application reconstructed and converted from Stitch Project ID `17577848741953184841` (**TenantPulse v3.8**).

## Overview

TenantPulse is an institutional-grade, multi-tenant B2B SaaS platform engineered for directory administrators, IT managers, and security auditors governing distributed enterprise teams. The application features strict schema isolation indicators, Role-Based Access Control (RBAC), SOC-2 compliant soft deletion and data retention policies, and real-time tenant switching.

---

## Key Features & Screen Implementation

### 1. Login Gateway (`/login`, `/`)
- **Tenant Auto-Detection:** Automatically extracts workspace domain slugs from work email input (e.g. `user@acmecorp.com` → `detected: acme`).
- **Workspace Locking:** Dedicated subdomain override option.
- **Evaluator Quick-Fill Personas:** One-click evaluators for **Admin** (`sarah.admin@acmecorp.io`), **Manager** (`marcus.mgr@novasystems.dev`), and **Employee** (`elena.ops@vertexlogistics.com`).
- **Security Anchors:** SSO-ready indicators, password visibility toggle, SOC-2 compliance badges.

### 2. Company Workspace Registration (`/register`)
- **2-Step Onboarding Wizard:**
  - **Step 1 (Company Profile):** Organization name, live auto-slug generator (`https://[slug].tenantpulse.io`), industry vertical selector, and organization size.
  - **Step 2 (Primary Administrator):** Admin credentials with live 4-criteria password strength validation (8+ chars, 1 number, 1 special symbol, mixed case).
- **Multi-Tenant Data Privacy Guarantee:** Explicit schema separation notice and compliance agreement.

### 3. Tenant Dashboard (`/dashboard`)
- **Tenant Meta Strip:** Active partition status, dedicated database cluster (`us-east-acme-prod`), and zero-leakage enforcement.
- **Bento KPI Metric Cards:** Total Headcount (148), Leadership Tier / Managers (18), Active Users (136 with live pulse), and Inactive / Soft-Deleted Users (12).
- **Realtime Activity Feed:** Live audit events with actor attribution, relative timestamps, and audit tags.
- **Role & Access Breakdown:** Visual progress meter and cards explaining privileges for Admin, Manager, and Employee tiers.
- **Database Node Health:** Micro-strip reporting replication latency (12ms) and SOC-2 Type II certification.
- **Modals:** API Credentials inspection and Quick User Provisioning.

### 4. User Management Directory (`/users`)
- **Global Actions:** Export to CSV (generates real CSV download of current view) and Add User modal.
- **Search & Filtering:** Real-time multi-attribute search (name, email, role, department), Role filter, Status filter (including Deactivated / Soft-deleted), and Department filter.
- **Batch Actions:** Select All with indeterminate state; bulk role change and status toggling for selected users.
- **Rich Data Table:** Employee avatars, job titles, roles, status pills, last active timestamps, and row action triggers.
- **Pagination:** Customizable rows per page (10, 25, 50) and numbered page navigation.

### 5. User Details & Soft Delete Compliance (`/users/[id]`)
- **Profile Card:** Full employee metadata, department pod, access clearance level, and assigned partition.
- **Permissions Matrix:** Enabled vs. restricted privileges breakdown.
- **Audit Trail & Lifecycle:** Connected timeline of account creation, SSO logins, and soft-deletion events.
- **Soft Delete Protocol:**
  - Interactive dialog with specific deactivation reasons (*Employee left company*, *Extended leave of absence*, *Temporary security hold*).
  - Preserves records under compliance retention policy (DRP-98) while immediately revoking cloud auth tokens.
  - One-click account restoration/reactivation.

### 6. Tenant Settings & Governance (`/settings`)
- Organization properties, partition cluster details, SAML 2.0 Identity Provider configuration, and retention policy controls.

---

## Project Structure

```
├── public/
│   └── images/                     # Downloaded localized avatars, logos, and server assets
│       ├── logo.png
│       ├── sarah-header.png
│       ├── sarah-jenkins.png
│       ├── marcus-rodriguez.png
│       ├── priya-sharma.png
│       ├── elena-rostova.png
│       └── server-datacenter.jpg
├── src/
│   ├── app/
│   │   ├── globals.css             # Tailwind CSS v4 design tokens, color palette, custom styling
│   │   ├── layout.tsx              # Root layout with Google Fonts, Material Symbols, TenantProvider
│   │   ├── page.tsx                # Home entrypoint (renders Login gateway)
│   │   ├── login/page.tsx          # Login Screen (Screen 1)
│   │   ├── register/page.tsx       # Company Registration Wizard (Screen 2)
│   │   ├── dashboard/page.tsx      # Tenant Dashboard (Screen 5)
│   │   ├── users/
│   │   │   ├── page.tsx            # User Management Table (Screen 3)
│   │   │   └── [id]/
│   │   │       ├── page.tsx        # User Details Server Component with generateStaticParams
│   │   │       └── UserDetailContent.tsx # User Details & Soft Delete View (Screen 6)
│   │   └── settings/page.tsx       # Tenant Configuration & Governance
│   ├── components/
│   │   ├── common/
│   │   │   └── Toast.tsx           # Global floating feedback notification
│   │   ├── layout/
│   │   │   ├── Header.tsx          # Top app header with tenant switcher, notifications, user profile
│   │   │   ├── Sidebar.tsx         # Responsive collapsible sidebar navigation
│   │   │   └── DashboardLayout.tsx # Unified app shell wrapper
│   │   └── modals/
│   │       ├── AddEditUserModal.tsx# Add / Edit Employee Dialog (Screen 4)
│   │       ├── SoftDeleteModal.tsx # Soft Delete Confirmation Protocol
│   │       └── ApiCredentialsModal.tsx # Tenant API keys and credentials viewer
│   ├── context/
│   │   └── TenantContext.tsx       # State management for tenants, employees, audits, and soft deletes
│   └── types/
│       └── index.ts                # TypeScript interfaces and types
├── package.json
└── tsconfig.json
```

---

## Getting Started

### Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
npm run build
npm run start
```
