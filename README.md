# 🔍 MarshAI | AI-Powered Domain Idea Validation

![Next.js](https://img.shields.io/badge/Next.js-000000?logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?logo=mysql&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?logo=vercel&logoColor=white)

A full-stack **SaaS** platform for **market research** that helps founders and domain investors validate an idea before building it. Enter a domain or business idea and MarshAI combines real Google Trends demand data with AI analysis to produce a structured market research report in minutes.

🚀 **Live Demo:** [Click here to view MarshAI](https://marshai-ebon.vercel.app)

## ✨ Key Features

- **Market Research in Minutes:** Submit a domain or business idea and get a full market research report generated in the background while you keep working.
- **Real Demand Data, Not Guesses:** Google Trends analysis shows interest over time, growth rate, rising and top related searches, and regional interest. Free reports cover 3 months of data, and Pro reports cover 12 months.
- **Clear Opportunity Score:** Every idea gets a score from 0 to 100 and a viability rating (High, Medium or Low), with the strengths and weaknesses behind it.
- **Know Your Audience and Competitors:** Get a profile of your target audience and their pain points, the level of competition, the key players, and where you can stand out.
- **Find Ways to Make Money:** Get monetization strategies and concrete business ideas, each with difficulty, time to launch, estimated cost and revenue model.
- **Launch Plan Included:** A phased go-to-market plan with quick wins, plus the main risks and clear recommendations for next steps.
- **SaaS Subscription Model:** Free accounts get 3 validations per month with concise reports (about 500 words). Pro accounts get unlimited validations and in-depth reports (up to about 2,000 words).
- **Simple Bank-Transfer Upgrade:** Submit a transaction ID and an invoice (image or PDF, up to 5 MB). Once the payment is approved, your account switches to Pro for one year.
- **Report History and PDF Export:** Every report is saved in your dashboard, and you can export it as a PDF.
- **Secure Accounts:** NextAuth with JWT sessions and bcrypt password hashing. You can change your password or delete your account and all its data at any time.
- **Responsive UI with Light and Dark Mode:** Built with Tailwind CSS to work comfortably on desktop, tablet and mobile.

## 🏗️ System Architecture & Tech Stack

MarshAI is a full-stack Next.js application. The interface and the API route handlers live in one codebase, and report generation runs in the background after a request returns, so the user never waits on a blank screen.

### Backend (The Engine)
- **Framework:** Next.js 16 (App Router route handlers) with TypeScript
- **Database:** MySQL (hosted on TiDB Cloud)
- **ORM:** Prisma 6 (schema management and type-safe queries)
- **Authentication:** NextAuth v5 with the Prisma adapter, JWT sessions and bcryptjs
- **AI Analysis:** Groq, called through the OpenAI-compatible `openai` SDK
- **Search Data:** `google-trends-api`
- **File Storage:** Vercel Blob for invoice uploads (local-disk fallback in development)

### Frontend (The Client)
- **Core:** React 19, Next.js, TypeScript
- **Styling:** Tailwind CSS, lucide-react icons
- **Data Visualization:** Recharts
- **PDF Export:** jsPDF and jspdf-autotable
- **Hosting:** Vercel

## 🗄️ Database Schema

The schema is relational and indexed on the fields that are queried most (user, status and creation date) to keep lookups fast as the user base grows.

- **Users Table:** Stores credentials (hashed passwords) and the account role. One-to-many with reports, usage logs and payment requests, and one-to-one with a subscription.
- **Subscriptions Table:** Tracks each user's plan (Free or Pro), start and end dates, and whether it is active.
- **Usage Logs Table:** Counts validations per user per month and year, with a unique constraint on that combination.
- **Reports Table:** Stores the idea, its keyword, the processing status (Pending, Processing, Completed or Failed), the score and viability rating, and JSON columns for the trends data, AI insights, competition, monetization and go-to-market sections.
- **Payment Requests Table:** Stores each upgrade request with its transaction ID, invoice link, status and approval date.
- **Cascading deletes:** Deleting a user removes their reports, usage logs, subscription and payment requests.

### How the Data Flows

- **On Validation:** A report is created as *Pending* and the request returns immediately. The background job marks it *Processing*, collects Google Trends data, asks the AI model for insights, then saves the score, viability rating and every section and marks the report *Completed* (or *Failed* if something goes wrong).
- **On the Free Limit:** Each validation increments that month's usage count. After 3, new validations are rejected until the next month or until the account upgrades.
- **On Upgrade:** A bank-transfer request is saved as *Pending* with the invoice link. When it is approved, the user's subscription is set to Pro for one year.

## 🚀 Local Installation & Setup

Want to run MarshAI on your local machine? Follow these steps.

### Prerequisites

- Node.js 20.9 or newer
- A MySQL database (local, or hosted such as TiDB Cloud)
- A [Groq API key](https://console.groq.com/keys)

### 1. Clone the Repository

```bash
git clone https://github.com/smon2006/MarshAI.git
cd MarshAI
```

### 2. Install Dependencies

```bash
npm install
```

This also runs `prisma generate` automatically.

### 3. Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/marshai"
AUTH_SECRET="your_random_secret"
GROQ_API_KEY="your_groq_api_key"

# Optional: invoice uploads go to Vercel Blob when this is set,
# otherwise they are saved to public/uploads/invoices
# BLOB_READ_WRITE_TOKEN="your_blob_token"
```

Generate a secret with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

URL-encode special characters in the database password (for example `@` becomes `%40`). For TiDB Cloud, end the connection string with `?sslaccept=strict`.

### 4. Create the Database Tables

```bash
npx prisma db push
```

### 5. Seed Starter Accounts (Optional)

The seed script reads its credentials from environment variables, so nothing is hardcoded.

```bash
# macOS / Linux
ADMIN_EMAIL="admin@example.com" ADMIN_PASSWORD="choose-a-strong-password" npx tsx prisma/seed.ts

# Windows PowerShell
$env:ADMIN_EMAIL="admin@example.com"
$env:ADMIN_PASSWORD="choose-a-strong-password"
npx tsx prisma/seed.ts
```

### 6. Run the App

```bash
npm run dev
```

The app will be available at http://localhost:3000.

## 📁 Project Structure

```
MarshAI/
├── app/
│   ├── (auth)/        # Sign in, register and password pages
│   ├── api/           # Route handlers: validate, reports, usage, subscription, user, auth
│   └── dashboard/     # User dashboard, saved reports and settings
├── components/        # Shared UI: theme toggle, password input, brand logos
├── lib/
│   ├── auth.ts        # NextAuth configuration
│   ├── prisma.ts      # Prisma client
│   ├── services/      # Google Trends and AI analysis services
│   └── utils/         # PDF export helpers
└── prisma/
    ├── schema.prisma  # Database schema
    └── seed.ts        # Starter account seed script
```

## ☁️ Deployment

MarshAI runs on **Vercel**, with **TiDB Cloud** for the MySQL database and **Vercel Blob** for invoice uploads.

1. Import the repository in Vercel.
2. Add `DATABASE_URL`, `AUTH_SECRET` and `GROQ_API_KEY` as environment variables.
3. Create a **Public** Blob store in the project's Storage tab and connect it (this adds `BLOB_READ_WRITE_TOKEN`).
4. Create the tables once with `npx prisma db push`, using the hosted `DATABASE_URL`.
5. Redeploy.
