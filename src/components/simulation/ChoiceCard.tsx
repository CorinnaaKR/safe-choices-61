import { motion } from 'framer-motion';
import { Choice } from '@/types/simulation';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';

interface ChoiceCardProps {
  choice: Choice;
  index: number;
  onSelect: () => void;
  disabled?: boolean;
}

export function ChoiceCard({ choice, index, onSelect, disabled }: ChoiceCardProps) {
  return (
    <motion.button
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.12, type: 'spring', stiffness: 100 }}
      whileHover={!disabled ? { scale: 1.02, x: 8 } : undefined}
      whileTap={!disabled ? { scale: 0.98 } : undefined}
      onClick={onSelect}
      disabled={disabled}
      className={cn(
        "w-full text-left p-5 rounded-xl border-2 transition-all duration-300 group",
        "bg-card hover:bg-primary/5 border-border hover:border-primary hover:shadow-lg hover:shadow-primary/5",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        disabled && "opacity-50 cursor-not-allowed hover:bg-card hover:border-border hover:shadow-none"
      )}
    >
      <div className="flex items-center gap-4">
        <span className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
          {String.fromCharCode(65 + index)}
        </span>
        <p className="font-medium text-foreground leading-relaxed flex-1">{choice.text}</p>
        <ChevronRight className="w-5 h-5 text-muted-foreground/0 group-hover:text-primary transition-all duration-300 group-hover:translate-x-1 flex-shrink-0" />
      </div>
    </motion.button>
  );
}
