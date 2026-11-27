// Single source of truth for portfolio copy.
// Every claim here is taken from Muhammad Ali's resume / LinkedIn profile.
// Do not add metrics, clients or outcomes that are not verified.

export const profile = {
  name: "Muhammad Ali",
  firstName: "Ali",
  role: "Software Engineer",
  location: "Lahore, Pakistan",
  email: "ak.alikhan.5911@gmail.com",
  phoneDisplay: "+92 302 184 8264",
  resumeUrl: "/resume.pdf",
  available: "Open to full stack & React roles",
};

const whatsappText = encodeURIComponent(
  "Hi Muhammad Ali, I came across your portfolio and would like to talk."
);

export const socials = {
  email: { label: "Email", href: `mailto:${profile.email}`, handle: profile.email },
  linkedin: {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/ali-khan-mern",
    handle: "in/ali-khan-mern",
  },
  github: {
    label: "GitHub",
    href: "https://github.com/alikhanglobedev777",
    handle: "alikhanglobedev777",
  },
  whatsapp: {
    label: "WhatsApp",
    href: `https://wa.me/923021848264?text=${whatsappText}`,
    handle: profile.phoneDisplay,
  },
};

export const navLinks = [
  { id: "work", label: "Work" },
  { id: "expertise", label: "Expertise" },
  { id: "experience", label: "Experience" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

export const hero = {
  eyebrow: "Muhammad Ali — Software Engineer",
  greeting: "Hi, I'm Ali.",
  intro: "I am a",
  // Cycled in the flip-notepad card.
  roles: ["Software Engineer", "Full Stack Developer", "MERN Stack Developer", "Product Builder"],
  description:
    "I build full stack business systems — contracts, logistics, production and quality management — with React, Node.js, TypeScript and PostgreSQL.",
  tag: "Software Engineer",
};

export const marqueeSkills = [
  "React.js",
  "Next.js",
  "TypeScript",
  "Node.js",
  "Express.js",
  "NestJS",
  "Fastify",
  "tRPC",
  "Drizzle ORM",
  "PostgreSQL",
  "MongoDB",
  "Redis",
  "TanStack Query",
  "Tailwind CSS",
  "Docker",
];

/*
 * Projects
 * kind: "product"  → personal product, has a live link
 *       "client"   → professional / client system, private codebase
 * mock: which illustrative mockup to render (no real screenshots available)
 */
export const projects = [
  {
    slug: "phone-discover",
    kind: "product",
    name: "Phone Discover",
    category: "AI / Consumer Product",
    year: "2026",
    tagline: "AI-assisted phone recommendation platform for the Pakistani market.",
    live: "https://phone-discover-web.onrender.com",
    stack: ["React", "TypeScript", "Django", "PostgreSQL", "Redis", "MinIO", "Render"],
    accent: "#5b4bff",
    tint: "#efe8dd",
    mock: "phones",
    overview:
      "A full stack phone catalogue and recommendation platform that helps buyers in Pakistan find the right phone for their budget, compare specifications and explore observed PKR asking prices.",
    problem:
      "Phone buyers compare scattered specs and inconsistent local prices. Purely AI-generated advice can sound confident while being wrong, so recommendations need to stay grounded in real data.",
    role: "Sole designer and engineer — product scope, data model, backend, ranking logic, frontend and deployment.",
    work: [
      "Phone catalogue with specification comparison and PKR price exploration",
      "Deterministic, evidence-gated ranking and pricing engine",
      "Optional Gemini / OpenAI generated explanations with automatic AI fallback",
      "Natural-language query parsing in English and Roman Urdu",
      "Object storage on MinIO and caching with Redis",
    ],
    approach:
      "Ranking is deterministic and evidence-gated: the engine decides, and the language model only explains. If an AI provider is unavailable the platform falls back automatically, so recommendations never depend on a single model.",
  },
  {
    slug: "ak-converter",
    kind: "product",
    name: "AK Converter",
    category: "Productivity / File Tools",
    year: "2026",
    tagline: "A multi-format file workspace with 13 PDF, Excel and image tools.",
    live: "https://ak-file-converter.onrender.com",
    stack: ["React", "Node.js", "Express.js", "MongoDB", "JWT", "Render"],
    accent: "#ff6a3d",
    tint: "#ffece4",
    mock: "files",
    overview:
      "A full stack file conversion platform supporting 13 PDF, Excel and image conversion tools, with accounts, history and a visual page organiser.",
    problem:
      "Everyday document tasks are spread across many single-purpose sites, often with no history and no protection against heavy, concurrent conversions.",
    role: "Sole engineer — frontend, REST API, authentication, storage lifecycle and deployment.",
    work: [
      "13 conversion tools across PDF, Excel and image formats",
      "JWT authentication and per-user conversion history",
      "Visual PDF page organiser",
      "TTL auto-expiry so stored files clean themselves up",
      "Backend rate limiting and concurrency control for reliability",
    ],
    approach:
      "Conversions run behind rate limiting and concurrency control so a burst of heavy jobs can't take the service down, while MongoDB TTL indexes expire stored conversion history automatically.",
  },
  {
    slug: "aaa-services-directory",
    kind: "product",
    name: "AAA Services Directory",
    category: "Marketplace / MERN",
    year: null,
    tagline: "A local services marketplace connecting clients with providers.",
    live: "https://aaa-loy9.onrender.com",
    stack: ["React", "Node.js", "Express.js", "MongoDB", "JWT"],
    accent: "#0f9d76",
    tint: "#e2f5ee",
    mock: "directory",
    overview:
      "A MERN service marketplace where clients discover local service providers, with role-based access for different kinds of users.",
    problem:
      "Finding a trusted local provider usually means word of mouth. A directory needs clear roles, secure accounts and fast, responsive discovery.",
    role: "Full stack engineer — API design, authentication, data model and interface.",
    work: [
      "Role-based access for clients and service providers",
      "JWT authentication",
      "REST APIs for listings and service discovery",
      "Responsive search and browsing experience",
    ],
    approach:
      "A classic MERN architecture: Express REST endpoints over MongoDB, JWT-secured sessions and role checks on the server, consumed by a responsive React client.",
  },
  {
    slug: "teo-ai",
    kind: "client",
    name: "TEO-AI",
    category: "Contract Management System",
    stack: ["React", "TypeScript", "PostgreSQL", "tRPC", "Drizzle ORM", "TanStack Query"],
    accent: "#5b4bff",
    tint: "#efe8dd",
    mock: "contracts",
    overview:
      "A contract management system designed and developed full stack, with type-safe client–server communication and efficient data fetching.",
    work: [
      "End-to-end type safety with tRPC and Drizzle ORM",
      "Relational data modelling on PostgreSQL",
      "Data fetching and caching with TanStack Query",
    ],
  },
  {
    slug: "cargopro",
    kind: "client",
    name: "CargoPro",
    category: "Logistics Management System",
    stack: ["NestJS", "TypeORM", "PostgreSQL", "Swagger", "React"],
    accent: "#ff6a3d",
    tint: "#ffece4",
    mock: "logistics",
    overview:
      "Backend services for a logistics management system, documented with Swagger, plus a responsive React frontend.",
    work: [
      "NestJS backend services with TypeORM on PostgreSQL",
      "API documentation with Swagger",
      "Responsive React.js frontend",
    ],
  },
  {
    slug: "awan-sports",
    kind: "client",
    name: "Awan Sports",
    category: "Industrial Production Management",
    stack: ["Fastify", "PostgreSQL", "Drizzle ORM", "React", "TypeScript"],
    accent: "#0f9d76",
    tint: "#e2f5ee",
    mock: "production",
    overview:
      "A production management system with a high-performance Fastify backend and a modular React + TypeScript frontend.",
    work: [
      "High-performance backend on Fastify",
      "PostgreSQL with Drizzle ORM",
      "Modular React.js and TypeScript frontend",
    ],
  },
  {
    slug: "qualiflow",
    kind: "client",
    name: "QualiFlow",
    category: "Quality Management System",
    stack: ["Fastify", "PostgreSQL", "Drizzle ORM", "TypeScript", "TanStack Query", "shadcn/ui"],
    accent: "#c2410c",
    tint: "#fdeee2",
    mock: "quality",
    overview:
      "A full stack quality management system built on Fastify and PostgreSQL with a modern React, TanStack Query and shadcn/ui frontend.",
    work: [
      "Fastify + Drizzle ORM backend on PostgreSQL",
      "TypeScript across the stack",
      "React frontend with TanStack Query and shadcn/ui",
    ],
  },
  {
    slug: "mablay-cosmetics",
    kind: "client",
    name: "Mablay Cosmetics",
    category: "Sales Management System",
    stack: ["NestJS", "Node.js", "PostgreSQL", "TypeScript", "Tailwind CSS", "AWS"],
    accent: "#9333ea",
    tint: "#f1e9e0",
    mock: "sales",
    overview:
      "New features added to an existing full stack sales management codebase, deployed and maintained on AWS.",
    work: [
      "Feature development in an existing NestJS + PostgreSQL codebase",
      "TypeScript and Tailwind CSS interface work",
      "Deployment and maintenance on AWS",
    ],
  },
];

export const numbers = [
  { value: 1, suffix: "+", label: "Year building production software", note: "Since July 2025" },
  { value: 5, suffix: "", label: "Business systems contributed to", note: "Contracts → sales" },
  { value: 3, suffix: "", label: "Live personal products", note: "Deployed on Render" },
  { value: 13, suffix: "", label: "Conversion tools in AK Converter", note: "PDF · Excel · Image" },
];

export const domains = ["Contracts", "Logistics", "Manufacturing", "Quality", "Sales", "Consumer AI"];

export const capabilities = [
  {
    no: "01",
    title: "Product Engineering",
    body: "Taking a product from schema to screen — data models, APIs, authentication and responsive, SEO-friendly interfaces with SSR where it matters.",
    tech: ["React.js", "Next.js", "TypeScript", "Node.js", "Tailwind CSS"],
  },
  {
    no: "02",
    title: "Business Systems & APIs",
    body: "Modelling real operations — contracts, shipments, production lines, quality checks, sales — as clean relational data behind type-safe, documented APIs.",
    tech: ["PostgreSQL", "tRPC", "Drizzle ORM", "NestJS", "Fastify", "Swagger"],
  },
  {
    no: "03",
    title: "AI-assisted Products",
    body: "Practical AI that sits on top of reliable logic: deterministic engines that decide, language models that explain, and automatic fallback when a provider fails.",
    tech: ["Gemini API", "OpenAI API", "NL query parsing", "Redis"],
  },
];

export const automation = {
  steps: [
    { title: "Manual Process", text: "Map how the work really happens today." },
    { title: "Data Model", text: "Turn records into a relational schema." },
    { title: "API Layer", text: "Type-safe, validated, authenticated endpoints." },
    { title: "Interface", text: "Role-based screens for each team." },
    { title: "Visibility", text: "Live status, history and audit trail." },
  ],
  before: [
    "Spreadsheets and paper records",
    "Disconnected tools per department",
    "Repetitive manual data entry",
    "Status updates lost in chats",
    "No single source of truth",
  ],
  after: [
    "One centralised database",
    "Validated, type-safe APIs",
    "Role-based access for every team",
    "Automatic status changes & history",
    "Dashboards everyone can trust",
  ],
};

export const experience = [
  {
    company: "Solutyics",
    role: "MERN Stack Developer",
    period: "Mar 2026 — Present",
    place: "Faisal Town, Lahore",
    current: true,
    summary:
      "Building production business platforms across contract, logistics, industrial production and quality management.",
    points: [
      "Engineer full stack applications with Node.js, Express.js, React.js, MongoDB and PostgreSQL.",
      "Design RESTful APIs with structured routing, validation, authentication and authorization.",
      "Integrate tRPC and Drizzle ORM for type-safe backend communication.",
      "Build reusable UI with React, TypeScript, Tailwind CSS, Mantine UI and shadcn/ui.",
      "Ship server-side rendered Next.js pages to improve performance and SEO.",
    ],
    tags: ["Next.js", "tRPC", "Drizzle", "PostgreSQL", "Mantine UI"],
  },
  {
    company: "TechBuzz",
    role: "Associate Software Engineer (Part-Time)",
    period: "Apr 2026 — Sep 2026",
    place: "Johar Town, Lahore",
    summary: "Full stack MERN work on business modules, APIs and data-driven features.",
    points: [
      "Developed full stack web applications with MongoDB, Express.js, React.js and Node.js.",
      "Built and integrated RESTful APIs powering dynamic, data-driven frontend features.",
      "Handled bug fixes and production-level business modules.",
    ],
    tags: ["MongoDB", "Express.js", "React.js", "Node.js"],
  },
  {
    company: "Devfied Software House",
    role: "MERN Stack Developer Intern",
    period: "Jul 2025 — Dec 2025",
    place: "Johar Town, Lahore",
    summary: "Real-world MERN applications under senior developer supervision.",
    points: [
      "Built and tested REST APIs for authentication and CRUD operations.",
      "Built React.js components for admin dashboards and service-based apps.",
      "Designed responsive interfaces with React.js and Tailwind CSS.",
      "Collaborated through structured Git / GitHub workflows.",
    ],
    tags: ["REST APIs", "Tailwind CSS", "Postman", "Git"],
  },
];

export const about = {
  paragraphs: [
    "I started writing code because I loved solving problems — the moment a broken thing finally works never gets old.",
    "Building contract, logistics, production and quality systems taught me that code is only half the job. The other half is understanding how a business actually operates: who touches a record, where information gets lost, and which step everyone quietly works around.",
    "Today I combine full stack engineering with that product thinking to build systems people rely on every day — and I'm adding AI only where it makes them genuinely better.",
  ],
  facts: [
    { label: "Education", value: "BS Information Technology (Software Engineering)" },
    { label: "Institute", value: "Govt. College Township, Lahore — University of the Punjab affiliated" },
    { label: "Graduated", value: "August 2025" },
    { label: "Based in", value: "Lahore, Pakistan" },
  ],
};

export const skillGroups = [
  {
    name: "Frontend",
    primary: ["React.js", "Next.js", "TypeScript"],
    rest: ["JavaScript", "HTML5", "CSS3", "Tailwind CSS", "Mantine UI", "shadcn/ui", "SSR / SSG / CSR"],
  },
  {
    name: "Backend",
    primary: ["Node.js", "Express.js", "NestJS"],
    rest: ["Fastify", "tRPC", "Django", "Django REST Framework"],
  },
  {
    name: "Databases",
    primary: ["PostgreSQL", "MongoDB"],
    rest: ["SQL", "Redis", "Drizzle ORM", "TypeORM"],
  },
  {
    name: "APIs & State",
    primary: ["REST APIs", "TanStack Query"],
    rest: ["Authentication", "Authorization", "Zustand", "Redux", "Context API"],
  },
  {
    name: "Tools",
    primary: ["Git", "Docker"],
    rest: ["GitHub", "Postman", "Swagger", "Render", "AWS (deploy & maintain)"],
  },
  {
    name: "AI",
    primary: ["Gemini / OpenAI APIs"],
    rest: ["Claude", "Codex", "Natural-language parsing"],
  },
];

export const exploring = [
  { title: "AI that explains, not decides", text: "Pairing deterministic business logic with language models for trustworthy answers." },
  { title: "End-to-end type safety", text: "Pushing tRPC, Drizzle and TypeScript further across larger systems." },
  { title: "Workflow automation", text: "Replacing repetitive operational steps with event-driven processes." },
  { title: "Faster product loops", text: "AI-assisted development to ship and iterate with small teams." },
];
