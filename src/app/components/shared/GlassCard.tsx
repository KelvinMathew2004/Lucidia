import { cn } from "../../../lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function GlassCard({ className, children, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl overflow-hidden",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
