import { motion } from 'framer-motion';
import { Evidence } from '@/types/simulation';
import { FileText, Eye, MessageSquare, Check } from 'lucide-react';
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
      className={cn(
        "relative p-4 rounded-lg border-2 transition-all cursor-pointer",
        isCollected 
          ? "bg-evidence-bg border-feedback-positive/50" 
          : "bg-card border-evidence-border hover:border-primary/50"
      )}
      onClick={!isCollected ? onCollect : undefined}
    >
      {isCollected && (
        <div className="absolute top-2 right-2 p-1 rounded-full bg-feedback-positive text-white">
          <Check className="w-3 h-3" />
        </div>
      )}
      
      <div className="flex items-start gap-3">
        <div className={cn(
          "p-2 rounded-lg",
          isCollected ? "bg-feedback-positive/10" : "bg-primary/10"
        )}>
          <Icon className={cn(
            "w-5 h-5",
            isCollected ? "text-feedback-positive" : "text-primary"
          )} />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {typeLabels[evidence.type]}
            </span>
          </div>
          <h4 className="font-semibold text-foreground mb-1">{evidence.title}</h4>
          <p className="text-sm text-muted-foreground mb-2">{evidence.description}</p>
          <p className="text-sm text-foreground leading-relaxed">{evidence.content}</p>
          <p className="text-xs text-muted-foreground mt-2">{evidence.timestamp}</p>
        </div>
      </div>
      
      {!isCollected && (
        <p className="text-xs text-primary font-medium mt-3 text-center">
          Click to add to evidence journal
        </p>
      )}
    </motion.div>
  );
}
