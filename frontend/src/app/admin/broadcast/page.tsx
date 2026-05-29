"use client";

import { useState } from "react";
import { Send } from "lucide-react";

export default function AdminBroadcast() {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) return;
    setSending(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSending(false);
    setMessage("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Send className="h-6 w-6 text-primary" />
          Broadcast Message
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Send announcements to all active users</p>
      </div>
      <div className="rounded-2xl border border-white/5 bg-black/40 backdrop-blur-xl p-6 max-w-2xl">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your broadcast message..."
          className="w-full h-32 bg-white/[0.03] border border-white/10 rounded-xl p-4 text-sm text-white placeholder:text-muted-foreground outline-none resize-none"
        />
        <div className="flex items-center justify-between mt-4">
          <span className="text-xs text-muted-foreground">{message.length} characters</span>
          <button
            onClick={handleSend}
            disabled={!message.trim() || sending}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-sm font-medium transition-all disabled:opacity-50"
          >
            {sending ? "Sending..." : "Send Broadcast"}
          </button>
        </div>
      </div>
    </div>
  );
}
