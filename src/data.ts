/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LearningPath, Course, CurriculumModule, Testimonial, FAQItem, BonusItem, PricingPlan } from "./types";
import { masterCourses, masterCategories, masterModules, masterLessons } from "./lib/db";

// 12 official primary categories for AI Online Business
export const academyCategories = [
  "AI Prompt Engineering",
  "AI Digital Products",
  "AI Content Creation",
  "App Creation with AI",
  "AI Automation",
  "Faceless YouTube",
  "Client Acquisition",
  "AI Affiliate Marketing",
  "Advertising",
  "AI Business Operations",
  "Social Media",
  "AI Ghostwriting"
];

// Re-map the learning paths to match the official AI Online Business specialized pathways
export const learningPaths: LearningPath[] = [
  {
    id: "path-1",
    title: "AI Business Creator Pathway",
    description: "Equipping individuals with practical, structured systems to construct profitable online ventures using AI tools.",
    tag: "Practical Business",
    lessons: 10,
    tools: ["ChatGPT Plus", "Selar", "Canva AI", "Scribe"],
    icon: "Briefcase"
  },
  {
    id: "path-2",
    title: "AI Digital Products Creator",
    description: "Launch, package, design, and list high-value digital assets that capture sales securely with zero capital.",
    tag: "Passive Income",
    lessons: 8,
    tools: ["ChatGPT Plus", "Canva Layouts", "Selar", "KDP Word Templates"],
    icon: "Layers"
  },
  {
    id: "path-3",
    title: "AI Media & Automation Authority",
    description: "Automate entire marketing funnels, scrape hundreds of leads, generate faceless channels, and script with Grok.",
    tag: "Autonomous Systems",
    lessons: 14,
    tools: ["Make.com", "Zapier AI", "Grok Video", "Apify Scrapers"],
    icon: "Bot"
  }
];

// Map 12 master courses to the legacy Course structure securely so legacy pages display them flawlessly
export const featuredCourses: Course[] = masterCourses.map(c => {
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
    overview: c.overview,
    outcomes: c.outcomes
  };
});

// Real academy success milestones (3,500+ alumni, Nigeria, churches/companies, 24/7 loops)
export const successMetrics = [
  { value: "3,500+", label: "Trained Students", desc: "Trained over 3,500 ambitious students on applied digital competencies globally." },
  { value: "100%", label: "Practical Workflows", desc: "Build hands-on tools, functional databases, and live business processes from Day 1." },
  { value: "₦400k", label: "Coaching Earnings", desc: "Average coaching retainers locked by certified advisors deploying AI operations for clients." },
  { value: "Nigeria", label: "National Presence", desc: "Successfully delivered educational programs across churches, companies, and organizations in Nigeria." },
  { value: "12+", label: "Applied Operations", desc: "Deploy standard automation tracks spanning ghostwriting, advertising, and digital products." },
  { value: "3x", label: "Operational Leverage", desc: "Multiply individual output cleanly by delegating tasks to custom-programmed background agents." }
];

// Relational curriculum modules remapped cleanly for visual accordion components
export const curriculumModules: CurriculumModule[] = masterModules.map(m => {
  // Find lessons belonging to this module
  const lessonsForModule = masterLessons.filter(l => l.moduleId === m.id).map(l => l.title);
  // Default fallback tools
  const toolsList = ["AI Models", "API Integrations", "Database Rules"];
  return {
    id: m.id,
    title: m.title,
    description: "Comprehensive step-by-step guidance on implementing tools, reviewing code structures, and checking assignments.",
    weeks: `Module ${m.sortOrder}`,
    lessonsCount: lessonsForModule.length || 2,
    lessons: lessonsForModule.length ? lessonsForModule : ["Introduction to Module Keynotes", "Practical Assignment Review"],
    toolsCovered: toolsList
  };
});

// Head of Academy spotlight and advisors
export const instructorInfo = {
  name: "Sandra Cole",
  role: "Faculty Director & Registrar",
  avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600&h=600",
  bio: "Sandra Cole is a pioneer of practical AI education in West Africa. She coordinates training curriculums, manages corporate workshops, and guides transition learning for 3,500+ participants across Nigeria's dynamic digital landscape.",
  stats: [
    { label: "Students Trained", value: "3,500+" },
    { label: "Workshops Hosted", value: "85+" },
    { label: "Average Income Lift", value: "2.8x" },
    { label: "Success Rate", value: "94%" }
  ],
  achievements: [
    "Program Director for AI Online Business Academy",
    "Delivered direct training sessions to major organizations and local churches across Lagos, Abuja & Port Harcourt",
    "Coordinated implementation modules for 3,500+ active enrollees",
    "Advisory Advisor in Modern Digital Product Launch frameworks"
  ],
  badges: ["Academy Director", "Digital Strategist", "LMS Curriculum Architect", "Senior Advisor Lead"]
};

// Testimonials of real success stories
export const testimonials: Testimonial[] = [
  {
    id: "t-1",
    name: "Emeka Okafor",
    role: "eCommerce Operations Manager",
    company: "Lagos Retail Network",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=300&h=300",
    rating: 5,
    highlightOutcome: "Built Selar visual products in 10 days",
    quote: "Following Course 2's system, I wrote, designed, and hosted an eBook detailing operational checklists on Selar. Sold over 120 copies in my first week. Incredible practical guidance!",
    growthMetric: "+₦280k Passive Income",
    videoThumb: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=600&h=400"
  },
  {
    id: "t-2",
    name: "Funmilayo Adebayo",
    role: "Content Coordinator",
    company: "Vanguard Media Group",
    avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=300&h=300",
    rating: 5,
    highlightOutcome: "Automated media schedules with Grok",
    quote: "By adopting the content generation strategies, we completely re-engineered how we publish on social channels. Automated script outputs save our studio upwards of 25 hours weekly.",
    growthMetric: "Saved 25 Hours of Editing Weekly",
    videoThumb: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=600&h=400"
  },
  {
    id: "t-3",
    name: "Tobi Alabi",
    role: "Digital Consultant",
    company: "Lekki Agency Hub",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300&h=300",
    rating: 5,
    highlightOutcome: "Scored corporate operations contract",
    quote: "The Client Acquisition strategies taught here work beautifully. I deployed cold email scraping nodes and signed my first organization retainer within six business days.",
    growthMetric: "Locked ₦500k Monthly Retainer"
  }
];

// High-fidelity FAQs
export const faqs: FAQItem[] = [
  {
    id: "faq-1",
    question: "Do I need previous coding experience to join AI Online Business?",
    answer: "No, you do not. Our training is structured to accommodate complete beginners as well as advanced students. We start from foundational prompting models and transition gracefully into visual, zero-code, and AI-assisted development tools."
  },
  {
    id: "faq-2",
    question: "How long do I keep access to these materials?",
    answer: "You receive lifetime access to all learning paths, course curriculums, lesson archives, and regular roadmap updates at no extra cost in your student dashboard."
  },
  {
    id: "faq-3",
    question: "Are payment installments available?",
    answer: "Yes, we support card payments, bank transfers, and flexible installments for our One-on-One coaching program. Please reach out to our admissions advisors at Lekki, Lagos or send us a message via WhatsApp."
  },
  {
    id: "faq-4",
    question: "Have you delivered corporate training programs in Nigeria?",
    answer: "Yes. We have delivered tailored in-person and virtual AI education workshops to several churches, service organizations, local businesses, schools, and dynamic corporate teams across Nigeria."
  }
];

export const bonuses: BonusItem[] = [
  {
    id: "b-1",
    title: "Master AI Prompt Toolbox",
    description: "A complete catalog of 500+ customized, production-tested prompt cards covering book drafting, copy parameters, and company proposals.",
    value: "₦75,000 VALUE",
    badge: "FREE BONUS",
    icon: "FileCode"
  },
  {
    id: "b-2",
    title: "SaaS & App Starter Blueprints",
    description: "Exportable wireframes, React sample shells, and secure Firestore database templates to kickstart your next application project.",
    value: "₦150,000 VALUE",
    badge: "EXCLUSIVE",
    icon: "FolderSync"
  }
];

// Dynamic tuition package rates
export const pricingPlans: PricingPlan[] = [
  {
    name: "Group Training",
    price: "₦150,000",
    period: "/month",
    tagline: "Highly intensive team training, group milestones, and direct workspace assignments.",
    popular: false,
    features: [
      "Access to ALL 12 Academy Courses",
      "Dynamic Lessons & Modules",
      "Interactive Group Assignments",
      "Access to Private Cohort forums",
      "Official Academy Graduation Credentials"
    ],
    ctaText: "Enroll in Group Track"
  },
  {
    name: "One-on-One Coaching",
    price: "₦400,000",
    period: "/6 weeks",
    tagline: "The gold standard: personalized mentor audits, direct WhatsApp support, and private sessions.",
    popular: true,
    features: [
      "Personalized 1-on-1 Weekly Live Sessions",
      "Customized AI Business Roadmap",
      "Practical Weekly Audits of Your Outputs",
      "Direct Coach Support via Secure Chat",
      "Complete Capstone Project Graduation Credentials",
      "Lifetime Private Alumni Hub Access"
    ],
    ctaText: "Unlock Coaching Track"
  },
  {
    name: "Corporate AI Custom",
    price: "Custom",
    period: "/project",
    tagline: "Tailored AI educational workshops for churches, companies, schools, and organizations.",
    popular: false,
    features: [
      "Customized Module Curriculums",
      "Physical or Virtual Interactive Sessions",
      "Dedicated Team Practical Labs",
      "Integration & Operations Implementation Audit",
      "Lifetime Team References Files"
    ],
    ctaText: "Contact Sales"
  }
];
