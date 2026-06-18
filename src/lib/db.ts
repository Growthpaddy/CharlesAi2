/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Course as LegacyCourse } from "../types";
import { supabase, syncLocalStorageToSupabase } from "./supabase";

// DB Relation Types
export interface Category {
  id: string;
  name: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  categoryId: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  studentCount: string;
  rating: string;
  instructorName: string;
  instructorAvatar: string;
  skills: string[];
  outcomes: string[];
  overview: string;
  price?: string;
}

export interface CourseModule {
  id: string;
  courseId: string;
  title: string;
  sortOrder: number;
}

export interface Lesson {
  id: string;
  moduleId: string;
  courseId: string;
  title: string;
  duration: string;
  content: string;
  videoUrl: string;
  sortOrder: number;
}

export interface Enrollment {
  id: string;
  courseId: string;
  enrolledAt: string;
}

export interface StudentProgress {
  id: string; // "courseId_lessonId" or random UUID
  courseId: string;
  lessonId: string;
  completed: boolean;
  completedAt: string;
}

// Hardcoded Master Seed Database matching "AI ONLINE BUSINESS" curriculum perfectly
export const masterCategories: Category[] = [
  { id: "cat-1", name: "AI Prompt Engineering" },
  { id: "cat-2", name: "AI Digital Products" },
  { id: "cat-3", name: "AI Content Creation" },
  { id: "cat-4", name: "App Creation with AI" },
  { id: "cat-5", name: "AI Automation" },
  { id: "cat-6", name: "Faceless YouTube" },
  { id: "cat-7", name: "Client Acquisition" },
  { id: "cat-8", name: "AI Affiliate Marketing" },
  { id: "cat-9", name: "Advertising" },
  { id: "cat-10", name: "AI Business Operations" },
  { id: "cat-11", name: "Social Media" },
  { id: "cat-12", name: "AI Ghostwriting" }
];

export const masterCourses: Course[] = [
  {
    id: "course-1",
    title: "AI Prompt Engineering Mastery",
    description: "Master the art of communicating effectively with AI systems. Learn prompt frameworks, optimization techniques, and professional AI applications.",
    overview: "This comprehensive course teaches you how to construct highly custom, robust instructions that bypass common ChatGPT limitations. You will work with complex frameworks such as CO-STAR, few-shot conditioning, and background cognitive loops to achieve cinematic standards in content production, operations support, and strategic data analysis.",
    thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600&h=450",
    categoryId: "cat-1",
    level: "Intermediate",
    duration: "10 hours",
    studentCount: "1,240",
    rating: "4.9",
    instructorName: "Charles Tuti",
    instructorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150",
    skills: ["CO-STAR Prompt Framework", "Zero-Shot vs Few-Shot Modeling", "Bias Mitigation Protocols", "Dynamic Tone Structuring"],
    outcomes: ["Understand prompt structures", "Create professional prompts", "Improve AI outputs", "Apply prompting in business workflows"]
  },
  {
    id: "course-2",
    title: "AI Digital Products Creation",
    description: "Learn how to create, package, publish, and sell digital products using AI tools.",
    overview: "Turn ideas into high-margin revenue drivers. In this blueprint with practical timelines, you will learn the exact sequence our students use to write books, compile curriculum products, format elegant layout books, and publish them to global sales processors like Amazon KDP and Selar without complex upfront logistics.",
    thumbnail: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600&h=450",
    categoryId: "cat-2",
    level: "Beginner",
    duration: "6 hours",
    studentCount: "820",
    rating: "4.8",
    instructorName: "Sandra Cole",
    instructorAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150&h=150",
    skills: ["AI-Generated Book Content", "Canva Layout Structuring", "Selar Integration", "Amazon KDP Formatting"],
    outcomes: ["Create books using AI", "Design professional eBooks", "Publish products online", "Generate passive income"]
  },
  {
    id: "course-3",
    title: "AI Content Creation Suite",
    description: "Create engaging content, images, videos, and marketing materials using AI tools.",
    overview: "Elevate your marketing assets to production-house standards. You will study how to program Grok to generate high-retention viral video scripts, configure photorealistic image models for graphics design, compile promotional vertical slides, and synthesize dynamic multi-lingual marketing flyers easily.",
    thumbnail: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=600&h=450",
    categoryId: "cat-3",
    level: "Intermediate",
    duration: "8 hours",
    studentCount: "950",
    rating: "4.9",
    instructorName: "Marcus Adebayo",
    instructorAvatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150&h=150",
    skills: ["Photorealistic Image Generation", "Vertical Video Editors", "Script Synthesis via Grok", "Flyers Design Templates"],
    outcomes: ["Generate quality content", "Create AI videos", "Produce AI images", "Design marketing creatives"]
  },
  {
    id: "course-4",
    title: "App Creation with AI",
    description: "Learn how to build modern applications using AI-powered development workflows.",
    overview: "Build apps even without deep engineering degrees. This structured track focuses on custom software creation: starting from conceptual brainstorming wireframes, code-stripping boilerplate assemblies, managing secure Firebase databases, adding simple authentication, and embedding live interactive cognitive assistants.",
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600&h=450",
    categoryId: "cat-4",
    level: "Intermediate",
    duration: "12 hours",
    studentCount: "540",
    rating: "4.9",
    instructorName: "Charles Tuti",
    instructorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150",
    skills: ["Figma Wireframes Analysis", "Firebase Configuration Rules", "AI Chatbot Orchestration", "Secure Router Design"],
    outcomes: ["Plan applications", "Build AI-powered apps", "Implement authentication", "Integrate AI assistants"]
  },
  {
    id: "course-5",
    title: "AI Automation Engineering",
    description: "Automate repetitive tasks and build intelligent business systems.",
    overview: "Construct standard self-directed background networks that coordinate tasks behind the scenes. This intermediate specialization guides you through linking Zapier interfaces, n8n databases, context scrapers, automated email responders, and active digital loops to reduce manual operations to zero.",
    thumbnail: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600&h=450",
    categoryId: "cat-5",
    level: "Intermediate",
    duration: "14 hours",
    studentCount: "780",
    rating: "4.9",
    instructorName: "Marcus Adebayo",
    instructorAvatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150&h=150",
    skills: ["Zapier Custom Routers", "n8n Cloud Webhooks", "API Data Scraping", "Email Dispatcher Automation"],
    outcomes: ["Build automations", "Create AI agents", "Automate workflows", "Improve productivity"]
  },
  {
    id: "course-6",
    title: "Faceless YouTube Empire",
    description: "Build and monetize YouTube channels without appearing on camera.",
    overview: "Set up and scale highly automated cash cow channels. Learn how to scrape trending search interests, generate narrative screenplays via AI, trigger voiceover synthesizers, pair dynamic visual overlays, and schedule optimized uploads to capture digital ad revenues.",
    thumbnail: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&q=80&w=600&h=450",
    categoryId: "cat-6",
    level: "Beginner",
    duration: "7 hours",
    studentCount: "1,110",
    rating: "4.7",
    instructorName: "Sandra Cole",
    instructorAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150&h=150",
    skills: ["SEO Niche Audits", "Voice Replication Engines", "Dynamic Slideshow Pairings", "YouTube Optimization Frameworks"],
    outcomes: ["Launch YouTube channels", "Create faceless videos", "Grow audience", "Monetize content"]
  },
  {
    id: "course-7",
    title: "Client Acquisition Accelerator",
    description: "Learn how to acquire high-paying clients consistently.",
    overview: "Find and lock down premium retainers with our cold pipeline engines. This course teaches how to automatically crawl local records, enrich leads with custom properties, draft target email proposals, and lock in professional corporate clients on LinkedIn and Google searches.",
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600&h=450",
    categoryId: "cat-7",
    level: "Intermediate",
    duration: "9 hours",
    studentCount: "890",
    rating: "4.9",
    instructorName: "Sandra Cole",
    instructorAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150&h=150",
    skills: ["Bulk Outreach Systems", "Google Maps Leads Scraping", "LinkedIn Business Inbound", "Sales Conversion Copywriter"],
    outcomes: ["Generate leads", "Find prospects", "Close clients", "Scale services"]
  },
  {
    id: "course-8",
    title: "AI Affiliate Marketing Hub",
    description: "Build profitable affiliate systems powered by AI.",
    overview: "Orchestrate simple conversion nodes that distribute selected tech or digital assets automatically. Master building landing visual layouts, running background webinar sequences, distributing sales videos, and managing automated follow-up funnels.",
    thumbnail: "https://images.unsplash.com/photo-1557200134-90327ee9fafa?auto=format&fit=crop&q=80&w=600&h=450",
    categoryId: "cat-8",
    level: "Intermediate",
    duration: "10 hours",
    studentCount: "620",
    rating: "4.8",
    instructorName: "Marcus Adebayo",
    instructorAvatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150&h=150",
    skills: ["Landing Page Generation", "Webinar Script Pipelines", "Sales Funnel Structuring", "Automated List Building"],
    outcomes: ["Build funnels", "Promote affiliate products", "Increase conversions", "Automate follow-up"]
  },
  {
    id: "course-9",
    title: "AI Advertising Blueprint",
    description: "Master paid advertising and lead generation using AI-enhanced strategies.",
    overview: "Unravel paid advertising. Learn how to deploy Facebook and Instagram campaigns, draft visual layouts that attract target clicks, hook up email capture boxes automatically, and run chat responder automations to guide sales conversions 24/7.",
    thumbnail: "https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&q=80&w=600&h=450",
    categoryId: "cat-9",
    level: "Intermediate",
    duration: "8 hours",
    studentCount: "570",
    rating: "4.8",
    instructorName: "Charles Tuti",
    instructorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150",
    skills: ["Metadata Ad Campaigns", "Custom Target Demographics", "Instagram DM Automation", "Ad Creative Generators"],
    outcomes: ["Generate leads", "Create ads", "Improve ROI", "Automate engagement"]
  },
  {
    id: "course-10",
    title: "AI Business Operations System",
    description: "Use AI to streamline and manage business operations efficiently.",
    overview: "Upgrade your standard operations setup. Re-architect how your company handles professional proposals, manages team financial reports, processes new student/member onboarding sheets, and coordinates schedules to run key tasks in record times.",
    thumbnail: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=600&h=450",
    categoryId: "cat-10",
    level: "Intermediate",
    duration: "11 hours",
    studentCount: "430",
    rating: "4.9",
    instructorName: "Sandra Cole",
    instructorAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150&h=150",
    skills: ["Proposals Writing Wizards", "Financial Summary Models", "Onboarding Automations", "Time Block Management"],
    outcomes: ["Improve efficiency", "Create business systems", "Manage teams", "Scale operations"]
  },
  {
    id: "course-11",
    title: "AI Social Media Growth",
    description: "Build profitable brands and communities using AI-powered social media systems.",
    overview: "Transform dry social handles into active client filters. Master scripting high-volume schedules, setting up automatic email newsletters, compiling custom copywriting catalogs, and deploying monetization products straight to your audience.",
    thumbnail: "https://images.unsplash.com/photo-1562577309-4932fdd64cd1?auto=format&fit=crop&q=80&w=600&h=450",
    categoryId: "cat-11",
    level: "Beginner",
    duration: "6 hours",
    studentCount: "1,450",
    rating: "4.9",
    instructorName: "Marcus Adebayo",
    instructorAvatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150&h=150",
    skills: ["Viral Thread Construction", "Ad Copy templates", "Auto-scheduler Platforms", "Audience Nurturing Guides"],
    outcomes: ["Create content", "Build audiences", "Monetize followers", "Increase engagement"]
  },
  {
    id: "course-12",
    title: "AI Ghostwriting Elite",
    description: "Learn how to write, publish, and earn from books and storytelling projects using AI.",
    overview: "Unlock lucrative ghostwriting assignments using technical accelerators. Study how to outline complex stories, maintain consistent voices across chapters, secure publishing arrangements, and negotiate agreements that protect royalties on published libraries.",
    thumbnail: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=600&h=450",
    categoryId: "cat-12",
    level: "Beginner",
    duration: "9 hours",
    studentCount: "660",
    rating: "4.9",
    instructorName: "Sandra Cole",
    instructorAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150&h=150",
    skills: ["Long-Form Story Outline", "Persona Synthesis Engine", "Copyright & NDA Blueprints", "Client Retainers Sourcing"],
    outcomes: ["Write books faster", "Publish professionally", "Understand ghostwriting agreements", "Earn from writing projects"]
  }
];

// Seed Modules beautifully
export const masterModules: CourseModule[] = [
  // Course 1 modules
  { id: "mod-1-1", courseId: "course-1", title: "Module 1: AI Prompt Core Components", sortOrder: 1 },
  { id: "mod-1-2", courseId: "course-1", title: "Module 2: AI Prompt Optional Components", sortOrder: 2 },
  { id: "mod-1-3", courseId: "course-1", title: "Module 3: AI Prompt Transformation", sortOrder: 3 },
  { id: "mod-1-4", courseId: "course-1", title: "Module 4: AI Prompt for Professional Applications", sortOrder: 4 },

  // Course 2 modules
  { id: "mod-2-1", courseId: "course-2", title: "Module 1: Creating Book Content with AI", sortOrder: 1 },
  { id: "mod-2-2", courseId: "course-2", title: "Module 2: Designing eBooks", sortOrder: 2 },
  { id: "mod-2-3", courseId: "course-2", title: "Module 3: Uploading to Selar", sortOrder: 3 },
  { id: "mod-2-4", courseId: "course-2", title: "Module 4: Uploading to Amazon KDP", sortOrder: 4 },

  // Course 3 modules
  { id: "mod-3-1", courseId: "course-3", title: "Module 1: Humanized Content Protocols", sortOrder: 1 },
  { id: "mod-3-2", courseId: "course-3", title: "Module 2: Grok AI for Video Scripts", sortOrder: 2 },
  { id: "mod-3-3", courseId: "course-3", title: "Module 3: Text-to-Image Generators", sortOrder: 3 },
  { id: "mod-3-4", courseId: "course-3", title: "Module 4: Text-to-Video Pipelines", sortOrder: 4 },
  { id: "mod-3-5", courseId: "course-3", title: "Module 5: Professional Flyer Design", sortOrder: 5 },

  // Course 4 modules
  { id: "mod-4-1", courseId: "course-4", title: "Module 1: Conceptual Brainstorming & Architecture", sortOrder: 1 },
  { id: "mod-4-2", courseId: "course-4", title: "Module 2: Modern Responsive App Design", sortOrder: 2 },
  { id: "mod-4-3", courseId: "course-4", title: "Module 3: Building & App Mounting", sortOrder: 3 },
  { id: "mod-4-4", courseId: "course-4", title: "Module 4: Firebase Configuration", sortOrder: 4 },
  { id: "mod-4-5", courseId: "course-4", title: "Module 5: Creating Secure Authentication", sortOrder: 5 },
  { id: "mod-4-6", courseId: "course-4", title: "Module 6: Embedding AI Chatbots", sortOrder: 6 },

  // Course 5 modules
  { id: "mod-5-1", courseId: "course-5", title: "Module 1: Zapier Dynamic Operations", sortOrder: 1 },
  { id: "mod-5-2", courseId: "course-5", title: "Module 2: n8n Custom Nodes Setup", sortOrder: 2 },
  { id: "mod-5-3", courseId: "course-5", title: "Module 3: Self-Directed AI Agents", sortOrder: 3 },
  { id: "mod-5-4", courseId: "course-5", title: "Module 4: Intelligent Chatbots Setup", sortOrder: 4 },
  { id: "mod-5-5", courseId: "course-5", title: "Module 5: Smart Email Assistants", sortOrder: 5 },
  { id: "mod-5-6", courseId: "course-5", title: "Module 6: Apify Record Scraping", sortOrder: 6 },

  // Course 6 modules
  { id: "mod-6-1", courseId: "course-6", title: "Module 1: Scraping Niche Research", sortOrder: 1 },
  { id: "mod-6-2", courseId: "course-6", title: "Module 2: Channel Creation & Settings", sortOrder: 2 },
  { id: "mod-6-3", courseId: "course-6", title: "Module 3: Strategic Video Upload Routine", sortOrder: 3 },
  { id: "mod-6-4", courseId: "course-6", title: "Module 4: Generating AI Podcast Episodes", sortOrder: 4 },

  // Course 7 modules
  { id: "mod-7-1", courseId: "course-7", title: "Module 1: Dispatching Bulk Emails", sortOrder: 1 },
  { id: "mod-7-2", courseId: "course-7", title: "Module 2: Google Maps Leads Mining", sortOrder: 2 },
  { id: "mod-7-3", courseId: "course-7", title: "Module 3: Facebook Client Scouting", sortOrder: 3 },
  { id: "mod-7-4", courseId: "course-7", title: "Module 4: LinkedIn Active Jobs Acquisition", sortOrder: 4 },

  // Course 8 modules
  { id: "mod-8-1", courseId: "course-8", title: "Module 1: Converting Landing Pages Setup", sortOrder: 1 },
  { id: "mod-8-2", courseId: "course-8", title: "Module 2: Running Background Webinars", sortOrder: 2 },
  { id: "mod-8-3", courseId: "course-8", title: "Module 3: Compiling Ad Video Materials", sortOrder: 3 },
  { id: "mod-8-4", courseId: "course-8", title: "Module 4: Automatic Follow-Up Systems", sortOrder: 4 },

  // Course 9 modules
  { id: "mod-9-1", courseId: "course-9", title: "Module 1: Generating High-Volume Lead Campaigns", sortOrder: 1 },
  { id: "mod-9-2", courseId: "course-9", title: "Module 2: Scaling Sales Ads Graphics", sortOrder: 2 },
  { id: "mod-9-3", courseId: "course-9", title: "Module 3: Instagram Conversational Automation", sortOrder: 3 },

  // Course 10 modules
  { id: "mod-10-1", courseId: "course-10", title: "Module 1: Corporate Proposals Blueprints", sortOrder: 1 },
  { id: "mod-10-2", courseId: "course-10", title: "Module 2: Financial Planning & Reports", sortOrder: 2 },
  { id: "mod-10-3", courseId: "course-10", title: "Module 3: Client Onboarding Workflow", sortOrder: 3 },
  { id: "mod-10-4", courseId: "course-10", title: "Module 4: AI Time Management Blockers", sortOrder: 4 },

  // Course 11 modules
  { id: "mod-11-1", courseId: "course-11", title: "Module 1: Formatting Viral AI Content", sortOrder: 1 },
  { id: "mod-11-2", courseId: "course-11", title: "Module 2: Launching Email Newsletters", sortOrder: 2 },
  { id: "mod-11-3", courseId: "course-11", title: "Module 3: Copywriting Formulas for Conversion", sortOrder: 3 },
  { id: "mod-11-4", courseId: "course-11", title: "Module 4: Direct Audience Monetization Models", sortOrder: 4 },

  // Course 12 modules
  { id: "mod-12-1", courseId: "course-12", title: "Module 1: Crafting Detailed Outline & Story Writing", sortOrder: 1 },
  { id: "mod-12-2", courseId: "course-12", title: "Module 2: Submitting on Publishing Platforms", sortOrder: 2 },
  { id: "mod-12-3", courseId: "course-12", title: "Module 3: Structuring Ghostwriting Client Agreements", sortOrder: 3 }
];

export const masterLessons: Lesson[] = [
  // Course 1 lessons
  { id: "les-1-1", moduleId: "mod-1-1", courseId: "course-1", title: "CO-STAR Prompt Framework Anatomy", duration: "12:40", content: "Learn the full CO-STAR framework for writing perfect, production-grade instructions.", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", sortOrder: 1 },
  { id: "les-1-2", moduleId: "mod-1-1", courseId: "course-1", title: "Defining Core Objectives", duration: "08:15", content: "Structure clear goals and boundaries for LLM calculations.", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", sortOrder: 2 },
  { id: "les-1-3", moduleId: "mod-1-2", courseId: "course-1", title: "Few-Shot Examples Conditioning", duration: "14:20", content: "Pass custom sample data and formats inside instructions to force identical outputs.", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", sortOrder: 1 },
  { id: "les-1-4", moduleId: "mod-1-3", courseId: "course-1", title: "Output Restructuring & Tone Shifts", duration: "11:50", content: "Reformat responses dynamically into clean JSON objects or beautiful Markdown boards.", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", sortOrder: 1 },
  { id: "les-1-5", moduleId: "mod-1-4", courseId: "course-1", title: "Drafting Pro Proposals with Prompts", duration: "15:00", content: "Integrate CO-STAR to speed up your corporate business proposals pipeline.", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", sortOrder: 1 },

  // Course 2 lessons
  { id: "les-2-1", moduleId: "mod-2-1", courseId: "course-2", title: "Structuring Outlines & Outline Prompting", duration: "10:30", content: "Plan table of contents and logical chapters inside AI agents.", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", sortOrder: 1 },
  { id: "les-2-2", moduleId: "mod-2-2", courseId: "course-2", title: "Designing Professional Layouts in Canva", duration: "12:15", content: "Design cover layout visuals and index charts perfectly.", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", sortOrder: 1 },
  { id: "les-2-3", moduleId: "mod-2-3", courseId: "course-2", title: "Setting Up Selar Products Catalog", duration: "09:45", content: "Host products on Selar and link active instant payment nodes.", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", sortOrder: 1 },
  { id: "les-2-4", moduleId: "mod-2-4", courseId: "course-2", title: "Formatting for Kindle & Amazon Publishing", duration: "11:00", content: "Compile Word records into validated KDP layouts.", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", sortOrder: 1 },

  // Course 3 lessons
  { id: "les-3-1", moduleId: "mod-3-1", courseId: "course-3", title: "Scrubbing Robotic Patterns from Text", duration: "12:20", content: "Bypass pattern filters by restoring human cadences & idioms.", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", sortOrder: 1 },
  { id: "les-3-2", moduleId: "mod-3-2", courseId: "course-3", title: "Grok Video Scripts Architecture", duration: "08:50", content: "Crawl trending threads to draft engaging voiceover blueprints.", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", sortOrder: 1 },
  { id: "les-3-3", moduleId: "mod-3-3", courseId: "course-3", title: "Perfecting Image Prompt Sheets", duration: "13:30", content: "Configure aspect views, lighting grids, and custom styling rules.", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", sortOrder: 1 },
  { id: "les-3-4", moduleId: "mod-3-4", courseId: "course-3", title: "Generating Video Ads Overlays", duration: "10:15", content: "Generate and stitch custom cinematic elements together.", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", sortOrder: 1 },

  // Course 4 lessons
  { id: "les-4-1", moduleId: "mod-4-1", courseId: "course-4", title: "Ideation & User Flow Graphing", duration: "11:10", content: "Draft application page flows and relational maps beforehand.", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", sortOrder: 1 },
  { id: "les-4-2", moduleId: "mod-4-2", courseId: "course-4", title: "Designing Beautiful Wireframe Cards", duration: "14:40", content: "Map visual layout cards that guide responsive configurations.", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", sortOrder: 1 },
  { id: "les-4-3", moduleId: "mod-4-3", courseId: "course-4", title: "Mounting the Codebase with Vite & React", duration: "18:20", content: "Setup clean React modules with structured relative assets folders.", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", sortOrder: 1 },
  { id: "les-4-4", moduleId: "mod-4-4", courseId: "course-4", title: "Structuring Firestore Schema Tables", duration: "15:10", content: "Assemble scalable collections, dynamic updates, and secure auth rules.", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", sortOrder: 1 },

  // Course 5 lessons
  { id: "les-5-1", moduleId: "mod-5-1", courseId: "course-5", title: "Setting Up Multi-Apps triggers", duration: "14:30", content: "Configure triggers that bridge GSheets and email automations automatically.", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", sortOrder: 1 },
  { id: "les-5-2", moduleId: "mod-5-2", courseId: "course-5", title: "n8n Self-Healing Router Setup", duration: "16:45", content: "Establish catch-all retry loops that resolve API failures automatically.", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", sortOrder: 1 },

  // Course 6 lessons
  { id: "les-6-1", moduleId: "mod-6-1", courseId: "course-6", title: "Mining High-Volume Ad Niches", duration: "09:50", content: "Analyze high CPM keywords to align viral video tags.", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", sortOrder: 1 },
  { id: "les-6-2", moduleId: "mod-6-2", courseId: "course-6", title: "Publishing & Rendering Overlays Automatically", duration: "11:25", content: "Stitch visual elements with voiceover tapes dynamically.", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", sortOrder: 1 },

  // Course 7 lessons
  { id: "les-7-1", moduleId: "mod-7-1", courseId: "course-7", title: "Compiling Clean Lead Inbound Files", duration: "13:00", content: "Crawl local directories to gather active decision lead lists.", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", sortOrder: 1 },
  { id: "les-7-2", moduleId: "mod-7-2", courseId: "course-7", title: "Writing Inbound Sales Letters via AI", duration: "11:15", content: "Generate personalized pitch sheets based on client properties.", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", sortOrder: 1 },

  // Course 8 lessons
  { id: "les-8-1", moduleId: "mod-8-1", courseId: "course-8", title: "Building Convincing High-Converting Optins", duration: "12:55", content: "Create visual models that attract active prospective list leads.", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", sortOrder: 1 },
  { id: "les-8-2", moduleId: "mod-8-2", courseId: "course-8", title: "Email Nurturing Sequence Setup", duration: "10:45", content: "Deploy automated follow-ups that handle prospect objections.", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", sortOrder: 1 },

  // Course 9 lessons
  { id: "les-9-1", moduleId: "mod-9-1", courseId: "course-9", title: "Deploying Conversational Ad Triggers", duration: "11:40", content: "Build Instagram automation rules that DM catalog links on comment keys.", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", sortOrder: 1 },

  // Course 10 lessons
  { id: "les-10-1", moduleId: "mod-10-1", courseId: "course-10", title: "Onboarding Contracts & Operations Setups", duration: "14:10", content: "Streamline operations with onboarding forms that automatically setup folders.", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", sortOrder: 1 },

  // Course 11 lessons
  { id: "les-11-1", moduleId: "mod-11-1", courseId: "course-11", title: "Scheduling Multi-Channel Calendars", duration: "11:05", content: "Deploy automated planners that run campaigns on preset parameters.", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", sortOrder: 1 },

  // Course 12 lessons
  { id: "les-12-1", moduleId: "mod-12-1", courseId: "course-12", title: "Securing High-value Writing retainer contracts", duration: "13:40", content: "Draft institutional writing contracts and protect copyright terms.", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", sortOrder: 1 }
];

// Database operations helper layer (LocalStorage persistence)
export const db = {
  // Read all collections safely
  getCategories(): Category[] {
    const data = localStorage.getItem("categories");
    if (!data) {
      localStorage.setItem("categories", JSON.stringify(masterCategories));
      return masterCategories;
    }
    return JSON.parse(data);
  },

  getCourses(): Course[] {
    const data = localStorage.getItem("courses");
    if (!data) {
      localStorage.setItem("courses", JSON.stringify(masterCourses));
      return masterCourses;
    }
    return JSON.parse(data);
  },

  getModules(): CourseModule[] {
    const data = localStorage.getItem("course_modules");
    if (!data) {
      localStorage.setItem("course_modules", JSON.stringify(masterModules));
      return masterModules;
    }
    return JSON.parse(data);
  },

  getLessons(): Lesson[] {
    const data = localStorage.getItem("lessons");
    if (!data) {
      localStorage.setItem("lessons", JSON.stringify(masterLessons));
      return masterLessons;
    }
    return JSON.parse(data);
  },

  getEnrollments(): Enrollment[] {
    const data = localStorage.getItem("enrollments");
    if (!data) {
      // Pre-enroll student in Course 1 and Course 2 to represent live tracking immediately
      const defaultEnrollments: Enrollment[] = [
        { id: "enr-1", courseId: "course-1", enrolledAt: new Date().toISOString() },
        { id: "enr-2", courseId: "course-2", enrolledAt: new Date().toISOString() }
      ];
      localStorage.setItem("enrollments", JSON.stringify(defaultEnrollments));
      return defaultEnrollments;
    }
    return JSON.parse(data);
  },

  getStudentProgress(): StudentProgress[] {
    const data = localStorage.getItem("student_progress");
    if (!data) {
      // Mark lessons finished in Course 1 initially
      const defaultProgress: StudentProgress[] = [
        { id: "course-1_les-1-1", courseId: "course-1", lessonId: "les-1-1", completed: true, completedAt: new Date().toISOString() },
        { id: "course-1_les-1-2", courseId: "course-1", lessonId: "les-1-2", completed: true, completedAt: new Date().toISOString() }
      ];
      localStorage.setItem("student_progress", JSON.stringify(defaultProgress));
      return defaultProgress;
    }
    return JSON.parse(data);
  },

  // Write modifications
  enrollInFlagshipProgram(): Enrollment[] {
    const enrollments: Enrollment[] = masterCourses.map((c, idx) => ({
      id: `enr-flag-${c.id}-${idx}`,
      courseId: c.id,
      enrolledAt: new Date().toISOString()
    }));
    localStorage.setItem("enrollments", JSON.stringify(enrollments));

    // Upload to Supabase if config exists
    if (supabase) {
      for (const enr of enrollments) {
        supabase
          .from("enrollments")
          .upsert({
            id: enr.id,
            course_id: enr.courseId,
            enrolled_at: enr.enrolledAt
          })
          .then(({ error }) => {
            if (error) console.error("Supabase enrollment sync failed:", error);
          });
      }
    }

    return enrollments;
  },

  enrollInCourse(courseId: string): Enrollment[] {
    return this.enrollInFlagshipProgram();
  },

  toggleLessonProgress(courseId: string, lessonId: string, completed: boolean): StudentProgress[] {
    const progress = this.getStudentProgress();
    const existingIdx = progress.findIndex(p => p.courseId === courseId && p.lessonId === lessonId);

    const targetProgress = existingIdx > -1 
      ? { ...progress[existingIdx], completed, completedAt: new Date().toISOString() }
      : { id: `${courseId}_${lessonId}`, courseId, lessonId, completed, completedAt: new Date().toISOString() };

    if (existingIdx > -1) {
      progress[existingIdx] = targetProgress;
    } else {
      progress.push(targetProgress);
    }

    localStorage.setItem("student_progress", JSON.stringify(progress));

    // Upload change to Supabase
    if (supabase) {
      supabase
        .from("student_progress")
        .upsert({
          id: targetProgress.id,
          course_id: targetProgress.courseId,
          lesson_id: targetProgress.lessonId,
          completed: targetProgress.completed,
          completed_at: targetProgress.completedAt
        })
        .then(({ error }) => {
          if (error) console.error("Supabase lesson completion sync failed:", error);
        });
    }

    return progress;
  },

  resetDatabase() {
    localStorage.removeItem("categories");
    localStorage.removeItem("courses");
    localStorage.removeItem("course_modules");
    localStorage.removeItem("lessons");
    localStorage.removeItem("enrollments");
    localStorage.removeItem("student_progress");
    this.getCategories();
    this.getCourses();
    this.getModules();
    this.getLessons();
    this.getEnrollments();
    this.getStudentProgress();
  }
};

// Initialize the Database immediately on runtime
export function initDB() {
  db.getCategories();
  db.getCourses();
  db.getModules();
  db.getLessons();
  db.getEnrollments();
  db.getStudentProgress();

  // Try automatic data migrations safely on client load
  syncLocalStorageToSupabase();
}

// Convert legacyCourse types cleanly
export function getLegacyFeaturedCourses(): LegacyCourse[] {
  const currentCourses = db.getCourses();
  return currentCourses.map(c => {
    const categoryName = masterCategories.find(cat => cat.id === c.categoryId)?.name || "AI Business";
    return {
      id: c.id,
      title: c.title,
      tagline: c.description,
      thumbnail: c.thumbnail,
      category: categoryName,
      level: c.level,
      duration: c.duration,
      studentCount: c.studentCount,
      instructor: c.instructorName,
      instructorAvatar: c.instructorAvatar,
      skillsAcquired: c.skills,
      price: c.price || "₦45,000"
    };
  });
}
