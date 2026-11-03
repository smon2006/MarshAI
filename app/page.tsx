import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import { RedditIcon, GoogleIcon } from "@/components/BrandLogos";
import {
  ArrowRight,
  TrendingUp,
  Search,
  FileText,
  Sparkles,
  CheckCircle,
  BarChart3,
  Brain,
  Target,
  Users,
  Zap,
  Globe,
  Star,
  ChevronRight,
  DollarSign,
  AlertTriangle,
  Lightbulb,
  ChartNoAxesCombined,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* ── Navbar ── */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-1">
                <ChartNoAxesCombined className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                <span className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  MarshAI
                </span>
              </Link>
              <div className="hidden md:flex items-center gap-6">
                <a
                  href="#features"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
                >
                  Features
                </a>
                <a
                  href="#how-it-works"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
                >
                  How it Works
                </a>
                <a
                  href="#pricing"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
                >
                  Pricing
                </a>
                <a
                  href="#faq"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
                >
                  FAQ
                </a>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Link
                href="/signin"
                className="hidden sm:block text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium transition px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition shadow-sm shadow-blue-200 dark:shadow-blue-900/40"
              >
                Get Started Free
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-blue-50 dark:from-gray-950 via-white dark:via-gray-900 to-white dark:to-gray-900 relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200 dark:bg-blue-800 rounded-full blur-3xl opacity-20 -translate-y-1/2" />
        <div className="absolute top-20 right-1/4 w-80 h-80 bg-purple-200 dark:bg-purple-800 rounded-full blur-3xl opacity-20" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-14">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-full mb-6">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                AI-Powered Domain Idea Validation Platform
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-gray-100 leading-tight mb-6 tracking-tight">
              Validate Any Domain Idea
              <span className="block bg-gradient-to-r bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Before You Build
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-500 dark:text-gray-400 mb-10 max-w-3xl mx-auto leading-relaxed">
              Stop wasting months on ideas that won't work. Get comprehensive
              market validation reports with Reddit analysis, Google Trends,
              competition intelligence, and AI strategy — in minutes.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
              <Link
                href="/register"
                className="flex items-center gap-2 px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200 dark:shadow-blue-900/40"
              >
                Start Validating Free
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="#how-it-works"
                className="flex items-center gap-2 px-8 py-4 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-lg font-semibold rounded-xl hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                See How It Works
                <ChevronRight className="w-5 h-5" />
              </a>
            </div>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              3 free validations/month · No credit card required · Cancel
              anytime
            </p>
          </div>

          {/* Mock Report Preview */}
          <div className="max-w-5xl mx-auto bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl shadow-gray-200 dark:shadow-black/50 overflow-hidden">
            {/* Window bar */}
            <div className="bg-gray-50 dark:bg-gray-950 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <div className="flex-1 mx-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded px-3 py-1 text-xs text-gray-400 dark:text-gray-500">
                DomainIdea.com/dashboard
              </div>
            </div>
            {/* Dashboard mock */}
            <div className="p-6 bg-white dark:bg-gray-900">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    Domain Idea Report:{" "}
                    <span className="text-blue-600 dark:text-blue-400">
                      Sustainable Dog Products
                    </span>
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                    Generated in 48 seconds · March 2026
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 text-sm font-semibold rounded-full">
                    Score: 84/100
                  </span>
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-sm font-semibold rounded-full">
                    High Opportunity
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                  {
                    label: "Reddit Posts Analyzed",
                    icon: RedditIcon,
                    value: "542",
                    color: "text-orange-500 dark:text-orange-400",
                    bg: "bg-orange-50 dark:bg-orange-950/40",
                  },
                  {
                    label: "Monthly Search Volume",
                    value: "89K",
                    color: "text-blue-600 dark:text-blue-400",
                    bg: "bg-blue-50 dark:bg-blue-950/40",
                  },
                  {
                    label: "Competition Level",
                    value: "Medium",
                    color: "text-yellow-600 dark:text-yellow-400",
                    bg: "bg-yellow-50 dark:bg-yellow-950/40",
                  },
                  {
                    label: "Market Trend",
                    value: "+43%",
                    color: "text-green-600 dark:text-green-400",
                    bg: "bg-green-50 dark:bg-green-950/40",
                  },
                ].map((item) => (
                  <div key={item.label} className={`${item.bg} rounded-lg p-3`}>
                    <p className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mb-1">
                      {item.icon && <item.icon className={`w-3.5 h-3.5 ${item.color}`} />}
                      {item.label}
                    </p>
                    <p className={`text-xl font-bold ${item.color}`}>
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 bg-gray-50 dark:bg-gray-950 rounded-lg p-4">
                  <p className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                    <GoogleIcon className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    Google Trends (12 months)
                  </p>
                  <div className="flex items-end gap-1 h-16">
                    {[30, 42, 38, 55, 60, 52, 68, 72, 65, 80, 85, 90].map(
                      (h, i) => (
                        <div
                          key={i}
                          className="flex-1 bg-blue-500 rounded-sm opacity-80 transition-all"
                          style={{ height: `${h}%` }}
                        />
                      ),
                    )}
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-xs text-gray-400 dark:text-gray-500">Mar 2025</span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">Mar 2026</span>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-950 rounded-lg p-4">
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                    Top Pain Points
                  </p>
                  <div className="space-y-2">
                    {[
                      "Eco-friendly packaging",
                      "Price vs quality",
                      "Ingredient transparency",
                    ].map((point) => (
                      <div key={point} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="border-y border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "10,000+", label: "Domain Ideas Validated" },
              { value: "500+", label: "Active Users" },
              { value: "98%", label: "Accuracy Rate" },
              { value: "< 60s", label: "Avg. Report Time" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900 rounded-full mb-4 uppercase tracking-wider">
              Features
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-gray-100 mb-4 tracking-tight">
              Everything to Validate
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Your Market Idea</span>
            </h2>
            <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              Eight powerful research modules that give you a complete picture
              of any domain idea market.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: RedditIcon,
                color: "text-orange-500 dark:text-orange-400",
                bg: "bg-orange-50 dark:bg-orange-950/40",
                border: "border-orange-100 dark:border-orange-900",
                title: "Reddit Community Analysis",
                description:
                  "Deep dive into 500+ posts and comments across relevant subreddits. Discover real user pain points, sentiment trends, and unmet demands directly from your target audience.",
                tags: ["Pain Points", "Sentiment", "Demand Signals"],
              },
              {
                icon: GoogleIcon,
                color: "text-blue-600 dark:text-blue-400",
                bg: "bg-blue-50 dark:bg-blue-950/40",
                border: "border-blue-100 dark:border-blue-900",
                title: "Google Trends Intelligence",
                description:
                  "Track 12-month search volume trends, seasonal patterns, regional interest, and rising related queries to understand if your Domain Idea is growing or dying.",
                tags: ["Growth Trends", "Seasonal Data", "Regional Interest"],
              },
              {
                icon: Brain,
                color: "text-purple-600 dark:text-purple-400",
                bg: "bg-purple-50 dark:bg-purple-950/40",
                border: "border-purple-100 dark:border-purple-900",
                title: "AI Market Analysis",
                description:
                  "Claude AI synthesizes all data to generate 2000+ word strategic reports with opportunity scoring, risk assessment, and tailored recommendations for your specific Domain Idea.",
                tags: ["Opportunity Score", "Risk Analysis", "Strategy"],
              },
              {
                icon: Target,
                color: "text-red-500 dark:text-red-400",
                bg: "bg-red-50 dark:bg-red-950/40",
                border: "border-red-100 dark:border-red-900",
                title: "Competition Intelligence",
                description:
                  "Understand the competitive landscape — who the key players are, what's missing in the market, and where you can carve out a defensible position.",
                tags: ["Market Gaps", "Competitor Map", "Positioning"],
              },
              {
                icon: DollarSign,
                color: "text-green-600 dark:text-green-400",
                bg: "bg-green-50 dark:bg-green-950/40",
                border: "border-green-100 dark:border-green-900",
                title: "Monetization Strategies",
                description:
                  "Get AI-generated monetization blueprints: product ideas, pricing models, affiliate opportunities, and service packages tailored to your Domain Idea's audience.",
                tags: ["Revenue Models", "Pricing", "Products"],
              },
              {
                icon: Globe,
                color: "text-cyan-600 dark:text-cyan-400",
                bg: "bg-cyan-50 dark:bg-cyan-950/40",
                border: "border-cyan-100 dark:border-cyan-900",
                title: "Go-To-Market Playbook",
                description:
                  "Receive a step-by-step market entry strategy including content angles, distribution channels, audience targeting, and early traction tactics.",
                tags: ["Launch Plan", "Channels", "Audience"],
              },
              {
                icon: AlertTriangle,
                color: "text-yellow-600 dark:text-yellow-400",
                bg: "bg-yellow-50 dark:bg-yellow-950/40",
                border: "border-yellow-100 dark:border-yellow-900",
                title: "Risk Assessment",
                description:
                  "Identify potential pitfalls before you invest — market saturation, seasonal drops, regulatory concerns, and low monetization ceiling all flagged upfront.",
                tags: ["Saturation Risk", "Seasonality", "Pitfalls"],
              },
              {
                icon: Lightbulb,
                color: "text-pink-600 dark:text-pink-400",
                bg: "bg-pink-50 dark:bg-pink-950/40",
                border: "border-pink-100 dark:border-pink-900",
                title: "Content & SEO Insights",
                description:
                  "Discover high-intent topics, trending questions, and content gaps your audience is actively searching for but not finding answers to.",
                tags: ["Content Ideas", "SEO Gaps", "Trending Topics"],
              },
              {
                icon: FileText,
                color: "text-indigo-600 dark:text-indigo-400",
                bg: "bg-indigo-50 dark:bg-indigo-950/40",
                border: "border-indigo-100 dark:border-indigo-900",
                title: "Exportable Full Reports",
                description:
                  "Every report is saved to your dashboard. Export as PDF or Markdown, share with your team, or reference anytime as your business evolves.",
                tags: ["PDF Export", "Markdown", "History"],
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className={`bg-white dark:bg-gray-900 rounded-xl border ${feature.border} p-6 hover:shadow-lg transition-shadow group`}
              >
                <div
                  className={`w-12 h-12 ${feature.bg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-4">
                  {feature.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {feature.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`text-xs px-2 py-0.5 ${feature.bg} ${feature.color} font-medium rounded-full`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section
        id="how-it-works"
        className="py-24 bg-gradient-to-b from-gray-50 dark:from-gray-950 to-white dark:to-gray-900"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/40 border border-purple-100 dark:border-purple-900 rounded-full mb-4 uppercase tracking-wider">
              How It Works
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-gray-100 mb-4 tracking-tight">
              From Idea to Insight
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">in 3 Simple Steps</span>
            </h2>
            <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              No research background needed. Enter your idea, let our AI do the
              heavy lifting.
            </p>
          </div>

          <div className="relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-1/2 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-blue-200 via-purple-200 to-green-200 -translate-y-1/2 mx-16" />

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  icon: Search,
                  color: "text-blue-600 dark:text-blue-400",
                  bg: "bg-blue-600",
                  title: "Enter Your Domain Idea",
                  description:
                    "Type any domain idea topic — a product category, service idea, content vertical, or business concept. Be as broad or specific as you want.",
                  example:
                    'e.g. "minimalist home office furniture" or "online piano lessons for adults"',
                },
                {
                  step: "02",
                  icon: Zap,
                  color: "text-purple-600 dark:text-purple-400",
                  bg: "bg-purple-600",
                  title: "AI Runs Deep Research",
                  description:
                    "Our AI simultaneously analyzes Reddit communities, Google Trends data, market competition, and synthesizes everything into structured intelligence.",
                  example:
                    "Scans 500+ posts · Trends data · Competitor mapping",
                },
                {
                  step: "03",
                  icon: BarChart3,
                  color: "text-green-600 dark:text-green-400",
                  bg: "bg-green-600",
                  title: "Get Your Full Report",
                  description:
                    "Receive a comprehensive validation report with an opportunity score, key insights, strategic recommendations, and actionable next steps.",
                  example:
                    "Score: 84/100 · High Opportunity · Ready in ~60 seconds",
                },
              ].map((step, idx) => (
                <div
                  key={step.step}
                  className="relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow p-8 text-center"
                >
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span
                      className={`inline-flex items-center justify-center w-8 h-8 ${step.bg} text-white text-sm font-bold rounded-full`}
                    >
                      {idx + 1}
                    </span>
                  </div>
                  <div
                    className={`w-16 h-16 bg-gray-50 dark:bg-gray-950 rounded-2xl flex items-center justify-center mx-auto mb-5 mt-2`}
                  >
                    <step.icon className={`w-8 h-8 ${step.color}`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-4">
                    {step.description}
                  </p>
                  <p
                    className={`text-xs font-medium ${step.color} bg-gray-50 dark:bg-gray-950 rounded-lg px-3 py-2`}
                  >
                    {step.example}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Use Cases ── */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/40 border border-green-100 dark:border-green-900 rounded-full mb-4 uppercase tracking-wider">
              Who It's For
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-gray-100 mb-4 tracking-tight">
              Built for Every
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Idea Maker</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Users,
                title: "Entrepreneurs & Founders",
                description:
                  "Validate your startup idea before spending months building. Know your market, competition, and potential revenue before writing a single line of code.",
                color: "text-blue-600 dark:text-blue-400",
                bg: "bg-blue-50 dark:bg-blue-950/40",
              },
              {
                icon: FileText,
                title: "Content Creators & Bloggers",
                description:
                  "Find profitable content Domain Ideas with growing audiences and strong monetization potential before investing time in creating a content library.",
                color: "text-purple-600 dark:text-purple-400",
                bg: "bg-purple-50 dark:bg-purple-950/40",
              },
              {
                icon: Globe,
                title: "E-commerce Sellers",
                description:
                  "Research product domain ideas, understand buyer psychology from Reddit, and identify gaps before choosing what to sell on Amazon, Shopify, or Etsy.",
                color: "text-green-600 dark:text-green-400",
                bg: "bg-green-50 dark:bg-green-950/40",
              },
              {
                icon: Brain,
                title: "Agency & Consultants",
                description:
                  "Deliver faster, data-backed market research to your clients. Generate professional Domain Idea reports in minutes instead of spending days on manual research.",
                color: "text-orange-500 dark:text-orange-400",
                bg: "bg-orange-50 dark:bg-orange-950/40",
              },
              {
                icon: TrendingUp,
                title: "Investors & Analysts",
                description:
                  "Quickly assess the market potential of an industry vertical or emerging Domain Idea. Get clear signal on demand, competition, and growth trajectory.",
                color: "text-pink-600 dark:text-pink-400",
                bg: "bg-pink-50 dark:bg-pink-950/40",
              },
              {
                icon: Lightbulb,
                title: "Side Project Builders",
                description:
                  "Don't waste your limited free time on ideas with no market. Validate your side project in 60 seconds and invest your energy only where it counts.",
                color: "text-indigo-600 dark:text-indigo-400",
                bg: "bg-indigo-50 dark:bg-indigo-950/40",
              },
            ].map((useCase) => (
              <div
                key={useCase.title}
                className="flex gap-4 p-6 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl hover:border-gray-200 dark:hover:border-gray-700 hover:shadow-md transition-all group"
              >
                <div
                  className={`w-12 h-12 ${useCase.bg} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}
                >
                  <useCase.icon className={`w-6 h-6 ${useCase.color}`} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1">
                    {useCase.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    {useCase.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section
        id="pricing"
        className="py-24 bg-gradient-to-b from-gray-50 dark:from-gray-950 to-white dark:to-gray-900"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900 rounded-full mb-4 uppercase tracking-wider">
              Pricing
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-gray-100 mb-4 tracking-tight">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-500 dark:text-gray-400">
              Start free. Upgrade only when you're ready.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="bg-yellow-200 rounded-2xl border border-yellow-300 shadow-xl shadow-yellow-300 dark:shadow-yellow-500/10 p-8">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">Free</h3>
                <p className="text-sm text-gray-700">Perfect to try it out</p>
              </div>
              <div className="flex items-end gap-1 mb-8">
                <span className="text-5xl font-extrabold text-gray-900">
                  ₹0
                </span>
                <span className="text-gray-700 mb-2">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  "3 domain idea validations per month",
                  "Reddit analysis (top 50 posts)",
                  "Google Trends overview",
                  "AI summary report (~500 words)",
                  "Overall opportunity score",
                  "View public reports",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-800">{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className="block w-full py-3 px-6 text-center text-sm font-semibold text-yellow-800 bg-white hover:bg-yellow-50 rounded-xl transition"
              >
                Start for Free
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="bg-blue-600 rounded-2xl border border-blue-700 shadow-xl shadow-blue-200 dark:shadow-blue-900/50 p-8 relative overflow-hidden">
              {/* Glow */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-blue-400 rounded-full blur-3xl opacity-20" />
              <div className="relative">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-xl font-bold text-white">Pro</h3>
                  <span className="text-xs font-bold bg-yellow-400 text-yellow-900 px-2.5 py-1 rounded-full">
                    MOST POPULAR
                  </span>
                </div>
                <p className="text-sm text-blue-200 mb-6">
                  For serious builders
                </p>
                <div className="flex items-end gap-1 mb-8">
                  <span className="text-5xl font-extrabold text-white">
                    ₹2500
                  </span>
                  <span className="text-blue-300 mb-2">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {[
                    "Unlimited Domain Idea validations",
                    "Deep Reddit analysis (500+ posts)",
                    "Advanced Trends data & forecasting",
                    "Full AI report (2000+ words)",
                    "Competition deep-dive",
                    "Monetization strategy report",
                    "Go-to-market playbook",
                    "Export to PDF & Markdown",
                    "Save unlimited reports",
                    "Priority processing",
                  ].map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-blue-300 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-blue-100">{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  className="block w-full py-3 px-6 text-center text-sm font-bold text-blue-700 bg-white hover:bg-blue-50 rounded-xl transition"
                >
                  Upgrade to Pro →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/40 border border-yellow-100 dark:border-yellow-900 rounded-full mb-4 uppercase tracking-wider">
              Testimonials
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-gray-100 mb-4 tracking-tight">
              What Our Users Say
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Alex R.",
                role: "Indie Hacker",
                avatar: "AR",
                color: "bg-blue-600",
                quote:
                  "I used to spend 2-3 days researching a new Domain Idea. With MarshAI I get the same depth of research in under a minute. It's the first tool I open when I have a new idea.",
                stars: 5,
              },
              {
                name: "Sarah K.",
                role: "Content Creator",
                avatar: "SK",
                color: "bg-purple-600",
                quote:
                  "The Reddit analysis feature is incredible. It surfaces real community conversations and pain points that I would have never found manually. My content now converts 3x better.",
                stars: 5,
              },
              {
                name: "Marcus T.",
                role: "E-commerce Founder",
                avatar: "MT",
                color: "bg-green-600",
                quote:
                  "Before launching my store I validated 12 product Domain Ideas in one afternoon. Found 2 with real potential and avoided 10 that looked good on the surface but had major issues.",
                stars: 5,
              },
            ].map((t) => (
              <div
                key={t.name}
                className="bg-gray-50 dark:bg-gray-950 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-6">
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 ${t.color} rounded-full flex items-center justify-center text-white text-xs font-bold`}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{t.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section
        id="faq"
        className="py-24 bg-gradient-to-b from-gray-50 dark:from-gray-950 to-white dark:to-gray-900"
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/40 border border-gray-200 dark:border-gray-700 rounded-full mb-4 uppercase tracking-wider">
              FAQ
            </span>
            <h2 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "How accurate is the Domain Idea data?",
                a: "Our data is pulled in real-time from Reddit and Google Trends, then analyzed by Claude AI. The data reflects current market conditions. We recommend re-validating Domain Ideas every 3–6 months as markets evolve.",
              },
              {
                q: "Can I cancel my Pro subscription anytime?",
                a: "Yes, absolutely. There are no long-term contracts. You can cancel your Pro subscription at any time from your account settings, effective at the end of your current billing period.",
              },
              {
                q: "How long does a validation report take?",
                a: "Most reports are generated in under 60 seconds. Complex Domain Ideas with large Reddit communities may occasionally take up to 2–3 minutes.",
              },
              {
                q: "What's the difference between Free and Pro?",
                a: "The Free plan gives you 3 validations per month with basic analysis (~500 word reports). Pro gives you unlimited validations, deeper Reddit data (500+ posts), full reports (2000+ words), competition analysis, monetization strategies, export features, and priority processing.",
              },
              {
                q: "Is my domain idea data kept private?",
                a: "Yes. Your reports and searches are private by default. Only you can view them in your dashboard. We never share your Domain Idea ideas or report data with other users.",
              },
              {
                q: "Can I use MarshAI for client work?",
                a: "Absolutely. Many agencies and consultants use MarshAI to deliver fast, data-driven market research to clients. Pro plan reports can be exported to PDF and shared directly.",
              },
            ].map((item) => (
              <div
                key={item.q}
                className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
              >
                <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-2">{item.q}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-3xl p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl opacity-5" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl opacity-5" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 border border-white/20 rounded-full mb-6">
                <Sparkles className="w-4 h-4 text-white" />
                <span className="text-sm font-medium text-white">
                  Start validating in seconds
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
                Stop Guessing.
                <span className="block">Start Knowing.</span>
              </h2>
              <p className="text-xl text-blue-100 mb-10 max-w-xl mx-auto">
                Join hundreds of builders who validate their Domain Idea ideas with
                real data before investing time and money.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/register"
                  className="flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-700 font-bold text-lg rounded-xl hover:bg-blue-50 transition shadow-lg"
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/signin"
                  className="flex items-center justify-center gap-2 px-8 py-4 bg-white/10 border border-white/20 text-white font-semibold text-lg rounded-xl hover:bg-white/20 transition"
                >
                  Sign In
                </Link>
              </div>
              <p className="text-blue-200 text-sm mt-6">
                3 free validations · No credit card required · Cancel anytime
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-gray-900 dark:bg-gray-950 text-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-1">
              <div className="flex items-center gap-1 mb-3">
                <ChartNoAxesCombined className="w-6 h-6 text-blue-400" />
                <span className="text-2xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  MarshAI
                </span>
              </div>
              <p className="text-sm leading-relaxed">
                AI-powered Domain Idea validation platform. Validate any market idea
                in under 60 seconds.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#features" className="hover:text-white transition">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-white transition">
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#how-it-works"
                    className="hover:text-white transition"
                  >
                    How It Works
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Account</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/register"
                    className="hover:text-white transition"
                  >
                    Sign Up
                  </Link>
                </li>
                <li>
                  <Link
                    href="/signin"
                    className="hover:text-white transition"
                  >
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard"
                    className="hover:text-white transition"
                  >
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#faq" className="hover:text-white transition">
                    FAQ
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:support@MarshAI.com"
                    className="hover:text-white transition"
                  >
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm">&copy; 2026 MarshAI. All rights reserved.</p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="hover:text-white transition">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white transition">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}