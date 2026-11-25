import type { Content } from "./types";
import { pt } from "./pt";

// Mesmas regras e fatos de pt.ts (ver o comentário do topo de lá). Imagens e
// stacks vêm de lá para não divergirem.
const [lakePt, platformPt, milixPt] = pt.featured;
const [flowPt, libraryPt, vizuPt] = pt.more.projects;

export const en: Content = {
  locale: "en",
  meta: {
    title: "Edilberto Lima Jr. · Full-stack & data engineering",
    description:
      "Full-stack developer and data engineer in Brazil. Lead developer of the Acre Industry Observatory's data lake and data platform, and creator of Milix, a SaaS for clinics.",
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
    lead: "I take data the way the government publishes it and deliver it the way a business owner can read it. I'm the lead developer of the Acre Industry Observatory's data lake and platform, and I created Milix, a clinic management system.",
    ctaPrimary: "See the work",
    ctaWhatsapp: "Message me on WhatsApp",
    scrollHint: "Scroll down the river",
  },
  path: {
    eyebrow: "00 · the source",
    title: "From raw file to screen.",
    body: "Most of my work starts in a raw file and ends in a chart someone opens on Monday morning. I like owning the whole way between them: the collection, the data model and the app.",
    steps: [
      { value: "Collect", label: "Python and PySpark pulling data from government agencies, APIs and internal systems" },
      { value: "Model", label: "Bronze, silver and gold layers on Databricks, ready to query" },
      { value: "Show", label: "Dashboards and Next.js apps for the people who make the call" },
      { value: "Automate", label: "Scheduled routines and AI customer service on WhatsApp" },
    ],
  },
  featured: [
    {
      ...lakePt,
      title: "Acre Industry Observatory data lake",
      kicker: "Data engineering · in production",
      role: "Architecture and lead development",
      summary:
        "The Acre Industry Observatory's data foundation, on Azure. It takes in public data on jobs, foreign trade and companies, cleans it, checks it and gets it ready for dashboards and reports. I led the architecture and development, together with the Observatory team.",
      shots: [{ ...lakePt.shots[0], alt: "Cover of the Acre Exports Overview 2021–2025 deck, with exports rising from US$48.8M to US$98.8M" }],
      details: {
        overview:
          "The Acre Industry Observatory publishes analysis on the state's jobs, foreign trade and companies, and all of it depends on public data. The lake does the heavy lifting: it downloads the source, keeps the original, cleans it, checks it and publishes it to Azure Data Explorer. The platform, the bulletins and the reports all query it from there, in KQL.",
        decisions: [
          {
            problem: "Testing pipelines straight in the cloud costs money on every run.",
            choice: "I wrote a Python engine that runs the same on my machine and on Databricks. Every pipeline passes local tests before it ships, at no cost.",
          },
          {
            problem: "Every agency publishes in a different format.",
            choice: "Every source follows the same staged template (bronze, silver and gold), with separate dev and prod catalogs. A new source reuses the template instead of inventing another one.",
          },
          {
            problem: "Reprocessing a month must never duplicate a row.",
            choice: "Loads are idempotent and every raw file gets a SHA-256 hash. Running it again gives the same result.",
          },
          {
            problem: "Azure Data Explorer bills for every hour it's on.",
            choice: "An automation shuts the cluster down outside working hours.",
          },
        ],
        results: [
          "In production, orchestrated by Azure Data Factory on daily and monthly triggers.",
          "Processes Brazil's formal employment and hiring records, foreign trade, company registry, social security and census data, among other public sources.",
          "Feeds the platform dashboards, the monthly foreign trade bulletin and the Acre Exports Overview 2021–2025 report.",
        ],
      },
    },
    {
      ...platformPt,
      title: "Observatory data platform",
      kicker: "Full-stack · in production",
      role: "Lead developer",
      summary:
        "The site where business owners and managers explore the Observatory's data. Dashboards on Acre's jobs, wages, exports and companies, reports and AI summaries, without downloading a spreadsheet. I'm the lead developer, working with the Observatory team.",
      shots: [
        { ...platformPt.shots[0], alt: "Acre Industry Observatory home page, with a globe highlighting the state of Acre" },
        { ...platformPt.shots[1], alt: "Salary Radar dashboard: median pay, coverage and the distribution of RAIS employment records by minimum-wage band" },
      ],
      details: {
        overview:
          "The platform has a public portal, a signed-in area with dashboards, reports and presentations, and an admin panel. Every dashboard number comes from the lake, queried live in Azure Data Explorer. There are dashboards for formal employment, hiring, foreign trade, companies, workplace accidents and municipal finances, among others.",
        decisions: [
          {
            problem: "Copying the lake into the app database would double the cost and leave stale numbers on screen.",
            choice: "Queries go in KQL straight to Azure Data Explorer, with filters applied there. The app only receives the result.",
          },
          {
            problem: "Not every user can see everything, and some access has an end date.",
            choice: "Microsoft Entra ID sign-in and permissions by user or group, resource and action, with validity windows and an audit trail.",
          },
          {
            problem: "Using AI on the data without the bill getting out of hand.",
            choice: "Vercel AI SDK with Anthropic, OpenAI and Google behind a usage cap.",
          },
          {
            problem: "With dozens of modules, one change breaks another and nobody notices.",
            choice: "Tests in Vitest and Playwright, and CI/CD on GitHub Actions and Azure DevOps with separate dev, staging and production.",
          },
        ],
        results: [
          "Live at observatorio.fieac.org.br.",
          "Beyond dashboards: a newsletter, a news CMS, presentations shared by signed link and a request hub.",
        ],
      },
    },
    {
      ...milixPt,
      title: "Milix: clinic management",
      kicker: "My own SaaS · paying customers",
      role: "Founder and sole developer",
      summary:
        "Clinic management software: scheduling, patient records, finance and invoicing, with an AI agent that answers patients on WhatsApp. It's my own product. I write the code, sell it and run support, and clinics already pay for it.",
      shots: [
        { ...milixPt.shots[0], alt: "Milix demo with sample data: today's schedule next to a WhatsApp chat where the patient confirms her slot" },
        { ...milixPt.shots[1], alt: "Milix home page: Your clinic, all in tune." },
      ],
      details: {
        overview:
          "Milix covers the patient's whole journey, from the first WhatsApp message to the day's cash close. Each clinic is an isolated tenant and can have several branches. The first version, Smilix, ran on Supabase, Stripe and Docker on a VPS. I rebuilt it on an architecture that is easier to test and to grow.",
        decisions: [
          {
            problem: "A clinic must never see another clinic's data, not even by mistake.",
            choice: "Every table carries the clinic, and every public call goes through a single entry point that checks identity, permission and plan, in that order.",
          },
          {
            problem: "When code grows fast, sooner or later someone takes a shortcut.",
            choice: "A structural test fails the build if a public call shows up outside that entry point.",
          },
          {
            problem: "Plans, add-ons and trials have to bill on their own.",
            choice: "Recurring billing on Asaas, with monthly and yearly plans, add-ons, trials and webhooks.",
          },
          {
            problem: "Patients send voice notes and spell procedures their own way.",
            choice: "An agent on Meta's official Cloud API, with audio transcription, semantic search over embeddings and my own LLM gateway.",
          },
          {
            problem: "Moving fast alone without breaking what's already live.",
            choice: "Vitest and Playwright tests across the product, and every architecture decision written down as an ADR.",
          },
        ],
        results: [
          "Paying clinics using it every day.",
          "The full product cycle: building, selling, onboarding with patient data import, and support.",
        ],
      },
    },
  ],
  more: {
    eyebrow: "04 · custom builds",
    title: "Built to order, used every day.",
    body: "Two systems I built as a freelancer that are still in production, plus a personal project on public election data.",
    projects: [
      {
        ...flowPt,
        kicker: "Freelance · in production",
        role: "Full-stack developer",
        summary:
          "Point of sale, inventory and orders for a beverage distributor. A chatbot takes orders on WhatsApp, a board shows each one in real time and the driver gets the route on their phone.",
        details: {
          overview:
            "A system for a beverage distributor: point of sale, inventory and WhatsApp customer service. The chatbot talks to the customer, builds the order and reports every step through the official WhatsApp API. On the board, orders move across a Kanban in real time, and drivers get their route from Google Maps.",
          decisions: [
            {
              problem: "A chatbot that invents products or prices costs money.",
              choice: "Every reply goes through Zod validation, a confidence threshold and anti-hallucination guardrails.",
            },
            {
              problem: "Conversations and orders have many steps, and it's easy for one to get lost halfway.",
              choice: "An XState state machine drives the conversation flow and the order stages.",
            },
            {
              problem: "WhatsApp, the board and the driver need to see the same order at the same time.",
              choice: "Supabase Realtime on every screen and bot sessions in Redis with expiry.",
            },
            {
              problem: "Returnable bottles disappear when nobody tracks them.",
              choice: "Returnables tracking with automatic reminders.",
            },
          ],
          results: [
            "Used daily for sales, stock and orders.",
            "Real customer orders come in through the chatbot without anyone typing.",
            "Every order is tracked from the WhatsApp message to the doorstep.",
          ],
        },
      },
      {
        ...libraryPt,
        title: "Process Library",
        kicker: "Freelance · in production",
        role: "Full-stack developer",
        summary:
          "A knowledge base for an internet provider. Support agents follow a decision tree step by step, and managers build and fix those flows in a visual editor, without calling a developer.",
        details: {
          overview:
            "An internet provider's support team needed every agent to solve the same problem the same way. The Library stores processes as decision trees: the agent answers the questions and reaches the fix. Managers edit the flows in a visual editor and write articles in a rich-text editor. Each department sees its own content.",
          decisions: [
            {
              problem: "Non-technical managers need to build flows on their own.",
              choice: "A React Flow editor with custom nodes and automatic dagre layout. Managers drag and connect the steps.",
            },
            {
              problem: "Each department may only see its own content.",
              choice: "NextAuth with JWT and department permissions filtering all content.",
            },
            {
              problem: "Knowing which processes actually help.",
              choice: "The viewer records the agent's path through the nodes, and an access log shows what gets used the most.",
            },
          ],
          results: [
            "In production on the client's server.",
            "Managers create and update processes without a developer.",
            "Support follows the same standard across every department.",
          ],
        },
      },
      {
        ...vizuPt,
        kicker: "Personal project · public data",
        role: "Author",
        summary:
          "Acre's election results, from the whole state down to a single polling section. Maps, rankings and candidate comparison on electoral court data, built on a Python ETL that always produces the same output.",
        shots: [{ ...vizuPt.shots[0], alt: "Municipal map of Acre colored by the leading candidate for governor, with a vote summary alongside" }],
        details: {
          overview:
            "A Python pipeline prepares the electoral court's results, loads them into Convex and shows them as maps, rankings and comparisons, from the whole state down to a single section, with CSV export.",
          decisions: [
            {
              problem: "Running the ETL twice must never give different results.",
              choice: "Deterministic preparation with SHA-256 hashes: a second run produces exactly the same files.",
            },
            {
              problem: "Long imports fail halfway.",
              choice: "Batched imports with resume points that can be repeated without duplicates.",
            },
            {
              problem: "A wrong total on an election map is worse than no map.",
              choice: "Totals are checked automatically between Python and the database, and the map uses IBGE's 2025 municipal boundaries in MapLibre.",
            },
          ],
          results: ["660 polling places, 22 municipalities and 341 candidates, searchable down to the section."],
        },
      },
    ],
  },
  archive: {
    title: "Archive",
    items: [
      { ...pt.archive.items[0], description: "The first version of Milix, for dentists only: Supabase with RLS, Stripe and a WhatsApp bot in Docker on a VPS." },
      { ...pt.archive.items[1], title: "Fiscal data from 21 municipalities", description: "Brings the transparency portals of 21 Acre municipalities into one dataset of 2.09 million records." },
      { ...pt.archive.items[2], title: "Observatory data presentations", description: "HTML decks that open in any browser, with three.js and CI that validates every version. One of them is the Acre Exports Overview." },
      { ...pt.archive.items[3], title: "Agent skills catalog", description: "Teaches Claude Code and Codex to model, ingest and build dashboards the team's way, with eval cases for every skill." },
      { ...pt.archive.items[4], title: "Gazette Search", description: "Downloads Acre's official gazettes and court journals and searches for terms inside the PDFs." },
      { ...pt.archive.items[5], title: "Service desk and document flow", description: "An inter-department request app and a signed document approval flow that took the FIEAC System's internal requests off email and paper." },
      { ...pt.archive.items[6], title: "FIEAC System intranet", description: "The intranet rebuilt on modern SharePoint, with custom SharePoint Framework web parts." },
      { ...pt.archive.items[7], title: "QR Code generator", description: "Custom QR codes for Instagram, WhatsApp, Pix and Wi-Fi, as PNG or SVG." },
    ],
  },
  career: {
    eyebrow: "05 · career",
    title: "From English teacher to data engineer.",
    body: "I taught English in Acre's public schools while studying Information Systems. I got into IT as a support intern and worked my way through automation into data engineering. The classroom left me with a habit of explaining: I can walk non-technical people through an architecture, and I write docs for whoever comes next.",
    positions: [
      { ...pt.career.positions[0], title: "IT Analyst · data engineering and full-stack", company: "Acre Industry Observatory, FIEAC System", period: "Oct 2025 – now", summary: "Lead developer of the data lake and the data platform. Also set up how the team uses AI coding agents." },
      { ...pt.career.positions[1], title: "Founder and developer", period: "Aug 2025 – now", summary: "My clinic SaaS: product, sales, onboarding and support." },
      { ...pt.career.positions[2], title: "Freelance full-stack developer", company: "Self-employed", period: "2025 – now", summary: "Systems in production for a beverage distributor and an internet provider." },
      { ...pt.career.positions[3], title: "IT Assistant", company: "UNITEC, FIEAC System", period: "Jan 2024 – Oct 2025", summary: "Power Apps, Power Automate flows, Python automation and the new SPFx intranet." },
      { ...pt.career.positions[4], title: "IT Intern", company: "UNITEC, FIEAC System", period: "Sep 2023 – Dec 2023", summary: "Support, tickets and my first internal Power Platform apps." },
    ],
    earlier: "Before that: English teacher for the state of Acre (2021–2024) and help desk intern at Uninorte (2021).",
    educationTitle: "Education",
    education: [
      { degree: "B.Sc. in Information Systems", institution: "Estácio-Unimeta", period: "2021–2024" },
      { degree: "B.Ed. in English Language", institution: "Federal University of Acre", period: "2016–2019" },
    ],
    certificationsTitle: "Courses",
    certifications: "Data Analytics and Project Management at the Industry Corporate University. Advanced Python, Django, advanced SQL and Power BI at Alura.",
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
    title: "If your business runs on spreadsheets and WhatsApp, I know where to start.",
    body: "I work with small and large companies, from the first sketch to a live system. You tell me how the work gets done today, I propose the smallest system that fixes it, and we grow from there.",
    items: [
      { title: "Custom systems", description: "Point of sale, stock, scheduling, knowledge bases. The software follows your process, not the other way around." },
      { title: "AI support on WhatsApp", description: "An agent that takes orders, books appointments and answers questions, without making up prices or products." },
      { title: "Data and dashboards", description: "Your spreadsheets and systems in one place, and a dashboard with the numbers that matter to your business." },
      { title: "Automation", description: "Document approvals, reports, repetitive email. The manual work happens on its own, with a log of everything." },
      { title: "SaaS from scratch", description: "From MVP to a product that bills: many companies on one system, plans, recurring payments and invoicing." },
      { title: "Integrations", description: "Payments, invoicing, WhatsApp, ERPs and any API, wired into the tools you already use." },
    ],
    cta: "Tell me about your project",
  },
  contact: {
    eyebrow: "07 · contact",
    title: "Got a role or a project? Let's talk.",
    body: "I reply fast on WhatsApp and email. If it's a role, my resume is right below.",
    whatsapp: "WhatsApp",
    email: pt.contact.email,
    resume: "Resume (PDF)",
    resumeAlt: "Currículo em português",
    note: "Rio Branco, Brazil · remote or on-site, open to relocation · UTC−5",
  },
  ui: {
    viewCase: "Read the case",
    visitSite: "Open the site",
    stack: "Stack",
    role: "Role",
    back: "Back to start",
    overview: "Context",
    decisions: "Decisions",
    problem: "Problem",
    choice: "What I did",
    results: "Where it stands",
    nextProject: "Next project",
    footer: "Made in Rio Branco, on the banks of the Acre River, with Next.js and three.js.",
    notFoundTitle: "This data never made it to gold.",
    notFoundBody: "The page you're looking for doesn't exist or has moved.",
    notFoundCta: "Back to start",
  },
};
