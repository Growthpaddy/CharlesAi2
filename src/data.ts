/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LearningPath, Course, CurriculumModule, Testimonial, FAQItem, BonusItem, PricingPlan } from "./types";

export const learningPaths: LearningPath[] = [
  {
    id: "path-1",
    title: "AI for Business Growth",
    description: "Incorporate semantic analytics and business intelligence to double operating margins.",
    tag: "Strategic",
    lessons: 18,
    tools: ["ChatGPT Team", "Claude 3.5 Sonnet", "Perplexity Pro"],
    icon: "Briefcase"
  },
  {
    id: "path-2",
    title: "ChatGPT & Prompt Engineering Mastery",
    description: "Write highly complex, system-level prompts to automate cognitive labor and save hours.",
    tag: "Practical Mastery",
    lessons: 22,
    tools: ["OpenAI Playground", "Anthropic Workbench", "Custom GPTs"],
    icon: "Cpu"
  },
  {
    id: "path-3",
    title: "AI Content & Brand Empire",
    description: "Produce cinema-grade video, high-converting copy, and modern social graphics in minutes.",
    tag: "Creative Tech",
    lessons: 15,
    tools: ["Midjourney Pro", "ElevenLabs", "HeyGen", "Runway Gen-3"],
    icon: "Sparkles"
  },
  {
    id: "path-4",
    title: "Developer-level AI Automation",
    description: "Create fully hands-off custom background routines linking operations with LLMs.",
    tag: "Autonomous Systems",
    lessons: 24,
    tools: ["Make.com", "Zapier AI", "n8n", "OpenAI Assistants API"],
    icon: "GitBranch"
  },
  {
    id: "path-5",
    title: "AI Marketing Engine Architecture",
    description: "Deploy SEO pipelines, programmatic text systems, and personalized marketing automation.",
    tag: "High Revenue",
    lessons: 14,
    tools: ["Clay.run", "Copy.ai", "SurferSEO"],
    icon: "Megaphone"
  },
  {
    id: "path-6",
    title: "High-Volume AI Sales Systems",
    description: "Synthesize target client files, personalize thousands of emails, and score warm leads automatically.",
    tag: "Revenue Max",
    lessons: 16,
    tools: ["Apollo.io", "Smartlead.ai", "ChatGPT Custom Actions"],
    icon: "TrendingUp"
  },
  {
    id: "path-7",
    title: "6-Figure AI Freelancing",
    description: "Structure highly lucrative freelance gigs offering bespoke AI workflows & training.",
    tag: "Wealth Creation",
    lessons: 19,
    tools: ["Fiverr/Upwork Optimization", "AI Consultation Frameworks"],
    icon: "DollarSign"
  },
  {
    id: "path-8",
    title: "Everyday AI Productivity",
    description: "Unravel daily friction by integrating calendar agents, voice synthesis, and local search.",
    tag: "Workflow Optimization",
    lessons: 12,
    tools: ["AudioPen", "Notion AI", "Raycast", "Siri Shortcuts"],
    icon: "Zap"
  },
  {
    id: "path-9",
    title: "Designing Advanced AI Agents",
    description: "Create multi-agent teams that deliberate on strategy, code, and resolve tickets independently.",
    tag: "Cutting Edge",
    lessons: 20,
    tools: ["CrewAI", "LangChain Basics", "Dify.ai", "Flowise"],
    icon: "Bot"
  },
  {
    id: "path-10",
    title: "No-Code AI Development",
    description: "Host clean, customized web wrappers, calculators, and client tools powered by background LLMs.",
    tag: "Software Builders",
    lessons: 17,
    tools: ["Bubble.io", "FlutterFlow", "Softr + Airtable AI"],
    icon: "Layers"
  }
];

export const featuredCourses: Course[] = [
  {
    id: "course-1",
    title: "AI Business Mastery",
    tagline: "The complete system blueprint showing entrepreneurs how to build an modern, lean, AI-centric enterprise from scratch.",
    thumbnail: "https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&q=80&w=600&h=450",
    category: "AI Business",
    level: "Intermediate",
    duration: "10 hours",
    studentCount: "4,820",
    instructor: "Dr. Sandra Cole",
    instructorAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150&h=150",
    skillsAcquired: ["Core AI Business Models", "Prompt Engineering For Ops", "Margin Maximization", "Lean Scaling"]
  },
  {
    id: "course-2",
    title: "ChatGPT for Entrepreneurs",
    tagline: "Go beyond elementary Q&As. Program ChatGPT to execute rigorous strategy audits, write compliance docs, and build lead databases.",
    thumbnail: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=600&h=450",
    category: "ChatGPT Mastery",
    level: "Beginner",
    duration: "8 hours",
    studentCount: "3,115",
    instructor: "Dr. Sandra Cole",
    instructorAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150&h=150",
    skillsAcquired: ["Structured Prompts", "Retrieval Augmentation", "Custom GPT Architecture", "Data Analysis"]
  },
  {
    id: "course-3",
    title: "AI Content Empire",
    tagline: "Construct a frictionless multi-channel digital publishing house. Edit, voiceover, render, and script entire series inside 30 minutes.",
    thumbnail: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=600&h=450",
    category: "AI Content Creation",
    level: "Intermediate",
    duration: "12 hours",
    studentCount: "2,760",
    instructor: "Nia Mitchell",
    instructorAvatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=150&h=150",
    skillsAcquired: ["Voice cloning & synthesis", "High-retention writing", "Video rendering", "Midjourney orchestration"]
  },
  {
    id: "course-4",
    title: "AI Automation Blueprint",
    tagline: "Link Airtable, OpenAI, Slack, and Google Workspace into fully self-healing business networks. Eliminate manual copy-paste.",
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600&h=450",
    category: "AI Automation",
    level: "Advanced",
    duration: "14 hours",
    studentCount: "1,940",
    instructor: "Marcus Adebayo",
    instructorAvatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150&h=150",
    skillsAcquired: ["Make.com pipelines", "Webhooks & JSON parsing", "API auth setup", "Exception routing"]
  },
  {
    id: "course-5",
    title: "AI Agency Builder",
    tagline: "Build a highly-profitable technical agency. Sell customized workflow installations, training sessions, and automated infrastructure.",
    thumbnail: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=600&h=450",
    category: "AI Freelancing",
    level: "Advanced",
    duration: "11 hours",
    studentCount: "1,450",
    instructor: "Tariq Jackson",
    instructorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150",
    skillsAcquired: ["Technical discovery", "Service pricing packages", "Contract design", "Implementation onboarding"]
  },
  {
    id: "course-6",
    title: "AI Sales Funnels",
    tagline: "A hands-on methodology to build sales templates that crawl LinkedIn, find target buyers, personalize intro lines, and drive replies.",
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600&h=450",
    category: "AI Sales Systems",
    level: "Intermediate",
    duration: "9 hours",
    studentCount: "1,680",
    instructor: "Kofi Mensah",
    instructorAvatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150&h=150",
    skillsAcquired: ["Data scraping at scale", "Email warmup config", "AI-personalized pitches", "Funnel analytics"]
  },
  {
    id: "course-7",
    title: "AI Productivity Systems",
    tagline: "Reclaim up to 20 hours each week. Connect AI engines to capture meetings, rewrite documents, and synthesize complex scientific studies.",
    thumbnail: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=600&h=450",
    category: "AI Productivity",
    level: "Beginner",
    duration: "6 hours",
    studentCount: "2,330",
    instructor: "Aisha Peterson",
    instructorAvatar: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=150&h=150",
    skillsAcquired: ["Automated note-taking", "Personal knowledge bases", "Email drafting shortcuts", "Context switcher bots"]
  },
  {
    id: "course-8",
    title: "Building AI Assistants",
    tagline: "Build custom intelligent web chatbots that can recall memory, access databases, schedule calendar slots, and execute calculations.",
    thumbnail: "https://images.unsplash.com/photo-1531747118685-ca8fa6e08806?auto=format&fit=crop&q=80&w=600&h=450",
    category: "AI Agents",
    level: "Advanced",
    duration: "13 hours",
    studentCount: "1,220",
    instructor: "Marcus Adebayo",
    instructorAvatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150&h=150",
    skillsAcquired: ["Autonomous reasoning loops", "Vector database setup", "Tool integration", "Agent safety guardrails"]
  }
];

export const successMetrics = [
  { value: "90%", label: "Launch AI-powered business", desc: "Our graduates successfully launch automated web stores, media channels, or tech consultancies within three months." },
  { value: "24h", label: "Save 20+ hours weekly", desc: "Automate core tedious overheads, freeing up deep creative time to expand or relax." },
  { value: "100%", label: "Automate repetitive tasks", desc: "Convert daily friction into automated cloud loops running securely 24/7." },
  { value: "$8.5k", label: "Generate new revenue", desc: "Average additional monthly revenue engineered by students setting up freelance consultation packages." },
  { value: "15+", label: "Build AI workflows", desc: "Equip your business stack with fully contextualized personal agents and pipelines." },
  { value: "3.5x", label: "Improve productivity", desc: "Transform your throughput. Write books, code databases, and launch campaigns in a fraction of previous times." }
];

export const curriculumModules: CurriculumModule[] = [
  {
    id: "m-1",
    title: "Module 1: AI Foundations",
    description: "Unpack modern AI architectural horizons. Learn how Large Language Models work and establish key accounts and terminal parameters.",
    weeks: "Week 1",
    lessonsCount: 6,
    lessons: [
      "History & Inner Workings of Transformer Models",
      "Setting up standard sandboxes & API frameworks",
      "Managing token optimization & latency parameters",
      "First model calibration & bias mitigation techniques",
      "Structuring professional file trees for prompt catalogs"
    ],
    toolsCovered: ["OpenAI API", "Anthropic Console", "DeepSeek", "Vite"]
  },
  {
    id: "m-2",
    title: "Module 2: ChatGPT & Prompt Mastery",
    description: "Write flawless structured instructions. Build advanced mental frameworks, custom roles, and specific contextual reference databases.",
    weeks: "Weeks 2-3",
    lessonsCount: 8,
    lessons: [
      "The CO-STAR prompting system",
      "Few-shot priming & Chain of Thought prompting",
      "Creating highly tuned Custom GPTs for niche roles",
      "Using Code Interpreter for massive real-time database audits",
      "Building personal knowledge graphs inside ChatGPT"
    ],
    toolsCovered: ["ChatGPT Plus", "Playground Mode", "Advanced Data Analyst"]
  },
  {
    id: "m-3",
    title: "Module 3: AI Productivity Systems",
    description: "Integrate frictionless text-to-action shortcuts. Save consecutive hours every day on communications, meeting notes, and summaries.",
    weeks: "Week 4",
    lessonsCount: 5,
    lessons: [
      "Real-time dictation, restructuring, and summary setups",
      "Configuring personal context layers using Raycast/Alfred",
      "Integrating AI into standard research engines",
      "Managing inbox parsing bots securely",
      "Syncing Notion AI with local files"
    ],
    toolsCovered: ["AudioPen", "Notion AI", "Raycast", "Readwise AI"]
  },
  {
    id: "m-4",
    title: "Module 4: Professional Content Systems",
    description: "Formulate automated cross-channel media assets. Orchestrate cinema-grade voiceovers, dynamic avatars, and pristine graphics in seconds.",
    weeks: "Weeks 5-6",
    lessonsCount: 9,
    lessons: [
      "Ethical high-fidelity voice cloning pipelines",
      "Configuring realistic, multi-lingual dynamic video avatars",
      "Orchestrating complex prompt sheets inside Midjourney v6",
      "Editing high-retention vertical videos utilizing AI transcriptions",
      "Publishing auto-scheduled multi-channel queues"
    ],
    toolsCovered: ["Midjourney Pro", "ElevenLabs", "HeyGen", "Runway AI", "CapCut"]
  },
  {
    id: "m-5",
    title: "Module 5: Advanced AI Automation",
    description: "Connect multi-step workflows. Automate operations by passing data seamlessly between emails, AI engines, spreadsheets, and databases.",
    weeks: "Weeks 7-8",
    lessonsCount: 10,
    lessons: [
      "Setting up zero-code workflows with triggers and routes",
      "Parsing complex JSON objects and nested objects",
      "Structuring error-handling, self-healing retries",
      "Setting up multi-model chains (Claude to Gemini to OpenAI)",
      "Storing persistent background states cleanly inside airtables"
    ],
    toolsCovered: ["Make.com", "Zapier AI", "Airtable Custom scripts", "Webhooks"]
  },
  {
    id: "m-6",
    title: "Module 6: Enterprise Marketing with AI",
    description: "Automate entire SEO pipelines, programmatic outreach, and conversion-focused copy generation from raw data vectors.",
    weeks: "Week 9",
    lessonsCount: 6,
    lessons: [
      "Scraping lead lists and enriching variables automatically",
      "Deploying high-ranking semantic topic clusters",
      "Synthesizing high-converting ad variants for digital ads",
      "Deploying context-aware programmatic copy generators",
      "Integrating AI analytics into standard marketing monitors"
    ],
    toolsCovered: ["Clay.run", "Copy.ai", "SurferSEO", "Google Analytics 4"]
  },
  {
    id: "m-7",
    title: "Module 7: Automated High-Performance Sales",
    description: "Scale high-conversion outreach. Personalize thousands of outbound touchpoints in seconds while keeping custom and natural tones.",
    weeks: "Week 10",
    lessonsCount: 7,
    lessons: [
      "Compiling warm client files from digital indicators",
      "Writing outbound opening hooks using AI intelligence",
      "Structuring automatic email warmups and calendar integrations",
      "Configuring conversational agents for rapid initial responses",
      "Synthesizing customized video demonstrations dynamically"
    ],
    toolsCovered: ["Apollo.io", "Smartlead.ai", "Loom AI", "HubSpot CRM"]
  },
  {
    id: "m-8",
    title: "Module 8: Building AI Businesses",
    description: "Master the architecture of AI freelancing and consulting. Create custom SaaS wrapped solutions or sell full workflow retainers.",
    weeks: "Week 11",
    lessonsCount: 6,
    lessons: [
      "The AI Discovery Audit: Scouting expensive client friction",
      "Structuring recurring maintenance contracts for automated workflows",
      "Deploying custom web interfaces atop LLMs using Bubble/Softr",
      "Packaging premium executive workshops that sell for $5k+",
      "White-labeling automated pipelines under your own agency"
    ],
    toolsCovered: ["Softr", "Bubble", "Stripe Connect", "AI Consultation Suite"]
  },
  {
    id: "m-9",
    title: "Module 9: Advanced AI Code & Assistants",
    description: "Construct smarter, agentic pipelines that write local code, Deliberate over strategy, and handle advanced database inquiries.",
    weeks: "Week 12",
    lessonsCount: 8,
    lessons: [
      "Creating multi-agent loops with distinct role frameworks",
      "Vector embeddings and retrieving data securely (RAG)",
      "Teaching your agents custom actions through background API calls",
      "Synthesizing raw databases into instant interactive layouts",
      "Configuring human-in-the-loop validation checkpoints"
    ],
    toolsCovered: ["Dify.ai", "CrewAI", "Pinecone Vector DB", "Local Host Wrappers"]
  },
  {
    id: "m-10",
    title: "Module 10: Future Trends & AI Safety",
    description: "Stay permanently ahead. Navigate evolving legal standards, model landscape shifts, and ethical integration strategies.",
    weeks: "Ongoing",
    lessonsCount: 4,
    lessons: [
      "Understanding corporate compliance and security rules",
      "Preparing your tech stack for multimodal real-time voice agents",
      "How to swap background LLMs instantly when visual costs drop",
      "Continuous prompt catalog optimization & community networking"
    ],
    toolsCovered: ["Gemini Live-API", "Custom API Proxies", "Modern Security Scanners"]
  }
];

export const instructorInfo = {
  name: "Dr. Sandra Cole",
  role: "Head of AI Education & Co-Founder",
  avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600&h=600",
  bio: "Dr. Sandra Cole is a pioneering AI Research Engineer, technical speaker, and consulting architect. Over the past decade, she has designed intelligent operational systems for mid-market enterprises and silicon valley startups. Today, she translates highly complex LLM capabilities into direct, lucrative business strategies for 12,000+ ambitious creators.",
  stats: [
    { label: "Students Taught", value: "12,000+" },
    { label: "AI Workflows Deployed", value: "140+" },
    { label: "Average Revenue Growth", value: "4.2x" },
    { label: "Years in AI & Software", value: "12" }
  ],
  achievements: [
    "Former Principal AI Lead at Apex Systems",
    "PhD in Computer Science with focus on Cognitive Systems",
    "Architect for $20M+ in verified automated business systems",
    "Member of specialized Advisory Cohorts in Applied Machine Learning"
  ],
  badges: ["AWS AI Specialty", "Google Cloud ML Expert", "Certified Automation Architect", "Distinguished Lecturer Award"]
};

export const testimonials: Testimonial[] = [
  {
    id: "t-1",
    name: "Marcus Adenbayo",
    role: "Founding Partner",
    company: "Aven & Partners Automation",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=300&h=300",
    rating: 5,
    highlightOutcome: "Built $18k/month consulting agency",
    quote: "AIOnlineBusiness wasn't just a course; it was a ready-to-run business model. I designed our first three client automation workflows straight from the Module 5 blueprints. Our agency passed $18,000 in monthly recurring revenues in exactly 74 days.",
    growthMetric: "+310% Agency Revenue Growth",
    videoThumb: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=600&h=400"
  },
  {
    id: "t-2",
    name: "Nia Mitchell",
    role: "Digital Brand Architect",
    company: "Vibrant Studio",
    avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=300&h=300",
    rating: 5,
    highlightOutcome: "Automated standard media production",
    quote: "We used to spend 40+ hours per week custom producing short-form educational videos. By utilizing the premium voice assets and custom-conditioned visual tools I studied here, we cut production labor downstream by 85% while scaling output 3x.",
    growthMetric: "Saved 32+ hours copy-editing weekly",
    videoThumb: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=600&h=400"
  },
  {
    id: "t-3",
    name: "Tariq Jackson",
    role: "eCommerce Founder",
    company: "Zuri Goods",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300&h=300",
    rating: 5,
    highlightOutcome: "Scaled customer service autonomously",
    quote: "Integrating an AI assistant that actually reads real-time database inventories has completely reshaped our business. Refunds resolved automatically in 1 minute, customer engagement skyrocketed, and store operations run perfectly even when I sleep.",
    growthMetric: "-45% Support Tickets and Overhead"
  }
];

export const faqs: FAQItem[] = [
  {
    id: "faq-1",
    question: "Do I need previous coding or technical experience to start?",
    answer: "Absolutely not. The curriculum is meticulously crafted to take you from a complete beginner to constructing enterprise-level AI installations and custom chatbots. While we do cover advanced APIs and lightweight scripts in later modules, we provide exhaustive line-by-line builders, templates, and zero-code paths like Make.com."
  },
  {
    id: "faq-2",
    question: "Are API keys and recurring cost expenses included?",
    answer: "Our course utilizes several premium AI tools that feature highly robust free tiers. For students looking to deploy heavy production databases or run volume programmatic marketing automation, we provide full guides on cost-optimization, budgeting filters, and how to query local open-source models for zero cost."
  },
  {
    id: "faq-3",
    question: "How long do I keep access to these materials?",
    answer: "You get unrestricted, lifetime access to all learning paths, course cards, module code files, and community boards. This including all future updates and monthly workspace webinars at no additional fee."
  },
  {
    id: "faq-4",
    question: "Can I apply these frameworks outside of the US/EU?",
    answer: "Yes, our frameworks operate worldwide. We explicitly focus on cloud-hosted global systems, localized payment integrations (like Stripe or native options), and how to build digital services that can be exported globally from anywhere you are."
  },
  {
    id: "faq-5",
    question: "What is the community setup, and are there actual live events?",
    answer: "Our private Discord and workspace community is very active. We host live weekly workshops with Dr. Cole, accountability clusters where students share their progress, structured career channels, and private consultation circles looking for technical partners."
  }
];

export const bonuses: BonusItem[] = [
  {
    id: "b-1",
    title: "Master AI Prompt Library",
    description: "1,500+ ultra-specific, production-tested prompt sheets covering business strategy, pricing audits, copy, and legal compliance.",
    value: "$497 VALUE",
    badge: "FREE BONUS",
    icon: "FileCode"
  },
  {
    id: "b-2",
    title: "Automation Blueprints & JSONs",
    description: "Exportable Make.com and Zapier custom templates. Launch intricate, self-healing multi-step workflows in precisely three clicks.",
    value: "$997 VALUE",
    badge: "CREATOR BONUS",
    icon: "FolderSync"
  },
  {
    id: "b-3",
    title: "AI Agency Pitch Decks",
    description: "The identical contract layouts, onboarding forms, and strategic presentation slides we use to sign premium $5k/mo clients.",
    value: "$595 VALUE",
    badge: "AGENCY EXCLUSIVE",
    icon: "Presentation"
  },
  {
    id: "b-4",
    title: "Weekly Live Office Hours",
    description: "Review your active pipelines, custom bots, and business frameworks live on video with Dr. Sandra Cole and guest architects.",
    value: "$2,400/yr VALUE",
    badge: "LIFETIME VALUE",
    icon: "Video"
  }
];

export const pricingPlans: PricingPlan[] = [
  {
    name: "Starter Bundle",
    price: "$49",
    period: "/month",
    tagline: "Equip yourself with practical AI prompt models and core productivity patterns.",
    popular: false,
    features: [
      "Access to 4 Core Learning Paths",
      "50+ Detailed Video Lessons",
      "Standard Copy prompting databases",
      "Private Student Forum Access",
      "Standard 48h Support Answer Times",
      "Official Program Graduation Certificate"
    ],
    excludedFeatures: [
      "Advanced Automation Workflows & Blueprints",
      "Full API & custom agent development suites",
      "Weekly live office hours with Dr. Cole",
      "6-Figure AI Freelancing and Agency Kit"
    ],
    ctaText: "Begin Starter Path"
  },
  {
    name: "Professional Plan",
    price: "$99",
    period: "/month",
    tagline: "Our flagship training system to construct high-performance AI automations and client models.",
    popular: true,
    features: [
      "Access to ALL 10 Learning Paths",
      "All 8 Premium Featured Programs",
      "Weekly Live Coaching & Audits with Dr. Cole",
      "1,500+ Master AI Prompt Library",
      "Premium Make.com and Zapier blueprints",
      "AI Agency contracts, slides, and scripts",
      "Priority 1-hour student support lounge",
      "Lifetime membership to private Discord circles"
    ],
    ctaText: "Unlock Flagship Plan"
  },
  {
    name: "Partner Summit",
    price: "$299",
    period: "/one-time",
    tagline: "The absolute premium experience with direct 1-to-1 operational blueprint design & audits.",
    popular: false,
    features: [
      "Everything in the flagship Professional Plan",
      "Dedicated 1-on-1 operational review of your system",
      "Direct WhatsApp and Slack link with technical leads",
      "Bespoke code-generation support for custom APIs",
      "Custom branding rights for physical workshops",
      "Invites to quarterly physical summits with innovators"
    ],
    excludedFeatures: [],
    ctaText: "Apply For Summit"
  }
];
