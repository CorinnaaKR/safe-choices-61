import { motion } from 'framer-motion';
import { Evidence } from '@/types/simulation';
import { FileText, Eye, MessageSquare, Check, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EvidenceCardProps {
  evidence: Evidence;
  isCollected: boolean;
  onCollect: () => void;
  compact?: boolean;
}

const iconMap = {
  message: MessageSquare,
  observation: Eye,
  visual: FileText,
};

const typeLabels = {
  message: 'Communication',
  observation: 'Observation',
  visual: 'Visual Evidence',
};

export function EvidenceCard({ evidence, isCollected, onCollect, compact = false }: EvidenceCardProps) {
  const Icon = iconMap[evidence.type];

  if (compact) {
    return (
      <div className="flex items-start gap-3 p-3 rounded-lg bg-evidence-bg border border-evidence-border">
        <div className="p-1.5 rounded bg-primary/10">
          <Icon className="w-4 h-4 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm text-foreground truncate">{evidence.title}</p>
          <p className="text-xs text-muted-foreground">{evidence.timestamp}</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={!isCollected ? { scale: 1.02, y: -2 } : undefined}
      whileTap={!isCollected ? { scale: 0.98 } : undefined}
      className={cn(
        "relative p-5 rounded-xl border-2 transition-all duration-300 cursor-pointer",
        isCollected 
          ? "bg-evidence-bg border-feedback-positive/50" 
          : "bg-card border-evidence-border hover:border-decision-highlight hover:shadow-lg hover:shadow-decision-highlight/10 evidence-shimmer"
      )}
      onClick={!isCollected ? onCollect : undefined}
    >
      {isCollected && (
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300 }}
          className="absolute top-3 right-3 p-1.5 rounded-full bg-feedback-positive text-white"
        >
          <Check className="w-3 h-3" />
        </motion.div>
      )}
      
      <div className="flex items-start gap-4">
        <div className={cn(
          "p-2.5 rounded-xl transition-colors duration-300",
          isCollected ? "bg-feedback-positive/10" : "bg-decision-highlight/10"
        )}>
          <Icon className={cn(
            "w-5 h-5",
            isCollected ? "text-feedback-positive" : "text-decision-highlight"
          )} />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {typeLabels[evidence.type]}
            </span>
            <span className="text-xs text-muted-foreground/60">•</span>
            <span className="text-xs text-muted-foreground">{evidence.timestamp}</span>
          </div>
          <h4 className="font-semibold text-foreground mb-2">{evidence.title}</h4>
          <p className="text-sm text-muted-foreground mb-2">{evidence.description}</p>
          <p className="text-sm text-foreground/80 leading-relaxed border-l-2 border-evidence-border pl-3 italic">
            {evidence.content}
          </p>
        </div>
      </div>
      
      {!isCollected && (
        <motion.div 
          className="mt-4 flex items-center justify-center gap-2 text-xs text-decision-highlight font-semibold"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Sparkles className="w-3.5 h-3.5" />
          Tap to collect evidence
        </motion.div>
      )}
    </motion.div>
  );
}
