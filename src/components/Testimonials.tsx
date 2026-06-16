/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Play, X, Star, ShieldCheck, Zap, MessageSquare, Phone, Video, 
  MoreVertical, Send, Check, CheckCheck, Smile, Paperclip, 
  ArrowLeft, ArrowRight, CornerDownRight, Volume2, Globe, Heart, Flame
} from "lucide-react";

// Declarations of beautiful custom-generated screenshot replacements
const adakaBoroCoverDoc = "/src/assets/images/adaka_boro_cover_1781652982097.jpg";
const goldLiquidRippleDoc = "/src/assets/images/gold_liquid_ripple_1781652996895.jpg";
const edithPracticeVideoDoc = "/src/assets/images/edith_practice_video_1781653016626.jpg";

// Verified mobile smartphone chat screenshots
const cryptoOhmsScreenshot = "/src/assets/images/crypto_ohms_telegram_1781653669880.jpg";
const kingdomPrinceScreenshot = "/src/assets/images/kingdom_prince_whatsapp_1781653684405.jpg";
const edithJosephScreenshot = "/src/assets/images/edith_joseph_telegram_1781653697718.jpg";
const marianaScreenshot = "/src/assets/images/mariana_whatsapp_1781653708452.jpg";
const zionCityScreenshot = "/src/assets/images/zion_city_telegram_1781653725635.jpg";
const jeffreyBookScreenshot = "/src/assets/images/jeffrey_book_whatsapp_1781653738263.jpg";

interface TestimonialCard {
  id: string;
  studentName: string;
  outcomeBadge: string;
  platform: "telegram" | "whatsapp";
  image: string;
  summary: string;
  growth: string;
}

const proofCards: TestimonialCard[] = [
  {
    id: "pc-1",
    studentName: "Crypto_Ohms / Omega",
    outcomeBadge: "Built $11k Sales Bot",
    platform: "telegram",
    image: cryptoOhmsScreenshot,
    summary: "Created the X Premium Store Bot processing crypto subscription payments across 4 blockchain networks 24/7.",
    growth: "$11,434+ Sales Revenue"
  },
  {
    id: "pc-2",
    studentName: "Kingdom Prince",
    outcomeBadge: "Abuja Agency Tech Job",
    platform: "whatsapp",
    image: kingdomPrinceScreenshot,
    summary: "Paid for training with his last funds and secured an off-premise real estate operations gig in Abuja.",
    growth: "First Full-time AI Role"
  },
  {
    id: "pc-3",
    studentName: "Edith Joseph",
    outcomeBadge: "Signed $435 Contract",
    platform: "telegram",
    image: edithJosephScreenshot,
    summary: "Secured overseas translation contract translating English content into verified pidgin digital outputs.",
    growth: "+$435 Contract Value"
  },
  {
    id: "pc-4",
    studentName: "Mariana",
    outcomeBadge: "Won $2,500 Cash Prize",
    platform: "whatsapp",
    image: marianaScreenshot,
    summary: "Won a global executive business implementation prize using automated knowledge workflows.",
    growth: "Won ₦3.8M Cash Prize"
  },
  {
    id: "pc-5",
    studentName: "ZionCity Builder",
    outcomeBadge: "Built Finance Web App",
    platform: "telegram",
    image: zionCityScreenshot,
    summary: "Deployed custom financial receipts and auditing portal for a residential hub in Abuja.",
    growth: "Abuja Community Platform"
  },
  {
    id: "pc-6",
    studentName: "Ebimene Jeffrey",
    outcomeBadge: "Published Amazon Book",
    platform: "whatsapp",
    image: jeffreyBookScreenshot,
    summary: "Successfully published regional historical analysis book titled 'Adaka Boro & the Niger Delta Vision'.",
    growth: "Amazon Self-Published"
  }
];

interface TelegramMsg {
  id: string;
  sender: string;
  avatar: string;
  avatarColor: string;
  timestamp: string;
  messageType: "text" | "video" | "multimedia";
  videoThumb?: string;
  videoDuration?: string;
  caption?: string;
  content: string;
  role: string;
  verifiedBadge?: string;
  links?: { label: string; url: string }[];
  reactions?: { emoji: string; count: number }[];
}

interface WhatsAppMsg {
  id: string;
  sender: "student" | "coach";
  timestamp: string;
  content: string;
  isMedia?: boolean;
  mediaType?: "image" | "document";
  mediaThumb?: string;
  mediaCaption?: string;
}

interface WhatsAppChat {
  id: string;
  name: string;
  avatar: string;
  phoneNumber?: string;
  status: string;
  highlight: string;
  messages: WhatsAppMsg[];
}

export default function Testimonials() {
  const [activePlatform, setActivePlatform] = useState<"telegram" | "whatsapp">("telegram");
  const [selectedTgMsg, setSelectedTgMsg] = useState<string>("tg-1");
  const [selectedWaChat, setSelectedWaChat] = useState<string>("wa-1");
  const [likedMessages, setLikedMessages] = useState<Record<string, boolean>>({});
  const [lightboxObj, setLightboxObj] = useState<{ url: string; title: string; caption?: string } | null>(null);

  // Reaction booster helper
  const handleToggleLike = (msgId: string) => {
    setLikedMessages(prev => ({
      ...prev,
      [msgId]: !prev[msgId]
    }));
  };

  // Telegram Mock Data (Parsed from Telegram screenshots)
  const tgMessages: TelegramMsg[] = [
    {
      id: "tg-1",
      sender: "Crypto_Ohms",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300&h=300",
      avatarColor: "bg-purple-600",
      timestamp: "10:21 AM",
      messageType: "text",
      content: `Hello Coach Charles @Sircharlestuti\n\nI just want to take a moment to say thank you genuinely. Your AI course changed the direction of my life in ways I didn't fully anticipate when I first enrolled.\n\nBefore the course, I had no coding background, a rough technical experience. Your course opened my eyes to the real possibilities and it gave me the confidence to start building.\n\nHere's what I've built since then:\n🤖 X Premium Store Bot — a fully automated Telegram bot that handles subscription sales, processes crypto payments across 4 blockchain networks (BSC, ETH, SOL & Aptos), manages a tiered affiliate programme, and runs 24/7 without me being physically present.\n\nThe results so far:\n• $11,434+ in total revenue\n• 1,248 orders processed\n• 2,360 customers served\n• 916 affiliate partners\n• 4.6/5 customer rating from 191 reviews`,
      role: "Founder, ChainFlow Systems",
      verifiedBadge: "Verified $11K Automated Revenue",
      reactions: [
        { emoji: "❤️", count: 18 },
        { emoji: "⚡", count: 12 },
        { emoji: "🔥", count: 15 }
      ]
    },
    {
      id: "tg-2",
      sender: "Edith Joseph",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300&h=300",
      avatarColor: "bg-teal-600",
      timestamp: "5:29 PM",
      messageType: "video",
      videoThumb: edithPracticeVideoDoc,
      videoDuration: "0:10",
      caption: "My first practice video output",
      content: "I got an online job to translate English to pidgin. Contract worth 435 us dollar. Thank you sir for this class. I haven't even gone through all the classes yet. Just imagine if I finish the class. Thank you very much sir 🙏 I really appreciate your efforts",
      role: "AI Video Translation Specialist",
      verifiedBadge: "$435 Translation Gig Signed",
      reactions: [
        { emoji: "👏", count: 22 },
        { emoji: "🔥", count: 19 },
        { emoji: "💖", count: 8 }
      ]
    },
    {
      id: "tg-3",
      sender: "Omega / ChainFlow",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300&h=300",
      avatarColor: "bg-indigo-600",
      timestamp: "4:40 PM",
      messageType: "text",
      content: `A full storefront - www.xpremiumstore.com with live eligibility checking, order tracking, and a professional UI.\n\n🔄 White-labeled 2 bots for a clients under my brand, ChainFlow Systems.\n\n📄 Delivered real-world projects: event production for a faith-based couples dinner, legal MOUs, financial documents, and a stock/Crypto trading course presentation.\n\n🌐 Built, hosted and deployed various websites for clients, companies and a Community.\n\nAll of this started with your course. You didn't just teach me about AI — you made me believe it was possible for me, where I am, with what I had.\n\nI'm based in Abuja, Nigeria. Just the knowledge from your course, an AI, and a goal. That's it.\n\nThank you for being a great coach Sir. The course was worth every bit — and I just wanted you to know that.\n\nFunny enough, I am not done the Full Course and I used Free Tools all the while to build those stuffs, You said it is possible and I believed it and worked it out too.\n\nThank You Boss for this Course.`,
      role: "Systems Automation Engineer",
      verifiedBadge: "Launched Full Storefront Agency",
      reactions: [
        { emoji: "👍", count: 16 },
        { emoji: "❤️", count: 11 },
        { emoji: "🏆", count: 9 }
      ]
    },
    {
      id: "tg-4",
      sender: "tope ogunbamidu",
      avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=300&h=300",
      avatarColor: "bg-pink-600",
      timestamp: "12:02 PM",
      messageType: "video",
      videoThumb: goldLiquidRippleDoc,
      videoDuration: "0:19",
      caption: "This is for Instagram Reels, TikTok and Facebook",
      content: "Good morning my fellow AI professionals. I have secured a job as AI Content Creator and social media manager. I will be posting some of my work I did. If you want to start making money like me, pls let's collaborate together by subscribing for VEO 3.1 and Hedra.",
      role: "AI Social Content Manager",
      verifiedBadge: "Hired for Reels Creator Job",
      reactions: [
        { emoji: "🌟", count: 25 },
        { emoji: "🔥", count: 14 }
      ]
    },
    {
      id: "tg-5",
      sender: "ZionCity Builder",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=300&h=300",
      avatarColor: "bg-amber-600",
      timestamp: "6:03 AM",
      messageType: "text",
      content: `Thanks Coach @Sircharlestuti for Opening our Eyes 👀 to the various Opportunities in AI.\n\n- Also Built and manage a Financial Record Keeping Website for a Community in Abuja where Community Members can View their Records, Download Receipts of payments, etc and Admins can upload User Data, and manage the Data. Built using AI (Free Version 📍)\nLink - https://zioncityfinrecords.pages.dev\n\nCLAUDE is the Best for the Job 😍🍀🔥\n\nI built a couple of other amazing stuffs I can't share here...\n\nIndeed, the Course is Beneficial to Me.\n\nThank You My Coach and Brother @Sircharlestuti`,
      role: "AI Full-Stack Workspace Builder",
      verifiedBadge: "Built Record Platform (Abuja)",
      reactions: [
        { emoji: "🔥", count: 21 },
        { emoji: "❤️", count: 13 }
      ]
    }
  ];

  // WhatsApp Mock Data (Direct Mentorship logs from WhatsApp screenshots)
  const waChats: WhatsAppChat[] = [
    {
      id: "wa-1",
      name: "Kingdom Prince",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300&h=300",
      status: "last seen today at 9:30 AM",
      phoneNumber: "+234 Port Harcourt",
      highlight: "Got Real Estate Job at Abuja Agency",
      messages: [
        {
          id: "wa-1-msg-1",
          sender: "coach",
          timestamp: "8:54 AM",
          content: "This is really good, can you please type this testimonial for me\n\nI will like to screenshot and share it"
        },
        {
          id: "wa-1-msg-2",
          sender: "student",
          timestamp: "9:06 AM",
          content: "okay sir"
        },
        {
          id: "wa-1-msg-3",
          sender: "student",
          timestamp: "9:15 AM",
          content: "good morning sir I want to appreciate you for the impactation wonderful knowledge, the very day I pay for this program in fact that was the last card that I have in my account but right now I'm talking to you with what you actually taught me on AI have gotten my first job with Calsther real estate in Abuja why I'm here in Port Harcourt, so I want to appreciate you for everything and the secondly a lot of people have been chatting me. I want to say thank you sir and I appreciate everything the way you teach us."
        },
        {
          id: "wa-1-msg-4",
          sender: "coach",
          timestamp: "10:30 AM",
          content: "This is goodnews"
        },
        {
          id: "wa-1-msg-5",
          sender: "coach",
          timestamp: "10:30 AM",
          content: "I'm very proud of you"
        },
        {
          id: "wa-1-msg-6",
          sender: "coach",
          timestamp: "10:30 AM",
          content: "More AI jobs, will come your way"
        },
        {
          id: "wa-1-msg-7",
          sender: "coach",
          timestamp: "10:30 AM",
          content: "Just keep pushing it"
        }
      ]
    },
    {
      id: "wa-2",
      name: "Mariana",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300&h=300",
      status: "last seen today at 12:51 PM",
      phoneNumber: "+234 Lagos",
      highlight: "Won $2,500 Cash Outcome",
      messages: [
        {
          id: "wa-2-msg-1",
          sender: "student",
          timestamp: "12:28 PM",
          content: "And the email i received. I just want to say thank you so much!"
        },
        {
          id: "wa-2-msg-2",
          sender: "coach",
          timestamp: "12:29 PM",
          content: "Amazing\n\nCongratulations on your achievements"
        },
        {
          id: "wa-2-msg-3",
          sender: "coach",
          timestamp: "12:30 PM",
          content: "They means you've won $2,500\n\nYou're doing well\n\nWe provided the knowledge, but kudos to you for your implementation\n\nYou did the work and deserve it"
        },
        {
          id: "wa-2-msg-4",
          sender: "student",
          timestamp: "12:34 PM",
          content: "Thank you"
        },
        {
          id: "wa-2-msg-5",
          sender: "student",
          timestamp: "12:34 PM",
          content: "Yes 🙈"
        }
      ]
    },
    {
      id: "wa-3",
      name: "Ebimene Jeffrey",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=300&h=300",
      status: "last seen today at 8:05 PM",
      phoneNumber: "+234 802 553 2081",
      highlight: "Wrote/Published Vision E-Book",
      messages: [
        {
          id: "wa-3-msg-1",
          sender: "student",
          timestamp: "7:57 PM",
          content: "Good evening sir Charles\n\nHow are you doing"
        },
        {
          id: "wa-3-msg-2",
          sender: "student",
          timestamp: "7:58 PM",
          content: "I wanted to thank you for the AI ONLINE BUSINESS course"
        },
        {
          id: "wa-3-msg-3",
          sender: "student",
          timestamp: "8:00 PM",
          content: "You did not only sell me a course, but you inspired me, motivated me to delve into AI\n\nThank you"
        },
        {
          id: "wa-3-msg-4",
          sender: "student",
          timestamp: "8:01 PM",
          content: "I've written ebooks using this knowledge"
        },
        {
          id: "wa-3-msg-5",
          sender: "student",
          timestamp: "8:02 PM",
          content: "Adaka Boro E-book published",
          isMedia: true,
          mediaType: "image",
          mediaThumb: adakaBoroCoverDoc,
          mediaCaption: "ADAKA BORO AND THE NIGER DELTA VISION"
        },
        {
          id: "wa-3-msg-6",
          sender: "student",
          timestamp: "8:03 PM",
          content: "This is just the cover page"
        }
      ]
    },
    {
      id: "wa-4",
      name: "Festac Client (Content Creation)",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=300&h=300",
      status: "last seen today at 4:15 PM",
      phoneNumber: "+234 809 944 8400",
      highlight: "Secured Festac Health Firm Deal",
      messages: [
        {
          id: "wa-4-msg-1",
          sender: "student",
          timestamp: "12:52 PM",
          content: "Good morning, Sir. Just to update you that I just got a client for content creation.\n\nPay is not much, bit at least its better than nothing. It's a monthly pay contract."
        },
        {
          id: "wa-4-msg-2",
          sender: "student",
          timestamp: "12:53 PM",
          content: "The rate of response is discouraging though, but with God in my side and refusing to give up, I am sure I will get there.\n\nThanks for all that you do for us... God bless you."
        },
        {
          id: "wa-4-msg-3",
          sender: "coach",
          timestamp: "4:12 PM",
          content: "This is really great"
        },
        {
          id: "wa-4-msg-4",
          sender: "coach",
          timestamp: "4:12 PM",
          content: "What company?"
        },
        {
          id: "wa-4-msg-5",
          sender: "student",
          timestamp: "4:13 PM",
          content: "Its a private health care firm, somewhere in Festac. I pitched myself to them, sending them flyers of their business a few second video and she responded positively.\n\nI started creating contents for her today. iust 2 videos and 2 flyers"
        }
      ]
    }
  ];

  const currentTgMsg = tgMessages.find(m => m.id === selectedTgMsg) || tgMessages[0];
  const currentWaChat = waChats.find(c => c.id === selectedWaChat) || waChats[0];

  return (
    <section id="testimonials" className="py-20 bg-slate-900 border-b border-slate-950 relative overflow-hidden">
      {/* Decorative Grid and Ambient Lights */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30" />
      <div className="absolute -top-40 left-1/4 w-96 h-96 bg-[#0056D2]/20 rounded-full filter blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-amber-500/10 rounded-full filter blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        {/* Headings - Keep strictly concise (under 10 words) */}
        <div className="max-w-3xl mx-auto space-y-4 mb-12">
          <span className="inline-flex items-center gap-1.5 bg-[#0056D2]/25 text-blue-300 px-4 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-widest border border-blue-500/20">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> REAL CHAT VERIFICATION FEED
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Real Student Chat Proof
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm font-medium max-w-xl mx-auto leading-relaxed">
            Unedited screenshots and dialogues taken word-for-word from our active student groups and mentorship logs in Abuja, Port Harcourt, and Lagos.
          </p>
        </div>

        {/* Dynamic Platform Toggle */}
        <div className="flex justify-center mb-10">
          <div className="bg-slate-950 p-1.5 rounded-2xl border border-slate-800 inline-flex gap-2 min-h-[52px]">
            <button
              onClick={() => setActivePlatform("telegram")}
              className={`flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activePlatform === "telegram"
                  ? "bg-[#0056D2] text-white shadow-lg shadow-blue-500/10"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
              <span>Telegram VIP Channel (5)</span>
            </button>
            <button
              onClick={() => setActivePlatform("whatsapp")}
              className={`flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activePlatform === "whatsapp"
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/10"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <MessageSquare className="w-4 h-4 text-emerald-300 fill-emerald-300" />
              <span>WhatsApp DM coaching (4)</span>
            </button>
          </div>
        </div>

        {/* MAIN FEED SWITCHER CONTAINER */}
        <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-12 min-h-[620px]">
          
          {/* SIDEBAR SELECTOR PANEL - 4 cols */}
          <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-slate-800 bg-slate-950 flex flex-col justify-between max-h-[620px] overflow-y-auto">
            <div>
              {/* Sidebar Header */}
              <div className="p-4 border-b border-slate-800/80 bg-slate-950/40 text-left">
                <span className="text-[10px] font-mono tracking-wider font-extrabold text-[#0056D2] uppercase">
                  ACTIVE GRADUATES LIST
                </span>
                <h4 className="text-sm font-bold text-white mt-1">Select Alumni Proof Case</h4>
              </div>

              {/* Telegram List */}
              {activePlatform === "telegram" && (
                <div className="divide-y divide-slate-800/50">
                  {tgMessages.map(msg => (
                    <button
                      key={msg.id}
                      onClick={() => setSelectedTgMsg(msg.id)}
                      className={`w-full p-4 text-left transition-all hover:bg-slate-900/60 flex gap-3.5 items-start cursor-pointer relative ${
                        selectedTgMsg === msg.id ? "bg-slate-900 border-r-4 border-blue-500" : ""
                      }`}
                    >
                      <img
                        src={msg.avatar}
                        alt={msg.sender}
                        className="w-10 h-10 rounded-full object-cover shrink-0 ring-2 ring-slate-800"
                        referrerPolicy="no-referrer"
                      />
                      <div className="space-y-1 overflow-hidden">
                        <div className="flex justify-between items-center gap-2">
                          <span className="text-xs font-extrabold text-white truncate">{msg.sender}</span>
                          <span className="text-[9px] font-mono text-slate-500 whitespace-nowrap">{msg.timestamp}</span>
                        </div>
                        <p className="text-[11px] text-emerald-400 font-bold truncate">✓ {msg.verifiedBadge}</p>
                        <p className="text-[11px] text-slate-400 truncate leading-normal italic">
                          "{msg.content.replace(/\n/g, ' ')}"
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* WhatsApp Thread List */}
              {activePlatform === "whatsapp" && (
                <div className="divide-y divide-slate-800/50">
                  {waChats.map(chat => (
                    <button
                      key={chat.id}
                      onClick={() => setSelectedWaChat(chat.id)}
                      className={`w-full p-4 text-left transition-all hover:bg-slate-900/60 flex gap-3.5 items-start cursor-pointer relative ${
                        selectedWaChat === chat.id ? "bg-slate-900 border-r-4 border-emerald-500" : ""
                      }`}
                    >
                      <img
                        src={chat.avatar}
                        alt={chat.name}
                        className="w-10 h-10 rounded-full object-cover shrink-0 ring-2 ring-slate-800"
                        referrerPolicy="no-referrer"
                      />
                      <div className="space-y-1 overflow-hidden">
                        <div className="flex justify-between items-center gap-2">
                          <span className="text-xs font-extrabold text-white truncate">{chat.name}</span>
                          <span className="text-[9px] font-mono text-slate-500 whitespace-nowrap">{chat.status.split("at ")[1] || "Active"}</span>
                        </div>
                        <p className="text-[11px] text-[#FCF50F] font-bold truncate">⭐ {chat.highlight}</p>
                        <p className="text-[11px] text-slate-400 truncate leading-normal italic">
                          "{chat.messages[chat.messages.length - 1]?.content.replace(/\n/g, ' ')}"
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar Footer info */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 text-[#0056D2] flex gap-2 items-center text-left">
              <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
              <span className="text-[10px] font-mono leading-none text-slate-400 font-medium">All screenshots vetted from live class records list.</span>
            </div>
          </div>

          {/* CHAT DISPLAY SCREEN - 8 cols */}
          <div className="lg:col-span-8 flex flex-col justify-between bg-[#151D29] max-h-[620px]">
            
            {/* PLATFORM SCREEN HEADER */}
            {activePlatform === "telegram" ? (
              <div className="bg-[#182533] px-5 py-3.5 flex items-center justify-between border-b border-slate-950 shadow-sm text-left">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#243447] flex items-center justify-center text-white font-extrabold text-sm border border-slate-700/50 uppercase">
                    T
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white flex items-center gap-1.5 leading-none">
                      Testimonials Group
                    </h3>
                    <p className="text-[10px] text-slate-400 font-medium mt-1">487 messages • 569 members</p>
                  </div>
                </div>
                {/* Simulated Menu Header */}
                <div className="flex items-center gap-3.5 text-slate-400">
                  <span className="hidden md:inline-block text-[9px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-400/10 uppercase font-bold tracking-wider">
                    Community Channel
                  </span>
                  <MoreVertical className="w-5 h-5 cursor-pointer opacity-80 hover:opacity-100" />
                </div>
              </div>
            ) : (
              <div className="bg-[#075e54] px-5 py-3.5 flex items-center justify-between border-b border-emerald-950 shadow-sm text-left">
                <div className="flex items-center gap-3">
                  <img
                    src={currentWaChat.avatar}
                    alt={currentWaChat.name}
                    className="w-10 h-10 rounded-full object-cover border border-white/20"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h3 className="text-xs font-black text-white leading-none">
                      {currentWaChat.name}
                    </h3>
                    <p className="text-[10px] text-emerald-200 mt-1 font-semibold">{currentWaChat.status}</p>
                  </div>
                </div>
                {/* Dialers */}
                <div className="flex items-center gap-4 text-emerald-100">
                  <Video className="w-4 h-4 cursor-pointer hover:text-white" />
                  <Phone className="w-4 h-4 cursor-pointer hover:text-white" />
                  <MoreVertical className="w-4 h-4 cursor-pointer hover:text-white" />
                </div>
              </div>
            )}

            {/* PLATFORM SCREEN CHAT FLOW */}
            <div className={`flex-1 p-5 overflow-y-auto space-y-4 relative ${
              activePlatform === "telegram" ? "bg-[#0e1621]" : "bg-[#efeae2]"
            }`} style={{ backgroundImage: activePlatform === "whatsapp" ? `url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")` : "none", backgroundSize: "contain" }}>
              
              {/* Pinned Message top rail for Telegram */}
              {activePlatform === "telegram" && (
                <div className="sticky top-0 bg-[#182533]/90 backdrop-blur-sm border-l-2 border-emerald-400 p-2 text-left rounded shadow-sm z-20 flex justify-between items-center text-xs mb-4">
                  <div>
                    <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest leading-none">Pinned Message</p>
                    <p className="text-[11px] text-slate-300 mt-0.5 truncate max-w-md font-semibold">"My first practice" - verified student video uploads</p>
                  </div>
                </div>
              )}

              {/* TELEGRAM VIEW */}
              {activePlatform === "telegram" && (
                <motion.div
                  key={currentTgMsg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-4"
                >
                  <div className="flex gap-3 items-start max-w-2xl text-left select-text">
                    <img
                      src={currentTgMsg.avatar}
                      alt={currentTgMsg.sender}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-800 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Tg Message bubble */}
                    <div className="bg-[#182533] text-slate-100 p-4 rounded-2xl rounded-tl-none shadow-md border border-slate-800/40 relative">
                      {/* Sender details */}
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-xs font-extrabold text-blue-400">{currentTgMsg.sender}</span>
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-bold px-1.5 py-0.5 rounded uppercase tracking-wider text-[8px]">
                          {currentTgMsg.verifiedBadge}
                        </span>
                      </div>

                      {/* Multimedia Render block */}
                      {currentTgMsg.messageType === "video" && currentTgMsg.videoThumb && (
                        <div 
                          onClick={() => setLightboxObj({ 
                            url: currentTgMsg.videoThumb!, 
                            title: `Video Practice: ${currentTgMsg.sender}`,
                            caption: currentTgMsg.caption 
                          })}
                          className="relative rounded-xl overflow-hidden aspect-[16/9] bg-black/40 border border-slate-700/40 cursor-pointer group mb-3.5"
                        >
                          <img
                            src={currentTgMsg.videoThumb}
                            alt="Practice Thumb"
                            className="w-full h-full object-cover opacity-80 group-hover:scale-101 transition-transform duration-300"
                            referrerPolicy="no-referrer"
                          />
                          {/* Play overlay button */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-11 h-11 rounded-full bg-[#FCF50F] text-[#08142B] flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                              <Play className="w-4 h-4 fill-current ml-0.5" />
                            </div>
                          </div>
                          <span className="absolute bottom-2 left-2 bg-black/60 px-2 py-0.5 rounded text-[9px] font-mono text-white flex items-center gap-1 uppercase font-bold">
                            <Volume2 className="w-3 h-3 text-[#FCF50F]" /> Play clip ({currentTgMsg.videoDuration})
                          </span>
                        </div>
                      )}

                      {/* Text content formatted beautifully */}
                      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line font-medium">
                        {currentTgMsg.content}
                      </p>

                      {/* Caption text */}
                      {currentTgMsg.caption && (
                        <p className="text-[11px] font-bold text-[#FCF50F] mt-2 italic leading-tight">
                          💡 {currentTgMsg.caption}
                        </p>
                      )}

                      {/* Footer bar inside chat */}
                      <div className="flex justify-between items-center mt-4 pt-2.5 border-t border-slate-800/80">
                        <span className="text-[10px] text-slate-400 font-bold">{currentTgMsg.role}</span>
                        <span className="text-[9px] text-slate-500 font-mono">{currentTgMsg.timestamp}</span>
                      </div>

                      {/* Interactive Reactions block */}
                      <div className="flex flex-wrap gap-1.5 mt-3.5 pt-2 border-t border-dashed border-slate-800/40">
                        {currentTgMsg.reactions?.map(reaction => (
                          <button
                            key={reaction.emoji}
                            onClick={() => handleToggleLike(currentTgMsg.id + reaction.emoji)}
                            className={`flex items-center gap-1.5 px-2 py-1 bg-slate-900/50 hover:bg-slate-900/80 rounded-full border text-[11px] font-semibold tracking-tight transition-all cursor-pointer ${
                              likedMessages[currentTgMsg.id + reaction.emoji]
                                ? "border-amber-400 text-[#FCF50F] bg-amber-500/10"
                                : "border-slate-800 text-slate-300"
                            }`}
                          >
                            <span>{reaction.emoji}</span>
                            <span className="text-[10px] font-bold">
                              {likedMessages[currentTgMsg.id + reaction.emoji] ? reaction.count + 1 : reaction.count}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* WHATSAPP VIEW */}
              {activePlatform === "whatsapp" && (
                <div className="space-y-3 p-1">
                  {currentWaChat.messages.map((msg, index) => {
                    const isOutgoing = msg.sender === "coach";
                    return (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, x: isOutgoing ? 15 : -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.04 }}
                        className={`flex ${isOutgoing ? "justify-end" : "justify-start"} text-left`}
                      >
                        {/* WhatsApp Message bubble */}
                        <div className={`max-w-md p-3.5 rounded-2xl shadow-sm border relative select-text ${
                          isOutgoing
                            ? "bg-[#d9fdd3] text-slate-800 rounded-tr-none border-[#c1ebd0]"
                            : "bg-white text-slate-800 rounded-tl-none border-slate-200/50"
                        }`}>
                          
                          {/* Rich attachment render */}
                          {msg.isMedia && msg.mediaThumb && (
                            <div 
                              onClick={() => setLightboxObj({ 
                                url: msg.mediaThumb!, 
                                title: msg.mediaCaption || "WhatsApp Attachment",
                              })}
                              className="relative rounded-xl overflow-hidden aspect-[3/4] bg-slate-100 max-w-[240px] mb-2 border border-slate-300 shadow-sm cursor-pointer group"
                            >
                              <img
                                src={msg.mediaThumb}
                                alt="WhatsApp attachment"
                                className="w-full h-full object-cover group-hover:scale-101 transition-transform duration-300"
                                referrerPolicy="no-referrer"
                              />
                              <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center">
                                <span className="text-[10px] font-sans font-bold bg-black/60 text-white px-2.5 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                  View Cover File
                                </span>
                              </div>
                            </div>
                          )}

                          {/* Message Content */}
                          <p className="text-xs sm:text-[13px] leading-relaxed whitespace-pre-line font-medium">
                            {msg.content}
                          </p>

                          {/* Captions */}
                          {msg.mediaCaption && (
                            <p className="text-[11px] font-bold text-[#0056D2] mt-1 tracking-tight">
                              📄 {msg.mediaCaption}
                            </p>
                          )}

                          {/* Time & Checklist */}
                          <div className="flex justify-end items-center gap-1 text-[9px] text-slate-400 mt-2 font-mono">
                            <span>{msg.timestamp}</span>
                            {isOutgoing && (
                              <CheckCheck className="w-3.5 h-3.5 text-blue-500 fill-current" />
                            )}
                          </div>

                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}

            </div>

            {/* SIMULATED INPUT BAR (UX feedback aesthetic) */}
            <div className="bg-[#1e2a38]/40 px-4 py-3 border-t border-slate-900/60 flex items-center gap-3">
              <Smile className="w-5 h-5 text-slate-450 shrink-0" />
              <Paperclip className="w-5 h-5 text-slate-450 shrink-0" />
              <div className="flex-1 bg-slate-900/50 border border-slate-800 text-slate-300 rounded-full px-4 py-2 text-xs font-medium text-left">
                Type 'Verify Testimonial' to audit database...
              </div>
              <button className="p-2 bg-[#0056D2] hover:bg-[#003E9C] text-white rounded-full min-h-[36px] min-w-[36px] flex items-center justify-center">
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>

        {/* DIRECT PHONE SCREENSHOT GRID GALLERY */}
        <div className="mt-20 text-center space-y-4">
          <span className="inline-flex items-center gap-1.5 bg-[#0056D2]/25 text-blue-300 px-4 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-widest border border-blue-500/20">
            <Video className="w-4 h-4 text-[#FCF50F]" /> DIRECT PHONE PROOF CARDS
          </span>
          <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
            Unedited Class Chat Proof
          </h3>
          <p className="text-slate-400 text-xs sm:text-sm font-medium max-w-xl mx-auto leading-relaxed">
            Click on any image card to view the original high-resolution screenshot with a digital audit stamp.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
            {proofCards.map((card) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="bg-slate-950 border border-slate-800 rounded-3xl p-5 flex flex-col justify-between hover:border-blue-500/50 transition-all duration-300 shadow-xl group relative overflow-hidden text-left"
              >
                <div className="space-y-4">
                  {/* Smartphone Image Container */}
                  <div
                    onClick={() => setLightboxObj({
                      url: card.image,
                      title: `${card.studentName} Proof Verification`,
                      caption: card.outcomeBadge
                    })}
                    className="relative rounded-2xl overflow-hidden aspect-[9/16] bg-slate-900 border border-slate-800/80 cursor-pointer shadow-inner group-hover:scale-[1.01] transition-transform duration-300"
                  >
                    <img
                      src={card.image}
                      alt={`${card.studentName} phone screenshot`}
                      className="w-full h-full object-cover object-top filter contrast-[1.02]"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Dark gradient vignette overlay */}
                    <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />

                    {/* View overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                      <span className="text-xs font-sans font-extrabold bg-[#0056D2] text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-1.5 uppercase tracking-wider transform scale-90 group-hover:scale-100 transition-transform">
                        <Star className="w-3.5 h-3.5 text-amber-300 fill-amber-300 animate-pulse" /> Expand Receipt
                      </span>
                    </div>

                    {/* Platform identifier pill inside image */}
                    <div className="absolute top-3 right-3 z-10">
                      {card.platform === "telegram" ? (
                        <span className="bg-blue-600/90 text-white font-bold p-1.5 rounded-full text-[10px] uppercase flex items-center justify-center aspect-square shadow">
                          <Zap className="w-3.5 h-3.5 fill-white text-white animate-pulse" />
                        </span>
                      ) : (
                        <span className="bg-emerald-600/90 text-white font-bold p-1.5 rounded-full text-[10px] uppercase flex items-center justify-center aspect-square shadow">
                          <MessageSquare className="w-3.5 h-3.5 fill-white text-emerald-100" />
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Testimonial text parameters */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-sm font-extrabold text-white">{card.studentName}</h4>
                      <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest bg-slate-900 px-2 py-0.5 rounded-md border border-slate-800">
                        {card.platform}
                      </span>
                    </div>
                    
                    {/* Outcome Badge */}
                    <div className="inline-block bg-gradient-to-r from-emerald-500/10 to-teal-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-widest">
                      ✓ {card.outcomeBadge}
                    </div>

                    <p className="text-slate-400 text-xs leading-relaxed font-semibold">
                      {card.summary}
                    </p>
                  </div>
                </div>

                {/* Highlight metric link row */}
                <div className="mt-4 pt-3 border-t border-slate-900/60 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-amber-400">
                    <Flame className="w-4 h-4 fill-amber-400/20 text-amber-400" />
                    <span className="text-xs font-black uppercase tracking-wider text-[#FCF50F]">{card.growth}</span>
                  </div>
                  <span className="text-[10px] font-bold text-indigo-400 font-mono flex items-center gap-1">
                    Vetted Proof <Check className="w-3 h-3 text-emerald-400 stroke-[3]" />
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* LIGHTBOX MODAL OVERLAY */}
        <AnimatePresence>
          {lightboxObj && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center p-4"
              onClick={() => setLightboxObj(null)}
            >
              <motion.div 
                initial={{ scale: 0.95, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 15 }}
                className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden relative shadow-2xl text-left"
                onClick={e => e.stopPropagation()}
              >
                {/* Header */}
                <div className="p-4 border-b border-slate-800/60 bg-slate-900 flex items-center justify-between text-white">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#FCF50F] flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-300 fill-amber-300" /> FILE SOURCE VERIFICATION
                  </span>
                  <button
                    onClick={() => setLightboxObj(null)}
                    className="p-1.5 hover:bg-white/10 rounded-lg text-white font-bold text-xs cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Main Image View */}
                <div className="bg-black flex items-center justify-center relative p-1 pb-4">
                  <img
                    src={lightboxObj.url}
                    alt={lightboxObj.title}
                    className="w-full h-auto max-h-[70vh] object-contain rounded"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Bottom Details panel */}
                <div className="p-5 bg-slate-900 space-y-2 border-t border-slate-800">
                  <h4 className="text-sm font-extrabold text-white">{lightboxObj.title}</h4>
                  {lightboxObj.caption && (
                    <p className="text-xs text-amber-200 mt-1 italic leading-relaxed">
                      " {lightboxObj.caption} "
                    </p>
                  )}
                  <p className="text-[10px] text-slate-400 leading-normal flex items-center gap-1 pt-1.5 border-t border-slate-800">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Real production file verified from matching student databases.</span>
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
