# HashiCorp Terraform Associate (004) Practice Exam Platform

A modern, responsive, high-performance practice exam web platform for the **HashiCorp Terraform Associate 004 certification**.

## Key Features & Architecture

- **Authoritative Question Bank**: Exactly **342 questions** extracted directly from the 6 official practice exams (57 questions per exam), with strict data integrity preservation (question wording, answer choices, correct answers, explanations, links, and objective classifications).
- **8 Certification Objectives**:
  - **Objective 1**: Infrastructure as Code (IaC) with Terraform (22 questions)
  - **Objective 2**: Terraform Fundamentals (44 questions)
  - **Objective 3**: Core Terraform Workflow (59 questions)
  - **Objective 4**: Terraform Configuration (75 questions)
  - **Objective 5**: Terraform Modules (37 questions)
  - **Objective 6**: Terraform State Management (41 questions)
  - **Objective 7**: Maintain Infrastructure with Terraform (28 questions)
  - **Objective 8**: HCP Terraform (36 questions)
- **4 Practice Modes**:
  - **Mode A — Full Practice Exam**: Select Exams #1 through #6 (57 questions each), timed test, palette navigation, flag for review, submission confirmation, answers revealed on submit.
  - **Mode B — Practice by Objective**: Select any of the 8 objectives and filter by All questions, Random selection, Unanswered questions, or Incorrect questions only.
  - **Mode C — Random Practice**: Quick drill mode with 10, 20, 30, 50, or custom questions, option scrambling (while strictly preserving correctness), and instant explanations.
  - **Mode D — Review Incorrect Questions**: Targeted remediation bank tracking attempts, correct/incorrect counters, and last attempted timestamp.
- **Certification Exam Interface**:
  - Clear multi-select indicators (e.g. `Select TWO answers`)
  - True/False detection and indicators
  - Keyboard navigation (A/B/C/D or 1/2/3/4 for choices, Left/Right for Next/Prev, F to Flag)
  - Code syntax blocks for HCL configurations
  - Question Navigator grid palette
- **Detailed Results & Analytics**:
  - Overall accuracy percentage, pass/fail badge (70% passing threshold)
  - Objective score breakdown with weak areas highlighted
  - Filterable question review (All, Correct, Incorrect, Unanswered, By Objective)
  - Celebratory confetti on passing score
- **Full-Text Search & Explorer**:
  - Real-time search across question texts, code snippets, choices, explanations, and display IDs
  - Quick chips for `provider`, `state`, `for_each`, `count`, `lifecycle`, `module`, `HCP Terraform`, `Sentinel`, `backend`, `data source`
- **Data Integrity Verification**: Built-in automated check verifying 342 questions, 57 per exam, 100% objective coverage, and valid answer mappings.
- **Offline-Ready Local Storage**: Persists user progress, question history, attempt logs, and theme settings.

## Getting Started

### Development Mode
```bash
npm install
npm run dev
```

### Production Build & Preview
```bash
npm run build
npm run preview
```

### Run Integrity Verification Suite
```bash
npm test
```
