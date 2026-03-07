import { useRef } from "react";
import { Info } from "lucide-react";
import { useTooltip, TooltipVariant } from "./TooltipContext";

interface InfoTooltipProps {
  content: string;
  className?: string;
  iconClassName?: string;
  variant?: TooltipVariant;
}

export default function InfoTooltip({ content, className = "", iconClassName = "", variant = 'default' }: InfoTooltipProps) {
  const { tooltip, openTooltip, closeTooltip } = useTooltip();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const isOpen = tooltip.isOpen && tooltip.content === content;

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <button
        ref={buttonRef}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (isOpen) {
            closeTooltip();
          } else if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            openTooltip(content, rect, variant);
          }
        }}
        className={`p-1 -m-1 transition-colors rounded-full ${iconClassName}`}
        title="More information"
      >
        <Info className="w-4 h-4" />
      </button>
    </div>
  );
}
