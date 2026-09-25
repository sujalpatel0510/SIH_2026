# CampusPilot AI — Smart Learning, Smarter Growth
### Enterprise AI-Powered Capacity Building & Competency Intelligence Platform
**Platform:** Next.js 14 App Router, TypeScript, Tailwind CSS, PostgreSQL 17, Prisma ORM  
**Architecture:** Multi-Role Workspaces (Trainee, Trainer, Admin), Automated AI Gap Detection, Adaptive Recommendations  

---

## 🚀 Live Demo & Presentation Quick-Start

The application is running at:
```
http://localhost:3000
```

### ⚡ Instant 1-Click Role Switcher
In the navigation header or on `/login`, click any role button to instantly preview that role without retyping passwords:
1. **Trainee Demo**: Priya Sharma (`priya.sharma@campuspilot.ai` / `password123`)
2. **Trainer Demo**: Dr. Rajesh Verma (`rajesh.verma@campuspilot.ai` / `password123`)
3. **Admin Demo**: Dr. Alok Nath (`admin@campuspilot.ai` / `admin123`)

---

## 🏛️ Comprehensive 5-Minute Live Demonstration Flow

| Minute | Step | Role | Screen / Action | Expected Highlight |
|---|---|---|---|---|
| **0:00 - 1:00** | **Admin Governance** | **Admin** | Navigate to `/admin/dashboard` and `/admin/users` | View platform-wide telemetry and approve pending user registration (Aarav Mehta). |
| **1:00 - 2:00** | **Trainer AI MCQ Studio** | **Trainer** | Navigate to `/trainer/ai-mcq-generator` | Paste lecture material/syllabus text, click "Generate MCQ Assessment", review extracted concepts, and publish to course. |
| **2:00 - 3:00** | **Competency Gap Engine** | **Trainee** | Navigate to `/trainee/competencies` | Show live comparison between current level (Level 2/5) and target level (Level 4/5). Point out **Machine Learning Gap Detected** badge. |
| **3:00 - 3:45** | **AI Recommendations** | **Trainee** | Navigate to `/trainee/recommendations` | Show AI match score (96.5%) and exact rationale linking the ML gap to Dr. Rajesh Verma's course. |
| **3:45 - 4:30** | **Assessment & Certification** | **Trainee** | Navigate to `/trainee/assessments` | Attempt timed quiz. Instant submission calculates score, upgrades verified competency in PostgreSQL, and generates certificate with unique verification code. |
| **4:30 - 5:00** | **AI Copilot** | **Trainee** | Click floating "Ask CampusPilot AI" | Ask *"What are my current competency gaps?"* or *"Who is the best ML trainer?"* grounded in database telemetry. |

---

## 🛠️ Complete Feature Matrix & Routes

### 1. Trainee Module
- **Dashboard (`/trainee/dashboard`)**: Enrolled programs, pending assessments, gap alerts, and active benchmarks.
- **Competency Mapping (`/trainee/competencies`)**: Visual matrix showing Level 1-5 proficiencies, gap deficits, and AI recalculation.
- **Smart Recommendations (`/trainee/recommendations`)**: AI course and master trainer recommendations with match ratings and rationale.
- **Course Discovery (`/trainee/courses`)**: Search by subject, difficulty, and instant enrollment.
- **Learning Library (`/trainee/resources`)**: PDF guides, video lectures, and PPT decks.
- **MCQ Assessments (`/trainee/assessments`, `/trainee/assessments/[id]`)**: Timed online assessments, live countdown, automatic grading, and explanations.
- **Digital Certificates (`/trainee/certificates`)**: Cryptographically verifiable certificates with verification codes.
- **Profile (`/trainee/profile`)**: Qualifications, department, skills, and target career goals.
- **AI Copilot (`/trainee/ai-assistant`)**: Conversational capacity building assistant.

### 2. Trainer Module
- **Dashboard (`/trainer/dashboard`)**: Enrolled cohorts, trainer ratings, and course telemetry.
- **Course Management (`/trainer/courses`)**: Create, publish, and manage courses.
- **Content Library (`/trainer/resources`)**: Upload PDFs, video streams, and presentation decks.
- **Questionnaires (`/trainer/assessments`)**: Create timed assessments and passing thresholds.
- **AI MCQ Generator (`/trainer/ai-mcq-generator`)**: Automatic question synthesis from curriculum text.
- **Cohort Monitoring (`/trainer/trainees`)**: Monitor pass rates, progress bars, and gap bridging.
- **Trainer Profile (`/trainer/profile`)**: Expertise areas, teaching subjects, and industry certifications.

### 3. Admin Module
- **Overview (`/admin/dashboard`)**: Total trainees, trainers, courses, attempts, and pending approval alerts.
- **User Approvals & RBAC (`/admin/users`)**: Approve, reject, or modify roles with real-time PostgreSQL updates.
- **Curriculum Governance (`/admin/courses`)**: Audit and accredit courses.
- **Platform Analytics (`/admin/analytics`)**: Departmental pass rates, participation, and competency growth charts.
- **Announcements & Feed (`/admin/announcements`)**: Broadcast announcements and celebrate top achievements.

---

## 🗄️ PostgreSQL Database Schema (`campuspilot_db`)
The database contains 20 normalized tables synchronized via Prisma:
- `users`: Core identity, password hashes, RBAC roles (TRAINEE, TRAINER, ADMIN), statuses.
- `trainee_profiles` & `trainer_profiles`: Academic and domain credentials.
- `competencies`, `trainee_competencies`, `trainer_competencies`: 5-tier proficiency matrix.
- `competency_gaps`: Trainee gap identification and AI recommended interventions.
- `recommendations`: Scored course and trainer recommendations.
- `courses` & `course_enrollments`: Course catalog and trainee progress.
- `learning_resources`: Uploaded materials (PDF, VIDEO, PPT, NOTES).
- `assessments`, `questions`, `assessment_attempts`, `assessment_answers`: Online examination engine.
- `certificates`: Verifiable certificate registry.
- `announcements` & `achievements`: Organization-wide communication.
