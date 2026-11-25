import type { Content, Project } from "./types";
import { pt } from "./pt";

// Mesmas regras e fatos de pt.ts (ver o comentário do topo de lá). Imagens,
// stacks e etapas da cena vêm de lá para não divergirem.
const [lakePt, platformPt, milixPt, flowPt, libraryPt, vizuPt] = pt.projects;
const shotAlt = (p: Project, ...alts: string[]) => p.shots.map((s, i) => ({ ...s, alt: alts[i] ?? s.alt }));

export const en: Content = {
  locale: "en",
  meta: {
    title: "Edilberto Lima Jr. · Full-stack & data engineering",
    description:
      "Full-stack developer and data engineer in Brazil. Lead developer of the Acre Industry Observatory's data lake and data platform, and creator of Milix, a SaaS for clinics.",
  },
  nav: {
    work: "work",
    now: "now",
    contact: "contact",
    resume: "Resume",
    switchLang: "PT",
    switchLangHref: "/",
    skip: "Skip to content",
    menuOpen: "Open menu",
    menuClose: "Close menu",
    mainLabel: "Main",
  },
  hero: {
    name: "Edilberto Lima Jr.",
    line: "Full-stack developer and data engineer in Rio Branco, in Brazil's Amazon.",
    scrollHint: "Scroll to fly over the river",
  },
  bio: [
    [
      "Hi, I'm Edilberto. I build whole systems: I fetch data wherever it lives, organize it in a ",
      { text: "data lake", term: "A central store where data from many sources is kept, cleaned and ready to query." },
      " and deliver it on a screen someone uses the next day.",
    ],
    [
      "I'm the lead developer of the ",
      { text: "data lake", href: "/en/projects/observatorio-data-lake" },
      " and the ",
      { text: "data platform", href: "/en/projects/observatorio-plataforma" },
      " at the ",
      { text: "Acre Industry Observatory", href: "https://observatorio.fieac.org.br" },
      ", together with the team there. On my own, I created ",
      { text: "Milix", href: "/en/projects/milix" },
      ", clinic management software that I code, sell and support.",
    ],
    [
      "Before programming, I taught English in public schools. The habit of explaining stuck: hover over the ",
      { text: "underlined words", term: "Exactly like this. Jargon here comes with a caption." },
      ".",
    ],
  ],
  work: { label: "work", more: "more things I made" },
  projects: [
    {
      ...lakePt,
      title: "Observatory data lake",
      line: "Brings public data on jobs, trade and companies into one place.",
      kicker: "Data engineering · in production",
      role: "Architecture and lead development",
      summary:
        "The Acre Industry Observatory's data foundation, on Azure. It takes in public data on jobs, foreign trade and companies, cleans it, checks it and gets it ready for dashboards and reports. I led the architecture and development, together with the Observatory team.",
      shots: shotAlt(lakePt, "Cover of the Acre Exports Overview 2021–2025 deck, with exports rising from US$48.8M to US$98.8M"),
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
      title: "Observatory platform",
      line: "Where business owners and managers in Acre explore that data.",
      kicker: "Full-stack · in production",
      role: "Lead developer",
      summary:
        "The site where business owners and managers explore the Observatory's data. Dashboards on Acre's jobs, wages, exports and companies, reports and AI summaries, without downloading a spreadsheet. I'm the lead developer, working with the Observatory team.",
      shots: shotAlt(
        platformPt,
        "Acre Industry Observatory home page, with a globe highlighting the state of Acre",
        "Salary Radar dashboard: median pay, coverage and the distribution of RAIS employment records by minimum-wage band",
      ),
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
      line: "My clinic management software, with AI customer service on WhatsApp.",
      tag: "my own product",
      kicker: "My own SaaS · paying customers",
      role: "Founder and sole developer",
      summary:
        "Clinic management software: scheduling, patient records, finance and invoicing, with an AI agent that answers patients on WhatsApp. It's my own product. I write the code, sell it and run support, and clinics already pay for it.",
      shots: shotAlt(milixPt, "Milix demo with sample data: today's schedule next to a WhatsApp chat where the patient confirms her slot", "Milix home page: Your clinic, all in tune."),
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
        results: ["Paying clinics using it every day.", "The full product cycle: building, selling, onboarding with patient data import, and support."],
      },
    },
    {
      ...flowPt,
      line: "WhatsApp orders, point of sale and deliveries for a beverage distributor.",
      kicker: "Freelance · in production",
      role: "Full-stack developer",
      summary:
        "Point of sale, inventory and orders for a beverage distributor. A chatbot takes orders on WhatsApp, a board shows each one in real time and the driver gets the route on their phone.",
      details: {
        overview:
          "A system for a beverage distributor: point of sale, inventory and WhatsApp customer service. The chatbot talks to the customer, builds the order and reports every step through the official WhatsApp API. On the board, orders move across a Kanban in real time, and drivers get their route from Google Maps.",
        decisions: [
          { problem: "A chatbot that invents products or prices costs money.", choice: "Every reply goes through Zod validation, a confidence threshold and anti-hallucination guardrails." },
          {
            problem: "Conversations and orders have many steps, and it's easy for one to get lost halfway.",
            choice: "An XState state machine drives the conversation flow and the order stages.",
          },
          {
            problem: "WhatsApp, the board and the driver need to see the same order at the same time.",
            choice: "Supabase Realtime on every screen and bot sessions in Redis with expiry.",
          },
          { problem: "Returnable bottles disappear when nobody tracks them.", choice: "Returnables tracking with automatic reminders." },
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
      line: "Decision trees for an internet provider's support team.",
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
          { problem: "Each department may only see its own content.", choice: "NextAuth with JWT and department permissions filtering all content." },
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
      line: "Acre's elections, from the whole state down to a polling section.",
      tag: "personal project",
      kicker: "Personal project · public data",
      role: "Author",
      summary:
        "Acre's election results, from the whole state down to a single polling section. Maps, rankings and candidate comparison on electoral court data, built on a Python ETL that always produces the same output.",
      shots: shotAlt(vizuPt, "Municipal map of Acre colored by the leading candidate for governor, with a vote summary alongside"),
      details: {
        overview:
          "A Python pipeline prepares the electoral court's results, loads them into Convex and shows them as maps, rankings and comparisons, from the whole state down to a single section, with CSV export.",
        decisions: [
          {
            problem: "Running the ETL twice must never give different results.",
            choice: "Deterministic preparation with SHA-256 hashes: a second run produces exactly the same files.",
          },
          { problem: "Long imports fail halfway.", choice: "Batched imports with resume points that can be repeated without duplicates." },
          {
            problem: "A wrong total on an election map is worse than no map.",
            choice: "Totals are checked automatically between Python and the database, and the map uses IBGE's 2025 municipal boundaries in MapLibre.",
          },
        ],
        results: ["660 polling places, 22 municipalities and 341 candidates, searchable down to the section."],
      },
    },
  ],
  archive: [
    { ...pt.archive[0], description: "The first version of Milix, for dentists only." },
    { ...pt.archive[1], title: "Fiscal data from 21 municipalities", description: "The transparency portals of 21 Acre municipalities in one dataset." },
    { ...pt.archive[2], title: "Data presentations", description: "The Observatory's HTML decks, like the Acre Exports Overview." },
    { ...pt.archive[3], title: "AI agent skills", description: "Teaches Claude Code and Codex to work the team's way." },
    { ...pt.archive[4], title: "Gazette Search", description: "Searches for terms inside Acre's official gazettes." },
    { ...pt.archive[5], title: "FIEAC System service desk", description: "Took internal requests off email and paper." },
    { ...pt.archive[6], title: "FIEAC System intranet", description: "Rebuilt on modern SharePoint, with custom web parts." },
    { ...pt.archive[7], title: "QR Code generator", description: "QR codes for Instagram, WhatsApp, Pix and Wi-Fi." },
  ],
  now: {
    label: "now",
    body: [
      ["At the Observatory, I keep adding new sources to the lake and new dashboards to the platform. At Milix, I look after the clinics already using it and what they ask for."],
      [
        "I also take on projects for businesses: custom systems, AI customer service on WhatsApp, ",
        { text: "dashboards", term: "Screens with the business numbers, updating on their own, instead of the spreadsheet someone rebuilds every week." },
        " and automations. If your business runs on spreadsheets and WhatsApp, ",
        { text: "get in touch", href: "whatsapp" },
        ".",
      ],
    ],
    signature: "Rio Branco, Brazil · November 2026",
  },
  past: {
    label: "before",
    hint: "hover or tap the years",
    steps: [
      { year: "2016", title: "Languages", text: "A teaching degree in English at the Federal University of Acre." },
      { year: "2021", title: "Classroom", text: "English teacher in Acre's public schools while studying Information Systems. The same year, a help desk internship at Uninorte." },
      { year: "2023", title: "Support", text: "IT intern at UNITEC, part of the FIEAC System: tickets and my first internal apps." },
      { year: "2024", title: "Automation", text: "IT assistant: Power Apps, Power Automate, Python and the FIEAC System's new intranet." },
      { year: "2025", title: "Data", text: "IT analyst at the Industry Observatory, leading the data lake and the platform. And Milix, on my own." },
    ],
    tools: "Day to day: Python, PySpark, Databricks, Azure, TypeScript, Next.js and PostgreSQL.",
  },
  contact: {
    label: "contact",
    body: [
      [
        "The fastest way to reach me is ",
        { text: "WhatsApp", href: "whatsapp" },
        ". I also answer at ",
        { text: "edlbrtojr@gmail.com", href: "email" },
        ". My resume is in ",
        { text: "English", href: "resume:en" },
        " and ",
        { text: "Portuguese", href: "resume:pt" },
        ", and the rest is on ",
        { text: "LinkedIn", href: "https://www.linkedin.com/in/edilbertolimajr/" },
        " and ",
        { text: "GitHub", href: "https://github.com/edlbrtojr" },
        ".",
      ],
    ],
    copied: "copied",
  },
  ui: {
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
    footer: "Made on the banks of the Acre River, with Next.js and three.js.",
    localTime: "in Rio Branco",
    notFoundTitle: "This data never made it to gold.",
    notFoundBody: "The page you're looking for doesn't exist or has moved.",
    notFoundCta: "Back to start",
  },
};
