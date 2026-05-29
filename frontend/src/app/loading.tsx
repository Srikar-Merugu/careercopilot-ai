import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#050816] flex items-center justify-center gap-4">
      <div className="absolute inset-0 bg-grid-cyber opacity-[0.15]" />
      <Loader2 className="h-8 w-8 animate-spin text-primary shadow-glow-primary" />
      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest animate-pulse">
        Loading...
      </span>
    </div>
  );
}
