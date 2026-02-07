import { motion } from 'framer-motion';
import { Choice } from '@/types/simulation';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeedbackPanelProps {
  choice: Choice;
  onContinue: () => void;
}

export function FeedbackPanel({ choice, onContinue }: FeedbackPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto"
    >
      {/* Consequence */}
      <div className="mb-6 p-6 rounded-lg bg-story-bg border border-border">
        <p className="font-serif text-lg text-story-text italic leading-relaxed">
          {choice.consequence}
        </p>
      </div>
      
      {/* Feedback */}
      <div className={cn(
        "p-6 rounded-lg border-2",
        choice.isOptimal 
          ? "bg-feedback-positive/5 border-feedback-positive/30" 
          : "bg-feedback-negative/5 border-feedback-negative/30"
      )}>
        <div className="flex items-start gap-4">
          <div className={cn(
            "p-2 rounded-full",
            choice.isOptimal ? "bg-feedback-positive/10" : "bg-feedback-negative/10"
          )}>
            {choice.isOptimal ? (
              <CheckCircle className="w-6 h-6 text-feedback-positive" />
            ) : (
              <XCircle className="w-6 h-6 text-feedback-negative" />
            )}
          </div>
          
          <div className="flex-1">
            <h3 className={cn(
              "font-semibold mb-2",
              choice.isOptimal ? "text-feedback-positive" : "text-feedback-negative"
            )}>
              {choice.isOptimal ? "Good Decision" : "Room for Improvement"}
            </h3>
            <p className="text-foreground leading-relaxed">{choice.feedback}</p>
            
            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <span className="font-medium">Points earned:</span>
              <span className={cn(
                "font-semibold",
                choice.points > 10 ? "text-feedback-positive" : 
                choice.points > 0 ? "text-feedback-neutral" : "text-feedback-negative"
              )}>
                {choice.points}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Continue Button */}
      <div className="mt-8 flex justify-center">
        <Button onClick={onContinue} size="lg" className="gap-2">
          Continue
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
}
