import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-white/5 border border-white/[0.02]",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
