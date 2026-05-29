"use client";

import React, { useState } from "react";
import { 
  Terminal, LayoutDashboard, UserCheck, Settings, Search, MapPin, 
  Briefcase, DollarSign, Send, Sparkles, FileText, Route
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

type TabType = "dashboard" | "search" | "analysis" | "coach";

export function InteractiveShowcase() {
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");

  // State for AI Interview Coach interaction
  const [coachInput, setCoachInput] = useState("");
  const [coachMessages, setCoachMessages] = useState([
    { role: "ai", text: "Hello Aryan! I'm your AI Interview Coach. How can I help you prepare today?" },
    { role: "user", text: "I have an interview for a Senior Frontend Developer role. Can you ask me some questions?" },
    { role: "ai", text: "Sure! Let's start with a foundational one: What is React, and how does it work under the hood?" }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSendCoachMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!coachInput.trim()) return;

    const newMsgs = [...coachMessages, { role: "user", text: coachInput }];
    setCoachMessages(newMsgs);
    const userMsg = coachInput;
    setCoachInput("");
    setIsTyping(true);

    // Simulate AI response after 1.5 seconds
    setTimeout(() => {
      let aiText = "Excellent. You mentioned component state and virtual DOM updates. Can you explain how the reconciliation algorithm compares the virtual DOM trees?";
      if (userMsg.toLowerCase().includes("reconciliation") || userMsg.toLowerCase().includes("diff")) {
        aiText = "Correct! React uses a heuristic O(n) diffing algorithm. Next: What is the difference between client-side rendering (CSR) and server-side rendering (SSR) in Next.js 15, and how does hydration fit in?";
      }
      setCoachMessages(prev => [...prev, { role: "ai", text: aiText }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <section id="how-it-works" className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-[#050816] via-[#0b1120]/20 to-[#050816]">
      {/* Background neon visual indicators */}
      <div className="absolute top-[20%] left-[-10%] w-[350px] h-[350px] bg-[#8B5CF6]/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[350px] h-[350px] bg-[#06B6D4]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container max-w-7xl mx-auto space-y-12">
        
        {/* Title */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-[10px] uppercase tracking-widest font-semibold text-[#06B6D4] block">
            Interactive Product Demo
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            See the Platform in Action
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Switch tabs below to interact with each core section of the actual application portal.
          </p>
        </div>

        {/* Tab Selector Links */}
        <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-xl bg-white/[0.02] border border-white/[0.04] max-w-2xl mx-auto backdrop-blur-md">
          {[
            { id: "dashboard", label: "Dashboard Hub", icon: LayoutDashboard },
            { id: "search", label: "Job Finder", icon: Search },
            { id: "analysis", label: "Resume Analyzer", icon: FileText },
            { id: "coach", label: "Interview Coach", icon: UserCheck }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                  isActive 
                    ? "bg-[#7c3aed] text-white shadow-glow-primary" 
                    : "text-muted-foreground hover:text-white hover:bg-white/[0.02]"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Console Showcase Workspace */}
        <div className="relative rounded-2xl border border-white/[0.06] bg-[#0b1120]/40 backdrop-blur-xl shadow-2xl overflow-hidden min-h-[600px] text-left">
          
          {/* Mock Window Title Bar */}
          <div className="h-10 border-b border-white/[0.04] bg-black/40 px-4 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-red-500/60" />
              <span className="h-3 w-3 rounded-full bg-yellow-500/60" />
              <span className="h-3 w-3 rounded-full bg-green-500/60" />
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded bg-white/[0.02] border border-white/[0.04] text-[9px] text-[#a0aec0] font-mono select-none">
              <Terminal className="h-3 w-3 text-[#06B6D4]" />
              app.careercopilot.ai/dashboard
            </div>
            <div className="w-12" />
          </div>

          <div className="p-4 sm:p-6 lg:p-8">
            <AnimatePresence mode="wait">
              
              {/* TAB 1: DASHBOARD VIEW */}
              {activeTab === "dashboard" && (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
                >
                  
                  {/* Left Sidebar Mock */}
                  <div className="lg:col-span-3 space-y-4">
                    <div className="rounded-xl bg-[#0b1120]/60 border border-white/[0.04] p-3 space-y-2">
                      <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-primary/10 border border-primary/20 text-[#8B5CF6] text-xs font-semibold">
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </div>
                      {[
                        { label: "Resume Analyzer", icon: FileText },
                        { label: "Job Search", icon: Search },
                        { label: "AI Interview Coach", icon: UserCheck },
                        { label: "Career Roadmap", icon: Route },
                        { label: "Settings", icon: Settings }
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-muted-foreground text-xs hover:text-white transition-colors cursor-pointer">
                          <item.icon className="h-4 w-4" />
                          {item.label}
                        </div>
                      ))}
                    </div>

                    {/* Pro promo block */}
                    <div className="p-4 rounded-xl border border-white/[0.04] bg-[#7c3aed]/5 relative overflow-hidden space-y-3">
                      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#8B5CF6] to-transparent" />
                      <h4 className="text-xs font-bold text-white leading-none">Upgrade to Premium</h4>
                      <p className="text-[10px] text-muted-foreground leading-normal">
                        Unlock all premium features and get unlimited matches.
                      </p>
                      <Button size="sm" className="w-full bg-[#7c3aed] text-white text-[10px] h-7 font-bold">
                        Upgrade Now
                      </Button>
                    </div>
                  </div>

                  {/* Center Main Dashboard Content */}
                  <div className="lg:col-span-9 space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/[0.04] pb-4">
                      <div>
                        <h3 className="text-lg font-extrabold text-white">Welcome back, Aryan! 👋</h3>
                        <p className="text-[10px] text-muted-foreground">Let's find the perfect opportunity for you.</p>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1 rounded bg-[#06B6D4]/10 border border-[#06B6D4]/20 text-[#06B6D4] text-[10px] font-semibold uppercase">
                        <Sparkles className="h-3 w-3" />
                        AI Agent Network Active
                      </div>
                    </div>

                    {/* Metrics grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {[
                        { val: "97%", label: "Resume Score", desc: "Excellent", col: "text-emerald-400" },
                        { val: "24", label: "Jobs Matched", desc: "This Week", col: "text-[#06B6D4]" },
                        { val: "12", label: "Applications", desc: "In Progress", col: "text-[#8B5CF6]" },
                        { val: "5", label: "Interviews", desc: "Scheduled", col: "text-[#3B82F6]" }
                      ].map((met, i) => (
                        <div key={i} className="p-4 rounded-xl bg-black/40 border border-white/[0.04] space-y-1">
                          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{met.label}</span>
                          <h4 className={`text-xl font-bold font-display ${met.col}`}>{met.val}</h4>
                          <span className="text-[9px] text-muted-foreground block font-mono">{met.desc}</span>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                      
                      {/* Left: Top Matches */}
                      <div className="md:col-span-7 space-y-4">
                        <h4 className="text-xs font-semibold text-white/90">Top Job Matches</h4>
                        <div className="space-y-3">
                          {[
                            { title: "Senior Frontend Developer", comp: "Acme Corp", loc: "Remote", match: "95% Match", time: "2h ago" },
                            { title: "AI/ML Engineer", comp: "TechNova", loc: "Bengaluru", match: "93% Match", time: "5h ago" },
                            { title: "Full Stack Developer", comp: "InnovateX", loc: "Remote", match: "90% Match", time: "1d ago" }
                          ].map((job, idx) => (
                            <div key={idx} className="p-3.5 rounded-lg border border-white/[0.04] bg-[#0b1120]/30 hover:border-[#8B5CF6]/30 transition-all flex items-center justify-between gap-4">
                              <div className="flex flex-col gap-1 text-left min-w-0">
                                <span className="text-xs font-bold text-white truncate">{job.title}</span>
                                <span className="text-[10px] text-muted-foreground truncate">{job.comp} • {job.loc}</span>
                              </div>
                              <div className="flex flex-col items-end gap-1 shrink-0">
                                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-semibold">{job.match}</span>
                                <span className="text-[9px] text-muted-foreground font-mono">{job.time}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Right: Resume ATS Gauge & Activity */}
                      <div className="md:col-span-5 space-y-4">
                        <div className="p-4 rounded-xl border border-white/[0.04] bg-black/30 flex flex-col items-center justify-center text-center space-y-3">
                          <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Your Resume Score</span>
                          
                          {/* Radial Progress Score */}
                          <div className="relative h-24 w-24 flex items-center justify-center">
                            <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                              <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.03)" strokeWidth="6" fill="transparent" />
                              <circle cx="50" cy="50" r="40" stroke="#8B5CF6" strokeWidth="6" fill="transparent" strokeDasharray="251" strokeDashoffset="7.5" />
                            </svg>
                            <span className="text-2xl font-extrabold text-white font-display">97</span>
                          </div>

                          <div className="space-y-1">
                            <span className="text-xs font-bold text-emerald-400">Excellent Status</span>
                            <p className="text-[9px] text-muted-foreground leading-normal max-w-[160px]">
                              Your resume is ATS-optimized and highly likely to get responses.
                            </p>
                          </div>
                        </div>
                      </div>

                    </div>

                  </div>

                </motion.div>
              )}

              {/* TAB 2: JOB SEARCH */}
              {activeTab === "search" && (
                <motion.div
                  key="search"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <h3 className="text-base font-extrabold text-white">Find the Best Job Opportunities</h3>
                      <p className="text-[10px] text-muted-foreground">Aggregated listing matching your skills from top platform sources.</p>
                    </div>
                  </div>

                  {/* Search box & filter bar */}
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input 
                        type="text" 
                        placeholder="Search job title, company, or keyword..." 
                        className="w-full rounded-lg bg-black/40 border border-white/5 pl-9 pr-4 py-2 text-xs text-white placeholder-muted-foreground/60 focus:outline-none focus:border-primary/50 transition-colors"
                        defaultValue="Senior Frontend Developer"
                        readOnly
                      />
                    </div>
                    <Button variant="outline" className="border-white/5 bg-[#0b1120]/40 text-xs h-9 px-4 hover:bg-white/5 gap-1">
                      Filters
                    </Button>
                  </div>

                  {/* Filter chips */}
                  <div className="flex flex-wrap items-center gap-2 border-b border-white/[0.04] pb-4">
                    {["Remote", "Full-time", "Experience", "Location", "Salary"].map((chip, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/[0.06] text-[10px] text-white/95 font-medium hover:border-[#8B5CF6]/40 transition-colors cursor-pointer">
                        {chip}
                      </span>
                    ))}
                  </div>

                  {/* Platform tabs */}
                  <div className="flex items-center gap-4 text-xs font-semibold text-muted-foreground border-b border-white/[0.04] pb-2">
                    <span className="text-[#8B5CF6] border-b border-[#8B5CF6] pb-2">All Jobs (12,340)</span>
                    <span className="hover:text-white cursor-pointer transition-colors pb-2">LinkedIn (3,478)</span>
                    <span className="hover:text-white cursor-pointer transition-colors pb-2">Indeed (3,410)</span>
                    <span className="hover:text-white cursor-pointer transition-colors pb-2">Wellfound (1,930)</span>
                  </div>

                  {/* Jobs listings */}
                  <div className="space-y-3">
                    {[
                      { title: "Senior Frontend Developer", comp: "Acme Corp", loc: "Remote", type: "Full-time", sal: "$80k - $120k", match: "95% Match", source: "LinkedIn" },
                      { title: "AI/ML Engineer", comp: "TechNova", loc: "Bengaluru", type: "Full-time", sal: "₹18L - ₹28L", match: "93% Match", source: "Indeed" },
                      { title: "Full Stack Developer", comp: "InnovateX", loc: "Remote", type: "Full-time", sal: "$70k - $110k", match: "90% Match", source: "Wellfound" }
                    ].map((job, idx) => (
                      <div key={idx} className="p-4 rounded-xl border border-white/[0.04] bg-[#0b1120]/30 hover:border-[#06B6D4]/30 hover:shadow-[0_0_20px_rgba(6,182,212,0.05)] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1.5 text-left">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-extrabold text-white">{job.title}</span>
                            <span className="px-1.5 py-0.5 rounded bg-white/[0.04] text-[8px] text-muted-foreground">{job.source}</span>
                          </div>
                          <p className="text-[10px] text-muted-foreground flex items-center gap-2 flex-wrap font-sans">
                            <span>{job.comp}</span>
                            <span>•</span>
                            <span className="flex items-center gap-0.5"><MapPin className="h-3 w-3" /> {job.loc}</span>
                            <span>•</span>
                            <span className="flex items-center gap-0.5"><Briefcase className="h-3 w-3" /> {job.type}</span>
                            <span>•</span>
                            <span className="flex items-center gap-0.5"><DollarSign className="h-3 w-3" /> {job.sal}</span>
                          </p>
                        </div>
                        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-semibold">{job.match}</span>
                          <Button size="sm" className="bg-[#7c3aed] text-white text-[9px] h-7 font-bold">Apply Now</Button>
                        </div>
                      </div>
                    ))}
                  </div>

                </motion.div>
              )}

              {/* TAB 3: RESUME ANALYZER */}
              {activeTab === "analysis" && (
                <motion.div
                  key="analysis"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-8"
                >
                  {/* Left panel: File card and score */}
                  <div className="lg:col-span-5 space-y-6">
                    <div className="p-4 rounded-xl border border-white/[0.04] bg-black/40 text-left space-y-4">
                      <div className="flex items-center justify-between border-b border-white/[0.04] pb-3">
                        <div className="flex items-center gap-2 min-w-0">
                          <FileText className="h-5 w-5 text-[#8B5CF6] shrink-0" />
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-white truncate leading-none">Aryan_Resume.pdf</h4>
                            <span className="text-[8px] text-muted-foreground mt-0.5 block">Uploaded 2 mins ago</span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="h-7 text-[9px] border-white/5 bg-[#0b1120]/45 px-2">
                          Re-analyze
                        </Button>
                      </div>

                      {/* circular score */}
                      <div className="flex items-center gap-4">
                        <div className="relative h-16 w-16 flex items-center justify-center shrink-0">
                          <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.03)" strokeWidth="8" fill="transparent" />
                            <circle cx="50" cy="50" r="40" stroke="#06B6D4" strokeWidth="8" fill="transparent" strokeDasharray="251" strokeDashoffset="7.5" />
                          </svg>
                          <span className="text-lg font-extrabold text-white font-display">97</span>
                        </div>
                        <div className="text-left space-y-1">
                          <span className="text-xs font-bold text-white leading-none">ATS Score: <span className="text-emerald-400">Excellent</span></span>
                          <p className="text-[9px] text-muted-foreground leading-normal max-w-[180px]">
                            Your resume structure matches standard recruiter schemas cleanly.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Suggestions list */}
                    <div className="p-4 rounded-xl border border-white/[0.04] bg-[#0b1120]/20 space-y-3">
                      <span className="text-[10px] text-muted-foreground uppercase font-semibold">AI Suggestions</span>
                      <ul className="space-y-2 text-xs font-sans text-muted-foreground list-inside list-disc text-left leading-relaxed">
                        <li>Add more quantifiable achievements.</li>
                        <li>Highlight your impact in previous roles.</li>
                        <li>Include more relevant keywords (AWS, Docker).</li>
                        <li>Add certifications to improve credibility.</li>
                      </ul>
                    </div>
                  </div>

                  {/* Right panel: Skills and metrics found */}
                  <div className="lg:col-span-7 space-y-6 text-left">
                    
                    {/* Skills badge list */}
                    <div className="space-y-3">
                      <span className="text-[10px] text-muted-foreground uppercase font-semibold block">Extracted Skills Found</span>
                      <div className="flex flex-wrap gap-2">
                        {[
                          "React", "Next.js", "TypeScript", "Node.js", "Python", 
                          "FastAPI", "MongoDB", "Tailwind CSS", "PostgreSQL",
                          "Git", "AWS", "Docker"
                        ].map((skill, i) => (
                          <span key={i} className="px-2.5 py-1 rounded bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 text-[#8B5CF6] text-[10px] font-semibold">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Meta stats details */}
                    <div className="grid grid-cols-2 gap-4 border-t border-white/[0.04] pt-6">
                      <div className="p-3.5 rounded-lg border border-white/[0.04] bg-black/20 space-y-1">
                        <span className="text-[10px] text-muted-foreground block">Professional Experience</span>
                        <h4 className="text-base font-bold text-white">2.5 Years</h4>
                      </div>
                      <div className="p-3.5 rounded-lg border border-white/[0.04] bg-black/20 space-y-1">
                        <span className="text-[10px] text-muted-foreground block">Project Listings Found</span>
                        <h4 className="text-base font-bold text-white">6 Projects</h4>
                      </div>
                      <div className="p-3.5 rounded-lg border border-white/[0.04] bg-black/20 col-span-2 space-y-1">
                        <span className="text-[10px] text-muted-foreground block">Education Track</span>
                        <h4 className="text-xs font-bold text-white">B.Tech Computer Science</h4>
                      </div>
                    </div>

                  </div>
                </motion.div>
              )}

              {/* TAB 4: INTERVIEW COACH */}
              {activeTab === "coach" && (
                <motion.div
                  key="coach"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-8"
                >
                  
                  {/* Left Column: Interactive Chat Interface */}
                  <div className="lg:col-span-8 flex flex-col min-h-[420px] rounded-xl border border-white/[0.04] bg-black/30 overflow-hidden relative">
                    
                    {/* Chat Header */}
                    <div className="h-11 border-b border-white/[0.04] px-4 flex items-center justify-between bg-[#0b1120]/40">
                      <div className="flex items-center gap-2">
                        <div className="h-2.5 w-2.5 rounded-full bg-[#8B5CF6] animate-ping" />
                        <span className="text-xs font-bold text-white">AI Interview Prep Assistant</span>
                      </div>
                      <span className="text-[9px] text-muted-foreground font-mono">Telemetry: ACTIVE</span>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 p-4 space-y-4 overflow-y-auto max-h-[300px]">
                      {coachMessages.map((msg, i) => (
                        <div 
                          key={i} 
                          className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div className={`max-w-[80%] rounded-xl px-3.5 py-2 text-xs leading-relaxed ${
                            msg.role === "user" 
                              ? "bg-[#7c3aed] text-white rounded-br-none" 
                              : "bg-[#0b1120]/80 border border-white/[0.04] text-white/95 rounded-bl-none"
                          }`}>
                            {msg.text}
                          </div>
                        </div>
                      ))}
                      {isTyping && (
                        <div className="flex justify-start">
                          <div className="bg-[#0b1120]/80 border border-white/[0.04] text-muted-foreground rounded-xl px-3.5 py-2 text-xs rounded-bl-none flex items-center gap-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#06B6D4] animate-bounce" />
                            <span className="h-1.5 w-1.5 rounded-full bg-[#06B6D4] animate-bounce [animation-delay:0.2s]" />
                            <span className="h-1.5 w-1.5 rounded-full bg-[#06B6D4] animate-bounce [animation-delay:0.4s]" />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Input Field */}
                    <form onSubmit={handleSendCoachMessage} className="p-3 border-t border-white/[0.04] bg-[#0b1120]/20 flex gap-2">
                      <input 
                        type="text" 
                        value={coachInput}
                        onChange={(e) => setCoachInput(e.target.value)}
                        placeholder="Type your answer here..."
                        className="flex-1 rounded-lg bg-black/40 border border-white/5 px-3 py-2 text-xs text-white placeholder-muted-foreground/60 focus:outline-none focus:border-primary/50 transition-colors"
                      />
                      <Button type="submit" size="sm" className="bg-[#06B6D4] hover:bg-[#0891b2] text-white h-8 w-8 p-0 flex items-center justify-center">
                        <Send className="h-4 w-4" />
                      </Button>
                    </form>

                  </div>

                  {/* Right Column: AI Feedback Telemetry */}
                  <div className="lg:col-span-4 space-y-6 text-left">
                    <div className="p-4 rounded-xl border border-white/[0.04] bg-[#0b1120]/45 relative overflow-hidden flex flex-col items-center justify-center text-center space-y-3">
                      <span className="text-[10px] text-muted-foreground uppercase font-semibold">Glowing Assistant Orb</span>
                      
                      {/* Floating glowing assistant sphere */}
                      <motion.div 
                        animate={{
                          scale: [1, 1.1, 1],
                          boxShadow: [
                            "0 0 30px rgba(139, 92, 246, 0.4)",
                            "0 0 50px rgba(6, 182, 212, 0.5)",
                            "0 0 30px rgba(139, 92, 246, 0.4)"
                          ]
                        }}
                        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                        className="h-16 w-16 rounded-full bg-gradient-to-tr from-[#7C3AED] to-[#06B6D4] opacity-80"
                      />
                      <span className="text-[10px] text-emerald-400 font-semibold tracking-wider uppercase animate-pulse mt-2">Coach Listening...</span>
                    </div>

                    <div className="space-y-4">
                      <span className="text-[10px] text-muted-foreground uppercase font-semibold block">Live Performance Metrics</span>
                      
                      <div className="space-y-3.5 font-sans">
                        {[
                          { label: "Speech Clarity", val: "94%", width: "w-[94%]", col: "bg-emerald-400" },
                          { label: "Confidence Tone", val: "88%", width: "w-[88%]", col: "bg-[#06B6D4]" },
                          { label: "Technical Keyword Match", val: "91%", width: "w-[91%]", col: "bg-[#8B5CF6]" }
                        ].map((bar, i) => (
                          <div key={i} className="space-y-1">
                            <div className="flex justify-between items-center text-[10px]">
                              <span className="text-white/80">{bar.label}</span>
                              <span className="font-mono text-white">{bar.val}</span>
                            </div>
                            <div className="h-1.5 rounded-full bg-white/[0.03] overflow-hidden border border-white/[0.05]">
                              <div className={`h-full rounded-full ${bar.col} ${bar.width}`} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                </motion.div>
              )}

            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
}
