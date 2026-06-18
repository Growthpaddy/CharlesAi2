/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  rating: number;
  highlightOutcome: string;
  quote: string;
  growthMetric: string;
  videoThumb?: string;
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  tag: string;
  lessons: number;
  tools: string[];
  icon: string; // lucide icon name
}

export interface Course {
  id: string;
  title: string;
  tagline: string;
  thumbnail: string;
  category: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  studentCount: string;
  instructor: string;
  instructorAvatar: string;
  skillsAcquired: string[];
  overview?: string;
  outcomes?: string[];
  price?: string;
}

export interface CurriculumModule {
  id: string;
  title: string;
  description: string;
  weeks: string;
  lessonsCount: number;
  lessons: string[];
  toolsCovered: string[];
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface BonusItem {
  id: string;
  title: string;
  description: string;
  value: string;
  badge: string;
  icon: string;
}

export interface PricingPlan {
  name: string;
  price: string;
  period: string;
  tagline: string;
  popular: boolean;
  features: string[];
  excludedFeatures?: string[];
  ctaText: string;
}
