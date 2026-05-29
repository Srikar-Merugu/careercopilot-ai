"use client";

import { Shield, Search } from "lucide-react";

const mockUsers = [
  { id: "USR001", name: "John Doe", email: "john@example.com", plan: "Premium", status: "Active", joined: "Jan 2026" },
  { id: "USR002", name: "Jane Smith", email: "jane@example.com", plan: "Pro", status: "Active", joined: "Feb 2026" },
  { id: "USR003", name: "Bob Wilson", email: "bob@example.com", plan: "Free", status: "Active", joined: "Mar 2026" },
  { id: "USR004", name: "Alice Brown", email: "alice@example.com", plan: "Premium", status: "Active", joined: "Dec 2025" },
  { id: "USR005", name: "Charlie Davis", email: "charlie@example.com", plan: "Free", status: "Inactive", joined: "Apr 2026" },
];

export default function AdminUsers() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          User Management
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Manage platform users</p>
      </div>
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/5">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          placeholder="Search users by name, email, or ID..."
          className="flex-1 bg-transparent text-sm text-white placeholder:text-muted-foreground outline-none"
        />
      </div>
      <div className="rounded-2xl border border-white/5 bg-black/40 backdrop-blur-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5">
              <th className="text-left py-3 px-4 text-muted-foreground font-medium">User</th>
              <th className="text-left py-3 px-4 text-muted-foreground font-medium">Email</th>
              <th className="text-left py-3 px-4 text-muted-foreground font-medium">Plan</th>
              <th className="text-left py-3 px-4 text-muted-foreground font-medium">Status</th>
              <th className="text-left py-3 px-4 text-muted-foreground font-medium">Joined</th>
            </tr>
          </thead>
          <tbody>
            {mockUsers.map((user) => (
              <tr key={user.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                <td className="py-3 px-4 text-white">{user.name}</td>
                <td className="py-3 px-4 text-muted-foreground">{user.email}</td>
                <td className="py-3 px-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.plan === "Premium" ? "bg-primary/10 text-primary" :
                    user.plan === "Pro" ? "bg-violet-500/10 text-violet-400" :
                    "bg-white/5 text-muted-foreground"
                  }`}>{user.plan}</span>
                </td>
                <td className="py-3 px-4">
                  <span className={`text-xs ${user.status === "Active" ? "text-emerald-400" : "text-rose-400"}`}>
                    {user.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-muted-foreground">{user.joined}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
