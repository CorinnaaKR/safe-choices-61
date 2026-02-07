import { motion } from 'framer-motion';
import { Choice } from '@/types/simulation';
import { cn } from '@/lib/utils';

interface ChoiceCardProps {
  choice: Choice;
  index: number;
  onSelect: () => void;
  disabled?: boolean;
}

export function ChoiceCard({ choice, index, onSelect, disabled }: ChoiceCardProps) {
  return (
    <motion.button
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={onSelect}
      disabled={disabled}
      className={cn(
        "w-full text-left p-5 rounded-lg border-2 transition-all",
        "bg-card hover:bg-secondary/50 border-border hover:border-primary",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        disabled && "opacity-50 cursor-not-allowed hover:bg-card hover:border-border"
      )}
    >
      <div className="flex items-start gap-4">
        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold flex items-center justify-center text-sm">
          {String.fromCharCode(65 + index)}
        </span>
        <p className="font-medium text-foreground leading-relaxed">{choice.text}</p>
      </div>
    </motion.button>
  );
}
