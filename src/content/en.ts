import type { Content } from "./types";
import { pt } from "./pt";

// Mesmos números de pt.ts. Imagens e stacks vêm de lá para não divergirem.
const [lakePt, platformPt, milixPt] = pt.featured;
const [flowPt, libraryPt, vizuPt] = pt.more.projects;

export const en: Content = {
  locale: "en",
  meta: {
    title: "Edilberto Lima Jr. · Full-stack & data engineering",
    description:
      "Full-stack developer and data engineer in Brazil. A production data lake on Azure, a data platform with 14 dashboards and a clinic SaaS with paying customers.",
  },
  nav: {
    work: "Work",
    career: "Career",
    services: "Services",
    contact: "Contact",
    resume: "Resume",
    switchLang: "PT",
    switchLangHref: "/",
    skip: "Skip to content",
    menuOpen: "Open menu",
    menuClose: "Close menu",
    mainLabel: "Main",
  },
  hero: {
    eyebrow: "Rio Branco, Brazil · open to roles and projects",
    name: "Edilberto Lima Jr.",
    role: "Full-stack developer and data engineer",
    lead: "I take data from the raw source to the screen of whoever makes the call: I built the Acre Industry Observatory's data lake on my own, I develop the platform that serves it, and I founded a SaaS already used by 3 paying clinics.",
    ctaPrimary: "See the work",
    ctaWhatsapp: "Message me on WhatsApp",
    scrollHint: "Scroll to follow the data",
  },
  path: {
    eyebrow: "00 · sources",
    title: "Fifteen raw sources. One path to the screen.",
    body: "I've spent 3+ years building end to end. I write the ingestion in PySpark, model the layers in Databricks, publish to Azure Data Explorer and build the Next.js app that puts it in front of managers and business owners. I run AI in production: agents, WhatsApp chatbots and agent-assisted development. Fluent English — I taught it for two years.",
    metrics: [
      { value: "15", label: "public and institutional datasets integrated" },
      { value: "30", label: "scheduled pipelines in Azure Data Factory" },
      { value: "23.7M", label: "records in the largest dataset" },
      { value: "3", label: "paying clinics on Milix" },
    ],
  },
  featured: [
    {
      ...lakePt,
      title: "Acre Industry Observatory data lake",
      kicker: "Data engineering · in production",
      role: "Architect and sole developer",
      summary:
        "I designed and built the FIEAC System's data lake on Azure by myself. Fifteen public and institutional datasets flow through bronze, silver and gold and land in Azure Data Explorer, ready for dashboards and reports.",
      metrics: [
        { value: "30", label: "ADF pipelines" },
        { value: "15", label: "sources integrated" },
        { value: "102", label: "test files" },
      ],
      shots: [{ ...lakePt.shots[0], alt: "Cover of the Acre Exports Overview 2021–2025 deck, with exports rising from US$48.8M to US$98.8M" }],
      details: {
        overview:
          "The lake brings public and institutional datasets into bronze, silver and gold layers on Databricks with Unity Catalog and Delta Lake, orchestrated by Azure Data Factory. Curated data goes to Azure Data Explorer, which the Observatory platform, bulletins and reports query with KQL.",
        challenges: [
          "Large, heterogeneous sources: up to 23.7 million records in a single one",
          "Reprocessing loads without duplicating data",
          "Validating pipelines without paying for the cloud on every test",
          "No secrets scattered across code or config",
          "Keeping Azure Data Explorer costs under control",
        ],
        solutions: [
          "Medallion architecture on Delta Lake and Unity Catalog, with separate dev and prod catalogs",
          "A Python engine that runs the same locally and in the cloud, so every pipeline is validated on my machine first",
          "Idempotent run control and a SHA-256 manifest of raw files",
          "Managed Identity, Key Vault and RBAC on every service, no shared keys",
          "30 pipelines on monthly and daily triggers, plus automation that shuts ADX down outside working hours",
        ],
        results: [
          "In production, running on schedule",
          "RAIS (1.3M employment records), CAGED (613K hires and layoffs), INSS (23.7M benefits) and Comex Stat (18M rows), among others",
          "Feeds the platform dashboards, the monthly foreign trade bulletin and the Acre Exports Overview 2021–2025 report",
        ],
      },
    },
    {
      ...platformPt,
      title: "Observatory data intelligence platform",
      kicker: "Full-stack · in production",
      role: "Lead developer",
      summary:
        "The portal that delivers the lake to managers and business owners: 14 analytical dashboards querying ADX in KQL, AI from three providers, newsletter, CMS and a request hub, with corporate sign-in and per-user and per-group permissions.",
      metrics: [
        { value: "14", label: "analytical dashboards" },
        { value: "945", label: "test files" },
        { value: "3", label: "environments with CI/CD" },
      ],
      shots: [
        { ...platformPt.shots[0], alt: "Acre Industry Observatory home page, with a globe highlighting the state of Acre" },
        { ...platformPt.shots[1], alt: "Salary Radar dashboard: median pay, coverage and the distribution of RAIS employment records by minimum-wage band" },
      ],
      details: {
        overview:
          "I'm the lead developer of the Acre Industry Observatory platform. It has a public portal, a signed-in area with dashboards, reports and presentations, and a full admin panel. Every dashboard number comes from the data lake, queried in Azure Data Explorer.",
        challenges: [
          "Querying large volumes without pulling data into the app",
          "Per-user and per-group access, with expiry and an audit trail",
          "Multi-provider AI without exposing keys or blowing the budget",
          "Keeping quality high across dozens of modules",
        ],
        solutions: [
          "KQL queries with filters applied inside Azure Data Explorer",
          "Microsoft Entra ID sign-in and permissions by user or group, resource and action, with validity windows and auditing",
          "Vercel AI SDK with Anthropic, OpenAI and Google, keys in Key Vault and usage limits",
          "CI/CD on GitHub Actions and Azure DevOps across dev, staging and production, tested with Vitest and Playwright",
        ],
        results: [
          "Live at observatorio.fieac.org.br",
          "14 dashboards: employment, hiring, foreign trade, companies, workplace accidents, municipal finances and more",
          "Newsletter, news CMS, signed-link presentations and a request hub",
        ],
      },
    },
    {
      ...milixPt,
      title: "Milix: clinic management",
      kicker: "My own SaaS · 3 paying clinics",
      role: "Founder and sole developer",
      summary:
        "A multi-tenant SaaS for clinics of any specialty: scheduling, records, finance, inventory, invoicing, CRM, a patient portal and an AI agent that answers on WhatsApp. I built it, sold it, onboarded the clinics and run support.",
      metrics: [
        { value: "3", label: "paying clinics" },
        { value: "155", label: "app screens" },
        { value: "1.7K", label: "test files" },
      ],
      shots: [
        { ...milixPt.shots[0], alt: "Milix demo with sample data: today's schedule next to a WhatsApp chat where the patient confirms her slot" },
        { ...milixPt.shots[1], alt: "Milix home page: Your clinic, all in tune." },
      ],
      details: {
        overview:
          "Milix serves dental, medical, physiotherapy, nutrition, psychology and aesthetics clinics. Each clinic is an isolated tenant and can have several branches. It covers the patient's whole journey, from the first WhatsApp message to the day's cash close. It grew out of Smilix, my first version, built for dentists.",
        challenges: [
          "Full data isolation between clinics and branches on every operation",
          "Fine-grained role permissions combined with plan-based features",
          "Recurring billing with plans, add-ons and trials",
          "An AI agent that talks to patients on WhatsApp safely",
          "Shipping fast, alone, without breaking production",
        ],
        solutions: [
          "Every table carries the tenant, and every public call goes through a single entry point that checks identity, permission and plan, in that order",
          "A structural test fails the build if anyone adds a public call outside that entry point",
          "Asaas billing with webhooks: monthly and yearly plans, add-ons and a 14-day trial",
          "Meta's official Cloud API, my own LLM gateway, audio transcription and semantic search with embeddings",
          "About 1,700 test files and 26 architecture decision records",
        ],
        results: [
          "3 paying clinics running it in production",
          "The full product cycle: building, selling, onboarding with patient data import, and support",
          "Migrated the first version (Supabase, Stripe, Docker on a VPS) to a sturdier, more testable architecture",
        ],
      },
    },
  ],
  more: {
    eyebrow: "04 · custom builds",
    title: "Systems for businesses that outgrew the spreadsheet.",
    body: "Freelance projects in production and a personal experiment with public data. Each one fixes a concrete problem for the people who use it every day.",
    projects: [
      {
        ...flowPt,
        kicker: "Freelance · in production",
        role: "Full-stack developer",
        summary:
          "Point of sale, inventory and orders for a beverage distributor, with an AI chatbot taking real orders on WhatsApp, a real-time board and a routing app for drivers.",
        details: {
          overview:
            "A full-stack system for a beverage distributor: point of sale, inventory and WhatsApp service. A Kanban board tracks orders in real time, drivers get routes through Google Maps, and an AI chatbot takes customer orders on its own, notifying every step through the official WhatsApp API.",
          challenges: [
            "A chatbot handling real orders without inventing products or prices",
            "Real-time order sync between WhatsApp, the board and drivers",
            "Tracking returnable bottles with automatic reminders",
            "Concurrent sessions and rate limits on the bot",
          ],
          solutions: [
            "Zod validation, confidence thresholds and anti-hallucination guardrails",
            "An XState state machine for conversation flows and order stages",
            "Supabase Realtime everywhere and Redis sessions with TTL",
            "Geocoding and delivery routing with the Google Maps API",
          ],
          results: [
            "Used daily at the distributor for sales, stock and orders",
            "Real customer orders taken by the chatbot without human help",
            "Every order tracked from the WhatsApp message to the doorstep",
          ],
        },
      },
      {
        ...libraryPt,
        title: "Process Library",
        kicker: "Freelance · in production",
        role: "Full-stack developer",
        summary:
          "A knowledge base for an internet provider: support agents follow interactive decision trees, and non-technical managers build the flows in a visual editor.",
        metrics: [
          { value: "22", label: "tables" },
          { value: "23", label: "screens" },
        ],
        details: {
          overview:
            "A knowledge base and process library for an internet provider's support team. Agents follow decision trees step by step; managers edit the flows in a React Flow editor and write articles in a rich-text editor. Access is role-based, with visibility by department.",
          challenges: [
            "A flow editor that non-technical managers can actually use",
            "Content visibility by role and department",
            "Keeping the old decision-tree format working next to the new one",
          ],
          solutions: [
            "React Flow with custom nodes and automatic dagre layout",
            "NextAuth with JWT and department permissions filtering all content",
            "A step-by-step viewer that records the agent's path through the nodes",
          ],
          results: [
            "In production on the client's server, standardizing support across teams",
            "Managers create and update processes without a developer",
            "Access logs showing which processes get used the most",
          ],
        },
      },
      {
        ...vizuPt,
        kicker: "Personal project · public data",
        role: "Author",
        summary:
          "Acre election results from public electoral court data: maps, rankings and candidate comparison from the whole state down to a single polling section, on a deterministic, replayable Python ETL.",
        metrics: [
          { value: "258K", label: "vote rows" },
          { value: "2,270", label: "polling sections" },
        ],
        shots: [{ ...vizuPt.shots[0], alt: "Municipal map of Acre colored by the leading candidate for governor, with a vote summary alongside" }],
        details: {
          overview:
            "A Python pipeline prepares Acre's election results, which are loaded into Convex and shown as maps, rankings and comparisons, from the whole state down to a single section, with CSV export.",
          challenges: [
            "Organizing 258K+ vote rows across several territorial levels",
            "Reprocessing without duplicates",
            "Making sure totals match the official source",
          ],
          solutions: [
            "Deterministic preparation with SHA-256 hashes: a rerun produces the exact same files",
            "Batched, resumable imports that can be repeated safely",
            "Automatic total checks between Python and the database, and the 2025 IBGE boundaries in MapLibre",
          ],
          results: [
            "258,052 vote rows, 2,270 sections, 660 polling places, 22 municipalities and 341 candidates",
            "Querying and export down to the polling section",
          ],
        },
      },
    ],
  },
  archive: {
    title: "Archive",
    items: [
      { ...pt.archive.items[0], description: "The first version of Milix, for dentists: Supabase with RLS, Stripe and a WhatsApp bot, running in Docker on a VPS." },
      { ...pt.archive.items[1], title: "Fiscal data from 21 municipalities", description: "A pipeline unifying the transparency portals of 21 Acre municipalities: 2.09 million records across 16 tables." },
      { ...pt.archive.items[2], title: "Observatory data presentations", description: "A kit for self-contained HTML decks with three.js and CI that validates every version. Acre Exports Overview and an East Manaus study." },
      { ...pt.archive.items[3], title: "Agent skills catalog", description: "Modeling, ingestion and dashboard skills for Claude Code and Codex, hash-synced across repos, with 34 eval cases." },
      { ...pt.archive.items[4], title: "Gazette Search", description: "Downloads Acre's official gazettes and court journals and searches terms inside the PDFs, with CLI and GUI." },
      { ...pt.archive.items[5], title: "Service desk and document flow", description: "An inter-department request app and a signed document approval flow that replaced email and paper at the FIEAC System." },
      { ...pt.archive.items[6], title: "FIEAC System intranet", description: "The intranet rebuilt on modern SharePoint, with custom SharePoint Framework web parts." },
      { ...pt.archive.items[7], title: "QR Code generator", description: "Custom QR codes for Instagram, WhatsApp, Pix and Wi-Fi, exported as PNG and SVG." },
    ],
  },
  career: {
    eyebrow: "05 · career",
    title: "From English teacher to data engineer.",
    body: "I taught English in Acre's public schools for over two years while studying Information Systems. The teaching stuck: I explain architecture to non-technical people and document for the next developer.",
    positions: [
      { ...pt.career.positions[0], title: "IT Analyst · data engineering and full-stack", company: "Acre Industry Observatory, FIEAC System", period: "Oct 2025 – now", summary: "Azure data lake, the data platform and the team's standard for AI coding agents." },
      { ...pt.career.positions[1], title: "Founder and developer", period: "Aug 2025 – now", summary: "Multi-tenant clinic SaaS with recurring billing and a WhatsApp AI agent." },
      { ...pt.career.positions[2], title: "Freelance full-stack developer", company: "Self-employed", period: "2025 – now", summary: "Custom systems in production for a distributor and an internet provider." },
      { ...pt.career.positions[3], title: "IT Assistant", company: "UNITEC, FIEAC System", period: "Jan 2024 – Oct 2025", summary: "Power Apps, Power Automate, Python automation and the new SPFx intranet." },
      { ...pt.career.positions[4], title: "IT Intern", company: "UNITEC, FIEAC System", period: "Sep 2023 – Dec 2023", summary: "Support, tickets and my first internal Power Platform apps." },
    ],
    earlier: "Before that: English teacher for the state of Acre (2021–2024) and help desk intern at Uninorte (2021).",
    educationTitle: "Education",
    education: [
      { degree: "B.Sc. in Information Systems", institution: "Estácio-Unimeta", period: "2021–2024" },
      { degree: "B.Ed. in English Language", institution: "Federal University of Acre", period: "2016–2019" },
    ],
    certificationsTitle: "Courses",
    certifications: "13 completed courses, including Data Analytics and Project Management (Industry Corporate University), advanced Python, Django, advanced SQL and Power BI (Alura).",
    skillsTitle: "Tools",
    skills: [
      { group: "Data", items: pt.career.skills[0].items },
      { group: "Apps", items: pt.career.skills[1].items },
      { group: "AI", items: ["Vercel AI SDK", "OpenAI", "Anthropic", "Embeddings", "Agents", "Claude Code", "Codex"] },
      { group: "Cloud & quality", items: pt.career.skills[3].items },
    ],
  },
  services: {
    eyebrow: "06 · for your business",
    title: "Stuck on a manual process? I'll turn it into a system.",
    body: "I work with businesses of any size, from the first sketch to a running system, with the same care I put into the Observatory and Milix in production.",
    items: [
      { title: "Custom systems", description: "Sales, stock, scheduling, knowledge bases: your workflow, instead of bending the business to generic software." },
      { title: "AI support on WhatsApp", description: "Chatbots and agents that take orders, book appointments and answer questions, with guardrails so they don't make things up." },
      { title: "Dashboards and data", description: "Pipelines that bring your spreadsheets and systems together, and dashboards that show what matters." },
      { title: "Process automation", description: "Repetitive work, from email to document approval, done automatically and logged." },
      { title: "SaaS from scratch", description: "From MVP to a product that bills: multi-tenant, plans, recurring payments and invoicing." },
      { title: "Integrations", description: "Payments, invoicing, WhatsApp, ERPs and APIs wired into the tools you already use." },
    ],
    cta: "Tell me about your project",
  },
  contact: {
    eyebrow: "07 · gold",
    title: "The data made it. Your move.",
    body: "Roles, freelance projects or just a chat about data: I reply fast on WhatsApp and email.",
    whatsapp: "WhatsApp",
    email: pt.contact.email,
    resume: "Resume (PDF)",
    resumeAlt: "Currículo em português",
    note: "Rio Branco, Brazil · remote or on-site · UTC−5",
  },
  ui: {
    viewCase: "Read the case",
    visitSite: "Open the site",
    stack: "Stack",
    role: "Role",
    back: "Back to start",
    overview: "Overview",
    challenges: "Challenges",
    solutions: "How I solved it",
    results: "Results",
    nextProject: "Next project",
    footer: "Built by Edilberto Lima Jr. with Next.js and three.js.",
    notFoundTitle: "This data never made it to gold.",
    notFoundBody: "The page you're looking for doesn't exist or has moved.",
    notFoundCta: "Back to start",
  },
};
