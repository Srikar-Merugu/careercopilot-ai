"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Settings as SettingsIcon, User, Bell, Shield, CreditCard,
  Sliders, Link2, Save, Globe, Smartphone,
  Key, ChevronRight,
} from "lucide-react";
import { useProfile, useUpdateProfile } from "@/hooks/use-dashboard";
import { useToast } from "@/providers/toast-provider";

const settingsTabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "ai-preferences", label: "AI Preferences", icon: Sliders },
  { id: "integrations", label: "Integrations", icon: Link2 },
  { id: "security", label: "Security", icon: Shield },
];

export default function SettingsPage() {
  const { data: profile } = useProfile();
  const updateProfile = useUpdateProfile();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");
  const [formData, setFormData] = useState({
    name: "", headline: "", bio: "", location: "",
    experience_level: "senior",
    email_notifications: true, ai_recommendations: true,
    interview_reminders: true, marketing_emails: false,
  });

  const handleSave = async () => {
    try {
      await updateProfile.mutateAsync(formData);
      toast("Settings Saved", "Your preferences have been updated.", "success");
    } catch {
      toast("Error", "Failed to save settings.", "error");
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
          <SettingsIcon className="h-6 w-6 text-primary" />
          Settings
        </h1>
        <p className="text-sm text-[#a0aec0] mt-0.5">Manage your account, preferences, and integrations</p>
      </motion.div>

      <div className="flex flex-wrap gap-1 border-b border-white/5 pb-1">
        {settingsTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg text-sm font-medium transition-all ${
                isActive ? "text-white bg-white/5 border-t border-l border-r border-white/10" : "text-[#a0aec0] hover:text-white"
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? "text-primary" : ""}`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {activeTab === "profile" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="rounded-xl border border-white/10 bg-[#0a0f2e]/60 backdrop-blur-xl p-6 space-y-5"
            >
              <h3 className="text-lg font-semibold text-white flex items-center gap-2"><User className="h-5 w-5 text-primary" /> Profile Information</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs text-[#a0aec0] font-medium">Display Name</label>
                  <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-primary/40" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-[#a0aec0] font-medium">Headline</label>
                  <input value={formData.headline} onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-primary/40" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-[#a0aec0] font-medium">Location</label>
                  <input value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-primary/40" />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs text-[#a0aec0] font-medium">Bio</label>
                  <textarea rows={3} value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-primary/40 resize-none" />
                </div>
              </div>
              <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-sm font-medium transition-all">
                <Save className="h-4 w-4" /> Save Changes
              </button>
            </motion.div>
          )}

          {activeTab === "notifications" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="rounded-xl border border-white/10 bg-[#0a0f2e]/60 backdrop-blur-xl p-6 space-y-4"
            >
              <h3 className="text-lg font-semibold text-white flex items-center gap-2"><Bell className="h-5 w-5 text-primary" /> Notification Preferences</h3>
              {[
                { key: "email_notifications", label: "Email Notifications", desc: "Receive daily digest of new matches and updates" },
                { key: "ai_recommendations", label: "AI Recommendations", desc: "Get notified when AI finds new opportunities for you" },
                { key: "interview_reminders", label: "Interview Reminders", desc: "Reminders before scheduled interviews" },
                { key: "marketing_emails", label: "Marketing Emails", desc: "Product updates, tips, and career resources" },
              ].map((item: any) => (
                <div key={item.key} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
                  <div>
                    <p className="text-sm font-medium text-white">{item.label}</p>
                    <p className="text-xs text-[#a0aec0]">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => setFormData({ ...formData, [item.key]: !(formData as any)[item.key] })}
                    className={`relative h-6 w-11 rounded-full transition-all ${(formData as any)[item.key] ? "bg-primary" : "bg-white/10"}`}
                  >
                    <div className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${(formData as any)[item.key] ? "left-[22px]" : "left-0.5"}`} />
                  </button>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === "ai-preferences" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="rounded-xl border border-white/10 bg-[#0a0f2e]/60 backdrop-blur-xl p-6 space-y-4"
            >
              <h3 className="text-lg font-semibold text-white flex items-center gap-2"><Sliders className="h-5 w-5 text-primary" /> AI Preferences</h3>
              <div className="space-y-1.5">
                <label className="text-xs text-[#a0aec0] font-medium">Experience Level</label>
                <select value={formData.experience_level} onChange={(e) => setFormData({ ...formData, experience_level: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-primary/40">
                  <option value="junior">Junior (0-2 years)</option>
                  <option value="mid">Mid-Level (3-5 years)</option>
                  <option value="senior">Senior (5-8 years)</option>
                  <option value="lead">Lead (8+ years)</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-[#a0aec0] font-medium">Preferred Industries</label>
                <input placeholder="e.g. Fintech, AI/ML, SaaS"
                  className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-primary/40" />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
                <div>
                  <p className="text-sm font-medium text-white">Auto-match new jobs</p>
                  <p className="text-xs text-[#a0aec0]">Automatically scan new jobs against your profile</p>
                </div>
                <div className="relative h-6 w-11 rounded-full bg-primary">
                  <div className="absolute top-0.5 left-[22px] h-5 w-5 rounded-full bg-white shadow" />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "integrations" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="rounded-xl border border-white/10 bg-[#0a0f2e]/60 backdrop-blur-xl p-6 space-y-4"
            >
              <h3 className="text-lg font-semibold text-white flex items-center gap-2"><Link2 className="h-5 w-5 text-primary" /> Integrations</h3>
              {[
                { name: "Telegram", desc: "Receive job alerts and notifications via Telegram", icon: Smartphone, connected: false },
                { name: "Google Calendar", desc: "Sync interviews and events to your calendar", icon: Globe, connected: true },
                { name: "LinkedIn", desc: "Import your LinkedIn profile and skills", icon: Globe, connected: false },
                { name: "GitHub", desc: "Connect your GitHub to showcase projects", icon: Globe, connected: true },
              ].map((integration, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <integration.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{integration.name}</p>
                      <p className="text-xs text-[#a0aec0]">{integration.desc}</p>
                    </div>
                  </div>
                  <button className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    integration.connected ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-white/5 text-[#a0aec0] border border-white/10 hover:bg-primary/10 hover:text-primary"
                  }`}>
                    {integration.connected ? "Connected" : "Connect"}
                  </button>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === "security" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="rounded-xl border border-white/10 bg-[#0a0f2e]/60 backdrop-blur-xl p-6 space-y-4"
            >
              <h3 className="text-lg font-semibold text-white flex items-center gap-2"><Shield className="h-5 w-5 text-primary" /> Security</h3>
              <div className="p-4 rounded-lg bg-white/5 border border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">Change Password</p>
                    <p className="text-xs text-[#a0aec0]">Last changed 3 months ago</p>
                  </div>
                  <button className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 text-[#a0aec0] border border-white/10 hover:text-primary">Update</button>
                </div>
                <div className="h-px bg-white/5" />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">Two-Factor Authentication</p>
                    <p className="text-xs text-[#a0aec0]">Add an extra layer of security</p>
                  </div>
                  <button className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 text-[#a0aec0] border border-white/10 hover:text-primary">Enable</button>
                </div>
                <div className="h-px bg-white/5" />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">Active Sessions</p>
                    <p className="text-xs text-[#a0aec0]">2 active sessions · Last from Chrome on macOS</p>
                  </div>
                  <button className="px-3 py-1.5 rounded-lg text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">Revoke All</button>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-amber-500/5 border border-amber-500/10">
                <p className="text-xs text-amber-400 flex items-center gap-2"><Key className="h-3.5 w-3.5" /> API keys and sensitive data are encrypted at rest and in transit.</p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="rounded-xl border border-white/10 bg-[#0a0f2e]/60 backdrop-blur-xl p-5 text-center">
            <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-[#7C3AED] to-[#06B6D4] flex items-center justify-center text-xl font-bold text-white mx-auto mb-3">
              {profile?.name?.slice(0, 2) || "U"}
            </div>
            <h3 className="text-white font-semibold">{profile?.name || "User"}</h3>
            <p className="text-xs text-[#a0aec0] mt-0.5">{profile?.email}</p>
            <div className="flex items-center justify-center gap-1.5 mt-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-primary/10 text-primary border border-primary/20">Pro Plan</span>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#0a0f2e]/60 backdrop-blur-xl p-5">
            <h4 className="text-xs font-semibold text-white mb-3 uppercase tracking-wider">Quick Links</h4>
            <div className="space-y-1">
              {[
                { label: "View Billing", href: "/dashboard/billing", icon: CreditCard },
                { label: "Privacy Policy", href: "#", icon: Shield },
                { label: "Terms of Service", href: "#", icon: Shield },
                { label: "Support", href: "#", icon: User },
              ].map((link, i) => {
                const Icon = link.icon;
                return (
                  <a key={i} href={link.href} className="flex items-center justify-between p-2.5 rounded-lg hover:bg-white/5 text-sm text-[#a0aec0] hover:text-white transition-all">
                    <span className="flex items-center gap-2"><Icon className="h-3.5 w-3.5" />{link.label}</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
