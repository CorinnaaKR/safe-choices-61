import { Evidence } from '@/types/simulation';
import { EvidenceCard } from './EvidenceCard';
import { Briefcase, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface EvidencePanelProps {
  collectedEvidence: Evidence[];
}

export function EvidencePanel({ collectedEvidence }: EvidencePanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm w-full">
      <motion.div
        layout
        className="bg-card border-2 border-border rounded-lg shadow-lg overflow-hidden"
      >
        {/* Header */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Briefcase className="w-5 h-5 text-primary" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-foreground">Evidence Journal</h3>
              <p className="text-sm text-muted-foreground">
                {collectedEvidence.length} item{collectedEvidence.length !== 1 ? 's' : ''} collected
              </p>
            </div>
          </div>
          {isExpanded ? (
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronUp className="w-5 h-5 text-muted-foreground" />
          )}
        </button>
        
        {/* Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              className="overflow-hidden"
            >
              <div className="p-4 pt-0 max-h-80 overflow-y-auto">
                {collectedEvidence.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No evidence collected yet. Click on evidence items in the story to add them.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {collectedEvidence.map(evidence => (
                      <EvidenceCard 
                        key={evidence.id} 
                        evidence={evidence} 
                        isCollected={true}
                        onCollect={() => {}}
                        compact
                      />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
