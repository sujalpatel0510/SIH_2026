<div align="center">

# 🎓 CampusPilot AI — Smart Learning, Smarter Growth
### Enterprise AI-Powered Capacity Building & Competency Intelligence Platform

[![Next.js 14](https://img.shields.io/badge/Next.js-14.2.15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-336791?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![Prisma ORM](https://img.shields.io/badge/Prisma-5.22-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![NVIDIA NIM](https://img.shields.io/badge/NVIDIA_NIM-Llama_3.1-76B900?style=for-the-badge&logo=nvidia)](https://build.nvidia.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

*Built for **Smart India Hackathon (SIH 2026)** — Next-Generation Institutional Capacity Building and Faculty Competency Enhancement.*

---

[Explore Features](#-key-platform-capabilities) • [Live Demo Flow](#-5-minute-evaluation--demo-walkthrough) • [Architecture](#-system-architecture) • [Database Schema](#-postgresql-database-schema) • [Installation](#-getting-started) • [API Docs](#-api-routes-reference)

</div>

---

## 📌 Executive Summary & Problem Statement

Higher education universities and corporate organizations spend millions annually on faculty development programs and student training. However, conventional institutional capacity building suffers from major systemic shortcomings:

1. **One-Size-Fits-All Curricula**: Training programs are scheduled without objective diagnosis of individuals' true baseline competency deficits.
2. **Fragmented Learning Records**: Progress, attendance, slide decks, and quiz scores are scattered across disconnected systems.
3. **Absence of Cognitive Assessment**: Evaluations rely on manual, repetitive question banks rather than dynamic, Bloom's Taxonomy-calibrated assessments.
4. **Unverified Credentials**: Certificates lack cryptographic verification and tamper-proof issuance records.

### 💡 The CampusPilot AI Solution
**CampusPilot AI** solves this through an autonomous, end-to-end competency intelligence ecosystem. It benchmarks trainees across an accredited **5-Tier Competency Matrix**, detects skills gaps in real-time, recommends personalized learning paths with certified trainers, synthesizes AI assessments via **NVIDIA NIM AI**, and issues cryptographically verified **SHA-256 accredited certificates** with direct image proof.

---

## ✨ Key Platform Capabilities

### 🧠 1. Dual-Engine AI Integration (NVIDIA NIM & Local Fallbacks)
- Seamlessly connects with **NVIDIA API Catalog & NIM** (`meta/llama-3.1-70b-instruct`, `meta/llama-3.2-11b-vision-instruct`, `nvidia/llama-3.1-nemotron-70b-instruct`).
- Provides deep, contextual answers grounded directly in the user's enrolled courses, competency scores, and identified skill gaps.
- Includes a clean in-app modal to hot-swap API keys and model engines at runtime.

### 📝 2. AI MCQ Assessment Studio (Bloom's Taxonomy)
- Allows master trainers to paste raw syllabus text, lecture notes, or research papers.
- Automatically analyzes core concepts and generates multiple-choice questions categorized by difficulty (`BEGINNER`, `INTERMEDIATE`, `ADVANCED`).
- Generates detailed rationales for each option and publishes directly to the course database with 1 click.

### 📊 3. 5-Tier Competency Intelligence & Radar Telemetry
- Maps every technical domain from **Level 1 (Novice)** to **Level 5 (Expert / Authority)**.
- Real-time radar charts and deficit badges highlight exact skill gaps (e.g., *Current: Level 2 → Target: Level 4*).
- Dynamic algorithm scores and matches faculty instructors and courses to resolve specific competency gaps with matching rationales.

### 🏆 4. Cryptographically Verifiable SHA-256 Certificates
- Automated certificate issuance upon passing course assessment benchmarks.
- Generates an immutable **SHA-256 verification hash** and verifiable verification code (e.g., `CP-AI-2026-XXXX`).
- Full support for **uploading certificate images/documents**, rendering live previews, and printable verification dossiers.

### 🪟 5. Centralized React Portal Modal System
- Custom built `<Modal />` architecture rendered via React `createPortal(..., document.body)` at `z-[100]`.
- Backdrops dim 100% of the screen (`bg-slate-950/70 backdrop-blur-sm`), guaranteeing zero header clipping or navbar collision across all screen sizes.
- Built-in body scroll lock, Escape key detection, and auto-centering with top breathing room.

### ⚡ 6. Instant 1-Click Role Switcher & Microsecond Caching
- Seamless demo role switcher on the navbar and login page: switch between **Trainee**, **Trainer**, and **Admin** instantly.
- Intelligent client-side sessionStorage caching ensures sub-100ms page transitions and instantaneous UI responsiveness.

---

## 🏛️ Workspace Modules & Feature Breakdown

### 🎓 1. Trainee Module (Learner Workspace)
| Screen | Route | Capabilities |
|---|---|---|
| **Dashboard** | `/trainee/dashboard` | Active enrollments, overall progress gauge, upcoming assessments, competency gap alerts, and announcements. |
| **Competency Mapping** | `/trainee/competencies` | 5-level proficiency matrix, visual gap deficit badges, target vs. current benchmark radar telemetry. |
| **Smart Recommendations** | `/trainee/recommendations` | AI match rating (e.g. 96.5%), match rationale, recommended master trainers, and direct enrollment. |
| **Course Catalog** | `/trainee/courses` | Searchable directory categorized by Artificial Intelligence, Cloud Infrastructure, and Software Engineering. |
| **Learning Library** | `/trainee/resources` | Multimedia study repository (interactive PDF readers, streaming video masterclasses, and slide decks). |
| **MCQ Assessments** | `/trainee/assessments` | Timed examinations, live countdown timer, auto-grading engine, and comprehensive question-by-question breakdown. |
| **Accredited Certificates** | `/trainee/certificates` | Certified credential registry, SHA-256 verification hashes, certificate image uploads, and print dossier. |
| **AI Learning Copilot** | `/trainee/ai-assistant` | Context-aware AI tutor answering queries grounded in the trainee's active enrollments and deficits. |

### 👨‍🏫 2. Trainer Module (Faculty / Instructor Workspace)
| Screen | Route | Capabilities |
|---|---|---|
| **Dashboard** | `/trainer/dashboard` | Cohort enrollment figures, average learner scores, active courses, and quick action launcher. |
| **Course Management** | `/trainer/courses` | Create new accredited courses, edit syllabus details, configure hours/difficulty, and manage learning modules. |
| **Content Repository** | `/trainer/resources` | Upload lecture notes, PDF guides, presentation slides, and recorded video links linked to courses. |
| **Questionnaire Studio** | `/trainer/assessments` | Create benchmark assessments, set passing marks, configure timers, and inspect submission attempts. |
| **AI MCQ Generator** | `/trainer/ai-mcq-generator` | AI synthesis of multiple-choice questions from syllabus text with instant course publishing. |
| **Cohort Telemetry** | `/trainer/trainees` | Real-time trainee roster, competency velocity tracking, and direct trainer mentorship feedback dispatch. |

### 🛡️ 3. Admin Module (Institutional Governance Workspace)
| Screen | Route | Capabilities |
|---|---|---|
| **Executive Overview** | `/admin/dashboard` | High-level KPI telemetry, trainee-to-trainer ratios, compliance statuses, and pending registration queues. |
| **RBAC & User Approvals** | `/admin/users` | Approve pending user registrations, reassign roles (Trainee/Trainer/Admin), and enforce security access. |
| **Curriculum Supervision** | `/admin/courses` | Inspect curriculum alignment, audit quality governance checklists, and manage course lifecycles (Publish/Archive). |
| **Institutional Analytics** | `/admin/analytics` | Departmental pass rates, monthly capacity growth, assessment velocity, and competency bridge metrics. |
| **Institutional Bulletins** | `/admin/announcements` | Publish institutional announcements, broadcast guidelines, and celebrate top learner achievements. |

---

## 🏛️ System Architecture

```mermaid
flowchart TD
    subgraph Client ["Client Presentation Layer (Next.js 14 / React 18)"]
        UI["Tailwind CSS 3.4 + Framer Motion"]
        Portal["React Portal Modal System (z-[100])"]
        State["Auth Context + Client Cache (sessionStorage)"]
    end

    subgraph API ["Server Layer (Next.js App Router API Routes)"]
        AuthRoute["/api/auth/* (JWT + bcryptjs)"]
        CourseRoute["/api/courses & /api/resources"]
        AssessRoute["/api/assessments & [id]/submit"]
        AIRoute["/api/ai-assistant & /api/ai-mcq-generator"]
        CertRoute["/api/certificates (SHA-256 Engine)"]
        AdminRoute["/api/admin/users & stats"]
    end

    subgraph AI_Engine ["External AI Engine"]
        NVIDIA["NVIDIA NIM API Catalog (Llama 3.1 70B / Nemotron)"]
        LocalAI["Local Heuristic Fallback Engine"]
    end

    subgraph Storage ["Database Persistence (PostgreSQL 17)"]
        Prisma["Prisma ORM 5.22 Schema Client"]
        PG[("PostgreSQL Database (campuspilot_sih)")]
    end

    Client -->|REST Requests + JWT Bearer| API
    AIRoute -->|HTTPS / OpenAI Compatible API| NVIDIA
    AIRoute -.->|Fallback on timeout| LocalAI
    API -->|Type-safe queries| Prisma
    Prisma -->|Pooled TCP connection| PG
```

---

## 🗄️ PostgreSQL Database Schema

The database consists of **20 normalized tables** synchronized through Prisma ORM:

```mermaid
erDiagram
    User ||--o{ TraineeProfile : has
    User ||--o{ TrainerProfile : has
    User ||--o{ CourseEnrollment : enrolls
    User ||--o{ AssessmentAttempt : attempts
    User ||--o{ Certificate : earns
    User ||--o{ Course : creates
    Course ||--o{ CourseEnrollment : contains
    Course ||--o{ LearningResource : owns
    Course ||--o{ Assessment : tests
    Assessment ||--o{ Question : includes
    Assessment ||--o{ AssessmentAttempt : tracks
    TraineeProfile ||--o{ TraineeCompetency : tracks
    Competency ||--o{ TraineeCompetency : categorized_by
    Competency ||--o{ CompetencyGap : identifies
```

### Table Dictionary
- `users`: Core authentication identity, password hash, role (`TRAINEE`, `TRAINER`, `ADMIN`), and account status (`ACTIVE`, `PENDING`, `SUSPENDED`).
- `trainee_profiles`: Department, year of study, target career roles, and baseline skill ratings.
- `trainer_profiles`: Faculty qualifications, expertise tags, institutional bio, and instructor rating.
- `competencies`: Standardized institutional skills taxonomy with 5 proficiency levels.
- `trainee_competencies`: Current level (1-5) and target level (1-5) mapping for learners.
- `competency_gaps`: Computed skill gaps with priority ranking and AI recommended actions.
- `recommendations`: Scored course and trainer suggestions with AI generated rationale.
- `courses`: Curriculum directory with title, subject, category, duration, difficulty, and publish status.
- `learning_resources`: Course materials supporting `PDF`, `VIDEO`, `PPT`, and `DOCUMENT` types.
- `assessments`: Timed multiple-choice evaluations linked to courses.
- `questions`: Individual MCQ questions with 4 choices, correct answer key, and pedagogical rationale.
- `assessment_attempts`: Trainee quiz submissions with score, passing flag, and completion timestamp.
- `certificates`: SHA-256 authenticated credentials with certificate title, issuer, issue date, and uploaded image URL.
- `announcements`: Institution-wide broadcasts with category tagging and priority level.

---

## 🚀 Getting Started

### 📋 Prerequisites
- **Node.js**: `v18.17.0` or higher (Node 20 recommended)
- **PostgreSQL**: `v14.0` or higher
- **NVIDIA AI API Key**: (Optional for enhanced AI responses) Get free keys at [build.nvidia.com](https://build.nvidia.com)

---

### 💻 Local Installation Steps

#### 1. Clone the Repository
```bash
git clone https://github.com/sujalpatel0510/SIH_2026.git
cd SIH_2026
```

#### 2. Install Project Dependencies
```bash
npm install
```

#### 3. Configure Environment Variables
Copy the template configuration file:
```bash
cp .env.example .env
```
Open `.env` and verify your credentials:
```env
# PostgreSQL connection string
DATABASE_URL="postgresql://postgres:password@localhost:5432/campuspilot_sih?schema=public"

# JWT Secret Key
JWT_SECRET="campuspilot-enterprise-super-secret-jwt-key-capacity-connect-998877"

# NVIDIA AI Key (Get free key from https://build.nvidia.com)
NVIDIA_API_KEY="nvapi-your-key-here"
NVIDIA_MODEL="meta/llama-3.1-70b-instruct"
```

#### 4. Initialize PostgreSQL Schema & Prisma Client
```bash
# Push schema directly to your PostgreSQL database
npx prisma db push

# Generate Prisma type-safe client
npx prisma generate
```

#### 5. Build and Launch Application
For Development Mode (Hot Reloading):
```bash
npm run dev
```

For Production Mode (Optimized Performance):
```bash
npm run build
npm run start
```
The application will be live at **`http://localhost:3000`**.

---

## ⚡ 5-Minute Evaluation & Demo Walkthrough

| Minute | Step | Role | Route | Key Feature Highlight |
|---|---|---|---|---|
| **0:00 - 1:00** | **Admin Governance** | **Admin** | `/admin/dashboard` & `/admin/users` | Audit institutional KPIs, review competency growth metrics, and approve pending registrations with 1 click. |
| **1:00 - 2:00** | **AI MCQ Studio** | **Trainer** | `/trainer/ai-mcq-generator` | Paste lecture text, synthesize Bloom's Taxonomy-aligned MCQs with explanations, and publish to course. |
| **2:00 - 3:00** | **Competency Matrix** | **Trainee** | `/trainee/competencies` | Observe real-time 5-level radar charts and identified deficit badges (e.g. *Level 2 → 4 Machine Learning gap*). |
| **3:00 - 3:45** | **AI Recommendations** | **Trainee** | `/trainee/recommendations` | View 96.5% AI match score and algorithm rationale linking the learner's deficit to Dr. Rajesh Verma's course. |
| **3:45 - 4:30** | **Online Assessment** | **Trainee** | `/trainee/assessments` | Attempt timed quiz. Automatic grading calculates score, upgrades verified competency in DB, and generates SHA-256 certificate. |
| **4:30 - 5:00** | **Certificate Proof** | **Trainee** | `/trainee/certificates` | View certificate with SHA-256 hash, upload certificate image file, and inspect verified institutional record. |

---

## 🔑 Demo Accounts & 1-Click Role Switcher

You can test all workspaces immediately using the **1-Click Role Switcher buttons in the navigation header** or on the `/login` page:

| Role | Demo Name | Email Credentials | Password | Default Workspace |
|---|---|---|---|---|
| 🎓 **Trainee** | Priya Sharma | `priya.sharma@campuspilot.ai` | `password123` | `/trainee/dashboard` |
| 👨‍🏫 **Trainer** | Dr. Rajesh Verma | `rajesh.verma@campuspilot.ai` | `password123` | `/trainer/dashboard` |
| 🛡️ **Admin** | Dr. Alok Nath | `admin@campuspilot.ai` | `admin123` | `/admin/dashboard` |

---

## 📡 API Routes Reference

| HTTP Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/login` | Authenticate user, issue signed JWT cookie | No |
| `POST` | `/api/auth/register` | Register new user with default `PENDING` status | No |
| `GET` | `/api/auth/me` | Fetch active user identity and profile session | Yes |
| `GET`, `POST`, `PUT` | `/api/courses` | Query courses, publish new course, or enroll | Yes |
| `GET`, `POST`, `DELETE` | `/api/resources` | Query, upload, or delete learning materials | Yes |
| `GET`, `POST`, `DELETE` | `/api/assessments` | Retrieve assessment list or publish new assessment | Yes |
| `POST` | `/api/assessments/[id]/submit` | Grade assessment attempt, update competency score | Yes |
| `POST` | `/api/ai-mcq-generator` | Generate Bloom's Taxonomy MCQs from syllabus text | Yes (Trainer) |
| `POST` | `/api/ai-assistant` | Query NVIDIA AI Copilot with trainee context | Yes |
| `GET`, `POST` | `/api/ai-assistant/config` | Read or update active NVIDIA model & API key | Yes |
| `GET`, `POST` | `/api/certificates` | List certificates or issue new accredited certificate | Yes |
| `GET`, `POST` | `/api/competency` | Fetch trainee competency matrix or recalculate | Yes |
| `GET` | `/api/recommendations` | Get personalized course & trainer recommendations | Yes |
| `GET`, `PATCH` | `/api/admin/users` | List users or approve/reject pending registrations | Yes (Admin) |
| `GET` | `/api/admin/stats` | Platform-wide analytics and enrollment telemetry | Yes (Admin) |

---

## 🇮🇳 Smart India Hackathon (SIH 2026) Alignment

- **Theme**: Smart Education / Capacity Building / Faculty Development
- **Target Beneficiaries**: Universities, Polytechnic Institutes, Government Training Boards, Faculty Development Centers, and Corporate Learning Academies.
- **National Education Policy (NEP 2020) Alignment**:
  - Continuous Professional Development (CPD) tracking for educators.
  - Outcome-Based Education (OBE) mapped to measurable Bloom's Taxonomy indicators.
  - Micro-credentialing with verifiable digital certificate registries.
- **Sustainability & Scalability**:
  - Stateless Next.js App Router architecture ready for containerization (Docker / Kubernetes).
  - Production-grade PostgreSQL database with indexed relational foreign keys.
  - Cloud-agnostic deployment compatible with Vercel, AWS ECS, Google Cloud Run, or on-premise institutional servers.

---

## 🛠️ Tech Stack Overview

- **Core Framework**: [Next.js 14.2.15](https://nextjs.org/) (App Router, Server & Client Components)
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **UI & Styling**: [Tailwind CSS 3.4](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/), [Lucide React Icons](https://lucide.dev/)
- **Database & ORM**: [PostgreSQL 17](https://www.postgresql.org/), [Prisma ORM 5.22](https://www.prisma.io/)
- **AI & LLM Services**: [NVIDIA NIM API Catalog](https://build.nvidia.com/) (Llama-3.1-70B, Llama-3.2, Nemotron)
- **Data Visualization**: [Recharts 3](https://recharts.org/) (Radar Charts, Progress Gauges)
- **Authentication & Security**: JWT (JSON Web Tokens), bcryptjs password hashing, SHA-256 cryptographic certificate hashing

---

## 📄 License & Attribution

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.  
Developed by the **CampusPilot AI Team** for the **Smart India Hackathon (SIH 2026)**.
